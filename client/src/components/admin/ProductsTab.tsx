import { type FC } from "react";
import { Eye, Trash2, Loader2 } from "lucide-react";
import Pagination from "../pagination";
// 1. Import hook từ Context (Thay đổi đường dẫn nếu file Context nằm ở chỗ khác)
import { useProducts } from "../../libs/contexts/productTab.context";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

// hoặc dùng trực tiếp type từ Context trả về cũng được.
interface Product {
  id: string;
  title: string;
  seller: { fullname: string };
  category: { name: string };
  currentPrice: number;
  endAt: string;
}

const formatCurrency = (v: number) =>
  v.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const ProductsTab: FC = () => {
  // 2. Lấy toàn bộ dữ liệu và hàm từ Context thông qua useProducts
  // Không còn useState hay useEffect ở đây nữa
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
  } = useProducts();

  // Hàm xử lý đổi trang
  function onPageChange(newPage: string | number) {
    if (newPage === "...") return;
    setPage(Number(newPage));
  }

  // Hàm xử lý đổi bộ lọc
  function handleFilterChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setFilter(e.target.value);
    setPage(1); // Reset về trang 1 khi đổi danh mục
  }

  // Hàm xử lý xóa (Gọi hàm từ Context)
  const handleDeleteClick = async (id: string) => {
    await deleteProduct(id);
    // Không cần gọi fetch lại, Context đã tự xử lý (Optimistic update)
  };

  // --- RETURN JSX ---
  return (
    <div className='flex-1'>
      <div className='rounded-lg border border-gray-200 bg-white shadow-sm flex flex-col h-full'>
        {/* Filter Header */}
        <div className='p-4 border-b border-gray-200 bg-gray-200  flex items-center gap-4'>
          <label className='text-sm font-medium'>Lọc theo danh mục:</label>
          <select
            value={filter}
            onChange={handleFilterChange}
            className='px-3 py-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value='all'>Tất cả</option>
            {categories.map((cate) => (
              <option key={cate.id} value={cate.id}>
                {cate.name}
              </option>
            ))}
          </select>

          <span className='ml-auto text-sm text-gray-500 font-bold'>
            {totalProducts} sản phẩm
          </span>
        </div>

        {/* Table Content */}
        {isLoading ? (
          <div className='flex h-120 items-center justify-center w-full'>
            <Loader2 className='w-8 h-8 animate-spin text-green-600' />
            <span className='ml-2 text-gray-500 font-medium'>
              Đang tải dữ liệu...
            </span>
          </div>
        ) : (
          <div className='overflow-x-auto w-full '>
            <table className='w-full text-sm'>
              <thead className='bg-gray-50 border-b'>
                <tr>
                  {[
                    "Sản phẩm",
                    "Người bán",
                    "Danh mục",
                    "Giá",
                    "Lượt ra giá",
                    "Trạng thái",
                    "Hành động",
                  ].map((h, i) => (
                    <th
                      key={i}
                      className='px-6 py-3 text-left font-semibold text-gray-700 bg-gray-50 whitespace-nowrap'
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {products.map((p, i) => {
                  const isEnded = new Date(p.endAt) < new Date();
                  const statusLabel = isEnded ? "Suspended" : "Active";
                  const statusClass = isEnded
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700";

                  return (
                    <tr
                      key={p.id || i}
                      className='border-b  hover:bg-gray-50 transition'
                    >
                      <td className='h-20 px-6 py-4 font-medium text-gray-900'>
                        {p.title}
                      </td>
                      <td className='h-20 px-6 py-4 text-gray-500'>
                        {p.seller?.fullname || "Ẩn danh"}
                      </td>
                      <td className='h-20 px-6 py-4 text-gray-500'>
                        {p.category?.name || "Khác"}
                      </td>
                      <td className='h-20 px-6 py-4 font-medium text-blue-600'>
                        {formatCurrency(p.currentPrice)}
                      </td>
                      <td className='h-20 px-6 py-4 text-center'>37</td>
                      <td className='h-20 px-6 py-4'>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${statusClass}`}
                        >
                          {statusLabel}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex gap-2'>
                          <button className='p-1 hover:bg-blue-50 rounded text-gray-500 hover:text-blue-600 transition'>
                            <Eye className='w-4 h-4' />
                          </button>

                          <Dialog>
                            <DialogTrigger asChild>
                              <button className='p-1 hover:bg-red-50 rounded text-gray-500 hover:text-red-600 transition'>
                                <Trash2 className='w-4 h-4' />
                              </button>
                            </DialogTrigger>

                            <DialogContent className='sm:max-w-[425px]'>
                              <DialogHeader>
                                <DialogTitle>Xác nhận xóa</DialogTitle>
                                <DialogDescription>
                                  Hành động này không thể hoàn tác.
                                </DialogDescription>
                              </DialogHeader>

                              <div className='py-4'>
                                <p>
                                  Bạn có chắc chắn muốn xóa sản phẩm
                                  <strong> {p.title}</strong> không?
                                </p>
                              </div>

                              <DialogFooter>
                                <DialogClose asChild>
                                  <button className='px-4 py-2 rounded border hover:bg-gray-100 text-sm font-medium'>
                                    Hủy
                                  </button>
                                </DialogClose>

                                <button
                                  className='px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-sm font-medium'
                                  onClick={() => handleDeleteClick(p.id)}
                                >
                                  Xóa
                                </button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {products.length === 0 && (
              <div className='text-center py-10 text-gray-500'>
                Không tìm thấy sản phẩm nào.
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalProducts > 0 && (
          <div className='h-20 border-t border-gray-200'>
            <Pagination
              className='flex justify-end'
              page={page}
              onPageChange={onPageChange}
              totalPage={totalPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsTab;
