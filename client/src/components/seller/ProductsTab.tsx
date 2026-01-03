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
  new Intl.NumberFormat("vi-VN").format(v) + " VND";
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
  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">("all");

  const productToDelete = products.find((p) => p.id === deleteId);

  // Filter products based on active tab
  const filteredProducts = products.filter((p) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") {
      return p.status === "ACTIVE" && new Date(p.endAt) > new Date();
    }
    if (activeTab === "completed") {
      return p.status === "SOLD" || (p.status === "ACTIVE" && new Date(p.endAt) <= new Date());
    }
    return true;
  });

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
      <div className='p-3 sm:p-4 border-b border-gray-200 bg-gray-50/50'>
        <h3 className='font-semibold text-base sm:text-lg text-gray-900'>
          Danh sách sản phẩm của tôi
        </h3>
      </div>

      {/* Tabs */}
      <div className='flex border-b border-gray-200 bg-white overflow-x-auto'>
        <button
          onClick={() => setActiveTab("all")}
          className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "all"
              ? "border-teal-600 text-teal-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => setActiveTab("active")}
          className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "active"
              ? "border-teal-600 text-teal-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Đang hoạt động
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "completed"
              ? "border-teal-600 text-teal-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Đã hoàn thành
        </button>
      </div>

      {/* Table - Hidden on Mobile */}
      <div className='hidden md:block overflow-x-auto'>
        <table className='w-full text-sm text-left'>
          <thead className='text-gray-500 bg-gray-50 border-b border-gray-200'>
            <tr>
              <th className='px-3 sm:px-6 py-2 sm:py-3 font-medium text-xs sm:text-sm'>Tên sản phẩm</th>
              <th className='px-3 sm:px-6 py-2 sm:py-3 font-medium text-xs sm:text-sm'>Giá</th>
              <th className='px-3 sm:px-6 py-2 sm:py-3 font-medium text-xs sm:text-sm'>Lượt đấu</th>
              <th className='px-3 sm:px-6 py-2 sm:py-3 font-medium text-xs sm:text-sm'>Trạng thái</th>
              <th className='px-3 sm:px-6 py-2 sm:py-3 font-medium text-xs sm:text-sm text-center'>Hành động</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {isLoading ? (
              // Loading Skeleton theo từng hàng
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className='animate-pulse h-[72px]'>
                  <td className='px-3 sm:px-6 py-3 align-middle'>
                    <div className='h-4 w-32 bg-gray-200 rounded'></div>
                  </td>
                  <td className='px-3 sm:px-6 py-3 align-middle'>
                    <div className='h-4 w-20 bg-gray-200 rounded'></div>
                  </td>
                  <td className='px-3 sm:px-6 py-3 align-middle'>
                    <div className='h-4 w-12 bg-gray-200 rounded'></div>
                  </td>
                  <td className='px-3 sm:px-6 py-3 align-middle'>
                    <div className='h-5 w-24 bg-gray-200 rounded-full'></div>
                  </td>
                  <td className='px-3 sm:px-6 py-3 align-middle'>
                    <div className='flex justify-center gap-2'>
                      <div className='h-8 w-8 bg-gray-200 rounded-lg'></div>
                      <div className='h-8 w-8 bg-gray-200 rounded-lg'></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className='px-3 sm:px-6 py-6 sm:py-10 text-center text-gray-500'
                >
                  <div className='flex flex-col items-center gap-2'>
                    <Search className='w-6 sm:w-8 h-6 sm:h-8 text-gray-300' />
                    <span className='text-xs sm:text-sm'>
                      {activeTab === "all"
                        ? "Bạn chưa có sản phẩm nào."
                        : activeTab === "active"
                        ? "Không có sản phẩm đang hoạt động."
                        : "Không có sản phẩm đã hoàn thành."}
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p.id} className='hover:bg-gray-50 transition-colors border-b border-gray-100 md:border-b-0 h-[72px]'>
                  <td className='px-3 sm:px-6 py-3 font-medium text-xs sm:text-sm text-gray-900 align-middle'>
                    <div className='min-h-[40px] flex items-center'>
                      <span className='line-clamp-2'>{p.title}</span>
                    </div>
                  </td>
                  <td className='px-3 sm:px-6 py-3 text-blue-600 font-semibold text-xs sm:text-sm align-middle'>
                    {formatCurrency(p.currentPrice)}
                  </td>
                  <td className='px-3 sm:px-6 py-3 text-gray-600 text-xs sm:text-sm align-middle'>{p.countbids}</td>
                  <td className='px-3 sm:px-6 py-3 align-middle'>
                    {(() => {
                      const isExpired = new Date(p.endAt) <= new Date();
                      const isCompleted = p.status === "SOLD" || (p.status === "ACTIVE" && isExpired);
                      
                      if (isCompleted) {
                        return (
                          <span className='px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 inline-block'>
                            Đã hoàn thành
                          </span>
                        );
                      }
                      
                      return (
                        <span className='px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 inline-block'>
                          Đang hoạt động
                        </span>
                      );
                    })()}
                  </td>
                  <td className='px-3 sm:px-6 py-3 sm:py-4'>
                    <div className='flex justify-center gap-1 sm:gap-2'>
                      <Link
                        to={`/product/${p.id}`}
                        className='p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200'
                        title='Xem chi tiết'
                      >
                        <Eye className='w-3 sm:w-4 h-3 sm:h-4' />
                      </Link>
                      {(() => {
                        const isExpired = new Date(p.endAt) <= new Date();
                        const isCompleted = p.status === "SOLD" || (p.status === "ACTIVE" && isExpired);
                        
                        if (isCompleted && p.countbids > 0) {
                          return (
                            <Link
                              to={`/product/${p.id}?tab=rating`}
                              className='px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors'
                              title='Đánh giá người mua'
                            >
                              Đánh giá
                            </Link>
                          );
                        }
                        
                        return (
                          <>
                            <Link
                              to={`/product/${p.id}?edit=true`}
                              className='p-1.5 sm:p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors border border-transparent hover:border-yellow-200'
                              title='Chỉnh sửa mô tả'
                            >
                              <Pencil className='w-3 sm:w-4 h-3 sm:h-4' />
                            </Link>
                            <button
                              onClick={() => setDeleteId(p.id)}
                              className='p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200'
                              title='Xóa sản phẩm'
                            >
                              <Trash2 className='w-3 sm:w-4 h-3 sm:h-4' />
                            </button>
                          </>
                        );
                      })()}
                    </div>
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
        ) : filteredProducts.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-8 text-gray-500'>
            <Search className='w-8 h-8 text-gray-300 mb-2' />
            <span className='text-sm'>
              {activeTab === "all"
                ? "Bạn chưa có sản phẩm nào."
                : activeTab === "active"
                ? "Không có sản phẩm đang hoạt động."
                : "Không có sản phẩm đã hoàn thành."}
            </span>
          </div>
        ) : (
          filteredProducts.map((p) => (
            <div key={p.id} className='bg-white border border-gray-200 rounded-lg p-3 sm:p-4'>
              <div className='flex justify-between items-start gap-2 mb-2'>
                <h3 className='font-medium text-sm text-gray-900 flex-1 truncate'>{p.title}</h3>
                {(() => {
                  const isExpired = new Date(p.endAt) <= new Date();
                  const isCompleted = p.status === "SOLD" || (p.status === "ACTIVE" && isExpired);
                  
                  if (isCompleted) {
                    return (
                      <span className='px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap'>
                        Đã hoàn thành
                      </span>
                    );
                  }
                  
                  return (
                    <span className='px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap'>
                      Đang hoạt động
                    </span>
                  );
                })()}
              </div>
              
              <div className='grid grid-cols-2 gap-2 mb-3 text-xs'>
                <div>
                  <span className='text-gray-500'>Giá:</span>
                  <p className='text-blue-600 font-semibold'>{formatCurrency(p.currentPrice)}</p>
                </div>
                <div>
                  <span className='text-gray-500'>Lượt đấu:</span>
                  <p className='font-medium'>{p.countbids}</p>
                </div>
              </div>
              
              <div className='flex gap-2'>
                <Link
                  to={`/product/${p.id}`}
                  className='flex-1 py-1.5 px-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center'
                >
                  Xem
                </Link>
                {(() => {
                  const isExpired = new Date(p.endAt) <= new Date();
                  const isCompleted = p.status === "SOLD" || (p.status === "ACTIVE" && isExpired);
                  
                  if (isCompleted && p.countbids > 0) {
                    return (
                      <Link
                        to={`/product/${p.id}?tab=rating`}
                        className='flex-1 py-1.5 px-2 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors text-center'
                      >
                        Đánh giá
                      </Link>
                    );
                  }
                  
                  return (
                    <>
                      <Link
                        to={`/product/${p.id}?edit=true`}
                        className='flex-1 py-1.5 px-2 text-xs font-medium text-yellow-600 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors text-center'
                      >
                        Sửa
                      </Link>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className='flex-1 py-1.5 px-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors'
                      >
                        Xóa
                      </button>
                    </>
                  );
                })()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Footer */}
      {!isLoading && totalProducts > 0 && (
         <div className='pb-8 pr-8 flex justify-end'>
        <Pagination page={page} totalPage={totalPage} onPageChange={onPageChange} />
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
