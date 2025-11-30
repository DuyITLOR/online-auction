import { useParams } from 'react-router-dom';
import Footer from '../../components/footer';
import Header from '../../components/header';
import Detail from '../../components/product/detail';
import { useEffect, useState } from 'react';
import type { Product } from '../../libs/types/types';
import { getProduct } from '../../api/product';

const DetailProduct = () => {
  const { id } = useParams();

  const [product, setProduct] = useState<Product | undefined>(undefined);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        const data = await getProduct(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, []);

  if (!product) return <div className='loader' />;
  return (
    <>
      <Header />
      <Detail product={product} />
      <Footer />
    </>
  );
};

export default DetailProduct;
