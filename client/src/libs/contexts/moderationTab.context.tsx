import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { getSession } from "../session";
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
  moderationData: ReportItem[];
  filteredData: ReportItem[];
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

// Dùng 1 key đơn giản, không nối chuỗi phức tạp
const STORAGE_KEY = "moderation_requests_cache";

export const ModerationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // --- States ---
  const [moderationData, setModerationData] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const limit = 5;

  // --- Helper: Load từ LocalStorage (Chạy 1 lần khi mount) ---
  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        // Chỉ load cache nếu nó có cấu trúc hợp lệ
        if (parsed.data && Array.isArray(parsed.data)) {
          setModerationData(parsed.data);
          setTotalRecords(parsed.total || 0);
          setTotalPage(parsed.totalPages || 1);
          setLoading(false); // Hiển thị luôn để người dùng đỡ chờ
        }
      } catch (e) {
        console.error("Cache parsing error", e);
      }
    }
  }, []);

  // --- 1. Fetch Data ---
  const fetchModerationData = useCallback(async () => {
    try {
      // Nếu chưa có data (lần đầu hoặc cache lỗi), bật loading
      if (moderationData.length === 0) setLoading(true);

      const session = await getSession();

      // console.log("Fetching with params:", params.toString());
      // Nếu API hỗ trợ filter status thì uncomment.
      // Nếu không, ta vẫn fetch all về và client-filter (như logic filteredData bên dưới).
      if (filterStatus !== "ALL") {
        params.append("status", filterStatus);
      }

      const response = await fetch(
        `http://localhost:4000/users/requests?limit=${limit}&page=${page}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch");

      const result = await response.json();
      console.log("Fetched moderation data:", result);
      const dataWrapper = result.data?.data || {};

      const dataList: ReportItem[] = dataWrapper.requests || [];
      const totalRequests = dataWrapper.totalRequests || 0;
      const totalPagesRes = dataWrapper.totalPages || 1;

      // Cập nhật State
      setModerationData(dataList);
      setTotalRecords(totalRequests);
      setTotalPage(totalPagesRes);
      setLoading(false);

      // Lưu Cache đơn giản (Ghi đè cái mới nhất)
      // Chỉ lưu khi ở trang 1 và filter ALL để đảm bảo cache là dữ liệu "gốc" sạch sẽ nhất
      // Hoặc lưu luôn trang hiện tại để reload lại đúng trang đó
      if (page === 1 && filterStatus === "ALL") {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            data: dataList,
            total: totalRequests,
            totalPages: totalPagesRes,
          })
        );
      }
    } catch (error) {
      console.error("Error fetching moderation data:", error);
      if (moderationData.length === 0) {
        toast.error("Không thể tải dữ liệu kiểm duyệt.");
      }
      setLoading(false);
    }
  }, [page, filterStatus]); // Bỏ cache dependency, chỉ phụ thuộc params API

  // --- 2. Xử lý Duyệt/Từ chối ---
  const processRequest = async (id: string, action: ActionType) => {
    const session = await getSession();
    try {
      let url =
        action === "APPROVE"
          ? `http://localhost:4000/users/upgrade/${id}/accept`
          : `http://localhost:4000/users/upgrade/${id}/refuse`;

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
      });

      if (!response.ok) throw new Error("Action failed");

      toast.success(action === "APPROVE" ? "Đã duyệt!" : "Đã từ chối!");

      // Reload lại data
      await fetchModerationData();
    } catch (error: any) {
      console.error("Error processing request:", error);
      toast.error("Có lỗi xảy ra.");
    }
  };

  // --- 3. Filter Client-side ---
  const filteredData = useMemo(() => {
    let data = moderationData;

    // Nếu API đã filter theo status thì data trả về đã đúng,
    // nhưng nếu API trả về hỗn hợp (do param sai/thiếu) thì đoạn này giúp lọc lại cho chắc.
    if (filterStatus !== "ALL") {
      // Logic filter client bổ sung
      // data = data.filter(...)
    }

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
  }, [moderationData, filterStatus, searchTerm]);

  // Reset page về 1 khi đổi filter
  useEffect(() => {
    setPage(1);
  }, [filterStatus]);

  // Trigger fetch khi page/filter đổi
  useEffect(() => {
    fetchModerationData();
  }, [fetchModerationData]);

  return (
    <ModerationContext.Provider
      value={{
        moderationData,
        filteredData,
        loading,
        filterStatus,
        searchTerm,
        page,
        totalPage,
        totalRecords,
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
