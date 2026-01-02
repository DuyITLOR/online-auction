import { useState, useEffect } from "react";
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";

import TabBoard from "./TabBoard";
import { getSellerStats } from "../../api/seller";
import type { SellerStats } from "../../api/seller";

// Format number to Vietnamese currency
const formatCurrency = (value: number): string => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

const SellerDashboard: React.FC = () => {
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getSellerStats();
        if (response.code === 200) {
          setStats(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError("Không thể tải dữ liệu thống kê");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const STATS_DISPLAY = [
    {
      label: "Sản phẩm hoạt động",
      value: stats?.products?.length?.toString() || "0",
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Đơn hàng hoàn thành",
      value: stats?.orders?.length?.toString() || "0",
      icon: ShoppingCart,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Doanh thu tháng này",
      value: formatCurrency(stats?.revenue || 0),
      icon: DollarSign,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Mức đánh giá",
      value: `${parseFloat(stats?.ratingValue || "0").toFixed(1)}/100`,
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  
  if (loading) return <div className='loader'></div>;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">Lỗi</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 font-sans text-gray-900'>
      {/* --- MAIN CONTENT --- */}
      <main className='max-w-7xl mx-auto px-4 py-8'>
        {/* Page Title & Action */}
        <div className='mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>
              Bảng điều khiển người bán
            </h1>
            <p className='text-gray-500'>
              Quản lý sản phẩm, đơn hàng và doanh thu của bạn
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
          {STATS_DISPLAY.map((stat, index) => (
            <div
              key={index}
              className='bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow'
            >
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-gray-500 text-sm font-medium mb-1'>
                    {stat.label}
                  </p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bg} ${stat.color} p-3 rounded-lg`}>
                  <stat.icon className='w-6 h-6' />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs Navigation */}
        <TabBoard />
      </main>
    </div>
  );
};

export default SellerDashboard;
