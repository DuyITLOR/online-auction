import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

import { useAdmin } from "./admin.context";

// --- Types ---
export type NodeType = "category" | "subcategory" | "product";

export interface TreeNode {
  id: string;
  name: string;
  type: NodeType;
  icon?: any;
  children?: TreeNode[];
  isLoaded?: boolean;
}

// Định nghĩa kiểu dữ liệu trả về cho các hành động
interface ActionResult {
  success: boolean;
  message: string;
}

interface CategoryContextType {
  treeData: TreeNode[];
  isInitialLoading: boolean;
  loadChildren: (node: TreeNode) => Promise<void>;

  // Các hàm này giờ sẽ trả về Promise<ActionResult> thay vì void
  createCategory: (
    name: string,
    parentId?: string | null
  ) => Promise<ActionResult>;
  updateCategory: (id: string, name: string) => Promise<ActionResult>;
  deleteCategory: (id: string) => Promise<ActionResult>;

  refreshCategories: () => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

// --- Update tree helper ---
const updateTreeData = (
  nodes: TreeNode[],
  parentId: string,
  newChildren: TreeNode[]
): TreeNode[] =>
  nodes.map((node) => {
    if (node.id === parentId) {
      return { ...node, children: newChildren, isLoaded: true };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, parentId, newChildren),
      };
    }
    return node;
  });

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { token } = useAdmin();
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  /** 1. Fetch Root Categories */
  const fetchRootCategories = useCallback(async () => {
    try {
      setIsInitialLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/categories?parents`
      );
      const data = (await res.json()).data;

      setTreeData(
        data.map((item: any) => ({
          id: item.id || item._id,
          name: item.name,
          type: "category",
          children: [],
          isLoaded: false,
        }))
      );
    } catch (error) {
      console.error("Fetch roots error:", error);
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  /** 2. Load Children */
  const loadChildren = useCallback(async (parentNode: TreeNode) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/categories?parents=${
          parentNode.id
        }`
      );
      const sub = (await res.json()).data;

      let finalChildren: TreeNode[] = [];

      if (sub.length > 0) {
        finalChildren = sub.map((item: any) => ({
          id: item.id || item._id,
          name: item.name,
          type: "subcategory",
          children: [],
          isLoaded: false,
        }));
      } else {
        const prodRes = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/product?categoryId=${
            parentNode.id
          }&limit=100`
        );
        const prod = await prodRes.json();

        finalChildren = (prod.data?.data || prod.data || []).map((p: any) => ({
          id: p.id || p._id,
          name: p.title || p.name,
          type: "product",
          children: [],
          isLoaded: true,
        }));
      }

      setTreeData((prev) => updateTreeData(prev, parentNode.id, finalChildren));
    } catch {
      setTreeData((prev) => updateTreeData(prev, parentNode.id, []));
    }
  }, []);

  /** 3. Create Category */
  const createCategory = async (
    name: string,
    parentId: string | null = null
  ): Promise<ActionResult> => {
    if (!token) return { success: false, message: "Unauthorized" };
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, parentId }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        await fetchRootCategories();
        return { success: true, message: "Tạo danh mục thành công" };
      }
      return { success: false, message: data.message || "Tạo thất bại" };
    } catch (err) {
      return { success: false, message: "Lỗi kết nối server" };
    }
  };

  /** 4. Update Category */
  const updateCategory = async (
    id: string,
    name: string
  ): Promise<ActionResult> => {
    if (!token) return { success: false, message: "Unauthorized" };
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/categories/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        await fetchRootCategories();
        return { success: true, message: "Cập nhật thành công" };
      }
      return { success: false, message: data.message || "Cập nhật thất bại" };
    } catch (err) {
      return { success: false, message: "Lỗi kết nối server" };
    }
  };

  /** 5. Delete Category */
  const deleteCategory = async (id: string): Promise<ActionResult> => {
    if (!token) return { success: false, message: "Unauthorized" };
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/categories/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        await fetchRootCategories();
        return { success: true, message: "Xóa thành công" };
      } else
        return {
          success: false,
          message: data.message || data.error || "Xóa thất bại",
        };
    } catch (err) {
      return { success: false, message: "Lỗi kết nối server" };
    }
  };

  useEffect(() => {
    fetchRootCategories();
  }, [fetchRootCategories]);

  return (
    <CategoryContext.Provider
      value={{
        treeData,
        isInitialLoading,
        loadChildren,
        createCategory,
        updateCategory,
        deleteCategory,
        refreshCategories: fetchRootCategories,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const ctx = useContext(CategoryContext);
  if (!ctx) throw new Error("useCategories must be inside CategoryProvider");
  return ctx;
};
