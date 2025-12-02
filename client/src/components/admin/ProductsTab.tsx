import { type FC, useState, useEffect } from "react";
import { Eye, Trash2, Loader2 } from "lucide-react";
import Pagination from "../pagination"; // Đảm bảo đường dẫn import đúng

interface Product {
  id: string;
  title: string;
  seller: { fullname: string };
  category: { name: string };
  currentPrice: number;
  endAt: string;
}

interface Category {
  id: string;
  name: string;
}

const formatCurrency = (v: number) =>
  v.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const ProductsTab: FC = () => {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter & Pagination State
  const [filter, setFilter] = useState("all"); // Mặc định là 'all' hoặc rỗng
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const limit = 5;

  // 1. Hàm lấy danh mục (Phải nằm TRONG component)
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:4000/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Lỗi lấy danh mục:", error);
    }
  };

  // 2. Hàm lấy sản phẩm (Phải nằm TRONG component)
  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      // Xây dựng URL Query
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      // Chỉ thêm categoryId nếu không phải chọn "Tất cả"
      if (filter !== "all") {
        params.append("categoryId", filter);
      }

      const res = await fetch(
        `http://localhost:4000/product?${params.toString()}`
      );
      const subRes = await res.json();

      if (subRes.success || subRes.data) {
        // Tùy cấu trúc API trả về, hãy đảm bảo trỏ đúng vào data array
        // Ví dụ: subRes.data.data là mảng sản phẩm, subRes.data.total là tổng số
        setProducts(subRes.data.data || []);
        setTotalProducts(subRes.data.total || 0);
        setTotalPage(subRes.data.totalPages || 1);
      }
    } catch (error) {
      console.error("Lỗi lấy sản phẩm:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Effect chạy 1 lần khi mount để lấy Categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // 4. Effect chạy khi page hoặc filter thay đổi
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filter]);

  // Hàm xử lý đổi trang
  function onPageChange(newPage: string | number) {
    if (newPage === "...") return;
    setPage(Number(newPage));
  }

  // Hàm xử lý đổi bộ lọc
  function handleFilterChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setFilter(e.target.value);
    setPage(1); // QUAN TRỌNG: Reset về trang 1 khi đổi danh mục
  }

  async function handleDeleteProduct(productId: string) {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    try {
      await fetch(`http://localhost:4000/product/${productId}`, {
        method: "DELETE",
      });
      // Gọi lại API để làm mới danh sách đúng chuẩn Server-side pagination
      fetchProducts();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  }

  // --- RETURN JSX ---
  return (
    <div className="flex-1">
      <div className="rounded-lg border bg-white shadow-sm flex flex-col h-full">
        {/* Filter Header */}
        <div className="p-4 border-b flex items-center gap-4">
          <label className="text-sm font-medium">Lọc theo danh mục:</label>
          <select
            value={filter}
            onChange={handleFilterChange}
            className="px-3 py-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả</option>
            {categories.map((cate) => (
              // Lưu ý: Value nên là ID, hiển thị là Name
              <option key={cate.id} value={cate.id}>
                {cate.name}
              </option>
            ))}
          </select>

          <span className="ml-auto text-sm text-gray-500">
            {totalProducts} sản phẩm
          </span>
        </div>

        {/* Table Content */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center w-full">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            <span className="ml-2 text-gray-500 font-medium">
              Đang tải dữ liệu...
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
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
                      className="px-6 py-3 text-left font-semibold text-gray-700 bg-gray-50 whitespace-nowrap"
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
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {p.title}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {p.seller?.fullname || "Ẩn danh"}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {p.category?.name || "Khác"}
                      </td>
                      <td className="px-6 py-4 font-medium text-blue-600">
                        {formatCurrency(p.currentPrice)}
                      </td>
                      <td className="px-6 py-4 text-center">37</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${statusClass}`}
                        >
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="p-1 hover:bg-blue-50 rounded text-gray-500 hover:text-blue-600 transition">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 hover:bg-red-50 rounded text-gray-500 hover:text-red-600 transition"
                            onClick={() => handleDeleteProduct(p.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {products.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                Không tìm thấy sản phẩm nào.
              </div>
            )}
          </div>
        )}

        {/* Pagination đặt ở dưới cùng */}
        {totalProducts > 0 && (
          <div className="h-20">
            <Pagination
              className="h-200"
              page={page}
              onPageChange={onPageChange}
              totalPage={totalPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}; // Đóng component ProductsTab ở tận cùng file mới đúng

export default ProductsTab;
