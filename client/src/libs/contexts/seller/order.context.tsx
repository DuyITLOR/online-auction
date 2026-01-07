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
  // Khởi tạo cache từ localStorage
  const [cache, setCache] = useState<Record<string, any>>(() => {
    try {
      const saved = localStorage.getItem("seller_orders_cache");
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
          const newData = json.data?.data?.map((order: any) => ({
            id: order.id,
            customer: order.buyer.fullname,
            date: order.createdAt,
            total: order.totalAmount,
            status: order.status,
            productTitle: order.product.title,
          })) || [];

          return {
            pageNum,
            data: newData,
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
      newCache[`${userId}-${startPage}`] = {
        orders: firstResult.data,
        totalOrders: total,
        totalPage: newTotalPages,
      };

      // Cập nhật state ngay lập tức nếu đang ở trang đầu
      if (page === startPage) {
        setOrders(firstResult.data);
        setTotalOrders(total);
        setTotalPage(newTotalPages);
        setIsLoading(false);
      }

      // Lưu cache vào localStorage ngay
      setCache((prev) => {
        const updated = { ...prev, ...newCache };
        try {
          localStorage.setItem("seller_orders_cache", JSON.stringify({
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
          moreCache[`${userId}-${pageNum}`] = {
            orders: data,
            totalOrders: t,
            totalPage: tp,
          };
        });

        // Cập nhật cache và localStorage
        setCache((prev) => {
          const updated = { ...prev, ...moreCache };
          try {
            localStorage.setItem("seller_orders_cache", JSON.stringify({
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
            setOrders(currentPageData.orders);
            setTotalOrders(currentPageData.totalOrders);
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
  }, [page, cache, user, token, totalPage, totalOrders]);

  const refreshOrders = () => {
    setCache({});
    localStorage.removeItem("seller_orders_cache");
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
