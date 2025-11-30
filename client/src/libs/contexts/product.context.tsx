import { createContext, type ReactNode, useEffect, useState } from 'react';
import type { Product } from '../types/types';
import { getAllProduct } from '../../api/product';

type ProductContextType = {
  endingSoonProducts: Product[];
  highestPriceProducts: Product[];
  loading: boolean;
};

// eslint-disable-next-line react-refresh/only-export-components
export const ProductContext = createContext<ProductContextType>({
  endingSoonProducts: [],
  highestPriceProducts: [],
  loading: true,
});

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [endingSoonProducts, setEndingProducts] = useState<Product[]>([]);
  const [highestPriceProducts, setPriceProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const endings = await getAllProduct(1, '10', '', 'endAt_desc');
        const prices = await getAllProduct(1, '10', '', 'price_desc');
        setEndingProducts(endings.data);
        setPriceProducts(prices.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ endingSoonProducts, highestPriceProducts, loading }}>
      {children}
    </ProductContext.Provider>
  );
};
