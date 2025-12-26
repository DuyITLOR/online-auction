import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { getSession, type UserSession } from "../../session";

interface AdminContextType {
  user: UserSession | null;
  token: string | null;
  isAuthLoading: boolean; // Đây là loading của việc check đăng nhập
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await getSession();
        if (session) {
          if ((session as any).user) setUser((session as any).user);
          if ((session as any).token) setToken((session as any).token);
        }
      } catch (error) {
        console.error("Failed to fetch seller session:", error);
      } finally {
        setIsAuthLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AdminContext.Provider value={{ user, token, isAuthLoading }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
