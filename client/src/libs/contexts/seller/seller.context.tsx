import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { getSession, type UserSession } from "../../session";

interface SellerContextType {
  token: string | null;
  user: UserSession | null;
  isLoading: boolean;
}

const SellerContext = createContext<SellerContextType | undefined>(undefined);

export const SellerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await getSession();
        // The payload from getSession is typed as any/JWTPayload but we know it matches Session structure
        if (session) {
          if ((session as any).user) setUser((session as any).user);
          if ((session as any).token) setToken((session as any).token);
        }
      } catch (error) {
        console.error("Failed to fetch seller session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <SellerContext.Provider value={{ user, isLoading, token }}>
      {children}
    </SellerContext.Provider>
  );
};

export const useSeller = () => {
  const context = useContext(SellerContext);
  if (context === undefined) {
    throw new Error("useSeller must be used within a SellerProvider");
  }
  return context;
};
