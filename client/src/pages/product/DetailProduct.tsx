import { useParams } from 'react-router-dom';
import Footer from '../../components/footer';
import Header from '../../components/header';
import Detail from '../../components/product/detail';
import { useEffect, useState } from 'react';
import type { Product } from '../../libs/types/types';
import { getProduct } from '../../api/product';
import { getSession } from '../../libs/session';

const DetailProduct = () => {
  const { id } = useParams();
  const [token, setToken] = useState('');

  const [product, setProduct] = useState<Product | undefined>(undefined);

  const fetchProduct = async () => {
    try {
      if (!id) return;
      const data = await getProduct(id);
      setProduct(data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    const getToken = async () => {
      const session = await getSession();
      setToken(typeof session?.token === 'string' ? session.token : '');
    };
    fetchProduct();
    getToken();
  }, []);

  if (!product) return <div className='loader' />;
  return (
    <>
      <Header />
      <Detail product={product} token={token} onRefresh={fetchProduct} />
      <Footer />
    </>
  );
};

export default DetailProduct;
