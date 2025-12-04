import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

import { getSession } from "../session";

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

interface CategoryContextType {
  treeData: TreeNode[];
  isInitialLoading: boolean;
  loadChildren: (node: TreeNode) => Promise<void>;
  createCategory: (name: string, parentId?: string | null) => Promise<void>;
  updateCategory: (id: string, name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  refreshCategories: () => void;

  // --- Response Dialog ---
  responseData: { success: boolean; message: string } | null;
  showResponseModal: boolean;
  setShowResponseModal: (value: boolean) => void;
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
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // --- Response Dialog States ---
  const [responseData, setResponseData] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const [showResponseModal, setShowResponseModal] = useState(false);

  const [session, setSession] = useState<{ token: string } | null>(null);

  const fetchSession = async () => {
    const sess = await getSession();
    setSession(sess);
  };
  /** 1. Fetch Root Categories */
  const fetchRootCategories = useCallback(async () => {
    try {
      setIsInitialLoading(true);
      const res = await fetch("http://localhost:4000/categories?parents");
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
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  /** 2. Load Children */
  const loadChildren = useCallback(async (parentNode: TreeNode) => {
    try {
      const res = await fetch(
        `http://localhost:4000/categories?parents=${parentNode.id}`
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
          `http://localhost:4000/product?categoryId=${parentNode.id}&limit=100`
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
  ) => {
    console.log("token", session?.token);
    const res = await fetch("http://localhost:4000/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${(await getSession())?.token}`,
      },
      body: JSON.stringify({ name, parentId }),
    });

    const data = await res.json();
    setResponseData(data);

    if (!res.ok) throw new Error("Create failed");
    await fetchRootCategories();
  };

  /** 4. Update Category */
  const updateCategory = async (id: string, name: string) => {
    const res = await fetch(`http://localhost:4000/categories/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${(await getSession())?.token}`,
      },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();
    setResponseData(data);

    if (!res.ok) throw new Error("Update failed");
    await fetchRootCategories();
  };

  /** 5. Delete Category */
  const deleteCategory = async (id: string) => {
    const res = await fetch(`http://localhost:4000/categories/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${(await getSession())?.token}`,
      },
    });

    const data = await res.json();
    setResponseData(data);

    if (!res.ok) throw new Error("Delete failed");
    await fetchRootCategories();
  };

  useEffect(() => {
    fetchSession();
  }, []);

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

        // Response
        responseData,
        showResponseModal,
        setShowResponseModal,
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
