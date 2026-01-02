import React from "react";
import { Eye, Search } from "lucide-react";
import Pagination from "../pagination";
import { useOrders } from "../../libs/contexts/seller/order.context";
import { formatCurrency } from "../../utils/format";
import { get } from "@/api/api";

const OrdersTab: React.FC = () => {
  const { orders, isLoading, page, totalPage, setPage } = useOrders();

const getStatusLabel = (status: string) => {
  switch (status) {
    
    case "WAIT_SELLER_BANK_INFO":
      return "Chờ thông tin ngân hàng người bán";
    case "WAIT_BUYER_PAYMENT":
      return "Chờ người mua thanh toán";
    case "WAIT_SELLER_SHIPPING":
      return "Chờ người bán vận chuyển";
    case "WAIT_BUYER_CONFIRM_RECEIVE":
      return "Chờ người mua xác nhận nhận hàng";
    case "WAIT_REVIEW":
      return "Chờ đánh giá";
    case "COMPLETED":
      return "Hoàn thành";
    case "CANCELED":
      return "Đã hủy";
    default:
      return status;
  }
};
  const onPageChange = (p: number | string) => {
    if (p === "...") return;
    setPage(Number(p));
  };

  return (
    <div className='bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300'>
      <div className='p-3 sm:p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50'>
        <h3 className='font-semibold text-base sm:text-lg text-gray-900'>Đơn hàng gần đây</h3>
      </div>
      
      {/* Table - Hidden on Mobile */}
      <div className='hidden md:block overflow-x-auto'>
        <table className='w-full text-xs sm:text-sm text-left'>
          <thead className='text-gray-500 bg-gray-50 border-b border-gray-200'>
            <tr>
              <th className='px-3 sm:px-6 py-2 sm:py-3 font-medium'>Sản phẩm</th>
              <th className='px-3 sm:px-6 py-2 sm:py-3 font-medium hidden sm:table-cell'>Khách hàng</th>
              <th className='px-3 sm:px-6 py-2 sm:py-3 font-medium hidden lg:table-cell'>Ngày đặt</th>
              <th className='px-3 sm:px-6 py-2 sm:py-3 font-medium'>Tổng tiền</th>
              <th className='px-3 sm:px-6 py-2 sm:py-3 font-medium'>Trạng thái</th>
              <th className='px-3 sm:px-6 py-2 sm:py-3 font-medium text-right'>Chi tiết</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {isLoading ? (
              // Loading Skeleton theo từng hàng
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className='animate-pulse'>
                  <td colSpan={6} className='px-3 sm:px-6 py-3 sm:py-4'>
                    <div className='h-4 bg-gray-200 rounded w-full'></div>
                  </td>
                </tr>
              ))
            ) : orders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className='px-3 sm:px-6 py-6 sm:py-10 text-center text-gray-500'
                >
                  <div className='flex flex-col items-center gap-2'>
                    <Search className='w-6 sm:w-8 h-6 sm:h-8 text-gray-300' />
                    <span className='text-xs sm:text-sm'>Bạn chưa có đơn hàng nào.</span>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                
                <tr
                  key={order.id}
                  className='hover:bg-gray-50 transition-colors border-b border-gray-100 md:border-b-0'
                >
                  <td className='px-3 sm:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm text-gray-900'>
                    <div className='truncate'>{order.productTitle}</div>
                  </td>
                  <td className='px-3 sm:px-6 py-3 sm:py-4 text-gray-600 text-xs sm:text-sm hidden sm:table-cell'>
                    <div className='truncate'>{order.customer}</div>
                  </td>
                  <td className='px-3 sm:px-6 py-3 sm:py-4 text-gray-500 text-xs sm:text-sm hidden lg:table-cell'>{order.date}</td>
                  <td className='px-3 sm:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm text-gray-900'>
                    {formatCurrency(order.total)} đ
                  </td>
                  <td className='px-3 sm:px-6 py-3 sm:py-4'>
                    <span
                      className={`px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium inline-block
                    ${
                        getStatusLabel(order.status) === "Hoàn thành"
                        ? "bg-green-100 text-green-800"
                        : getStatusLabel(order.status) === "Đang vận chuyển"
                        ? "bg-blue-100 text-blue-800"
                        : getStatusLabel(order.status) === "Đã hủy"
                        ? "bg-red-100 text-red-800"
                        : getStatusLabel(order.status) === "Chờ đánh giá"
                        ? "bg-yellow-100 text-yellow-800"
                        : getStatusLabel(order.status) === "Chờ người mua xác nhận nhận hàng"
                        ? "bg-purple-100 text-purple-800"
                        : getStatusLabel(order.status) === "Đang vận chuyển"
                        ? "bg-indigo-100 text-indigo-800"
                        : getStatusLabel(order.status) === "Chờ người mua thanh toán"
                        ? "bg-teal-100 text-teal-800"
                        : "bg-gray-100 text-gray-800"

                    }`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className='px-3 sm:px-6 py-3 sm:py-4 text-right'>
                    <button className='text-blue-600 hover:bg-blue-50 p-1.5 sm:p-2 rounded-lg transition-colors'>
                      <Eye className='w-4 h-4' />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className='md:hidden space-y-3 p-3 sm:p-4'>
        {isLoading ? (
          // Loading skeletons for mobile
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className='animate-pulse bg-gray-100 rounded-lg h-24'></div>
          ))
        ) : orders.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-8 text-gray-500'>
            <Search className='w-8 h-8 text-gray-300 mb-2' />
            <span className='text-sm'>Bạn chưa có đơn hàng nào.</span>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className='bg-white border border-gray-200 rounded-lg p-3 sm:p-4'>
              <div className='flex justify-between items-start gap-2 mb-2'>
                <div className='flex-1'>
                  <h3 className='font-medium text-sm text-gray-900 truncate'>{order.productTitle}</h3>
                  <p className='text-xs text-gray-500 truncate'>{order.customer}</p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap
                ${getStatusLabel(order.status) === "Hoàn thành"
                    ? "bg-green-100 text-green-800"
                    : getStatusLabel(order.status) === "Đang vận chuyển"
                    ? "bg-blue-100 text-blue-800"
                    : getStatusLabel(order.status) === "Đã hủy"
                    ? "bg-red-100 text-red-800"
                    : getStatusLabel(order.status) === "Chờ đánh giá"
                    ? "bg-yellow-100 text-yellow-800"
                    : getStatusLabel(order.status) === "Chờ người mua xác nhận nhận hàng"
                    ? "bg-purple-100 text-purple-800"
                    : getStatusLabel(order.status) === "Đang vận chuyển"
                    ? "bg-indigo-100 text-indigo-800"
                    : getStatusLabel(order.status) === "Chờ người mua thanh toán"
                    ? "bg-teal-100 text-teal-800"
                    : "bg-gray-100 text-gray-800"
                }`}
                >
                  {getStatusLabel(order.status)}
                </span>
              </div>
              
              <div className='grid grid-cols-2 gap-2 mb-3 text-xs'>
                <div>
                  <span className='text-gray-500'>Ngày đặt:</span>
                  <p className='font-medium'>{order.date}</p>
                </div>
                <div>
                  <span className='text-gray-500'>Tổng tiền:</span>
                  <p className='font-medium text-blue-600'>{formatCurrency(order.total)} đ</p>
                </div>
              </div>
              
              <button className='w-full py-1.5 px-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors'>
                Xem chi tiết
              </button>
            </div>
          ))
        )}
      </div>
      {/* Pagination Footer */}
      {!isLoading && orders.length > 0 && (
        <div className='p-3 sm:p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0'>
          <div className='text-xs sm:text-sm text-gray-500'>
            <span className='font-medium text-gray-900'>{totalPage}</span>
          </div>
          <div className='overflow-x-auto w-full sm:w-auto'>
            <Pagination
              page={page}
              onPageChange={onPageChange}
              totalPage={totalPage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTab;
