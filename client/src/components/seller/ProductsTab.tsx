import React from "react";
import { Filter, MoreHorizontal } from "lucide-react";

const PRODUCTS_MOCK = [
  {
    id: 1,
    name: "iPhone 13 Pro Max",
    price: "24.500.000 đ",
    status: "Active",
    stock: 5,
  },
  {
    id: 2,
    name: "MacBook Air M2",
    price: "28.990.000 đ",
    status: "Active",
    stock: 2,
  },
  {
    id: 3,
    name: "Sony WH-1000XM5",
    price: "8.490.000 đ",
    status: "Sold Out",
    stock: 0,
  },
  {
    id: 4,
    name: "iPad Gen 10",
    price: "10.200.000 đ",
    status: "Active",
    stock: 12,
  },
];

const ProductsTab: React.FC = () => {
  return (
    <div className='bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300'>
      <div className='p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50'>
        <h3 className='font-semibold text-gray-900'>Danh sách sản phẩm</h3>
        <button className='p-2 hover:bg-gray-200 rounded-full transition-colors'>
          <Filter className='w-4 h-4 text-gray-500' />
        </button>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm text-left'>
          <thead className='text-gray-500 bg-gray-50 border-b border-gray-200'>
            <tr>
              <th className='px-6 py-3 font-medium'>Tên sản phẩm</th>
              <th className='px-6 py-3 font-medium'>Giá</th>
              <th className='px-6 py-3 font-medium'>Kho</th>
              <th className='px-6 py-3 font-medium'>Trạng thái</th>
              <th className='px-6 py-3 font-medium text-right'>Hành động</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {PRODUCTS_MOCK.map((product) => (
              <tr
                key={product.id}
                className='hover:bg-gray-50 transition-colors'
              >
                <td className='px-6 py-4 font-medium text-gray-900'>
                  {product.name}
                </td>
                <td className='px-6 py-4 text-blue-600 font-medium'>
                  {product.price}
                </td>
                <td className='px-6 py-4 text-gray-600'>{product.stock}</td>
                <td className='px-6 py-4'>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className='px-6 py-4 text-right'>
                  <button className='text-gray-400 hover:text-blue-600 transition-colors'>
                    <MoreHorizontal className='w-5 h-5' />
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

export default ProductsTab;
