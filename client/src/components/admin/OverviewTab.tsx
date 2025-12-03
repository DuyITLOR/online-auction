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
} from "recharts";

type RevenuePoint = {
  month: string;
  revenue: number;
};

type ActivityPoint = {
  month: string;
  sales: number;
  users: number;
};

type Props = {
  revenue?: RevenuePoint[];
  activity?: ActivityPoint[];
};

const revenueDataDefault = [
  { month: "Jan", revenue: 2400 },
  { month: "Feb", revenue: 3120 },
  { month: "Mar", revenue: 2780 },
  { month: "Apr", revenue: 3900 },
  { month: "May", revenue: 4200 },
  { month: "Jun", revenue: 4800 },
];

const activityDataDefault = [
  { month: "Jan", sales: 1200, users: 9000 },
  { month: "Feb", sales: 1600, users: 7500 },
  { month: "Mar", sales: 2000, users: 18000 },
  { month: "Apr", sales: 2200, users: 10000 },
  { month: "May", sales: 2500, users: 15000 },
  { month: "Jun", sales: 2700, users: 12000 },
];

// Custom tooltip UI
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;

  return (
    <div className='p-3 shadow-md rounded-md bg-white border border-gray-200 text-sm'>
      <p className='font-semibold'>{label}</p>
      {payload.map((item: any) => (
        <p key={item.dataKey} className='flex justify-between gap-2'>
          <span className='font-medium' style={{ color: item.color }}>
            {item.name}:
          </span>
          <span>{item.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

const TongQuanSection: React.FC<Props> = ({ revenue, activity }) => {
  const revenueData = revenue || revenueDataDefault;
  const activityData = activity || activityDataDefault;

  return (
    <div className='grid grid-cols-1 lg:grid-cols-1 gap-8'>
      {/* Biểu đồ doanh thu */}
      <div className='rounded-lg border border-gray-200 p-6 bg-white shadow-sm hover:shadow-md transition-shadow'>
        <h2 className='text-lg font-semibold mb-4'>📈 Doanh thu theo tháng</h2>

        <div className='h-72'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={revenueData}>
              <defs>
                <linearGradient
                  id='revenueGradient'
                  x1='0'
                  y1='0'
                  x2='0'
                  y2='1'
                >
                  <stop offset='0%' stopColor='#10b981' stopOpacity={0.4} />
                  <stop offset='100%' stopColor='#10b981' stopOpacity={0} />
                </linearGradient>

                {/* Shadow */}
                <filter
                  id='shadow'
                  x='-20%'
                  y='-20%'
                  width='200%'
                  height='200%'
                >
                  <feDropShadow
                    dx='0'
                    dy='4'
                    stdDeviation='4'
                    floodColor='#10b98155'
                  />
                </filter>
              </defs>

              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='month' />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              <Line
                type='natural'
                dataKey='revenue'
                stroke='#10b981'
                strokeWidth={3}
                dot={{ r: 4 }}
                fill='url(#revenueGradient)'
                fillOpacity={1}
                animationDuration={1200}
                filter='url(#shadow)'
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TongQuanSection;
