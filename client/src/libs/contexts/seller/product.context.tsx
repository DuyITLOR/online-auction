import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from "react";
import { useSeller } from "./seller.context";

interface Product {
  id: string;
  title: string;
  description?: string; // Thêm description
  seller: { fullname: string };
  category: { name: string };
  currentPrice: number;
  endAt: string;
  countbids: number;
  status: string;
}

interface ActionResult {
  success: boolean;
  message: string;
}

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  page: number;
  totalPage: number;
  totalProducts: number;
  activeTab?: "ALL" | "ACTIVE" | "COMPLETED";
  setActiveTab: (tab: "ALL" | "ACTIVE" | "COMPLETED") => void;
  setPage: (page: number) => void;
  deleteProduct: (id: string) => Promise<ActionResult>;
  updateProductDescription: (
    id: string,
    description: string
  ) => Promise<ActionResult>;
  refreshProducts: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user,token } = useSeller();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  
  // Khởi tạo cache từ localStorage
  const [cache, setCache] = useState<Record<string, any>>(() => {
    try {
      const saved = localStorage.getItem("seller_products_cache");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Kiểm tra cache có hết hạn không (5 phút)
        if (parsed.timestamp && Date.now() - parsed.timestamp < 5 * 60 * 1000) {
          return parsed.data || {};
        }
      }
    } catch (e) {
      console.error("Error loading cache from localStorage:", e);
    }
    return {};
  });
  
  const [activeTab, setActiveTab] = useState<"ALL" | "ACTIVE" | "COMPLETED">(() => {
    const saved = localStorage.getItem("seller_products_tab");
    if (saved === "ALL" || saved === "ACTIVE" || saved === "COMPLETED") {
      return saved;
    }
    return "ACTIVE";
  });
  const limit = 5;
  const prefetchPages = 4; // Số pages prefetch mỗi lần

  // Handler để đổi tab và reset page
  const handleSetActiveTab = useCallback((tab: "ALL" | "ACTIVE" | "COMPLETED") => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      setPage(1);
      // Không clear cache khi đổi tab để giữ data các tab khác
      localStorage.setItem("seller_products_tab", tab); // Lưu vào localStorage
    }
  }, [activeTab]);

  const fetchProducts = useCallback(async () => {
    if (!user?.id) return;
    const userId = user.id;

    // Cache key bao gồm cả activeTab
    const cacheKey = `${userId}-${activeTab}-${page}`;
    
    // Nếu đã có trong cache → dùng luôn
    if (cache[cacheKey]) {
      const c = cache[cacheKey];
      setProducts(c.products);
      setTotalProducts(c.totalProducts);
      setTotalPage(c.totalPage);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      // Tính startPage: làm tròn xuống theo batch (1-4, 5-8, 9-12...)
      const batchIndex = Math.floor((page - 1) / prefetchPages);
      const startPage = batchIndex * prefetchPages + 1;
    
      // Fetch song song nhiều pages bằng Promise.all
      const fetchPage = async (pageNum: number) => {
        try {
          // Build URL với status parameter
          let url = `${import.meta.env.VITE_BACKEND_URL}/product?sellerId=${userId}&page=${pageNum}&limit=${limit}`;
          
          // Thêm status filter nếu không phải ALL
          if (activeTab !== "ALL") {
            url+=`&status=${activeTab}`;}
            
          
          const res = await fetch(url);
          if (!res.ok) return { pageNum, data: [], total: 0, totalPages: 1 };
          const json = await res.json();
          const rawData = json.data?.data ?? [];
          const data = rawData.filter((item: any) => item.status !== "Expired"); // Lọc bỏ các sản phẩm Expired
          return {
            pageNum,
            data: data,
            total: json.data?.total ?? 0,
            totalPages: json.data?.totalPages ?? 1,
          };
        } catch {
          return { pageNum, data: [], total: 0, totalPages: 1 };
        }
      };

      // Bước 1: Fetch trang đầu tiên để lấy totalPages và hiển thị ngay
      const firstResult = await fetchPage(startPage);
      let newTotalPages = firstResult.totalPages;
      let total = firstResult.total;

      // Lưu trang đầu vào cache ngay
      const newCache: Record<string, any> = {};
      newCache[`${userId}-${activeTab}-${startPage}`] = {
        products: firstResult.data,
        totalProducts: total,
        totalPage: newTotalPages,
      };

      // Cập nhật state ngay lập tức nếu đang ở trang đầu
      if (page === startPage) {
        setProducts(firstResult.data);
        setTotalProducts(total);
        setTotalPage(newTotalPages);
        setIsLoading(false);
      }

      // Lưu cache vào localStorage ngay
      setCache((prev) => {
        const updated = { ...prev, ...newCache };
        try {
          localStorage.setItem("seller_products_cache", JSON.stringify({
            data: updated,
            timestamp: Date.now()
          }));
        } catch (e) {
          console.error("Error saving cache to localStorage:", e);
        }
        return updated;
      });

      // Bước 2: Prefetch các trang còn lại (nếu có)
      const endPage = Math.min(startPage + prefetchPages - 1, newTotalPages);
      if (endPage > startPage) {
        const remainingPages = Array.from(
          { length: endPage - startPage },
          (_, i) => startPage + i + 1
        );

        // Fetch các trang còn lại song song
        const remainingResults = await Promise.all(remainingPages.map(fetchPage));

        // Cache các trang còn lại
        const moreCache: Record<string, any> = {};
        remainingResults.forEach(({ pageNum, data, total: t, totalPages: tp }) => {
          moreCache[`${userId}-${activeTab}-${pageNum}`] = {
            products: data,
            totalProducts: t,
            totalPage: tp,
          };
        });

        // Cập nhật cache và localStorage
        setCache((prev) => {
          const updated = { ...prev, ...moreCache };
          try {
            localStorage.setItem("seller_products_cache", JSON.stringify({
              data: updated,
              timestamp: Date.now()
            }));
          } catch (e) {
            console.error("Error saving cache to localStorage:", e);
          }
          return updated;
        });

        // Nếu trang hiện tại nằm trong các trang vừa prefetch, cập nhật UI
        if (page > startPage && page <= endPage) {
          const currentPageData = moreCache[cacheKey];
          if (currentPageData) {
            setProducts(currentPageData.products);
            setTotalProducts(currentPageData.totalProducts);
            setTotalPage(currentPageData.totalPage);
          }
        }
      }

      // Nếu trang hiện tại không nằm trong batch này, set loading false
      if (page !== startPage) {
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [page, cache, user, totalPage, totalProducts, activeTab]);

  const deleteProduct = async (id: string): Promise<ActionResult> => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/product/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setCache({});
        localStorage.removeItem("seller_products_cache");
        return { success: true, message: "Xóa sản phẩm thành công" };
      }
      return { success: false, message: data.message || "Xóa thất bại" };
    } catch (err) {
      return { success: false, message: "Lỗi kết nối server" };
    }
  };

  const updateProductDescription = async (
    id: string,
    description: string
  ): Promise<ActionResult> => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/product/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ description }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setCache({});
        localStorage.removeItem("seller_products_cache");
        return { success: true, message: "Cập nhật mô tả thành công" };
      }
      return { success: false, message: data.message || "Cập nhật thất bại" };
    } catch (err) {
      return { success: false, message: "Lỗi kết nối server" };
    }
  };

  const refreshProducts = () => {
    setCache({});
    localStorage.removeItem("seller_products_cache");
    setTotalPage(1); // Reset để fetch lại totalPage mới
    fetchProducts();
  };

  // Kiểm tra và điều chỉnh page khi vượt quá totalPage
  useEffect(() => {
    if (page > totalPage && totalPage > 0) {
      setPage(totalPage);
    }
  }, [page, totalPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <ProductContext.Provider
      value={{
        products,
        isLoading,
        page,
        totalPage,
        totalProducts,
        activeTab,
        setActiveTab: handleSetActiveTab,
        setPage,
        deleteProduct,
        updateProductDescription,
        refreshProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used inside ProductProvider");
  return ctx;
};
