import { createContext, type ReactNode, useEffect, useState } from 'react';
import type { Product, WatchList } from '../types/types';
import { getAllProduct } from '../../api/product';
import { createWatchList, deleteWatchList, getAllWatchList } from '../../api/watchlist';
import { getSession } from '../session';

type ProductContextType = {
  endingSoonProducts: Product[];
  highestPriceProducts: Product[];
  watchList: WatchList[];
  loading: boolean;
  toggleWatchList: (productId: string) => Promise<void>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const ProductContext = createContext<ProductContextType>({
  endingSoonProducts: [],
  highestPriceProducts: [],
  watchList: [],
  loading: true,
  toggleWatchList: async () => {},
});

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [endingSoonProducts, setEndingProducts] = useState<Product[]>([]);
  const [highestPriceProducts, setPriceProducts] = useState<Product[]>([]);
  const [watchProducts, setWatchProducts] = useState<WatchList[]>([]);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPublicProducts = async () => {
    try {
      const [endings, prices] = await Promise.all([
        getAllProduct({ limit: '10', sort: 'endAt_desc' }),
        getAllProduct({ limit: '10', sort: 'price_desc' }),
      ]);
      setEndingProducts(endings.data);
      setPriceProducts(prices.data);
    } catch (err) {
      console.error('Lỗi fetch sản phẩm:', err);
    }
  };

  const fetchWatchList = async (currentToken: string) => {
    if (!currentToken) return;
    try {
      const watchs = await getAllWatchList({ token: currentToken });
      setWatchProducts(watchs);
    } catch (err) {
      console.error('Lỗi fetch watchlist:', err);
    }
  };

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        const session = await getSession();
        const currentToken = typeof session?.token === 'string' ? session.token : '';

        setToken(currentToken);

        await Promise.all([fetchPublicProducts(), fetchWatchList(currentToken)]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  const handleToggleWatchList = async (productId: string) => {
    if (!token) {
      alert('Vui lòng đăng nhập để sử dụng tính năng này!');
      return;
    }

    const existingItem = watchProducts.find((item: WatchList) => item.productId === productId);

    try {
      if (existingItem) {
        setWatchProducts((prev: WatchList[]) => prev.filter((item) => item.productId !== productId));
        await deleteWatchList({ productId, token });
      } else {
        const newItem = await createWatchList({ productId, token });
        const products = [...endingSoonProducts, ...highestPriceProducts];
        const productDetail = products.find((item: Product) => productId === item.id);

        const newProduct: WatchList = {
          ...newItem,
          productId,
          product: productDetail,
        };

        setWatchProducts((prev) => [...prev, newProduct]);
      }
    } catch (error) {
      console.error('Lỗi khi toggle watchlist:', error);
      fetchWatchList(token);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        endingSoonProducts,
        highestPriceProducts,
        watchList: watchProducts,
        toggleWatchList: handleToggleWatchList,
        loading,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
