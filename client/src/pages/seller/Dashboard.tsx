import React from "react";
import {
  Plus,
  LogOut,
  Search,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Menu,
} from "lucide-react";

import TabBoard from "./TabBoard";
import Header from "../../components/header";
import Footer from "../../components/footer";

// --- Mock Data (Hardcoded) ---
const STATS = [
  {
    label: "Sản phẩm hoạt động",
    value: "24",
    icon: Package,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    label: "Đơn hàng hoàn thành",
    value: "156",
    icon: ShoppingCart,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    label: "Doanh thu tháng này",
    value: "125.5M",
    icon: DollarSign,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  {
    label: "Mức đánh giá",
    value: "4.8/5",
    icon: TrendingUp,
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
];

const SellerDashboard: React.FC = () => {
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
          {STATS.map((stat, index) => (
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
