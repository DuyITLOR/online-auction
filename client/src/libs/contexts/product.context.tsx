/* eslint-disable @typescript-eslint/no-unused-expressions */
import { createContext, type ReactNode, useEffect, useState } from 'react';
import type { Product, WatchList } from '../types/types';
import { getAllProduct } from '../../api/product';
import { createWatchList, deleteWatchList, getAllWatchLists } from '../../api/watchlist';
import { getSession } from '../session';

type ProductContextType = {
  endingSoonProducts: Product[];
  highestPriceProducts: Product[];
  highestBidProducts: Product[];
  watchList: WatchList[];
  loading: boolean;
  toggleWatchList: (productId: string) => Promise<void>;
  refresh: () => Promise<void>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const ProductContext = createContext<ProductContextType>({
  endingSoonProducts: [],
  highestPriceProducts: [],
  highestBidProducts: [],
  watchList: [],
  loading: true,
  toggleWatchList: async () => {},
  refresh: async () => {},
});

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [endingSoonProducts, setEndingProducts] = useState<Product[]>([]);
  const [highestPriceProducts, setPriceProducts] = useState<Product[]>([]);
  const [highestBidProducts, setBidProducts] = useState<Product[]>([]);
  const [watchProducts, setWatchProducts] = useState<WatchList[]>([]);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPublicProducts = async () => {
    try {
      const [endings, prices, bidTimes] = await Promise.all([
        getAllProduct({ limit: '5', sort: 'ending_soon', isBidder: 'true' }),
        getAllProduct({ limit: '5', sort: 'price_desc', isBidder: 'true' }),
        getAllProduct({ limit: '5', sort: 'countBids_desc', isBidder: 'true' }),
        getAllProduct({}),
      ]);
      setEndingProducts(endings.data);
      setPriceProducts(prices.data);
      setBidProducts(bidTimes.data);
    } catch (err) {
      console.error('Lỗi fetch sản phẩm:', err);
    }
  };

  const fetchWatchList = async (currentToken: string) => {
    if (currentToken === '') return;
    try {
      const watchs = await getAllWatchLists({ token: currentToken });
      setWatchSet(new Set(watchs.data.map((w: WatchList) => w.productId)));
      setWatchProducts(watchs.data);
    } catch (err) {
      console.error('Lỗi fetch watchlist:', err);
    }
  };

  const [watchSet, setWatchSet] = useState<Set<string>>(new Set());

  const getData = async () => {
    setLoading(true);
    try {
      const session = await getSession();
      const currentToken = typeof session?.token === 'string' ? session.token : '';

      console.log(currentToken);

      setToken(currentToken);

      await Promise.all([fetchPublicProducts(), fetchWatchList(currentToken)]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  const handleToggleWatchList = async (productId: string) => {
    if (!token) return;

    setWatchSet((prev) => {
      const next = new Set(prev);
      next.has(productId) ? next.delete(productId) : next.add(productId);
      return next;
    });

    try {
      if (watchSet.has(productId)) {
        await deleteWatchList({ productId, token });
        setWatchProducts((prev: WatchList[]) => prev.filter((item) => item.productId !== productId));
      } else {
        const newItem = await createWatchList({ productId, token });
        const products = [...endingSoonProducts, ...highestPriceProducts, ...highestBidProducts];
        const productDetail = products.find((item: Product) => productId === item.id);

        const newProduct: WatchList = {
          ...newItem,
          productId,
          product: productDetail,
        };

        setWatchProducts((prev) => [...prev, newProduct]);
      }
    } catch {
      fetchWatchList(token);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        endingSoonProducts,
        highestPriceProducts,
        highestBidProducts,
        watchList: watchProducts,
        toggleWatchList: handleToggleWatchList,
        loading,
        refresh: () => getData(),
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
