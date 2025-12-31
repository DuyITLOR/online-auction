import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useMemo,
  useCallback,
} from "react";
import { useAdmin } from "./admin.context";
import { toast } from "sonner";

// --- Types ---
export interface User {
  fullname: string;
  email: string;
}

export interface ReportItem {
  id: string;
  userId: string;
  user: User;
  note: string;
  createdAt: string;
  status: string;
  expiredAt: string;
  decidedAt: string;
}

export type ActionType = "APPROVE" | "REFUSE";

interface ModerationContextType {
  // Dữ liệu đã phân trang để hiển thị lên UI (chỉ chứa 5 item của trang hiện tại)
  paginatedData: ReportItem[];
  loading: boolean;
  filterStatus: string;
  searchTerm: string;
  page: number;
  totalPage: number;
  totalRecords: number;
  setPage: (page: number) => void;
  setFilterStatus: (status: string) => void;
  setSearchTerm: (term: string) => void;
  refreshData: () => Promise<void>;
  processRequest: (id: string, action: ActionType) => Promise<void>;
}

const ModerationContext = createContext<ModerationContextType | undefined>(
  undefined
);

const STORAGE_KEY = "moderation_requests_cache";

export const ModerationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { token } = useAdmin();

  // --- States ---
  // allData: Chứa TOÀN BỘ dữ liệu từ API
  const [allData, setAllData] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const limit = 5; // Số lượng item mỗi trang

  // --- Helper: Load từ LocalStorage ---
  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          setAllData(parsed);
          setLoading(false);
        }
      } catch (e) {
        console.error("Cache parsing error", e);
      }
    }
  }, []);

  // --- 1. Fetch ALL Data ---
  // Lưu ý: Vì ta cần filter ở client, ta phải fetch HẾT.
  // Ta set limit thật lớn hoặc bỏ param page/limit nếu API hỗ trợ lấy all.
  const fetchModerationData = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);

      // Giả sử API cho phép lấy nhiều record (ví dụ 1000).
      // Nếu API ép buộc phân trang nhỏ (vd max 50), bạn cần viết hàm loop để fetch hết các trang.
      const maxLimit = 1000;

      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/users/requests?limit=${maxLimit}&page=1`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch");

      const result = await response.json();
      const dataWrapper = result.data?.data || {};
      const dataList: ReportItem[] = dataWrapper.requests || [];

      // Cập nhật State gốc
      setAllData(dataList);
      setLoading(false);

      // Lưu Cache toàn bộ dữ liệu
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataList));
    } catch (error) {
      console.error("Error fetching moderation data:", error);
      if (allData.length === 0) {
        toast.error("Không thể tải dữ liệu kiểm duyệt.");
      }
      setLoading(false);
    }
  }, [token]); // Bỏ page, filterStatus khỏi dependency vì ta fetch 1 lần cục to

  // --- 2. Filter Logic (Lọc trên tập dữ liệu tổng) ---
  const filteredData = useMemo(() => {
    let data = allData;
// Loại bỏ luôn các item EXPIRED
      data = data.filter((item => item.status !== "EXPIRED"));

    // Filter theo Status
    if (filterStatus !== "ALL") {
      
      data = data.filter((item) => item.status === filterStatus);
    }

    // Filter theo Search Term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter((item) => {
        const userName = item.user?.fullname || "";
        const userEmail = item.user?.email || "";
        return (
          userName.toLowerCase().includes(term) ||
          userEmail.toLowerCase().includes(term)
        );
      });
    }

    return data;
  }, [allData, filterStatus, searchTerm]);

  // --- 3. Pagination Logic (Cắt dữ liệu đã lọc để hiển thị) ---
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, page, limit]);

  // Tính toán lại tổng số trang dựa trên kết quả đã lọc
  const totalRecords = filteredData.length;
  const totalPage = Math.ceil(totalRecords / limit) || 1;

  // Reset page về 1 khi đổi điều kiện lọc
  useEffect(() => {
    setPage(1);
  }, [filterStatus, searchTerm]);

  // Fetch dữ liệu lần đầu (chỉ chạy 1 lần khi mount hoặc khi token đổi)
  useEffect(() => {
    fetchModerationData();
  }, [fetchModerationData]);

  // --- 4. Xử lý Duyệt/Từ chối ---
  const processRequest = async (id: string, action: ActionType) => {
    if (!token) {
      toast.error("Unauthorized");
      return;
    }
    try {
      let url =
        action === "APPROVE"
          ? `${import.meta.env.VITE_BACKEND_URL}/users/upgrade/${id}/accept`
          : `${import.meta.env.VITE_BACKEND_URL}/users/upgrade/${id}/refuse`;

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Action failed");

      toast.success(action === "APPROVE" ? "Đã duyệt!" : "Đã từ chối!");

      // Refresh lại toàn bộ data để cập nhật status mới nhất
      await fetchModerationData();
    } catch (error: any) {
      console.error("Error processing request:", error);
      toast.error("Có lỗi xảy ra.");
    }
  };

  return (
    <ModerationContext.Provider
      value={{
        paginatedData, // Dùng biến này để render bảng (Table)
        loading,
        filterStatus,
        searchTerm,
        page,
        totalPage, // Tổng page này là của dữ liệu đã lọc
        totalRecords, // Tổng record này là của dữ liệu đã lọc
        setPage,
        setFilterStatus,
        setSearchTerm,
        refreshData: () => fetchModerationData(),
        processRequest,
      }}
    >
      {children}
    </ModerationContext.Provider>
  );
};

export const useModeration = () => {
  const context = useContext(ModerationContext);
  if (!context) {
    throw new Error("useModeration must be used within a ModerationProvider");
  }
  return context;
};
