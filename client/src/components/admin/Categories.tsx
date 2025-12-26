import { type FC, useState } from "react";
import {
  Plus,
  ChevronRight,
  ChevronDown,
  Folder,
  Box,
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
} from "../ui/dialog";
import { toast } from "sonner";

import {
  useCategories,
  type TreeNode,
} from "../../libs/contexts/admin/cate.context";

// ===============================
// TreeItem Component
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
    if (!isOpen) {
      if (!node.isLoaded && !hasChildren) {
        setIsLoading(true);
        await onLoadData(node);
        setIsLoading(false);
      }
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className='transition-all'>
      <div
        onClick={handleToggle}
        className={`
          group flex items-center justify-between py-3 px-5 cursor-pointer border-b border-gray-100
          transition hover:bg-gray-50 select-none
          ${node.type === "category" ? "bg-gray-50/50 font-medium" : ""}
        `}
        style={{ paddingLeft: `${level * 1.5 + 1.25}rem` }}
      >
        <div className='flex items-center gap-3'>
          <div className='w-5 h-5 text-gray-400 flex items-center justify-center shrink-0'>
            {isLoading ? (
              <Loader2 className='w-4 h-4 animate-spin text-teal-500' />
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
            <Folder className='w-5 h-5 text-green-600 fill-green-400 shrink-0' />
          ) : node.type === "subcategory" ? (
            <Folder className='w-4 h-4 text-yellow-500 shrink-0' />
          ) : (
            <Box className='w-4 h-4 text-gray-400 shrink-0' />
          )}

          <span
            className={`truncate ${
              node.type === "product"
                ? "text-gray-600 text-sm"
                : "text-gray-900 font-medium"
            }`}
          >
            {node.name}
          </span>
        </div>

        {isCategory && (
          <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
            {node.type === "category" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddSub(node);
                }}
                title='Thêm danh mục con'
                className='p-1.5 rounded hover:bg-blue-100 text-blue-600 transition'
              >
                <Plus size={16} />
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(node);
              }}
              title='Sửa tên'
              className='p-1.5 rounded hover:bg-yellow-100 text-yellow-600 transition'
            >
              <Pencil size={16} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(node);
              }}
              title='Xóa'
              className='p-1.5 rounded hover:bg-red-100 text-red-600 transition'
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

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
        <div className='py-2 text-xs text-gray-400 italic ml-1.5'>(Trống)</div>
      )}
    </div>
  );
};

// ===============================
// Main Component
// ===============================
const CategoriesTab: FC = () => {
  const {
    treeData,
    isInitialLoading,
    loadChildren,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  const [dialogMode, setDialogMode] = useState<
    "create_root" | "create_sub" | "edit" | null
  >(null);
  const [deleteNode, setDeleteNode] = useState<TreeNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [formName, setFormName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Handlers ---
  const openCreateRoot = () => {
    setDialogMode("create_root");
    setFormName("");
    setSelectedNode(null);
  };

  const openCreateSub = (node: TreeNode) => {
    setDialogMode("create_sub");
    setFormName("");
    setSelectedNode(node);
  };

  const openEdit = (node: TreeNode) => {
    setDialogMode("edit");
    setFormName(node.name);
    setSelectedNode(node);
  };

  const openDelete = (node: TreeNode) => {
    setDeleteNode(node);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    try {
      setIsSubmitting(true);

      if (dialogMode === "create_root") {
        await createCategory(formName, null);
        toast.success("Tạo danh mục gốc thành công");
      } else if (dialogMode === "create_sub" && selectedNode) {
        await createCategory(formName, selectedNode.id);
        toast.success("Tạo danh mục con thành công");
      } else if (dialogMode === "edit" && selectedNode) {
        await updateCategory(selectedNode.id, formName);
        toast.success("Cập nhật thành công");
      }

      setDialogMode(null);
      setFormName("");
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteNode) return;
    try {
      setIsSubmitting(true);
      const result = await deleteCategory(deleteNode.id);

      if (result.success) {
        toast.success("Đã xóa danh mục");
        setDeleteNode(null);
      } else {
        toast.error(result.message || "Xóa thất bại!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDialogTitle = () => {
    if (dialogMode === "create_root") return "Tạo danh mục gốc";
    if (dialogMode === "create_sub")
      return `Thêm danh mục con cho "${selectedNode?.name}"`;
    if (dialogMode === "edit") return "Đổi tên danh mục";
    return "";
  };

  return (
    <div className='flex-1 space-y-6'>
      <div className='bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden '>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white'>
          <h2 className='text-lg font-semibold text-gray-900'>
            Quản lý danh mục
          </h2>
          <button
            onClick={openCreateRoot}
            className='flex items-center gap-2 px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 transition text-sm font-medium shadow-sm'
          >
            <Plus size={16} /> Thêm gốc
          </button>
        </div>
      </div>
      <div className='bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden min-h-[300px] flex flex-col'>
        {/* Tree Content */}
        <div className='flex-1 overflow-y-auto bg-white'>
          {isInitialLoading ? (
            <div className='flex justify-center items-center py-20 text-gray-500'>
              <Loader2 className='w-6 h-6 animate-spin mr-2 text-teal-600' />{" "}
              Đang tải dữ liệu...
            </div>
          ) : treeData.length === 0 ? (
            <div className='text-center py-20 text-gray-400 italic'>
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

      {/* --- DIALOG FORM --- */}
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
              <label
                htmlFor='name'
                className='text-right text-sm font-medium text-gray-700'
              >
                Tên DM
              </label>
              <input
                id='name'
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className='col-span-3 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                placeholder='Nhập tên...'
                required
                autoFocus
              />
            </div>

            <DialogFooter>
              <button
                type='button'
                onClick={() => setDialogMode(null)}
                className='bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500'
              >
                Hủy
              </button>
              <button
                type='submit'
                disabled={isSubmitting}
                className='bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition flex items-center gap-2 disabled:opacity-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500'
              >
                {isSubmitting && <Loader2 className='w-4 h-4 animate-spin' />}
                Lưu lại
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- DIALOG DELETE --- */}
      <Dialog
        open={!!deleteNode}
        onOpenChange={(open) => !open && setDeleteNode(null)}
      >
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription className='text-red-600'>
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>

          <div className='py-4 text-sm text-gray-600'>
            <p>
              Bạn có chắc chắn muốn xóa danh mục: <br />
              <span className='font-bold text-lg text-gray-900'>
                {deleteNode?.name}
              </span>
              ?
            </p>
          </div>

          <DialogFooter>
            <button
              onClick={() => setDeleteNode(null)}
              disabled={isSubmitting}
              className='bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition text-sm font-medium '
            >
              Hủy
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={isSubmitting}
              className='bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500'
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
