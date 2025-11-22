import { type FC, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Category {
  icon: string;
  name: string;
  products: number;
}

const categoryData: Category[] = [
  { icon: "📱", name: "Điện thoại", products: 245 },
  { icon: "💻", name: "Máy tính", products: 189 },
  { icon: "📱", name: "Máy tính bảng", products: 156 },
  { icon: "⌚", name: "Đồng hồ", products: 98 },
  { icon: "🎧", name: "Tai nghe", products: 134 },
  { icon: "🔌", name: "Phụ kiện", products: 276 },
];

const CategoriesTab: FC = () => {
  const [categories, setCategories] = useState(categoryData);

  // 👉 State cho modal + form
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("📦");

  const maxProducts = Math.max(...categories.map((c) => c.products));

  const handleAddCategory = () => {
    if (!newName.trim()) return;

    setCategories((prev) => [
      ...prev,
      {
        icon: newIcon || "📦",
        name: newName.trim(),
        products: 0,
      },
    ]);

    // reset + đóng dialog
    setNewName("");
    setNewIcon("📦");
    setIsDialogOpen(false);
  };

  return (
    <div className="flex-1">
      <div className="border rounded-lg p-6 bg-white ">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Quản lý danh mục</h2>
            <p className="text-sm text-gray-500">
              Thêm, sửa, xóa danh mục sản phẩm
            </p>
          </div>

          {/* Nút mở dialog */}
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Thêm danh mục
          </button>
        </div>

        {/* GRID CATEGORY */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c, index) => {
            const percentage = (c.products / maxProducts) * 100;

            return (
              <div
                key={index}
                className="border rounded-lg p-4 hover:shadow-md transition bg-white "
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{c.icon}</span>
                    <div>
                      <h3 className="font-semibold">{c.name}</h3>
                      <p className="text-sm text-gray-500">
                        {c.products} sản phẩm
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="p-1 hover:bg-gray-100  rounded transition">
                      <Pencil className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-1 hover:bg-red-100  rounded transition">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL THÊM DANH MỤC */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div
            className="w-full max-w-sm rounded-lg bg-white  p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">
              Thêm danh mục mới
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tên danh mục
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: Điện thoại, Laptop..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Icon (emoji)
                </label>
                <input
                  type="text"
                  value={newIcon}
                  onChange={(e) => setNewIcon(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="📱, 💻, 🎧..."
                  maxLength={2}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                className="px-3 py-2 text-sm rounded-md border hover:bg-gray-100 "
                onClick={() => setIsDialogOpen(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleAddCategory}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesTab;
