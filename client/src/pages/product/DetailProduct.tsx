import { useParams } from 'react-router-dom';
import Footer from '../../components/footer';
import Header from '../../components/header';
import Detail from '../../components/product/detail';
import { useEffect, useState, useCallback } from 'react';
import { type User, type BidHistory, type Product } from '../../libs/types/types';
import { getProduct } from '../../api/product';
import { getSession } from '../../libs/session';
import { getHistoryBid } from '../../api/historyBid';
import { getRole } from '../../api/user';

const DetailProduct = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState('');
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [historyBid, setHistoryBid] = useState<BidHistory[]>([]);
  const [user, setUser] = useState<User | undefined>(undefined);

  const fetchData = useCallback(async (currentId: string, accessToken: string) => {
    try {
      const [productData, historyData] = await Promise.all([
        getProduct(currentId),
        getHistoryBid({ productId: currentId, token: accessToken, desc: true }),
      ]);

      setProduct(productData);
      setHistoryBid(historyData);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }, []);

  const fetchUser = useCallback(async (accessToken: string) => {
    try {
      const userData = await getRole({ token: accessToken });
      setUser(userData);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      if (!id) return;

      setIsLoading(true);
      setProduct(undefined);

      try {
        const session = await getSession();
        const accessToken = typeof session?.token === 'string' ? session.token : '';
        setToken(accessToken);

        await fetchData(id, accessToken);
        await fetchUser(accessToken);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [id, fetchData]);

  const handleRefresh = async () => {
    if (id) {
      await fetchData(id, token);
      await fetchUser(token);
    }
  };

  if (isLoading || !user) return <div className='loader' />;
  if (!product) return <div>Không tìm thấy sản phẩm</div>;

  return (
    <>
      <Header />
      <Detail product={product} historyBid={historyBid} token={token} onRefresh={handleRefresh} user={user} />
      <Footer />
    </>
  );
};

export default DetailProduct;
