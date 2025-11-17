import React from "react";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";


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


const TongQuanSection: React.FC<Props> = ({ revenue, activity }) => {
    const revenueData = revenue || revenueDataDefault;
    const activityData = activity || activityDataDefault; 

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

      {/* Biểu đồ doanh thu theo tháng */}
      <div className="rounded-lg border p-6 bg-white ">
        <h2 className="text-lg font-semibold mb-4">📈 Doanh thu theo tháng</h2>
        
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>


      {/* Biểu đồ hoạt động nền tảng */}
      <div className="rounded-lg border p-6 bg-white ">
        <h2 className="text-lg font-semibold mb-4">📊 Hoạt động nền tảng</h2>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#3b82f6" />
              <Bar dataKey="users" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default TongQuanSection;

