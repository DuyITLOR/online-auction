import React from "react";

const PAYOUT_HISTORY = [
  {
    date: "2024-06-10",
    method: "Ngân hàng",
    amount: "25M VND",
    status: "Completed",
  },
  {
    date: "2024-05-15",
    method: "Ngân hàng",
    amount: "35.5M VND",
    status: "Completed",
  },
  {
    date: "2024-04-20",
    method: "Ví điện tử",
    amount: "18.2M VND",
    status: "Completed",
  },
  {
    date: "2024-03-25",
    method: "Ngân hàng",
    amount: "42M VND",
    status: "Completed",
  },
];

const PayoutsTab: React.FC = () => {
  return (
    <div className='space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300'>
      {/* Balance Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-white border border-gray-200 rounded-xl p-6 shadow-sm'>
          <p className='text-gray-500 text-sm font-medium mb-2'>
            Số dư khả dụng
          </p>
          <p className='text-3xl font-bold text-green-600'>45.3M VND</p>
        </div>
        <div className='bg-white border border-gray-200 rounded-xl p-6 shadow-sm'>
          <p className='text-gray-500 text-sm font-medium mb-2'>
            Đang chờ (7 ngày)
          </p>
          <p className='text-3xl font-bold text-yellow-600'>12.5M VND</p>
        </div>
        <div className='bg-white border border-gray-200 rounded-xl p-6 shadow-sm'>
          <p className='text-gray-500 text-sm font-medium mb-2'>Tổng đã rút</p>
          <p className='text-3xl font-bold text-blue-600'>287.8M VND</p>
        </div>
      </div>

      {/* History & Action */}
      <div className='bg-white border border-gray-200 rounded-xl p-6 shadow-sm'>
        <h2 className='text-lg font-bold mb-4 text-gray-900'>
          Lịch sử thanh toán
        </h2>
        <div className='space-y-3 mb-6'>
          {PAYOUT_HISTORY.map((item, index) => (
            <div
              key={index}
              className='flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors'
            >
              <div>
                <p className='font-semibold text-gray-900'>{item.date}</p>
                <p className='text-sm text-gray-500'>
                  Phương thức: {item.method}
                </p>
              </div>
              <div className='text-right'>
                <p className='font-bold text-green-600'>{item.amount}</p>
                <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1'>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button className='w-full h-12 flex items-center justify-center text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
          Yêu cầu rút tiền
        </button>
      </div>
    </div>
  );
};

export default PayoutsTab;
