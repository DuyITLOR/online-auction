// libs/contexts/productTab.context.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
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

  // CACHE
  const [cache, setCache] = useState<Record<string, CacheData>>({});

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

  // Fetch Products (Có cache)
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

      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filter !== "all") query.append("categoryId", filter);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/product?${query.toString()}`
      );
      const json = await res.json();

      const list = json.data?.data ?? [];
      const total = json.data?.total ?? 0;
      const totalPages = json.data?.totalPages ?? 1;

      setProducts(list);
      setTotalProducts(total);
      setTotalPage(totalPages);

      setCache((prev) => ({
        ...prev,
        [cacheKey]: {
          products: list,
          totalProducts: total,
          totalPage: totalPages,
        },
      }));
    } catch (err) {
      console.error("Fetch products failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filter, page, cache]);

  // Delete Product (KHÔNG xoá UI trước → tránh mất dialog)
  const deleteProduct = async (productId: string): Promise<DeleteResult> => {
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

      // Không fetch ngay → tránh dialog biến mất (Tab sẽ fetch sau)
      return { success: true, message: data.message || "Đã xoá thành công" };
    } catch (err) {
      console.error("Delete error:", err);
      return { success: false, message: "Lỗi kết nối server" };
    }
  };

  const refreshProducts = () => {
    setCache({});
    fetchProducts();
  };

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
