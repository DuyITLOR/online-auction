// context/ProductContext.tsx
import { createContext, type ReactNode, useEffect, useState, useContext } from 'react';
import type { Product, WatchList } from '../types/types';
import { getAllProduct } from '../../api/product';
import { getAllWatchList, createWatchList, deleteWatchList } from '../../api/watchlist';

// 1. Định nghĩa kiểu dữ liệu cho Context
type ProductContextType = {
  endingSoonProducts: Product[];
  highestPriceProducts: Product[];
  watchList: WatchList[]; // Danh sách các sản phẩm đã like
  loading: boolean;
  toggleWatchList: (productId: string) => Promise<void>; // Hàm bật/tắt like
};

// 2. Tạo Context với giá trị mặc định
// eslint-disable-next-line react-refresh/only-export-components
export const ProductContext = createContext<ProductContextType>({
  endingSoonProducts: [],
  highestPriceProducts: [],
  watchList: [],
  loading: true,
  toggleWatchList: async () => {},
});

// Helper để lấy token (Giả lập getSession hoặc lấy từ localStorage)
const getToken = () => {
  // Thay thế dòng này bằng logic lấy token thực tế của bạn
  // Ví dụ: return localStorage.getItem('access_token') || '';
  // Hoặc nếu dùng session hook, bạn cần truyền token từ component cha vào Provider
  return localStorage.getItem('accessToken') || ''; 
};

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [endingSoonProducts, setEndingProducts] = useState<Product[]>([]);
  const [highestPriceProducts, setPriceProducts] = useState<Product[]>([]);
  const [watchList, setWatchList] = useState<WatchList[]>([]); // Sửa tên state cho khớp
  const [loading, setLoading] = useState(true);

  // Hàm load dữ liệu
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = getToken(); // Lấy token

      // Gọi song song các API không cần token
      const [endings, prices] = await Promise.all([
        getAllProduct(1, '10', '', 'endAt_desc'),
        getAllProduct(1, '10', '', 'price_desc'),
      ]);
      
      setEndingProducts(endings.data);
      setPriceProducts(prices.data);

      // Chỉ gọi Watchlist nếu có token (đã đăng nhập)
      if (token) {
        const watchs = await getAllWatchList({ token });
        // Giả sử API trả về mảng object, trong đó có productId
        setWatchList(watchs); 
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 3. Logic Bật/Tắt Like (Quan trọng)
  const handleToggleWatchList = async (productId: string) => {
    const token = getToken();
    if (!token) {
      alert("Vui lòng đăng nhập để sử dụng tính năng này!");
      return;
    }

    // Kiểm tra xem sản phẩm này đã có trong watchlist chưa
    const existingItem = watchList.find((item) => item.productId === productId);

    try {
      if (existingItem) {
        // --- TRƯỜNG HỢP UNLIKE (XÓA) ---
        // 1. Cập nhật UI ngay lập tức (Optimistic Update) cho mượt
        setWatchList((prev) => prev.filter((item) => item.productId !== productId));
        
        // 2. Gọi API xóa
        await deleteWatchList({ productId, token });
      } else {
        // --- TRƯỜNG HỢP LIKE (THÊM) ---
        // 1. Gọi API thêm trước để lấy data chính xác (hoặc fake data tạm thời)
        const newItem = await createWatchList({ productId, token });
        
        // 2. Cập nhật state
        setWatchList((prev) => [...prev, newItem]); 
      }
    } catch (error) {
      console.error("Lỗi khi toggle watchlist:", error);
      // Nếu lỗi, nên load lại data để đồng bộ UI
      fetchData(); 
    }
  };

  return (
    // Đừng quên truyền watchList và toggleWatchList vào value
    <ProductContext.Provider 
      value={{ 
        endingSoonProducts, 
        highestPriceProducts, 
        watchList, 
        loading, 
        toggleWatchList: handleToggleWatchList 
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};