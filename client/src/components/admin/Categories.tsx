import { type FC, useState, useEffect, useCallback } from "react";
import {
  Plus,
  ChevronRight,
  ChevronDown,
  Folder,
  Box,
  Monitor,
  MoreVertical,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";

// --- Import Dialog Components ---
// Đảm bảo đường dẫn này trỏ đúng vào file dialog.tsx bạn vừa tạo
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../ui/dialog"; // <--- SỬA ĐƯỜNG DẪN NẾU CẦN

// --- 1. Định nghĩa Types ---
type NodeType = "category" | "subcategory" | "product";

interface TreeNode {
  id: string;
  name: string;
  type: NodeType;
  icon?: any;
  children?: TreeNode[];
  isLoaded?: boolean;
}

// --- 2. Helper Update Tree ---
const updateTreeData = (
  nodes: TreeNode[],
  parentId: string,
  newChildren: TreeNode[]
): TreeNode[] => {
  return nodes.map((node) => {
    if (node.id === parentId) {
      return { ...node, children: newChildren, isLoaded: true };
    }
    if (node.children && node.children.length > 0) {
      return {
        ...node,
        children: updateTreeData(node.children, parentId, newChildren),
      };
    }
    return node;
  });
};

// --- 3. Component TreeItem ---
interface TreeItemProps {
  node: TreeNode;
  level: number;
  onLoadData: (node: TreeNode) => void;
}

const TreeItem: FC<TreeItemProps> = ({ node, level, onLoadData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isExpandable = node.type !== "product";
  const hasChildren = node.children && node.children.length > 0;

  const handleToggle = async () => {
    if (!isExpandable) return;

    if (!isOpen) {
      if (!node.isLoaded && !hasChildren) {
        setIsLoading(true);
        await onLoadData(node);
        setIsLoading(false);
      }
    }
    setIsOpen(!isOpen);
  };

  const handleDelete = (node: TreeNode, e: React.MouseEvent) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa "${node.name}" không?`
    );
    if (confirmed) {
      const res = fetch(`http://localhost:4000/categories/${node.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // Authorization:
        },
      });
      console.log("Xóa node:", node);
    }
  };

  const handleUpdate = (node: TreeNode, e: React.MouseEvent) => {
    console.log("Cập nhật node:", node);
  };
  return (
    <div className="transition-all">
      <div
        onClick={handleToggle}
        className={`
          group flex items-center justify-between py-3 px-5 cursor-pointer border-b 
          transition hover:bg-gray-50 select-none
          ${node.type === "category" ? "bg-gray-50 font-semibold" : ""}
        `}
        style={{ paddingLeft: `${level * 1.5 + 1}rem` }}
      >
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 text-gray-400 flex items-center justify-center">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            ) : isExpandable ? (
              isOpen ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )
            ) : (
              <span className="w-4" />
            )}
          </div>

          {node.type === "category" ? (
            node.icon ? (
              <node.icon className="w-5 h-5 text-blue-600" />
            ) : (
              <Monitor className="w-5 h-5 text-blue-600" />
            )
          ) : node.type === "subcategory" ? (
            <Folder className="w-4 h-4 text-yellow-500" />
          ) : (
            <Box className="w-4 h-4 text-gray-400" />
          )}

          <span
            className={`${
              node.type === "product"
                ? "text-gray-600 text-sm"
                : "text-gray-800 font-medium"
            }`}
          >
            {node.name}
          </span>

          {hasChildren && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-600">
              {node.children?.length}
            </span>
          )}
        </div>
        <div>
          <button
            onClick={(e) => e.stopPropagation()}
            className="opacity-0 group-hover:opacity-100 transition hover:bg-gray-200 p-2 rounded"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={(e) => handleDelete(node, e)}
            className="text-red-400 opacity-0 group-hover:opacity-100 transition hover:bg-gray-200 p-2 rounded"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {isOpen && hasChildren && (
        <div className="ml-6 border-l border-gray-200 animate-[fadeDown_0.2s_ease]">
          {node.children!.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              level={level + 1}
              onLoadData={onLoadData}
            />
          ))}
        </div>
      )}

      {isOpen &&
        !isLoading &&
        !hasChildren &&
        isExpandable &&
        node.isLoaded && (
          <div
            className="py-2 text-xs text-gray-400 italic"
            style={{ paddingLeft: `${level * 1.5 + 4}rem` }}
          >
            (Trống)
          </div>
        )}
    </div>
  );
};

// --- 4. Main Component ---
const CategoriesTab: FC = () => {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // --- STATE CHO DIALOG ---
  const [openDialog, setOpenDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // --- FETCH DATA ---
  const fetchRootCategories = async () => {
    try {
      setIsInitialLoading(true);
      const res = await fetch("http://localhost:4000/categories?parents");
      const data = await res.json();

      const formattedData: TreeNode[] = data.map((item: any) => ({
        id: item.id || item._id,
        name: item.name,
        type: "category",
        children: [],
        isLoaded: false,
      }));

      setTreeData(formattedData);
    } catch (error) {
      console.error("Failed to fetch roots:", error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchRootCategories();
  }, []);

  const handleLoadChildren = useCallback(async (parentNode: TreeNode) => {
    try {
      const res = await fetch(
        `http://localhost:4000/categories?parents=${parentNode.id}`
      );
      const subCategoriesData = await res.json();

      let finalChildren: TreeNode[] = [];

      if (Array.isArray(subCategoriesData) && subCategoriesData.length > 0) {
        finalChildren = subCategoriesData.map((item: any) => ({
          id: item.id || item._id,
          name: item.name,
          type: "subcategory",
          children: [],
          isLoaded: false,
        }));
      } else if (parentNode.type === "subcategory") {
        const prodRes = await fetch(
          `http://localhost:4000/product?categoryId=${parentNode.id}&limit=100`
        );
        const prodData = await prodRes.json();
        const productList = prodData.data?.data || prodData.data || [];

        if (Array.isArray(productList)) {
          const productNodes: TreeNode[] = productList.map((item: any) => ({
            id: item.id || item._id,
            name: item.title || item.name,
            type: "product",
            children: [],
            isLoaded: true,
          }));
          finalChildren = productNodes;
        }
      }

      setTreeData((prev) => updateTreeData(prev, parentNode.id, finalChildren));
    } catch (error) {
      console.error("Failed to fetch children:", error);
      setTreeData((prev) => updateTreeData(prev, parentNode.id, []));
    }
  }, []);

  // --- HÀM XỬ LÝ TẠO MỚI ---
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      setIsCreating(true);

      // Gọi API tạo mới Category (Mặc định tạo Root - không có parentId)
      const res = await fetch("http://localhost:4000/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization:
          // "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7Im5hbWUiOm51bGwsImVtYWlsIjoibnF0MzcyMDA1QGdtYWlsLmNvbSIsImF2YXRhclVybCI6Imh0dHBzOi8vbHF4cmRzYXl1emp5YmNjc3VobWIuc3VwYWJhc2UuY28vc3RvcmFnZS92MS9vYmplY3QvcHVibGljL2ltYWdlcy9hdmF0YXIvNzY1LWRlZmF1bHQtYXZhdGFyLnBuZyJ9LCJ0b2tlbiI6ImV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpwWkNJNklqRTBNakl5WXpjMUxURTJPV1V0TkdKbE5pMDVabU14TFdaak1URTBOVEEzWkdJNU15SXNJbVZ0WVdsc0lqb2libkYwTXpjeU1EQTFRR2R0WVdsc0xtTnZiU0lzSW1saGRDSTZNVGMyTkRVNE1UVXhOQ3dpWlhod0lqb3hOelkzTVRjek5URTBmUS5SVnl0X3F0MGt6am53WkU2bTN3OUhHa3FOR0liS2NsZnJoRlBqNFktMnkwIiwiaWF0IjoxNzY0NTgxNTE1LCJleHAiOjE3NjQ1ODg3MTV9.oK90x1Lu_Q_OxIoMIeMjF1gqmKkYe4oHzdaB76gBlvU", // Thêm token nếu cần
        },
        body: JSON.stringify({
          name: newCategoryName,
          // parentId: null // Mặc định là null
        }),
      });

      if (!res.ok) throw new Error("Failed to create");

      // Thành công: Reset và đóng Dialog
      setNewCategoryName("");
      setOpenDialog(false);

      // Load lại danh sách gốc để hiện category mới
      await fetchRootCategories();
    } catch (error) {
      console.error("Create error:", error);
      alert("Tạo danh mục thất bại!");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex-1">
      <div className="bg-white shadow-sm rounded-xl border overflow-hidden min-h-[500px]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b bg-gray-50">
          <div>
            <h2 className="text-lg font-semibold">Quản lý danh mục</h2>
            <p className="text-sm text-gray-500">
              Hiển thị dạng cây: Danh mục → Nhóm → Sản phẩm
            </p>
          </div>

          {/* NÚT MỞ DIALOG */}
          <button
            onClick={() => setOpenDialog(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <Plus size={16} /> Thêm mới
          </button>
        </div>

        {/* List Head */}
        <div className="px-5 py-2 text-xs font-bold uppercase bg-gray-100 text-gray-500 border-b">
          Tên danh mục / Sản phẩm
        </div>

        {/* Tree Render */}
        <div className="pb-10">
          {isInitialLoading ? (
            <div className="flex justify-center items-center py-20 text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Đang tải dữ
              liệu...
            </div>
          ) : treeData.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              Chưa có danh mục nào
            </div>
          ) : (
            treeData.map((node) => (
              <TreeItem
                key={node.id}
                node={node}
                level={0}
                onLoadData={handleLoadChildren}
              />
            ))
          )}
        </div>
      </div>

      {/* --- DIALOG COMPONENT --- */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tạo danh mục gốc mới</DialogTitle>
            <DialogDescription>
              Nhập tên danh mục để tạo mới. Danh mục này sẽ nằm ở cấp cao nhất.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateCategory} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right text-sm font-medium">
                Tên DM
              </label>
              <input
                id="name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="col-span-3 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ví dụ: Điện tử"
                required
                autoFocus
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <button
                  type="button"
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition text-sm font-medium"
                >
                  Hủy
                </button>
              </DialogClose>
              <button
                type="submit"
                disabled={isCreating}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 text-sm font-medium"
              >
                {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
                {isCreating ? "Đang lưu..." : "Lưu danh mục"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesTab;
