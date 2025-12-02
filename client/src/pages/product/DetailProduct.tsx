import { useParams } from 'react-router-dom';
import Footer from '../../components/footer';
import Header from '../../components/header';
import Detail from '../../components/product/detail';
import { useEffect, useState } from 'react';
import { type BidHistory, type Product } from '../../libs/types/types';
import { getProduct } from '../../api/product';
import { getSession } from '../../libs/session';
import { getHistoryBid } from '../../api/historyBid';

const DetailProduct = () => {
  const { id } = useParams();
  const [token, setToken] = useState('');

  const [product, setProduct] = useState<Product | undefined>(undefined);

  const [historyBid, setHistoryBid] = useState<BidHistory[]>([]);

  const fetchProduct = async () => {
    try {
      if (!id) return;
      const data = await getProduct(id);
      setProduct(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistoryBid = async (accessToken: string) => {
    try {
      if (!id) return;
      const data = await getHistoryBid({ productId: id, token: accessToken, desc: true });
      setHistoryBid(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFetch = async () => {
    await fetchHistoryBid(token);
    await fetchProduct();
  };

  useEffect(() => {
    const getToken = async () => {
      const session = await getSession();
      setToken(typeof session?.token === 'string' ? session.token : '');
    };
    getToken();
    fetchProduct();
    fetchHistoryBid(token);
  }, [token]);

  if (!product) return <div className='loader' />;
  return (
    <>
      <Header />
      <Detail product={product} historyBid={historyBid} token={token} onRefresh={handleFetch} />
      <Footer />
    </>
  );
};

export default DetailProduct;
