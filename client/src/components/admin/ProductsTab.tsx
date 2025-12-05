// components/admin/ProductsTab.tsx
import { type FC, useState } from "react";
import { Eye, Trash2, Loader2 } from "lucide-react";
import Pagination from "../pagination";
import { useProducts } from "../../libs/contexts/productTab.context";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(v);

const ProductsTab: FC = () => {
  const {
    products,
    categories,
    isLoading,
    filter,
    page,
    totalPage,
    totalProducts,
    setFilter,
    setPage,
    deleteProduct,
    refreshProducts,
  } = useProducts();

  // State quản lý dialog
  const [openId, setOpenId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Tìm sản phẩm cần xóa
  const productToDelete = products.find((p) => p.id === openId);

  const onPageChange = (p: number | string) => {
    if (p === "...") return;
    setPage(Number(p));
  };

  const handleDelete = async () => {
    if (!openId) return;

    setDeletingId(openId);
    const result = await deleteProduct(openId);
    setDeletingId(null);

    if (result.success) {
      toast.success(result.message);
      setOpenId(null); // Đóng dialog
      refreshProducts(); // Refresh dữ liệu
    } else {
      toast.error(result.message);
    }
  };

  const handleOpenChange = (open: boolean) => {
    // Chỉ cho phép đóng khi không đang trong quá trình xóa (loading)
    if (!open && !deletingId) {
      setOpenId(null);
    }
  };

  return (
    <>
      <div className='flex-1'>
        <div className='rounded-lg border border-gray-200 bg-white shadow-sm flex flex-col'>
          {/* --- FILTER SECTION --- */}
          <div className='p-4 border-b bg-gray-200 flex items-center gap-4 border-gray-200'>
            <label>Lọc theo danh mục:</label>
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
              className='px-3 py-2 border border-gray-200 rounded-lg bg-white'
            >
              <option value='all'>Tất cả</option>
              {categories.map((c) => (
                <option value={c.id} key={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <span className='ml-auto font-bold text-sm'>
              {totalProducts} sản phẩm
            </span>
          </div>

          {/* --- TABLE SECTION --- */}
          {isLoading ? (
            <div className='flex items-center justify-center h-40'>
              <Loader2 className='animate-spin w-6 h-6 text-blue-600' />
              <span className='ml-2'>Đang tải...</span>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead className='bg-gray-100 border border-gray-200'>
                  <tr>
                    {[
                      "Sản phẩm",
                      "Người bán",
                      "Danh mục",
                      "Giá",
                      "Lượt ra giá",
                      "Trạng thái",
                      "Hành động",
                    ].map((h) => (
                      <th key={h} className='px-4 py-2 text-left font-medium'>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {products.map((p) => {
                    const isEnded = new Date(p.endAt) < new Date();
                    const statusClass = isEnded
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700";

                    return (
                      <tr
                        key={p.id}
                        className='border-b border-gray-200 hover:bg-gray-50'
                      >
                        <td className='px-4 py-3 font-medium'>{p.title}</td>
                        <td className='px-4 py-3'>{p.seller?.fullname}</td>
                        <td className='px-4 py-3'>{p.category?.name}</td>
                        <td className='px-4 py-3'>
                          {formatCurrency(p.currentPrice)}
                        </td>
                        <td className='px-4 py-3'>{p.countbids}</td>
                        <td className='px-4 py-3'>
                          <span
                            className={`px-2 py-1 rounded text-xs ${statusClass}`}
                          >
                            {isEnded ? "Suspended" : "Active"}
                          </span>
                        </td>
                        <td className='px-4 py-3'>
                          <div className='flex gap-2'>
                            <Eye className='w-4 h-4 text-gray-600 cursor-pointer' />
                            {/* Nút Xóa: Chỉ set ID, không chứa Dialog */}
                            <button
                              onClick={() => setOpenId(p.id)}
                              className='p-1 rounded hover:bg-red-100 text-red-600'
                              title='Xoá sản phẩm'
                            >
                              <Trash2 className='w-4 h-4' />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {products.length === 0 && (
                <div className='py-10 text-center text-gray-500'>
                  Không có sản phẩm nào.
                </div>
              )}
            </div>
          )}

          {/* --- PAGINATION --- */}
          {totalProducts > 0 && (
            <div className='p-6 pd-8 border-t border-gray-200 '>
              <Pagination
                page={page}
                totalPage={totalPage}
                onPageChange={onPageChange}
                className='flex justify-end'
              />
            </div>
          )}
        </div>
      </div>

      {/* --- DIALOG NẰM NGOÀI CÙNG (Dùng React Portal tự động) --- */}
      {/* Chỉ render Dialog khi có openId để tránh lỗi render rỗng */}
      <Dialog open={!!openId} onOpenChange={handleOpenChange}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Xác nhận xoá</DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác. Sản phẩm sẽ bị xóa khỏi hệ
              thống.
            </DialogDescription>
          </DialogHeader>

          <div className='py-4 text-sm'>
            {productToDelete ? (
              <p>
                Bạn có chắc chắn muốn xoá sản phẩm: <br />
                <span className='font-bold text-red-600 text-base'>
                  {productToDelete.title}
                </span>
                ?
              </p>
            ) : (
              // Fallback nếu không tìm thấy thông tin sản phẩm
              <p className='text-gray-500'>Đang tải thông tin sản phẩm...</p>
            )}
          </div>

          <DialogFooter>
            <button
              onClick={() => setOpenId(null)}
              disabled={!!deletingId}
              className='px-4 py-2 text-sm font-medium border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-50'
            >
              Hủy bỏ
            </button>

            <button
              onClick={handleDelete}
              disabled={!!deletingId}
              className='px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2 disabled:opacity-50'
            >
              {deletingId ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  Đang xoá...
                </>
              ) : (
                "Xác nhận xoá"
              )}
            </button>
          </DialogFooter>

          {/* Overlay loading khi đang call API xóa */}
          {deletingId && (
            <div className='absolute inset-0 bg-white/50 flex items-center justify-center z-50'>
              {/* Giữ chỗ để người dùng không click lung tung */}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductsTab;
