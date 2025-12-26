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

  const fetchProducts = useCallback(async () => {
    if (!user?.id) return;
    const userId = user.id;

    const cacheKey = `${userId}-${page}`;
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
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/product?sellerId=${userId}&page=${page}&limit=${limit}`
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
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [page, cache, user]);

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
    fetchProducts();
  };

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
