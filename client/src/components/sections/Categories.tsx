import { type FC, useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  ChevronRight,
  ChevronDown,
  Folder,
  Smartphone,
  Box,
  Monitor,
  MoreVertical,
} from "lucide-react";
import { get } from "../../api/api";

// Data Types
type NodeType = "category" | "subcategory" | "product";

interface TreeNode {
  id: string;
  name: string;
  type: NodeType;
  icon?: any;
  children?: TreeNode[];
}
async function getUserData() {
  const res = await fetch("http://localhost:4000/categories/parents");
  const categories = await res.json();
  console.log(categories);
  return categories;
}

getUserData();

// Mock Data (unchanged)
const initialData: TreeNode[] = [
  {
    id: "1",
    name: "Điện thoại & Phụ kiện",
    type: "category",
    icon: Smartphone,
    children: [
      {
        id: "1-1",
        name: "Điện thoại di động",
        type: "subcategory",
        children: [
          { id: "1-1-1", name: "iPhone 15 Pro Max", type: "product" },
          { id: "1-1-2", name: "Samsung Galaxy S24", type: "product" },
        ],
      },
      {
        id: "1-2",
        name: "Phụ kiện",
        type: "subcategory",
        children: [
          { id: "1-2-1", name: "Tai nghe AirPods", type: "product" },
          { id: "1-2-2", name: "Sạc dự phòng Anker", type: "product" },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Máy tính & Laptop",
    type: "category",
    icon: Monitor,
    children: [
      {
        id: "2-1",
        name: "Laptop Gaming",
        type: "subcategory",
        children: [
          { id: "2-1-1", name: "Asus ROG Strix", type: "product" },
          { id: "2-1-2", name: "MSI Raider", type: "product" },
        ],
      },
      {
        id: "2-2",
        name: "Macbook",
        type: "subcategory",
        children: [],
      },
    ],
  },
];

// Recursive Tree Component
const TreeItem: FC<{ node: TreeNode; level: number }> = ({ node, level }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="transition-all">
      {/* Row */}
      <div
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        className={`
          group flex items-center justify-between py-3 px-5 cursor-pointer border-b 
          transition hover:bg-gray-50 select-none
          ${node.type === "category" ? "bg-gray-50 font-semibold" : ""}
        `}
        style={{ paddingLeft: `${level * 1.5 + 1}rem` }}
      >
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 text-gray-400 flex items-center justify-center">
            {hasChildren ? (
              isOpen ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )
            ) : (
              <span className="w-4" />
            )}
          </div>

          {/* Icons */}
          {node.type === "category" && node.icon ? (
            <node.icon className="w-5 h-5 text-blue-600" />
          ) : node.type === "subcategory" ? (
            <Folder className="w-4 h-4 text-yellow-500" />
          ) : (
            <Box className="w-4 h-4 text-gray-400" />
          )}

          {/* Label */}
          <span
            className={`${
              node.type === "product"
                ? "text-gray-600 text-sm"
                : "text-gray-800 font-medium"
            }`}
          >
            {node.name}
          </span>

          {/* Badge */}
          {hasChildren && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-600">
              {node.children?.length}
            </span>
          )}
        </div>

        {/* Action Menu */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 transition hover:bg-gray-200 p-2 rounded"
        >
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Children */}
      {isOpen && hasChildren && (
        <div className="ml-6 border-l border-gray-200 animate-[fadeDown_0.2s_ease]">
          {node.children!.map((child) => (
            <TreeItem key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const handleAddNew = () => {};
// Main UI
const CategoriesTab: FC = () => {
  const [treeData] = useState<TreeNode[]>(initialData);

  return (
    <div className="flex-1">
      <div className="bg-white shadow-sm rounded-xl border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b bg-gray-50">
          <div>
            <h2 className="text-lg font-semibold">Quản lý danh mục</h2>
            <p className="text-sm text-gray-500">
              Hiển thị dạng cây: Danh mục → Nhóm → Sản phẩm
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            onClick={() => {}}
          >
            <Plus size={16} /> Thêm mới
          </button>
        </div>

        {/* List Head */}
        <div className="px-5 py-2 text-xs font-bold uppercase bg-gray-100 text-gray-500 border-b">
          Tên danh mục / Sản phẩm
        </div>

        {/* Tree Render */}
        <div>
          {treeData.map((node) => (
            <TreeItem key={node.id} node={node} level={0} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesTab;
