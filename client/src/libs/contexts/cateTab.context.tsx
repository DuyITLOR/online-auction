import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

import { getSession } from "../session";
// --- 1. Types ---
export type NodeType = "category" | "subcategory" | "product";

export interface TreeNode {
  id: string;
  name: string;
  type: NodeType;
  icon?: any;
  children?: TreeNode[];
  isLoaded?: boolean;
}

interface CategoryContextType {
  treeData: TreeNode[];
  isInitialLoading: boolean;
  loadChildren: (node: TreeNode) => Promise<void>;
  createCategory: (name: string, parentId?: string | null) => Promise<void>;
  updateCategory: (id: string, name: string) => Promise<void>; // <-- Mới thêm
  deleteCategory: (id: string) => Promise<void>; // <-- Bỏ tham số name, bỏ window.confirm
  refreshCategories: () => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

const session = await getSession();

// Helper đệ quy cập nhật cây
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

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // 1. Fetch Root Categories
  const fetchRootCategories = useCallback(async () => {
    try {
      setIsInitialLoading(true);
      const res = await fetch("http://localhost:4000/categories?parents");
      const data = (await res.json()).data;

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
  }, []);

  // 2. Load Children
  const loadChildren = useCallback(async (parentNode: TreeNode) => {
    try {
      const res = await fetch(
        `http://localhost:4000/categories?parents=${parentNode.id}`
      );
      const subCategoriesData = (await res.json()).data;
      let finalChildren: TreeNode[] = [];

      if (Array.isArray(subCategoriesData) && subCategoriesData.length > 0) {
        finalChildren = subCategoriesData.map((item: any) => ({
          id: item.id || item._id,
          name: item.name,
          type: "subcategory",
          children: [],
          isLoaded: false,
        }));
      } else if (
        parentNode.type === "subcategory" ||
        finalChildren.length === 0
      ) {
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

  // 3. Create Category
  const createCategory = async (
    name: string,
    parentId: string | null = null
  ) => {
    const res = await fetch("http://localhost:4000/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
      body: JSON.stringify({ name, parentId }),
    });

    if (!res.ok) throw new Error("Failed to create");
    await fetchRootCategories();
  };

  // 4. Update Category (Mới)
  const updateCategory = async (id: string, name: string) => {
    const res = await fetch(`http://localhost:4000/categories/${id}`, {
      method: "PATCH", // Hoặc PUT tùy API của bạn
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) throw new Error("Failed to update");
    await fetchRootCategories();
  };

  // 5. Delete Category
  const deleteCategory = async (id: string) => {
    console.log("Attempting to delete node:", id);
    const res = await fetch(`http://localhost:4000/categories/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to delete");
    await fetchRootCategories();
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
        updateCategory, // Export hàm mới
        deleteCategory,
        refreshCategories: fetchRootCategories,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
};
