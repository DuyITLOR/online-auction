import { useState, useEffect } from "react";
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";

import TabBoard from "./TabBoard";
import { getSellerStats } from "../../api/seller";
import type { SellerStats } from "../../api/seller";


import NotFoundPage from "../NotFound.tsx";
// Format number to Vietnamese currency
const formatCurrency = (value: number): string => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B VND`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M VND`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K VND`;
  }
  return new Intl.NumberFormat("vi-VN").format(value) + " VND";

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
      badge: "Sản phẩm",
    },
    {
      label: "Đơn hàng hoàn thành",
      value: stats?.orders?.length?.toString() || "0",
      icon: ShoppingCart,
      badge: "Đơn hàng",
    },
    {
      label: "Doanh thu tháng này",
      value: formatCurrency(stats?.revenue || 0),
      icon: DollarSign,
      badge: "Doanh thu",
    },
    {
      label: "Mức đánh giá",
      value: `${parseFloat(stats?.ratingValue || "0").toFixed(1)}/100`,
      icon: TrendingUp,
      badge: "Đánh giá",
    },
  ];

  
  if (loading) return <div className='loader'></div>;

  if (error) {
    return (
      <NotFoundPage />
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
              className='bg-white rounded-xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group'
            >
              <div className='flex items-center justify-between mb-4'>
                <div className='w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300'>
                  <stat.icon className='w-6 h-6' />
                </div>
                <span className='text-xs font-bold px-2 py-1 bg-gray-50 text-gray-500 rounded-full'>{stat.badge}</span>
              </div>
              <div>
                <span className='block text-3xl font-extrabold text-gray-900 mb-1'>
                  {stat.value}
                </span>
                <span className='text-sm font-medium text-gray-500'>
                  {stat.label}
                </span>
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
