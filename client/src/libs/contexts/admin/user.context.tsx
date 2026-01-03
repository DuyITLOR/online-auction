import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

import { useAdmin } from "./admin.context";

interface User {
  id: string;
  email: string;
  fullname: string;
  role: string;
  createdAt: string;
}

interface CacheItem {
  users: User[];
  totalUsers: number;
  totalPages: number;
}

interface UserContextType {
  users: User[];
  isLoading: boolean;
  page: number;
  totalUsers: number;
  totalPages: number;
  setPage: (page: number) => void;
  deleteUser: (id: string) => Promise<void>;
  refreshUsers: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);
const limit = 5;
const prefetchPages = 4; // Số pages prefetch mỗi lần

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAdmin();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Cache: key dạng "pageNumber"
  const [cache, setCache] = useState<Record<string, CacheItem>>({});

  // ---- FETCH USERS Với cache + Promise.all ----
  const fetchUsers = useCallback(async () => {
    if (!token) return;
    
    // UI page bắt đầu từ 1, API page bắt đầu từ 0
    const apiPage = page - 1;
    const cacheKey = `page-${apiPage}`;

    // A. Lấy dữ liệu từ cache nếu có
    if (cache[cacheKey]) {
      const data = cache[cacheKey];
      setUsers(data.users);
      setTotalUsers(data.totalUsers);
      setTotalPages(data.totalPages);
      setIsLoading(false);
      return;
    }

    // B. Gọi API song song bằng Promise.all
    try {
      setIsLoading(true);
      const batchIndex = Math.floor(apiPage / prefetchPages);
      const startPage = batchIndex * prefetchPages; // API page bắt đầu từ 0

      // Fetch song song nhiều pages
      const fetchPage = async (pageNum: number) => {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/admin/users?limit=${limit}&page=${pageNum}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!res.ok) return { pageNum, data: [], totalUsers: 0, totalPages: 1 };
          const json = await res.json();
          return {
            pageNum,
            data: json?.data?.data?.users || [],
            totalUsers: json?.data?.data?.totalUsers || 0,
            totalPages: Math.ceil((json?.data?.data?.totalUsers || 0) / limit),
          };
        } catch {
          return { pageNum, data: [], totalUsers: 0, totalPages: 1 };
        }
      };

      // Tính số pages cần fetch: không vượt quá totalPages đã biết
      // totalPages ở đây là số trang thực tế (API trả về)
      const maxApiPage = totalPages - 1; // API page cuối cùng
      const endPage = totalPages > 0 
        ? Math.min(startPage + prefetchPages - 1, maxApiPage)
        : startPage + prefetchPages - 1;
      
      const pagesToFetch = endPage - startPage + 1;

      // Tạo array các promises cho các pages cần fetch (chỉ fetch đủ số page cần thiết)
      const pageNumbers = Array.from(
        { length: pagesToFetch },
        (_, i) => startPage + i
      );

      const results = await Promise.all(pageNumbers.map(fetchPage));

      // Cache từng page từ kết quả
      const newCache: Record<string, CacheItem> = {};
      let newTotalUsers = 0;
      let newTotalPages = 1;

      results.forEach(({ pageNum, data, totalUsers: tu, totalPages: tp }) => {
        if (data.length > 0) {
          newCache[`page-${pageNum}`] = {
            users: data,
            totalUsers: tu,
            totalPages: tp,
          };
        }
        if (tu > 0) {
          newTotalUsers = tu;
          newTotalPages = tp;
        }
      });

      setCache((prev) => ({ ...prev, ...newCache }));

      // Cập nhật totalPages 1 lần từ response (nếu chưa có hoặc thay đổi)
      if (newTotalPages !== totalPages) {
        setTotalPages(newTotalPages);
      }
      if (newTotalUsers !== totalUsers) {
        setTotalUsers(newTotalUsers);
      }

      const currentPageData = newCache[cacheKey];
      if (currentPageData) {
        setUsers(currentPageData.users);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  }, [token, page, cache, totalPages, totalUsers]);

  // Refresh thủ công hoặc sau xóa user
  const refreshUsers = () => {
    setCache({});
    setTotalPages(1); // Reset để fetch lại totalPages mới
    fetchUsers();
  };

  // Kiểm tra và điều chỉnh page khi vượt quá totalPages
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  // ---- Delete User ----
  const deleteUser = async (userId: string) => {
    const prevUsers = users;

    // Optimistic UI
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setTotalUsers((prev) => prev - 1);

    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Xóa cache để dữ liệu cập nhật mới
      setCache({});
    } catch (error) {
      console.error("Delete user failed:", error);
      setUsers(prevUsers);
      setTotalUsers((prev) => prev + 1);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <UserContext.Provider
      value={{
        users,
        isLoading,
        page,
        totalUsers,
        totalPages,
        setPage,
        deleteUser,
        refreshUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUsers must be used inside a UserProvider");
  return ctx;
};
