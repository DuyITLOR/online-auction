import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from "react";
import { useSeller } from "./seller.context";

interface Order {
  id: string;
  customer: string;
  date: string;
  total: string;
  status: string;
  productTitle: string;
}

interface OrderContextType {
  orders: Order[];
  isLoading: boolean;
  page: number;
  totalPage: number;
  totalOrders: number;
  setPage: (page: number) => void;
  refreshOrders: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user, token } = useSeller();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [cache, setCache] = useState<Record<string, any>>({});

  const limit = 5;
  const prefetchPages = 4; // Số pages prefetch mỗi lần

  const fetchOrders = useCallback(async () => {
    if (!user?.id) return;
    const userId = user.id;

    const cacheKey = `${userId}-${page}`;
    if (cache[cacheKey]) {
      const c = cache[cacheKey];
      setOrders(c.orders);
      setTotalOrders(c.totalOrders);
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
          const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/orders?view=SELLER&page=${pageNum}&limit=${limit}&sellerId=${userId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
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
            orders: data,
            totalOrders: t,
            totalPage: tp,
          };
        }
        if (t > 0) {
          total = t;
          newTotalPages = tp;
        }
      });

      setCache((prev) => ({ ...prev, ...newCache }));

      // Cập nhật totalPage 1 lần từ response
      if (newTotalPages !== totalPage) {
        setTotalPage(newTotalPages);
      }
      if (total !== totalOrders) {
        setTotalOrders(total);
      }

      const currentPageData = newCache[cacheKey];
      if (currentPageData) {
        setOrders(currentPageData.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [page, cache, user, token, totalPage, totalOrders]);

  const refreshOrders = () => {
    setCache({});
    setTotalPage(1); // Reset để fetch lại totalPage mới
    fetchOrders();
  };

  // Kiểm tra và điều chỉnh page khi vượt quá totalPage
  useEffect(() => {
    if (page > totalPage && totalPage > 0) {
      setPage(totalPage);
    }
  }, [page, totalPage]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <OrderContext.Provider
      value={{
        orders,
        isLoading,
        page,
        totalPage,
        totalOrders,
        setPage,
        refreshOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used inside OrderProvider");
  return ctx;
};
