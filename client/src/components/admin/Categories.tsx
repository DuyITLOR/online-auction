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

// Import Context
import { useCategories } from "../../libs/contexts/cateTab.context"; // Đảm bảo đúng đường dẫn

interface TreeNode {
  id: string;
  name: string;
  type: "category" | "subcategory" | "product";
  children?: TreeNode[];
  isLoaded?: boolean;
}
// --- Component TreeItem (Dumb Component - Chỉ hiển thị và bắn sự kiện) ---
interface TreeItemProps {
  node: TreeNode;
  level: number;
  onLoadData: (node: TreeNode) => void;
  // Các hàm callback để mở Dialog từ cha
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

  // Chỉ cho phép thao tác nếu không phải là Product
  const isCategory = node.type !== "product";
  const hasChildren = node.children && node.children.length > 0;

  const handleToggle = async () => {
    if (!isCategory) return; // Product không mở rộng được

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
          group flex items-center justify-between py-3 px-5 cursor-pointer border-b border-gray-200
          transition hover:bg-gray-50 select-none
          ${node.type === "category" ? "bg-gray-50 font-semibold" : ""}
        `}
        style={{ paddingLeft: `${level * 1.5 + 1}rem` }}
      >
        {/* Phần trái: Icon và Tên */}
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
            className={`${
              node.type === "product"
                ? "text-gray-600 text-sm"
                : "text-gray-800 font-medium"
            }`}
          >
            {node.name}
          </span>

          {hasChildren && (
            <span className='px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-600'>
              {node.children?.length}
            </span>
          )}
        </div>

        {/* Phần phải: Các nút hành động (Chỉ hiện khi hover) */}
        {isCategory && (
          <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
            {/* Nút Thêm danh mục con (Chỉ hiện cho Category, ko hiện cho Subcategory nếu chỉ có 2 cấp) */}
            {/* Giả sử chỉ cho tạo sub ở cấp 1 (Category) */}
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

      {/* Render con đệ quy */}
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

// --- Main Component ---
const CategoriesTab: FC = () => {
  const {
    treeData,
    isInitialLoading,
    loadChildren,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  // --- STATE QUẢN LÝ DIALOG ---
  const [dialogMode, setDialogMode] = useState<
    "create_root" | "create_sub" | "edit" | null
  >(null);
  const [deleteNode, setDeleteNode] = useState<TreeNode | null>(null); // Node đang chọn để xóa
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null); // Node đang chọn để sửa/thêm con

  // State cho Form
  const [formName, setFormName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- HANDLERS MỞ DIALOG ---

  // 1. Mở dialog Thêm Root
  const openCreateRoot = () => {
    setDialogMode("create_root");
    setFormName("");
    setSelectedNode(null);
  };

  // 2. Mở dialog Thêm Sub
  const openCreateSub = (node: TreeNode) => {
    setDialogMode("create_sub");
    setFormName("");
    setSelectedNode(node);
  };

  // 3. Mở dialog Edit
  const openEdit = (node: TreeNode) => {
    setDialogMode("edit");
    setFormName(node.name);
    setSelectedNode(node);
  };

  // 4. Mở dialog Delete
  const openDelete = (node: TreeNode) => {
    setDeleteNode(node);
  };

  // --- HANDLER SUBMIT FORM (Thêm/Sửa) ---
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    try {
      setIsSubmitting(true);

      if (dialogMode === "create_root") {
        await createCategory(formName, null);
      } else if (dialogMode === "create_sub" && selectedNode) {
        await createCategory(formName, selectedNode.id);
        // Có thể cần reload node cha để thấy con mới, hoặc API create tự refresh root
      } else if (dialogMode === "edit" && selectedNode) {
        await updateCategory(selectedNode.id, formName);
      }

      // Reset & Close
      setDialogMode(null);
      setFormName("");
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- HANDLER DELETE ---
  const handleDeleteConfirm = async () => {
    if (!deleteNode) return;
    try {
      setIsSubmitting(true);

      await deleteCategory(deleteNode.id);
      setDeleteNode(null);
    } catch (error) {
      console.error(error);
      console.log("Deleting category ID:", deleteNode.id);
      alert("Xóa thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tiêu đề Dialog Form
  const getDialogTitle = () => {
    if (dialogMode === "create_root") return "Tạo danh mục gốc";
    if (dialogMode === "create_sub")
      return `Thêm danh mục con cho "${selectedNode?.name}"`;
    if (dialogMode === "edit") return "Đổi tên danh mục";
    return "";
  };

  return (
    <div className='flex-1'>
      <div className='bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden min-h-[500px]'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-5 border-b bg-gray-200'>
          <h2 className='text-lg font-semibold'>Quản lý danh mục</h2>
          <button
            onClick={openCreateRoot}
            className='flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition'
          >
            <Plus size={16} /> Thêm gốc
          </button>
        </div>

        {/* Tree Content */}
        <div className='pb-10'>
          {isInitialLoading ? (
            <div className='flex justify-center items-center py-20 text-gray-500'>
              <Loader2 className='w-6 h-6 animate-spin mr-2' /> Đang tải dữ
              liệu...
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

      {/* --- DIALOG 1: FORM (Thêm/Sửa) --- */}
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
              <label htmlFor='name' className='text-right text-sm font-medium'>
                Tên DM
              </label>
              <input
                id='name'
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className='col-span-3 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Nhập tên...'
                required
                autoFocus
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <button
                  type='button'
                  className='bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition text-sm font-medium'
                >
                  Hủy
                </button>
              </DialogClose>
              <button
                type='submit'
                disabled={isSubmitting}
                className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 text-sm font-medium'
              >
                {isSubmitting && <Loader2 className='w-4 h-4 animate-spin' />}
                Lưu lại
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- DIALOG 2: CONFIRM DELETE --- */}
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

          <div className='py-4'>
            <p>
              Bạn có chắc chắn muốn xóa danh mục: <br />
              <span className='font-bold text-lg'>{deleteNode?.name}</span> ?
            </p>
            <p className='text-xs text-gray-500 mt-2'>
              Lưu ý: Nếu danh mục này có chứa con, chúng cũng sẽ bị xóa.
            </p>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <button className='bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition text-sm font-medium'>
                Hủy
              </button>
            </DialogClose>
            <button
              onClick={handleDeleteConfirm}
              disabled={isSubmitting}
              className='bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50 text-sm font-medium'
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
