import { type FC, useState } from "react";
import { Eye, Trash2, Loader2, Pencil, Search } from "lucide-react";
import Pagination from "../pagination";
import { useProducts } from "../../libs/contexts/seller/product.context";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    v
  );

const ProductsTab: FC = () => {
  const {
    products,
    isLoading,
    page,
    totalPage,
    totalProducts,
    setPage,
    deleteProduct,
    updateProductDescription,
    refreshProducts,
  } = useProducts();

  // State quản lý dialog
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [newDesc, setNewDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productToDelete = products.find((p) => p.id === deleteId);

  const onPageChange = (p: number | string) => {
    if (p === "...") return;
    setPage(Number(p));
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsSubmitting(true);
    const res = await deleteProduct(deleteId);
    if (res.success) {
      toast.success(res.message);
      setDeleteId(null);
      refreshProducts();
    } else {
      toast.error(res.message);
    }
    setIsSubmitting(false);
  };

  const handleUpdate = async () => {
    if (!editProduct) return;
    setIsSubmitting(true);
    const res = await updateProductDescription(editProduct.id, newDesc);
    if (res.success) {
      toast.success(res.message);
      setEditProduct(null);
      refreshProducts();
    } else {
      toast.error(res.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className='bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300'>
      {/* Header */}
      <div className='p-4 border-b border-gray-200 bg-gray-50/50'>
        <h3 className='font-semibold text-gray-900'>
          Danh sách sản phẩm của tôi
        </h3>
      </div>

      {/* Table */}
      <div className='overflow-x-auto'>
        <table className='w-full text-sm text-left'>
          <thead className='text-gray-500 bg-gray-50 border-b border-gray-200'>
            <tr>
              <th className='px-6 py-3 font-medium'>Tên sản phẩm</th>
              <th className='px-6 py-3 font-medium'>Giá hiện tại</th>
              <th className='px-6 py-3 font-medium'>Lượt đấu</th>
              <th className='px-6 py-3 font-medium'>Trạng thái</th>
              <th className='px-6 py-3 font-medium text-center'>Hành động</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {isLoading ? (
              // Loading Skeleton theo từng hàng
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className='animate-pulse'>
                  <td colSpan={5} className='px-6 py-4'>
                    <div className='h-4 bg-gray-200 rounded w-full'></div>
                  </td>
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className='px-6 py-10 text-center text-gray-500'
                >
                  <div className='flex flex-col items-center gap-2'>
                    <Search className='w-8 h-8 text-gray-300' />
                    <span>Bạn chưa có sản phẩm nào.</span>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className='hover:bg-gray-50 transition-colors'>
                  <td className='px-6 py-4 font-medium text-gray-900'>
                    {p.title}
                  </td>
                  <td className='px-6 py-4 text-blue-600 font-semibold'>
                    {formatCurrency(p.currentPrice)}
                  </td>
                  <td className='px-6 py-4 text-gray-600'>{p.countbids}</td>
                  <td className='px-6 py-4'>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        p.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {p.status === "ACTIVE" ? "Đang đấu giá" : p.status}
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex justify-center gap-2'>
                      <Link
                        to={`/product/${p.id}`}
                        className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200'
                        title='Xem chi tiết'
                      >
                        <Eye className='w-4 h-4' />
                      </Link>
                      <button
                        onClick={() => {
                          setEditProduct(p);
                          setNewDesc(p.description || "");
                        }}
                        className='p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors border border-transparent hover:border-yellow-200'
                        title='Chỉnh sửa mô tả'
                      >
                        <Pencil className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200'
                        title='Xóa sản phẩm'
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && totalProducts > 0 && (
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

      {/* Dialog Chỉnh sửa mô tả */}
      <Dialog open={!!editProduct} onOpenChange={() => setEditProduct(null)}>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa mô tả sản phẩm</DialogTitle>
            <DialogDescription>
              Cập nhật nội dung chi tiết cho "{editProduct?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className='py-4'>
            <textarea
              className='w-full p-3 border border-gray-300 rounded-md min-h-[150px] text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all'
              placeholder='Nhập mô tả mới tại đây...'
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
          </div>
          <DialogFooter>
            <button
              onClick={() => setEditProduct(null)}
              className='px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50'
            >
              Hủy
            </button>
            <button
              onClick={handleUpdate}
              disabled={isSubmitting}
              className='px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 flex items-center gap-2 disabled:opacity-50'
            >
              {isSubmitting && <Loader2 className='w-4 h-4 animate-spin' />}
              Lưu thay đổi
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Xác nhận xóa */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
            <DialogDescription className='text-red-600 font-medium'>
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <div className='py-4'>
            <p className='text-sm text-gray-600'>
              Bạn có chắc chắn muốn xóa sản phẩm: <br />
              <span className='font-bold text-gray-900 text-base'>
                {productToDelete?.title}
              </span>
              ?
            </p>
          </div>
          <DialogFooter>
            <button
              onClick={() => setDeleteId(null)}
              className='px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50'
            >
              Hủy
            </button>
            <button
              onClick={handleDelete}
              disabled={isSubmitting}
              className='px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 flex items-center gap-2 disabled:opacity-50'
            >
              {isSubmitting && <Loader2 className='w-4 h-4 animate-spin' />}
              Xác nhận xóa
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsTab;
