import React from "react";
import { Eye, Search } from "lucide-react";
import Pagination from "../pagination";
import { useOrders } from "../../libs/contexts/seller/order.context";
import { formatCurrency } from "../../utils/format";

const OrdersTab: React.FC = () => {
  const { orders, isLoading, page, totalPage, setPage } = useOrders();

  const onPageChange = (p: number | string) => {
    if (p === "...") return;
    setPage(Number(p));
  };

  return (
    <div className='bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300'>
      <div className='p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50'>
        <h3 className='font-semibold text-gray-900'>Đơn hàng gần đây</h3>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm text-left'>
          <thead className='text-gray-500 bg-gray-50 border-b border-gray-200'>
            <tr>
              <th className='px-6 py-3 font-medium'>Sản phẩm</th>
              <th className='px-6 py-3 font-medium'>Khách hàng</th>
              <th className='px-6 py-3 font-medium'>Ngày đặt</th>
              <th className='px-6 py-3 font-medium'>Tổng tiền</th>
              <th className='px-6 py-3 font-medium'>Trạng thái</th>
              <th className='px-6 py-3 font-medium text-right'>Chi tiết</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {isLoading ? (
              // Loading Skeleton theo từng hàng
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className='animate-pulse'>
                  <td colSpan={6} className='px-6 py-4'>
                    <div className='h-4 bg-gray-200 rounded w-full'></div>
                  </td>
                </tr>
              ))
            ) : orders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className='px-6 py-10 text-center text-gray-500'
                >
                  <div className='flex flex-col items-center gap-2'>
                    <Search className='w-8 h-8 text-gray-300' />
                    <span>Bạn chưa có đơn hàng nào.</span>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className='hover:bg-gray-50 transition-colors'
                >
                  <td className='px-6 py-4 font-medium text-gray-900'>
                    {order.productTitle}
                  </td>
                  <td className='px-6 py-4 text-gray-600'>{order.customer}</td>
                  <td className='px-6 py-4 text-gray-500'>{order.date}</td>
                  <td className='px-6 py-4 font-medium text-gray-900'>
                    {formatCurrency(order.total)} đ
                  </td>
                  <td className='px-6 py-4'>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                    ${
                      order.status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : order.status === "SHIPPING"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "CANCELED"
                        ? "bg-red-100 text-red-800"
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
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Footer */}
      {!isLoading && orders.length > 0 && (
        <div className='p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between'>
          <div className='text-sm text-gray-500'>
            <span className='font-medium text-gray-900'>{totalPage}</span>
          </div>
          <Pagination
            page={page}
            onPageChange={onPageChange}
            totalPage={totalPage}
          />
        </div>
      )}
    </div>
  );
};

export default OrdersTab;
