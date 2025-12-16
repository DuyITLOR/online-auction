import React from "react";
import { Eye } from "lucide-react";

const ORDERS_MOCK = [
  {
    id: "#ORD-001",
    customer: "Nguyễn Văn A",
    total: "24.500.000 đ",
    status: "Completed",
    date: "2024-06-12",
  },
  {
    id: "#ORD-002",
    customer: "Trần Thị B",
    total: "8.490.000 đ",
    status: "Processing",
    date: "2024-06-11",
  },
  {
    id: "#ORD-003",
    customer: "Lê Văn C",
    total: "10.200.000 đ",
    status: "Shipping",
    date: "2024-06-10",
  },
];

const OrdersTab: React.FC = () => {
  return (
    <div className='bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300'>
      <div className='p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50'>
        <h3 className='font-semibold text-gray-900'>Đơn hàng gần đây</h3>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm text-left'>
          <thead className='text-gray-500 bg-gray-50 border-b border-gray-200'>
            <tr>
              <th className='px-6 py-3 font-medium'>Mã đơn</th>
              <th className='px-6 py-3 font-medium'>Khách hàng</th>
              <th className='px-6 py-3 font-medium'>Ngày đặt</th>
              <th className='px-6 py-3 font-medium'>Tổng tiền</th>
              <th className='px-6 py-3 font-medium'>Trạng thái</th>
              <th className='px-6 py-3 font-medium text-right'>Chi tiết</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {ORDERS_MOCK.map((order) => (
              <tr key={order.id} className='hover:bg-gray-50 transition-colors'>
                <td className='px-6 py-4 font-medium text-gray-900'>
                  {order.id}
                </td>
                <td className='px-6 py-4 text-gray-600'>{order.customer}</td>
                <td className='px-6 py-4 text-gray-500'>{order.date}</td>
                <td className='px-6 py-4 font-medium text-gray-900'>
                  {order.total}
                </td>
                <td className='px-6 py-4'>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                    ${
                      order.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Shipping"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className='px-6 py-4 text-right'>
                  <button className='text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors'>
                    <Eye className='w-4 h-4' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTab;
