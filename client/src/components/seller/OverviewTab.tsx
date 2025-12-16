import React from "react";
import { TrendingUp } from "lucide-react";

const OverviewTab: React.FC = () => {
  return (
    <div className='flex flex-col items-center justify-center py-12 bg-white border border-gray-200 rounded-xl shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300'>
      <div className='bg-gray-100 p-4 rounded-full mb-4'>
        <TrendingUp className='w-8 h-8 text-gray-400' />
      </div>
      <h3 className='text-lg font-semibold text-gray-900'>Biểu đồ tổng quan</h3>
      <p className='text-gray-500'>Dữ liệu biểu đồ sẽ được hiển thị tại đây.</p>
    </div>
  );
};

export default OverviewTab;
