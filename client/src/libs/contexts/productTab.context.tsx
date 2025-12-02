import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

import { getSession } from "../session";

// --- Types ---
interface Product {
  id: string;
  title: string;
  seller: { fullname: string };
  category: { name: string };
  currentPrice: number;
  endAt: string;
}

interface Category {
  id: string;
  name: string;
}

// Cấu trúc dữ liệu lưu trong Cache cho mỗi trang
interface CacheData {
  products: Product[];
  totalProducts: number;
  totalPage: number;
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
  deleteProduct: (id: string) => Promise<void>;
  refreshProducts: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);
const session = await getSession();

export const ProductProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // --- State Hiển thị ---
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- Pagination & Filter ---
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // --- CACHE STATE (Lưu trữ các trang đã tải) ---
  // Key sẽ là dạng: "categoryId-pageNumber" (ví dụ: "all-1", "dientu-2")
  const [cache, setCache] = useState<Record<string, CacheData>>({});

  const limit = 5;

  // 1. Lấy danh mục (Chạy 1 lần)
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:4000/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Lỗi lấy danh mục:", error);
    }
  };

  // 2. Lấy sản phẩm (Có Caching)
  const fetchProducts = useCallback(async () => {
    // Tạo cache Key duy nhất cho trang thái hiện tại
    const cacheKey = `${filter}-${page}`;

    // A. KIỂM TRA CACHE
    if (cache[cacheKey]) {
      // Nếu đã có dữ liệu trong kho, lôi ra dùng ngay lập tức
      const cachedData = cache[cacheKey];
      setProducts(cachedData.products);
      setTotalProducts(cachedData.totalProducts);
      setTotalPage(cachedData.totalPage);
      setIsLoading(false); // Đảm bảo tắt loading
      console.log(`Loaded from cache: ${cacheKey}`);
      return; // Dừng lại, không gọi API nữa
    }

    // B. NẾU KHÔNG CÓ CACHE -> GỌI API
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filter !== "all") {
        params.append("categoryId", filter);
      }

      const res = await fetch(
        `http://localhost:4000/product?${params.toString()}`
      );
      const subRes = await res.json();

      if (subRes.success || subRes.data) {
        const newData = subRes.data.data || [];
        const newTotal = subRes.data.total || 0;
        const newTotalPages = subRes.data.totalPages || 1;

        // Cập nhật State hiển thị
        setProducts(newData);
        setTotalProducts(newTotal);
        setTotalPage(newTotalPages);

        // LƯU VÀO CACHE
        setCache((prevCache) => ({
          ...prevCache,
          [cacheKey]: {
            products: newData,
            totalProducts: newTotal,
            totalPage: newTotalPages,
          },
        }));
      }
    } catch (error) {
      console.error("Lỗi lấy sản phẩm:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, filter, cache]); // Thêm cache vào dependency để check

  // 3. Xử lý Xóa (Cần làm sạch Cache để tránh dữ liệu cũ)
  const deleteProduct = async (productId: string) => {
    // Optimistic UI: Xóa trên giao diện ngay
    const oldProducts = [...products];
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setTotalProducts((prev) => prev - 1);

    try {
      console.log("getSession in deleteProduct:", getSession());
      await fetch(`http://localhost:4000/product/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
      });

      // QUAN TRỌNG: Khi dữ liệu thay đổi (xóa/sửa/thêm), Cache cũ không còn đúng nữa.
      // Cách đơn giản nhất: Xóa toàn bộ Cache để ép tải lại dữ liệu mới nhất khi chuyển trang.
      setCache({});

      // Hoặc cách phức tạp hơn: Tìm trong cache và xóa item đó (nhưng sẽ khó xử lý số totalPage)
    } catch (error) {
      console.error("Delete failed:", error);
      // Hoàn tác nếu lỗi
      setProducts(oldProducts);
      setTotalProducts((prev) => prev + 1);
    }
  };

  // Hàm force reload (dùng khi muốn nút refresh thủ công)
  const refreshProducts = () => {
    setCache({}); // Xóa cache
    fetchProducts(); // Gọi lại
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
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
