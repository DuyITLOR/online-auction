import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from "react";
import { useSeller } from "./seller.context";
import { getSession } from "../../session";

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
  const { user } = useSeller();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [cache, setCache] = useState<Record<string, any>>({});

  const limit = 5;
  const prefetchPages = 4; // Số pages prefetch mỗi lần

  const fetchProducts = useCallback(async () => {
    if (!user?.id) return;
    const userId = user.id;

    const cacheKey = `${userId}-${page}`;
    
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
          const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/product?sellerId=${userId}&page=${pageNum}&limit=${limit}`
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

      // Tính số pages cần fetch: không vượt quá totalPage đã biết
      const endPage = totalPage > 1
        ? Math.min(startPage + prefetchPages - 1, totalPage)
        : startPage + prefetchPages - 1;
      
      const pagesToFetch = endPage - startPage + 1;

      // Tạo array các promises cho các pages cần fetch
      const pageNumbers = Array.from(
        { length: pagesToFetch },
        (_, i) => startPage + i
      );
      
      const results = await Promise.all(pageNumbers.map(fetchPage));

      // Cache từng page từ kết quả
      const newCache: Record<string, any> = {};
      let total = 0;
      let newTotalPages = 1;

      results.forEach(({ pageNum, data, total: t, totalPages: tp }) => {
        if (data.length > 0) {
          newCache[`${userId}-${pageNum}`] = {
            products: data,
            totalProducts: t,
            totalPage: tp,
          };
        }
        // Lấy total và totalPages từ bất kỳ response nào có data
        if (t > 0) {
          total = t;
          newTotalPages = tp;
        }
      });

      // Cập nhật cache
      setCache((prev) => ({ ...prev, ...newCache }));

      // Cập nhật totalPage 1 lần từ response
      if (newTotalPages !== totalPage) {
        setTotalPage(newTotalPages);
      }
      if (total !== totalProducts) {
        setTotalProducts(total);
      }

      // Hiển thị data của page hiện tại
      const currentPageData = newCache[cacheKey];
      if (currentPageData) {
        setProducts(currentPageData.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [page, cache, user, totalPage, totalProducts]);

  const deleteProduct = async (id: string): Promise<ActionResult> => {
    try {
      const session = await getSession();
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/product/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${session?.token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setCache({});
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
      const session = await getSession();
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/product/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.token}`,
          },
          body: JSON.stringify({ description }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setCache({});
        return { success: true, message: "Cập nhật mô tả thành công" };
      }
      return { success: false, message: data.message || "Cập nhật thất bại" };
    } catch (err) {
      return { success: false, message: "Lỗi kết nối server" };
    }
  };

  const refreshProducts = () => {
    setCache({});
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
