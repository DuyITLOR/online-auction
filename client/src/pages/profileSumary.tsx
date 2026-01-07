import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getUser as apiGetUser, getUserStatistic } from "@/api/user";

// --- Types ---

type Role = "user" | "seller" | "admin";

export interface UserProfile {
  id: string;
  fullName: string;
  username?: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  address?: string;
  dateOfBirth?: string;
  status?: "active" | "banned" | "pending";
  roles?: Role[];
  verified?: boolean;
  rating?: number;
  createdAt?: string;
  stats?: {
    totalBids?: number;
    totalWatches?: number;
    totalOrders?: number;
    totalRatings?: number;
  };
}

interface ProfileSummaryProps {
  user?: UserProfile;
  userId?: string;
  loadUser?: (id: string) => Promise<UserProfile>;
  className?: string;
}

// --- Helper Functions & Components ---

const formatDate = (iso?: string) => {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString("vi-VN");
  } catch {
    return iso;
  }
};

const StatusBadge: React.FC<{ status?: UserProfile["status"] }> = ({
  status,
}) => {
  const label =
    status === "active"
      ? "Hoạt động"
      : status === "banned"
      ? "Bị khóa"
      : status === "pending"
      ? "Chờ duyệt"
      : "Không rõ";

  const colorClass =
    status === "active"
      ? "text-green-700 bg-green-50 ring-1 ring-green-600/20"
      : status === "banned"
      ? "text-red-700 bg-red-50 ring-1 ring-red-600/20"
      : status === "pending"
      ? "text-yellow-700 bg-yellow-50 ring-1 ring-yellow-600/20"
      : "text-gray-600 bg-gray-50 ring-1 ring-gray-500/20";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
    >
      {label}
    </span>
  );
};

const RatingStars: React.FC<{ rating?: number }> = ({ rating }) => {
  const r = Math.max(0, Math.min(10, rating ?? 0)) / 2;
  return (
    <div
      aria-label={`Đánh giá: ${rating}/10`}
      title={`Đánh giá: ${rating}/10`}
      className='inline-flex gap-0.5'
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-lg leading-none ${
            i < Math.round(r) ? "text-yellow-400" : "text-gray-200"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => {
  return (
    <div className='grid grid-cols-[160px_1fr] items-center gap-4 border-b border-dashed border-gray-100 py-3 last:border-0'>
      <div className='text-gray-500 text-sm font-medium'>{label}</div>
      {/* UPDATE: Màu chữ value chuyển thành xám (text-gray-600) thay vì đen */}
      <div className='text-gray-600 font-medium break-words text-[15px]'>
        {value ?? "-"}
      </div>
    </div>
  );
};

// --- Main Component ---

export const ProfileSummary: React.FC<ProfileSummaryProps> = ({
  user: userProp,
  userId,
  loadUser,
  className = "",
}) => {
  const [user, setUser] = useState<UserProfile | undefined>(userProp);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    let active = true;
    if (!userProp && userId && loadUser) {
      setLoading(true);
      setError(undefined);
      loadUser(userId)
        .then((u) => {
          if (active) setUser(u);
        })
        .catch((e) => {
          if (active)
            setError(e?.message ?? "Không thể tải thông tin người dùng");
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    } else {
      setUser(userProp);
    }
    return () => {
      active = false;
    };
  }, [userProp, userId, loadUser]);

  const rolesLabel = useMemo(() => {
    if (!user?.roles?.length) return "-";
    return user.roles
      .map((r) =>
        r === "user" ? "Người dùng" : r === "seller" ? "Người bán" : "Quản trị"
      )
      .join(", ");
  }, [user]);

  if (!userId && !userProp && !user) {
    return (
      <div className='p-8 text-gray-400 text-center text-sm'>
        Không có người dùng để hiển thị.
      </div>
    );
  }

  if (loading) return <div className='loader'></div>;

  if (error) {
    return (
      <div className='p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 m-4 text-sm'>
        {error}
      </div>
    );
  }

  return (
    <div className={`p-4 max-w-4xl mx-auto font-sans ${className}`}>
      {/* Header Profile */}
      <div className='flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-8'>
        {/* Avatar với Shadow đậm hơn */}
        <div className='w-28 h-28 rounded-full overflow-hidden bg-gray-50 shrink-0 border-4 border-white shadow-lg ring-1 ring-gray-100'>
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user?.fullName ?? "avatar"}
              className='w-full h-full object-cover'
            />
          ) : (
            <div className='w-full h-full grid place-items-center text-gray-300 text-4xl font-bold bg-gray-50'>
              {(user?.fullName ?? user?.username ?? "?")
                .slice(0, 1)
                .toUpperCase()}
            </div>
          )}
        </div>

        <div className='flex-1 min-w-0 text-center sm:text-left pt-2'>
          <div className='flex flex-col sm:flex-row items-center gap-3'>
            <h2 className='m-0 text-2xl font-bold text-gray-800'>
              {user?.fullName ?? user?.username ?? "Người dùng"}
            </h2>
            <StatusBadge status={user?.status} />
          </div>

          <div className='flex items-center justify-center sm:justify-start gap-3 mt-3'>
            <div className='flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100'>
              <span className='font-bold text-yellow-700 text-sm'>
                {user?.rating ? Number(user.rating).toFixed(1) : "0"}
              </span>
              <RatingStars rating={user?.rating} />
            </div>
            {user?.username && (
              <span className='text-sm text-gray-400 font-medium'>
                @{user.username}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Info sections Grid */}
      {user && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Section 1: Thông tin cá nhân */}
          {/* UPDATE: Shadow-md, Rounded-xl, Border nhạt */}
          <section className='border border-gray-300 rounded-xl p-6 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow duration-200'>
            <h3 className='mt-0 mb-4 pb-3 border-b border-gray-200 text-lg font-bold text-gray-800 flex items-center gap-2'>
              <span className='w-1 h-5 bg-blue-500 rounded-full inline-block'></span>
              Thông tin cá nhân
            </h3>
            <div className='flex flex-col'>
              <InfoRow label='Email' value={user.email} />
              <InfoRow
                label='Địa chỉ'
                value={user.address || "Chưa cập nhật"}
              />
              <InfoRow
                label='Ngày tham gia'
                value={formatDate(user.createdAt)}
              />
              <InfoRow label='Vai trò' value={rolesLabel} />
            </div>
          </section>

          {/* Section 2: Thống kê hoạt động */}
          {/* UPDATE: Shadow-md, Rounded-xl, Border nhạt */}
          <section className='border border-gray-300 rounded-xl p-6 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow duration-200'>
            <h3 className='mt-0 mb-4 pb-3 border-b border-gray-200 text-lg font-bold text-gray-800 flex items-center gap-2'>
              <span className='w-1 h-5 bg-purple-500 rounded-full inline-block'></span>
              Thống kê hoạt động
            </h3>
            <div className='flex flex-col'>
              <InfoRow
                label='Lượt đặt giá'
                value={user.stats?.totalBids ?? 0}
              />
              <InfoRow
                label='Sản phẩm theo dõi'
                value={user.stats?.totalWatches ?? 0}
              />
              <InfoRow
                label='Đơn hàng đã mua'
                value={user.stats?.totalOrders ?? 0}
              />
              <InfoRow
                label='Số lượng đánh giá'
                value={user.stats?.totalRatings ?? 0}
              />
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default ProfileSummary;

// --- Logic Fetch Data ---

const fetchUserById = async (id: string): Promise<UserProfile> => {
  const basicData: any = await apiGetUser({ id });
  const totalRatings = (basicData.ratingPos ?? 0) + (basicData.ratingNeg ?? 0);
  const rating =
    totalRatings > 0 ? (basicData.ratingPos / totalRatings) * 10 : 0;

  const roleStr = String(basicData.role || "BIDDER");
  const roles: Role[] = [
    roleStr === "ADMIN" ? "admin" : roleStr === "SELLER" ? "seller" : "user",
  ];

  let stats = {
    totalBids: 0,
    totalWatches: 0,
    totalOrders: 0,
    totalRatings: 0,
  };

  try {
    const statsData = await getUserStatistic({ id });
    stats = {
      totalBids: statsData.BidCount || 0,
      totalWatches: statsData.WatchListCount || 0,
      totalOrders: statsData.OrderCount || 0,
      totalRatings: statsData.RatingCount || 0,
    };
  } catch (err) {
    console.warn("Lỗi lấy thống kê:", err);
  }

  return {
    id: String(basicData.id),
    fullName: basicData.fullname ?? "",
    username: basicData.username ?? "",
    email: basicData.email ?? "",
    dateOfBirth: basicData.dateOfBirth ?? undefined,
    avatarUrl: basicData.avtUrl ?? undefined,
    address: basicData.address ?? undefined,
    status: basicData.status ?? "active",
    verified: basicData.isVerified ?? false,
    roles,
    rating,
    createdAt: basicData.createdAt ?? undefined,
    stats,
  };
};

export const ProfileSummaryRoute: React.FC = () => {
  const { userId } = useParams();
  return <ProfileSummary userId={userId} loadUser={fetchUserById} />;
};
