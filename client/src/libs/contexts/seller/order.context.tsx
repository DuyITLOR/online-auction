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
      console.log(token);
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/orders?view=SELLER&page=${page}&limit=${limit}&sellerId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await res.json();

      const rawList = json.data?.data ?? [];
      const total = json.data?.total ?? 0;
      const totalPages = json.data?.totalPages ?? 1;

  //       WAIT_SELLER_BANK_INFO
  // WAIT_BUYER_PAYMENT
  // WAIT_SELLER_SHIPPING
  // WAIT_BUYER_CONFIRM_RECEIVE
  // WAIT_REVIEW
  // COMPLETED
  // CANCELLED
      const list: Order[] = rawList.map((item: any) => ({
        id: item.id,
        customer: item.buyer?.fullname || "Unknown",
        date: "N/A", // Server currently doesn't return date for SELLER view
        total: item.totalAmount,
        status: item.status,
        productTitle: item.product?.title || "",
      }));

      setOrders(list);
      setTotalOrders(total);
      setTotalPage(totalPages);
      setCache((prev) => ({
        ...prev,
        [cacheKey]: {
          orders: list,
          totalOrders: total,
          totalPage: totalPages,
        },
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [page, cache, user]);

  const refreshOrders = () => {
    setCache({});
    fetchOrders();
  };

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
