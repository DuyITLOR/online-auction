import { type FC, useState, useEffect } from "react";
import { Eye, Trash2, Loader2 } from "lucide-react";

// 1. Định nghĩa lại Interface để code không báo lỗi đỏ và dễ quản lý
interface Product {
  id: string;
  title: string;
  seller: { fullname: string };
  category: { name: string };
  currentPrice: number;
  endAt: string; // API trả về string ISO
}

interface Category {
  name: string;
}

const formatCurrency = (v: number) =>
  v.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const ProductsTab: FC = () => {
  // 2. Sửa tên state: Product -> products (viết thường cho biến)
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("Tất cả");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Gọi song song 2 API để tiết kiệm thời gian
        const [resProd, resCat] = await Promise.all([
          fetch("http://localhost:4000/product"),
          fetch("http://localhost:4000/categories"),
        ]);

        const dataProd = await resProd.json();
        const dataCat = await resCat.json();

        if (dataProd.success) {
          let totalProducts = dataProd.data.total;
          const subResProd = await fetch(
            `http://localhost:4000/product?limit=${totalProducts}`
          );
          const subDataProd = await subResProd.json();
          console.log("Fetched products:", 1);
          setProducts(subDataProd.data.data);
        }

        if (dataCat) {
          setCategories(dataCat);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts =
    filter === "Tất cả"
      ? products
      : products.filter((p) => p.category?.name === filter);

  async function handleDeleteProduct(productId: string) {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    try {
      await fetch(`http://localhost:4000/product/${productId}`, {
        method: "DELETE",
      });
      // Cập nhật lại UI sau khi xóa mà không cần load lại trang
      setProducts(products.filter((p) => p.id !== productId));
      console.log("Deleted product:", productId);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  }

  return (
    <div className="flex-1">
      <div className="rounded-lg border bg-white shadow-sm">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center w-full">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-500 font-medium">
              Đang tải dữ liệu...
            </span>
          </div>
        ) : (
          <>
            {/* Filter Header */}
            <div className="p-4 border-b flex items-center gap-4">
              <label className="text-sm font-medium">Lọc theo danh mục:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Tất cả">Tất cả</option>
                {categories.map((cate, i) => (
                  <option key={i} value={cate.name}>
                    {cate.name}
                  </option>
                ))}
              </select>

              <span className="ml-auto text-sm text-gray-500">
                {filteredProducts.length} sản phẩm
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b sticky top-0 z-10">
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
                        className="px-6 py-3 text-left font-semibold text-gray-700 bg-gray-50"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((p, i) => {
                    // 3. Xử lý Logic ngày tháng ở đây
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
              {filteredProducts.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  Không tìm thấy sản phẩm nào.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsTab;
