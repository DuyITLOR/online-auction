/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// --- Types ---
type RevenuePoint = {
  month: string;
  revenue: number;
};

type ActivityPoint = {
  month: string;
  sales: number;
  users: number;
};

// Dữ liệu mẫu (nếu props không truyền vào)
const revenueDataDefault = [
  { month: "Jan", revenue: 2400 },
  { month: "Feb", revenue: 3120 },
  { month: "Mar", revenue: 2780 },
  { month: "Apr", revenue: 3900 },
  { month: "May", revenue: 4200 },
  { month: "Jun", revenue: 4800 },
  { month: "Jul", revenue: 5300 },
  { month: "Aug", revenue: 6100 },
  { month: "Sep", revenue: 5800 },
  { month: "Oct", revenue: 6500 },
  { month: "Nov", revenue: 7200 },
  { month: "Dec", revenue: 8400 },
];

const activityDataDefault = [
  { month: "Jan", sales: 1200, users: 9000 },
  { month: "Feb", sales: 1600, users: 7500 },
  { month: "Mar", sales: 2000, users: 18000 },
  { month: "Apr", sales: 2200, users: 14000 },
  { month: "May", sales: 2800, users: 21000 },
  { month: "Jun", sales: 3100, users: 19000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-white p-3 border border-gray-100 shadow-lg rounded-lg text-sm'>
        <p className='font-bold text-gray-800 mb-1'>{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const OverviewTab: React.FC = () => {
  return (
    <div className='flex-1 space-y-6'>
      {/* Thẻ thống kê tổng quan (Ví dụ) */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
          <h3 className='text-sm font-medium text-gray-500 uppercase'>
            Tổng doanh thu
          </h3>
          <p className='mt-2 text-3xl font-bold text-gray-900'>₫ 128.4M</p>
          <span className='text-sm text-green-600 font-medium'>
            +12.5% so với tháng trước
          </span>
        </div>
        <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
          <h3 className='text-sm font-medium text-gray-500 uppercase'>
            Người dùng mới
          </h3>
          <p className='mt-2 text-3xl font-bold text-gray-900'>14,200</p>
          <span className='text-sm text-green-600 font-medium'>
            +8.2% so với tháng trước
          </span>
        </div>
        <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
          <h3 className='text-sm font-medium text-gray-500 uppercase'>
            Đơn hàng
          </h3>
          <p className='mt-2 text-3xl font-bold text-gray-900'>3,850</p>
          <span className='text-sm text-red-600 font-medium'>
            -2.1% so với tháng trước
          </span>
        </div>
      </div>

      {/* Biểu đồ doanh thu */}
      <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
        <div className='mb-6'>
          <h3 className='text-lg font-bold text-gray-900'>Biểu đồ doanh thu</h3>
          <p className='text-sm text-gray-500'>
            Thống kê doanh thu theo từng tháng trong năm
          </p>
        </div>

        <div className='h-[350px] w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={revenueDataDefault}>
              <defs>
                <linearGradient
                  id='revenueGradient'
                  x1='0'
                  y1='0'
                  x2='0'
                  y2='1'
                >
                  <stop offset='5%' stopColor='#10b981' stopOpacity={0.2} />
                  <stop offset='95%' stopColor='#10b981' stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray='3 3'
                vertical={false}
                stroke='#e5e7eb'
              />
              <XAxis
                dataKey='month'
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                dx={-10}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "#10b981",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Line
                type='monotone'
                dataKey='revenue'
                name='Doanh thu'
                stroke='#10b981'
                strokeWidth={3}
                dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Biểu đồ hoạt động */}
      <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
        <div className='mb-6'>
          <h3 className='text-lg font-bold text-gray-900'>
            Hoạt động người dùng & Bán hàng
          </h3>
          <p className='text-sm text-gray-500'>
            So sánh lượng người dùng truy cập và số đơn hàng
          </p>
        </div>

        <div className='h-[350px] w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={activityDataDefault}>
              <CartesianGrid
                strokeDasharray='3 3'
                vertical={false}
                stroke='#e5e7eb'
              />
              <XAxis
                dataKey='month'
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                yAxisId='left'
                orientation='left'
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <YAxis
                yAxisId='right'
                orientation='right'
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#f3f4f6" }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Bar
                yAxisId='left'
                dataKey='sales'
                name='Đơn hàng'
                fill='#3b82f6'
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
              <Bar
                yAxisId='right'
                dataKey='users'
                name='Người dùng'
                fill='#8b5cf6'
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
