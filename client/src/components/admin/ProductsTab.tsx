import { type FC, useState } from "react";
import { Eye, Trash2, Loader2, Filter, Search } from "lucide-react";
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
    try {
      setDeletingId(openId);
      await deleteProduct(openId);
      toast.success("Xoá sản phẩm thành công");
      setOpenId(null);
      refreshProducts(); // reload list
    } catch (error) {
      console.error(error);
      toast.error("Xoá thất bại, vui lòng thử lại");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className='flex-1 space-y-6'>
      {/* --- TOOLBAR & FILTERS --- */}
      <div className='bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4'>
        <div className='flex items-center gap-2 w-full sm:w-auto'>
          <span className='text-sm font-medium text-gray-700 whitespace-nowrap'>
            Danh mục:
          </span>
          <div className='relative w-full sm:w-64'>
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
              className='block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md border'
            >
              <option value='all'>Tất cả</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className='text-sm text-gray-500'>
          Tổng số:{" "}
          <span className='font-medium text-gray-900'>{totalProducts}</span> sản
          phẩm
        </div>
      </div>

      {/* --- DATA TABLE --- */}
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm text-left'>
            <thead className='bg-gray-50 text-gray-500 uppercase font-medium text-xs border-b border-gray-200'>
              <tr>
                <th className='px-6 py-4 font-semibold'>Sản phẩm</th>
                <th className='px-6 py-4 font-semibold'>Người bán</th>
                <th className='px-6 py-4 font-semibold'>Danh mục</th>
                <th className='px-6 py-4 font-semibold'>Giá hiện tại</th>
                <th className='px-6 py-4 font-semibold'>Trạng thái</th>
                <th className='px-6 py-4 font-semibold text-right'>
                  Hành động
                </th>
              </tr>
            </thead>

            <tbody className='divide-y divide-gray-100'>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className='px-6 py-12 text-center text-gray-500'
                  >
                    <div className='flex justify-center items-center gap-2'>
                      <Loader2 className='animate-spin w-5 h-5 text-teal-600' />{" "}
                      Đang tải dữ liệu...
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className='px-6 py-12 text-center text-gray-500 italic'
                  >
                    <div className='flex flex-col items-center gap-2'>
                      <Search className='w-8 h-8 text-gray-300' />
                      <span>Không tìm thấy sản phẩm nào.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const isEnded = new Date(p.endAt).getTime() < Date.now();
                  return (
                    <tr
                      key={p.id}
                      className='hover:bg-gray-50 transition-colors duration-150'
                    >
                      <td className='px-6 py-4'>
                        <div className='font-medium text-gray-900'>
                          {p.title}
                        </div>
                      </td>
                      <td className='px-6 py-4 text-gray-600'>
                        {p.seller?.fullname || "Ẩn danh"}
                      </td>
                      <td className='px-6 py-4 text-gray-600'>
                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
                          {p.category?.name || "Khác"}
                        </span>
                      </td>
                      <td className='px-6 py-4 font-medium text-blue-600'>
                        {formatCurrency(p.currentPrice)}
                      </td>
                      <td className='px-6 py-4'>
                        {isEnded ? (
                          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
                            <span className='w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5'></span>
                            Kết thúc
                          </span>
                        ) : (
                          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                            <span className='w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5'></span>
                            Đang diễn ra
                          </span>
                        )}
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          <Link
                            to={`/product/${p.id}`}
                            className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200'
                            title='Xem chi tiết'
                          >
                            <Eye className='w-4 h-4' />
                          </Link>
                          <button
                            onClick={() => setOpenId(p.id)}
                            className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200'
                            title='Xóa sản phẩm'
                          >
                            <Trash2 className='w-4 h-4' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION --- */}
        {totalProducts > 0 && (
          <div className='p-4 border-t border-gray-100 mt-auto bg-gray-50/50'>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-gray-500'>
                Hiển thị trang <span className='font-medium'>{page}</span> /{" "}
                <span className='font-medium'>{totalPage}</span>
              </div>
              <Pagination
                className='flex justify-end'
                page={page}
                onPageChange={onPageChange}
                totalPage={totalPage}
              />
            </div>
          </div>
        )}
      </div>

      {/* --- CONFIRM DIALOG --- */}
      <Dialog open={!!openId} onOpenChange={(val) => !val && setOpenId(null)}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Xác nhận xoá sản phẩm</DialogTitle>
            <DialogDescription className='text-red-600'>
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>

          <div className='py-4'>
            {productToDelete ? (
              <p className='text-sm text-gray-600'>
                Bạn có chắc chắn muốn xoá sản phẩm: <br />
                <span className='font-bold text-gray-900 text-base'>
                  {productToDelete.title + " "}
                </span>
                ?
              </p>
            ) : (
              <p className='text-gray-500'>Đang tải thông tin sản phẩm...</p>
            )}
          </div>

          <DialogFooter className='gap-2 sm:gap-0'>
            <button
              onClick={() => setOpenId(null)}
              disabled={!!deletingId}
              className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 '
            >
              Hủy bỏ
            </button>

            <button
              onClick={handleDelete}
              disabled={!!deletingId}
              className='ml-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 flex items-center gap-2 disabled:opacity-50'
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsTab;
