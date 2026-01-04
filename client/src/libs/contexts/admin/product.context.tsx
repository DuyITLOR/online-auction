// libs/contexts/productTab.context.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from "react";

import { useAdmin } from "./admin.context";

// --- Types ---
interface Product {
  id: string;
  title: string;
  seller: { fullname: string };
  category: { name: string };
  currentPrice: number;
  endAt: string;
  countbids: number;
}

interface Category {
  id: string;
  name: string;
}

interface CacheData {
  products: Product[];
  totalProducts: number;
  totalPage: number;
}

interface DeleteResult {
  success: boolean;
  message: string;
}

interface ProductContextType {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  filter: string;
  page: number;
  totalPage: number;
  totalProducts: number;
  setFilter: (filter: string) => void;
  setPage: (page: number) => void;
  deleteProduct: (id: string) => Promise<DeleteResult>;
  refreshProducts: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { token } = useAdmin();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const limit = 5;
  const prefetchPages = 4; // Số pages prefetch mỗi lần
  // CACHE - Khởi tạo từ localStorage
  const [cache, setCache] = useState<Record<string, CacheData>>(() => {
    try {
      const saved = localStorage.getItem("admin_products_cache");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.timestamp && Date.now() - parsed.timestamp < 5 * 60 * 1000) {
          return parsed.data || {};
        }
      }
    } catch (e) {
      console.error("Error loading cache from localStorage:", e);
    }
    return {};
  });

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/categories`);
      const json = await res.json();
      setCategories(json.data || []);
    } catch (err) {
      console.error("Fetch categories failed:", err);
    }
  };

  // Fetch Products (Có cache + Promise.all)
  const fetchProducts = useCallback(async () => {
    const cacheKey = `${filter}-${page}`;

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
      const batchIndex = Math.floor((page - 1) / prefetchPages);
      const startPage = batchIndex * prefetchPages + 1;

      // Fetch song song nhiều pages bằng Promise.all
      const fetchPage = async (pageNum: number) => {
        try {
          const query = new URLSearchParams({
            page: pageNum.toString(),
            limit: limit.toString(),
          });
          if (filter !== "all") query.append("categoryId", filter);

          const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/product?${query.toString()}`
          );
          if (!res.ok) return { pageNum, data: [], total: 0, totalPages: 1 };
          const json = await res.json();
          return {
            pageNum,
            data: json.data?.data ?? [],
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
      const newCache: Record<string, CacheData> = {};
      newCache[`${filter}-${startPage}`] = {
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
          localStorage.setItem("admin_products_cache", JSON.stringify({
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
        const moreCache: Record<string, CacheData> = {};
        remainingResults.forEach(({ pageNum, data, total: t, totalPages: tp }) => {
          moreCache[`${filter}-${pageNum}`] = {
            products: data,
            totalProducts: t,
            totalPage: tp,
          };
        });

        // Cập nhật cache và localStorage
        setCache((prev) => {
          const updated = { ...prev, ...moreCache };
          try {
            localStorage.setItem("admin_products_cache", JSON.stringify({
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
      console.error("Fetch products failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filter, page, cache, totalPage, totalProducts]);

  // Delete Product (KHÔNG xoá UI trước → tránh mất dialog)
  const deleteProduct = async (productId: string): Promise<DeleteResult> => {
    if (!token) return { success: false, message: "Unauthorized" };
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/product/${productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, message: data?.message || "Xóa thất bại" };
      }

      // Clear cache để lần fetch kế tiếp lấy data mới
      setCache({});
      localStorage.removeItem("admin_products_cache");

      // Không fetch ngay → tránh dialog biến mất (Tab sẽ fetch sau)
      return { success: true, message: data.message || "Đã xoá thành công" };
    } catch (err) {
      console.error("Delete error:", err);
      return { success: false, message: "Lỗi kết nối server" };
    }
  };

  const refreshProducts = () => {
    setCache({});
    localStorage.removeItem("admin_products_cache");
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
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        isLoading,
        filter,
        page,
        totalPage,
        totalProducts,
        setFilter,
        setPage,
        deleteProduct,
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
