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

  // Cache: key dạng "pageNumber" - Khởi tạo từ localStorage
  const [cache, setCache] = useState<Record<string, CacheItem>>(() => {
    try {
      const saved = localStorage.getItem("admin_users_cache");
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

      // Bước 1: Fetch trang đầu tiên để lấy totalPages và hiển thị ngay
      const firstResult = await fetchPage(startPage);
      let newTotalPages = firstResult.totalPages;
      let newTotalUsers = firstResult.totalUsers;

      // Lưu trang đầu vào cache ngay
      const newCache: Record<string, CacheItem> = {};
      newCache[`page-${startPage}`] = {
        users: firstResult.data,
        totalUsers: newTotalUsers,
        totalPages: newTotalPages,
      };

      // Cập nhật state ngay lập tức nếu đang ở trang đầu
      if (apiPage === startPage) {
        setUsers(firstResult.data);
        setTotalUsers(newTotalUsers);
        setTotalPages(newTotalPages);
        setIsLoading(false);
      }

      // Lưu cache vào localStorage ngay
      setCache((prev) => {
        const updated = { ...prev, ...newCache };
        try {
          localStorage.setItem("admin_users_cache", JSON.stringify({
            data: updated,
            timestamp: Date.now()
          }));
        } catch (e) {
          console.error("Error saving cache to localStorage:", e);
        }
        return updated;
      });

      // Bước 2: Prefetch các trang còn lại (nếu có)
      const maxApiPage = newTotalPages - 1; // API page cuối cùng (0-indexed)
      const endPage = Math.min(startPage + prefetchPages - 1, maxApiPage);
      
      if (endPage > startPage) {
        const remainingPages = Array.from(
          { length: endPage - startPage },
          (_, i) => startPage + i + 1
        );

        // Fetch các trang còn lại song song
        const remainingResults = await Promise.all(remainingPages.map(fetchPage));

        // Cache các trang còn lại
        const moreCache: Record<string, CacheItem> = {};
        remainingResults.forEach(({ pageNum, data, totalUsers: tu, totalPages: tp }) => {
          moreCache[`page-${pageNum}`] = {
            users: data,
            totalUsers: tu,
            totalPages: tp,
          };
        });

        // Cập nhật cache và localStorage
        setCache((prev) => {
          const updated = { ...prev, ...moreCache };
          try {
            localStorage.setItem("admin_users_cache", JSON.stringify({
              data: updated,
              timestamp: Date.now()
            }));
          } catch (e) {
            console.error("Error saving cache to localStorage:", e);
          }
          return updated;
        });

        // Nếu trang hiện tại nằm trong các trang vừa prefetch, cập nhật UI
        if (apiPage > startPage && apiPage <= endPage) {
          const currentPageData = moreCache[cacheKey];
          if (currentPageData) {
            setUsers(currentPageData.users);
            setTotalUsers(currentPageData.totalUsers);
            setTotalPages(currentPageData.totalPages);
          }
        }
      }

      // Nếu trang hiện tại không nằm trong batch này, set loading false
      if (apiPage !== startPage) {
        setIsLoading(false);
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
    localStorage.removeItem("admin_users_cache");
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
      localStorage.removeItem("admin_users_cache");
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
