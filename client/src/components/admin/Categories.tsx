import { type FC, useState } from "react";
import {
  Plus,
  ChevronRight,
  ChevronDown,
  Folder,
  Box,
  Monitor,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { toast } from "sonner"; // <--- IMPORT SONNER

import {
  useCategories,
  type TreeNode,
} from "../../libs/contexts/cateTab.context";

// ===============================
// TreeItem Component (GIỮ NGUYÊN)
// ===============================
interface TreeItemProps {
  node: TreeNode;
  level: number;
  onLoadData: (node: TreeNode) => void;
  onAddSub: (node: TreeNode) => void;
  onEdit: (node: TreeNode) => void;
  onDelete: (node: TreeNode) => void;
}

const TreeItem: FC<TreeItemProps> = ({
  node,
  level,
  onLoadData,
  onAddSub,
  onEdit,
  onDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isCategory = node.type !== "product";
  const hasChildren = node.children && node.children.length > 0;

  const handleToggle = async () => {
    if (!isCategory) return;

    if (!isOpen && !node.isLoaded && !hasChildren) {
      setIsLoading(true);
      await onLoadData(node);
      setIsLoading(false);
    }

    setIsOpen(!isOpen);
  };

  return (
    <div className='transition-all'>
      <div
        onClick={handleToggle}
        className={`
          group flex items-center justify-between py-3 px-5 cursor-pointer border-b border-gray-200
          hover:bg-gray-50 select-none
          ${node.type === "category" ? "bg-gray-50 font-semibold" : ""}
        `}
        style={{ paddingLeft: `${level * 1.5 + 1}rem` }}
      >
        {/* ICON & NAME */}
        <div className='flex items-center gap-3'>
          <div className='w-5 h-5 text-gray-400 flex items-center justify-center'>
            {isLoading ? (
              <Loader2 className='w-4 h-4 animate-spin text-blue-500' />
            ) : isCategory ? (
              isOpen ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )
            ) : (
              <span className='w-4' />
            )}
          </div>

          {node.type === "category" ? (
            <Monitor className='w-5 h-5 text-blue-600' />
          ) : node.type === "subcategory" ? (
            <Folder className='w-4 h-4 text-yellow-500' />
          ) : (
            <Box className='w-4 h-4 text-gray-400' />
          )}

          <span
            className={
              node.type === "product"
                ? "text-gray-600 text-sm"
                : "text-gray-800 font-medium"
            }
          >
            {node.name}
          </span>
        </div>

        {/* ACTION BUTTONS */}
        {isCategory && (
          <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
            {node.type === "category" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddSub(node);
                }}
                className='p-1.5 rounded hover:bg-blue-100 text-blue-600'
              >
                <Plus size={16} />
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(node);
              }}
              className='p-1.5 rounded hover:bg-yellow-100 text-yellow-600'
            >
              <Pencil size={16} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(node);
              }}
              className='p-1.5 rounded hover:bg-red-100 text-red-600'
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* CHILDREN */}
      {isOpen && hasChildren && (
        <div className='ml-6 border-l border-gray-200 animate-[fadeDown_0.2s_ease]'>
          {node.children!.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              level={level + 1}
              onLoadData={onLoadData}
              onAddSub={onAddSub}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {isOpen && !isLoading && !hasChildren && isCategory && node.isLoaded && (
        <div
          className='py-2 text-xs text-gray-400 italic'
          style={{ paddingLeft: `${level * 1.5 + 4}rem` }}
        >
          (Trống)
        </div>
      )}
    </div>
  );
};

// ===============================
// MAIN COMPONENT
// ===============================
const CategoriesTab: FC = () => {
  const {
    treeData,
    isInitialLoading,
    loadChildren,
    createCategory,
    updateCategory,
    deleteCategory,
    // Không còn lấy responseData và modal từ context nữa
  } = useCategories();

  // FORM DIALOG STATES
  const [dialogMode, setDialogMode] = useState<
    "create_root" | "create_sub" | "edit" | null
  >(null);
  const [deleteNode, setDeleteNode] = useState<TreeNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);

  const [formName, setFormName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // HANDLERS ----------------------------
  const openCreateRoot = () => {
    setDialogMode("create_root");
    setSelectedNode(null);
    setFormName("");
  };

  const openCreateSub = (node: TreeNode) => {
    setDialogMode("create_sub");
    setSelectedNode(node);
    setFormName("");
  };

  const openEdit = (node: TreeNode) => {
    setDialogMode("edit");
    setSelectedNode(node);
    setFormName(node.name);
  };

  const openDelete = (node: TreeNode) => setDeleteNode(node);

  // SUBMIT FORM (CREATE / EDIT) -------------------------
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setIsSubmitting(true);
    let result = { success: false, message: "" };

    try {
      if (dialogMode === "create_root") {
        result = await createCategory(formName, null);
      } else if (dialogMode === "create_sub" && selectedNode) {
        result = await createCategory(formName, selectedNode.id);
      } else if (dialogMode === "edit" && selectedNode) {
        result = await updateCategory(selectedNode.id, formName);
      }

      // Xử lý kết quả trả về
      if (result.success) {
        toast.success(result.message);
        setDialogMode(null); // Chỉ đóng form khi thành công
        setFormName("");
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Đã có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  // DELETE CONFIRM ----------------------
  const handleDeleteConfirm = async () => {
    if (!deleteNode) return;
    setIsSubmitting(true);

    try {
      const result = await deleteCategory(deleteNode.id);

      if (result.success) {
        toast.success(result.message);
        setDeleteNode(null); // Đóng dialog xóa
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Không thể xoá danh mục");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDialogTitle = () => {
    switch (dialogMode) {
      case "create_root":
        return "Tạo danh mục gốc";
      case "create_sub":
        return `Thêm danh mục con cho "${selectedNode?.name}"`;
      case "edit":
        return "Đổi tên danh mục";
      default:
        return "";
    }
  };

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className='flex-1'>
      <div className='bg-white rounded-xl border border-gray-200 shadow-sm min-h-[500px] overflow-hidden'>
        <div className='flex items-center justify-between px-6 py-5 border-b bg-gray-200'>
          <h2 className='text-lg font-semibold'>Quản lý danh mục</h2>

          <button
            onClick={openCreateRoot}
            className='flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition'
          >
            <Plus size={16} /> Thêm gốc
          </button>
        </div>

        <div className='pb-10'>
          {isInitialLoading ? (
            <div className='flex justify-center items-center py-20 text-gray-500'>
              <Loader2 className='w-6 h-6 animate-spin mr-2' />
              Đang tải dữ liệu...
            </div>
          ) : treeData.length === 0 ? (
            <div className='text-center py-10 text-gray-400'>
              Chưa có danh mục nào
            </div>
          ) : (
            treeData.map((node) => (
              <TreeItem
                key={node.id}
                node={node}
                level={0}
                onLoadData={loadChildren}
                onAddSub={openCreateSub}
                onEdit={openEdit}
                onDelete={openDelete}
              />
            ))
          )}
        </div>
      </div>

      {/* DIALOG: FORM (CREATE/EDIT) */}
      <Dialog
        open={!!dialogMode}
        onOpenChange={(open) => !open && setDialogMode(null)}
      >
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogDescription>
              {dialogMode === "edit"
                ? "Cập nhật tên mới cho danh mục."
                : "Nhập tên danh mục mới."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <label className='text-right text-sm font-medium'>Tên DM</label>
              <input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className='col-span-3 border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500'
                required
                autoFocus
              />
            </div>

            <DialogFooter>
              <button
                type='button'
                onClick={() => setDialogMode(null)}
                className='bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200'
              >
                Hủy
              </button>

              <button
                type='submit'
                disabled={isSubmitting}
                className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50'
              >
                {isSubmitting && <Loader2 className='w-4 h-4 animate-spin' />}
                Lưu lại
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG: DELETE CONFIRM */}
      <Dialog
        open={!!deleteNode}
        onOpenChange={(open) => {
          // Ngăn đóng khi đang xoá để tránh lỗi UI
          if (!open && !isSubmitting) setDeleteNode(null);
        }}
      >
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription className='text-red-600'>
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>

          <div className='py-4'>
            <p>
              Bạn có chắc chắn muốn xóa danh mục:
              <br />
              <span className='font-bold text-lg'>{deleteNode?.name}</span>?
            </p>
            <p className='text-xs text-gray-500 mt-2'>
              Nếu danh mục có chứa danh mục con, chúng cũng sẽ bị xóa.
            </p>
          </div>

          <DialogFooter>
            <button
              onClick={() => setDeleteNode(null)}
              disabled={isSubmitting}
              className='bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 disabled:opacity-50'
            >
              Hủy
            </button>

            <button
              onClick={handleDeleteConfirm}
              disabled={isSubmitting}
              className='bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center gap-2 disabled:opacity-50'
            >
              {isSubmitting && <Loader2 className='w-4 h-4 animate-spin' />}
              Xóa vĩnh viễn
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesTab;
