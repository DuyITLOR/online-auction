import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';

import { useAdmin } from './admin.context';

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
  deleteUser: (id: string) => Promise<void>; // backward compat, maps to deactivate
  deactivateUser: (id: string) => Promise<void>;
  activateUser: (id: string) => Promise<void>;
  refreshUsers: () => void;
  // Deactivated users view
  deactivatedUsers: User[];
  isLoadingDeactivated: boolean;
  fetchDeactivatedUsers: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);
const limit = 5;
const prefetchPages = 4; // Số pages prefetch mỗi lần

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAdmin();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDeactivated, setIsLoadingDeactivated] = useState(false);

  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [deactivatedUsers, setDeactivatedUsers] = useState<User[]>([]);

  // Cache: key dạng "pageNumber" - Khởi tạo từ localStorage
  const [cache, setCache] = useState<Record<string, CacheItem>>(() => {
    try {
      const saved = localStorage.getItem('admin_users_cache');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.timestamp && Date.now() - parsed.timestamp < 5 * 60 * 1000) {
          return parsed.data || {};
        }
      }
    } catch (e) {
      console.error('Error loading cache from localStorage:', e);
    }
    return {};
  });

  // ---- FETCH USERS Với cache-first + SWR background prefetch ----
  const fetchUsers = useCallback(async () => {
    if (!token) return;

    const apiPage = page - 1; // API page 0-indexed
    const cacheKey = `page-${apiPage}`;

    // Read latest cache snapshot from localStorage to avoid stale state
    let localCache: Record<string, CacheItem> | undefined;
    try {
      const raw = localStorage.getItem('admin_users_cache');
      if (raw) {
        const parsed = JSON.parse(raw) as {
          data: Record<string, CacheItem>;
          timestamp: number;
        };
        if (parsed && parsed.data) localCache = parsed.data;
      }
    } catch {}

    const batchIndex = Math.floor(apiPage / prefetchPages);
    const startPage = batchIndex * prefetchPages; // API page 0-indexed

    const fetchPage = async (pageNum: number) => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/admin/users?limit=${limit}&page=${pageNum}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
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

    // Serve cached page immediately and do NOT fetch again
    if (localCache && localCache[cacheKey]) {
      const data = localCache[cacheKey];
      setUsers(data.users);
      setTotalUsers(data.totalUsers);
      setTotalPages(data.totalPages);
      setIsLoading(false);
      return;
    }

    // No cache for current page: normal fetch with loader
    try {
      setIsLoading(true);
      const firstResult = await fetchPage(startPage);
      let newTotalPages = firstResult.totalPages;
      let newTotalUsers = firstResult.totalUsers;
      const newCache: Record<string, CacheItem> = {};
      newCache[`page-${startPage}`] = {
        users: firstResult.data,
        totalUsers: newTotalUsers,
        totalPages: newTotalPages,
      };
      if (apiPage === startPage) {
        setUsers(firstResult.data);
        setTotalUsers(newTotalUsers);
        setTotalPages(newTotalPages);
      }
      setCache((prev) => {
        const updated = { ...prev, ...newCache };
        try {
          localStorage.setItem(
            'admin_users_cache',
            JSON.stringify({ data: updated, timestamp: Date.now() })
          );
        } catch {}
        return updated;
      });

      const maxApiPage = newTotalPages - 1; // API page cuối cùng (0-indexed)
      const endPage = Math.min(startPage + prefetchPages - 1, maxApiPage);
      if (endPage > startPage) {
        const remainingPages = Array.from(
          { length: endPage - startPage },
          (_, i) => startPage + i + 1
        );
        const remainingResults = await Promise.all(
          remainingPages.map(fetchPage)
        );
        const moreCache: Record<string, CacheItem> = {};
        remainingResults.forEach(
          ({ pageNum, data, totalUsers: tu, totalPages: tp }) => {
            moreCache[`page-${pageNum}`] = {
              users: data,
              totalUsers: tu,
              totalPages: tp,
            };
          }
        );
        setCache((prev) => {
          const updated = { ...prev, ...moreCache };
          try {
            localStorage.setItem(
              'admin_users_cache',
              JSON.stringify({ data: updated, timestamp: Date.now() })
            );
          } catch {}
          return updated;
        });
        if (apiPage > startPage && apiPage <= endPage) {
          const currentPageData = moreCache[cacheKey];
          if (currentPageData) {
            setUsers(currentPageData.users);
            setTotalUsers(currentPageData.totalUsers);
            setTotalPages(currentPageData.totalPages);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token, page]);

  // Refresh thủ công hoặc sau xóa user
  const refreshUsers = () => {
    setCache({});
    localStorage.removeItem('admin_users_cache');
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
    // Map to deactivate for backward compatibility
    await deactivateUser(userId);
  };

  // Deactivate user (PATCH)
  const deactivateUser = async (userId: string) => {
    const prevUsers = users;
    // Optimistic update: remove from active list
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setTotalUsers((prev) => Math.max(0, prev - 1));
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users/${userId}/deactivate`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error('Deactivate failed');
      // bust cache
      setCache({});
      localStorage.removeItem('admin_users_cache');
      localStorage.removeItem('admin_deactivated_users_cache');
      // optionally refresh deactivated list next time
    } catch (error) {
      console.error('Deactivate user failed:', error);
      setUsers(prevUsers);
      setTotalUsers((prev) => prev + 1);
      throw error;
    }
  };

  // Activate user (PATCH)
  const activateUser = async (userId: string) => {
    const prev = deactivatedUsers;
    // Optimistic: remove from deactivated list
    setDeactivatedUsers((prev) => prev.filter((u) => u.id !== userId));
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users/${userId}/activate`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error('Activate failed');
      // Invalidate active cache so user appears back when refetched
      setCache({});
      localStorage.removeItem('admin_users_cache');
      localStorage.removeItem('admin_deactivated_users_cache');
    } catch (error) {
      console.error('Activate user failed:', error);
      setDeactivatedUsers(prev);
      throw error;
    }
  };

  // Fetch deactivated users (no pagination on API)
  const fetchDeactivatedUsers = useCallback(async () => {
    if (!token) return;
    // Try local cache first (TTL 5 minutes)
    try {
      const saved = localStorage.getItem('admin_deactivated_users_cache');
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as {
            users: User[];
            timestamp: number;
          };
          const isFresh = Date.now() - parsed.timestamp < 5 * 60 * 1000;
          if (Array.isArray(parsed.users)) {
            setDeactivatedUsers(parsed.users);
          }
          if (isFresh) {
            // Serve from cache and revalidate in background without spinner
            (async () => {
              try {
                const res = await fetch(
                  `${import.meta.env.VITE_BACKEND_URL}/users/deactivated`,
                  {
                    method: 'GET',
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                if (!res.ok) return;
                const json = await res.json();
                const list: User[] = json?.data?.users || [];
                setDeactivatedUsers(list);
                localStorage.setItem(
                  'admin_deactivated_users_cache',
                  JSON.stringify({ users: list, timestamp: Date.now() })
                );
              } catch {}
            })();
            return;
          }
        } catch (e) {
          console.error('Error parsing deactivated cache:', e);
        }
      }
      // No cache or stale: show loader then fetch
      setIsLoadingDeactivated(true);
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users/deactivated`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error('Fetch deactivated failed');
      const json = await res.json();
      const list: User[] = json?.data?.users || [];
      setDeactivatedUsers(list);
      try {
        localStorage.setItem(
          'admin_deactivated_users_cache',
          JSON.stringify({ users: list, timestamp: Date.now() })
        );
      } catch (e) {
        console.error('Error saving deactivated cache:', e);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingDeactivated(false);
    }
  }, [token]);

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
        deactivateUser,
        activateUser,
        refreshUsers,
        deactivatedUsers,
        isLoadingDeactivated,
        fetchDeactivatedUsers,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUsers must be used inside a UserProvider');
  return ctx;
};
