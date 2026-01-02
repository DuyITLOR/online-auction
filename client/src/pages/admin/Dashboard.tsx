import React, { useContext, useEffect, useState } from 'react';
import TabBoard from './TabBoard';
import { useAdmin } from '../../libs/contexts/admin/admin.context';
import { UserContext } from '@/libs/contexts/user.context';
import UnauthorizedPage from '../Unauthorization';

// Interface khớp với API Response
interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  completedOrders: number;
  revenue: number;
}

// Dữ liệu mặc định
const defaultDashboardData: DashboardStats = {
  totalUsers: 0,
  totalProducts: 0,
  completedOrders: 0,
  revenue: 0,
};

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

const Dashboard: React.FC = () => {
  const { token, isAuthLoading } = useAdmin();
  const [stats, setStats] = useState<DashboardStats>(defaultDashboardData);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const { user } = useContext(UserContext);
  useEffect(() => {
    // Logic: Có token và đã check auth xong mới gọi API
    if (!isAuthLoading && token) {
      const fetchDashboardData = async () => {
        setIsDataLoading(true);
        try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/data`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.ok) {
            const result = await res.json();
            if (result.data && result.data.data) {
              setStats(result.data.data);
            }
          } else {
            console.error('Failed to fetch dashboard data');
          }
        } catch (error) {
          console.error('Error fetching dashboard:', error);
        } finally {
          setIsDataLoading(false);
        }
      };

      fetchDashboardData();
    } else if (!isAuthLoading && !token) {
      setIsDataLoading(false);
    }
  }, [token, isAuthLoading]);

  const isLoading = isAuthLoading || isDataLoading;
  if (isLoading || !user?.role) {
    return <div className='loader' />;
  } else if (user?.role !== 'ADMIN') {
    return <UnauthorizedPage />;
  } else {
    return (
      <>
        {isLoading && <div className='loader' />}
        {!isLoading && (
          <div>
            <div className='max-w-7xl mx-auto px-4 py-8'>
              <div className='mb-8'>
                <p className='text-3xl font-bold text-foreground mb-2'>Quản trị Nền tảng</p>
                <p className='text-muted-foreground'>Quản lý toàn bộ hệ thống đấu giá AuctionHub</p>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
                {/* Tổng người dùng */}
                <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300'>
                      <svg
                        className='w-6 h-6'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          fillRule='evenodd'
                          d='M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H6Zm7.25-2.095c.478-.86.75-1.85.75-2.905a5.973 5.973 0 0 0-.75-2.906 4 4 0 1 1 0 5.811ZM15.466 20c.34-.588.535-1.271.535-2v-1a5.978 5.978 0 0 0-1.528-4H18a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2h-4.535Z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <span className='text-xs font-bold px-2 py-1 bg-gray-50 text-gray-500 rounded-full'>Người dùng</span>
                  </div>
                  <div>
                    <span className='block text-3xl font-extrabold text-gray-900 mb-1'>{stats.totalUsers}</span>
                    <span className='text-sm font-medium text-gray-500'>Tổng người dùng</span>
                  </div>
                </div>

                {/* Tổng sản phẩm */}
                <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300'>
                      <svg
                        className='w-6 h-6'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path d='M20 7h-.7c.229-.467.349-.98.351-1.5a3.5 3.5 0 0 0-3.5-3.5c-1.717 0-3.215 1.2-4.331 2.481C10.4 2.842 8.949 2 7.5 2A3.5 3.5 0 0 0 4 5.5c.003.52.123 1.033.351 1.5H4a2 2 0 0 0-2 2v2a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a2 2 0 0 0-2-2Zm-9.942 0H7.5a1.5 1.5 0 0 1 0-3c.9 0 2 .754 3.092 2.122-.219.337-.392.635-.534.878Zm6.1 0h-3.742c.933-1.368 2.371-3 3.739-3a1.5 1.5 0 0 1 0 3h.003ZM13 14h-2v8h2v-8Zm-4 0H4v6a2 2 0 0 0 2 2h3v-8Zm6 0v8h3a2 2 0 0 0 2-2v-6h-5Z' />
                      </svg>
                    </div>
                    <span className='text-xs font-bold px-2 py-1 bg-gray-50 text-gray-500 rounded-full'>Sản phẩm</span>
                  </div>
                  <div>
                    <span className='block text-3xl font-extrabold text-gray-900 mb-1'>{stats.totalProducts}</span>
                    <span className='text-sm font-medium text-gray-500'>Tổng sản phẩm</span>
                  </div>
                </div>

                {/* Đơn hàng hoàn thành */}
                <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300'>
                      <svg
                        className='w-6 h-6'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          fillRule='evenodd'
                          d='M4 4a1 1 0 0 1 1-1h1.5a1 1 0 0 1 .979.796L7.939 6H19a1 1 0 0 1 .979 1.204l-1.25 6a1 1 0 0 1-.979.796H9.605l.208 1H17a3 3 0 1 1-2.83 2h-2.34a3 3 0 1 1-4.009-1.76L5.686 5H5a1 1 0 0 1-1-1Z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <span className='text-xs font-bold px-2 py-1 bg-gray-50 text-gray-500 rounded-full'>Đơn hàng</span>
                  </div>
                  <div>
                    <span className='block text-3xl font-extrabold text-gray-900 mb-1'>{stats.completedOrders}</span>
                    <span className='text-sm font-medium text-gray-500'>Đơn hàng hoàn thành</span>
                  </div>
                </div>

                {/* Doanh thu */}
                <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300'>
                      <svg
                        className='w-6 h-6'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
                        <path
                          stroke='currentColor'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M4 4.5V19a1 1 0 0 0 1 1h15M7 14l4-4 4 4 5-5m0 0h-3.207M20 9v3.207'
                        />
                      </svg>
                    </div>
                    <span className='text-xs font-bold px-2 py-1 bg-gray-50 text-gray-500 rounded-full'>Doanh thu</span>
                  </div>
                  <div>
                    <span className='block text-3xl font-extrabold text-gray-900 mb-1'>
                      {formatCurrency(stats.revenue)}
                    </span>
                    <span className='text-sm font-medium text-gray-500'>Tổng doanh thu</span>
                  </div>
                </div>
              </div>

              <TabBoard />
            </div>
          </div>
        )}
      </>
    );
  }
  console.log(user?.role);
};

export default Dashboard;
