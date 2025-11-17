import { type FC, useState } from "react";
import { Eye, Trash2 } from "lucide-react";

interface Product {
  name: string;
  seller: string;
  category: string;
  price: number;
  bids: number;
  status: "Active" | "Suspended";
}

const productDataDefault: Product[] = [
  {
    name: "iPhone 15 Pro Max",
    seller: "Seller123",
    category: "Điện thoại",
    price: 25000000,
    bids: 12,
    status: "Active",
  },
  {
    name: "MacBook Pro 16",
    seller: "Seller456",
    category: "Máy tính",
    price: 45000000,
    bids: 8,
    status: "Active",
  },
  {
    name: "Apple Watch Series 9",
    seller: "Seller123",
    category: "Đồng hồ",
    price: 8000000,
    bids: 15,
    status: "Active",
  },
  {
    name: "Sony WH-1000XM5",
    seller: "Seller789",
    category: "Tai nghe",
    price: 7500000,
    bids: 6,
    status: "Active",
  },
  {
    name: "iPad Air 11",
    seller: "Seller456",
    category: "Máy tính bảng",
    price: 18000000,
    bids: 10,
    status: "Active",
  },
];

const categories = [
  "Tất cả",
  "Điện thoại",
  "Máy tính",
  "Máy tính bảng",
  "Đồng hồ",
  "Tai nghe",
  "Phụ kiện",
];

const formatCurrency = (v: number) =>
  v.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const ProductsTab: FC<{ data?: Product[] }> = ({ data }) => {
  const productData = data || productDataDefault;
  const [filter, setFilter] = useState("Tất cả");

  const filteredProducts =
    filter === "Tất cả"
      ? productData
      : productData.filter((p) => p.category === filter);

  return (
    <div className="flex-1">
      <div className="rounded-lg border bg-white ">
        {/* Filter Header */}
        <div className="p-4 border-b flex items-center gap-4">
          <label className="text-sm font-medium">Lọc theo danh mục:</label>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-white "
          >
            {categories.map((category, i) => (
              <option key={i} value={category}>
                {category}
              </option>
            ))}
          </select>

          <span className="ml-auto text-sm text-gray-500">
            {filteredProducts.length} sản phẩm
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50  border-b">
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
                  <th key={i} className="px-6 py-3 text-left font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((p, i) => (
                <tr
                  key={i}
                  className="border-b hover:bg-gray-50  transition"
                >
                  <td className="px-6 py-4 font-medium">{p.name}</td>
                  <td className="px-6 py-4 text-gray-500">{p.seller}</td>
                  <td className="px-6 py-4 text-gray-500">{p.category}</td>
                  <td className="px-6 py-4 font-medium">
                    {formatCurrency(p.price)}
                  </td>
                  <td className="px-6 py-4">{p.bids}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        p.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-gray-100  rounded">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-1 hover:bg-red-100  rounded">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsTab;
