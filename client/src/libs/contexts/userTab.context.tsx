import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

import { getSession } from "../session";

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

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Cache: key dạng "pageNumber"
  const [cache, setCache] = useState<Record<string, CacheItem>>({});

  // ---- FETCH USERS Với cache ----
  const fetchUsers = useCallback(async () => {
    const cacheKey = `page-${page}`;

    // A. Lấy dữ liệu từ cache nếu có
    if (cache[cacheKey]) {
      const data = cache[cacheKey];
      setUsers(data.users);
      setTotalUsers(data.totalUsers);
      setTotalPages(data.totalPages);
      setIsLoading(false);
      console.log(`User loaded from cache: ${cacheKey}`);
      return;
    }

    // B. Gọi API nếu cache không có
    try {
      setIsLoading(true);

      const session = await getSession();

      const res = await fetch(
        `http://localhost:4000/admin/users?limit=${limit}&page=${page - 1}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.token}`,
          },
        }
      );

      const json = await res.json();

      const newUsers = json.data.data.users || [];
      const newTotalUsers = json.data.data.totalUsers || 0;
      const newTotalPages = json.data.data.totalPages || 1;

      setUsers(newUsers);
      setTotalUsers(newTotalUsers);
      setTotalPages(newTotalPages);

      // C. Lưu vào cache
      setCache((prev) => ({
        ...prev,
        [cacheKey]: {
          users: newUsers,
          totalUsers: newTotalUsers,
          totalPages: newTotalPages,
        },
      }));
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  }, [page, cache]);

  // Refresh thủ công hoặc sau xóa user
  const refreshUsers = () => {
    setCache({});
    fetchUsers();
  };

  // ---- Delete User ----
  const deleteUser = async (userId: string) => {
    const prevUsers = users;

    // Optimistic UI
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setTotalUsers((prev) => prev - 1);

    try {
      const session = await getSession();

      await fetch(`http://localhost:4000/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.token}`,
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
