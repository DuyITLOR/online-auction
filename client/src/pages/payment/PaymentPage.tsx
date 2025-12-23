import PaymentHeader from '../../components/payment/PaymentHeader'
import PaymentProcess from '../../components/payment/PaymentProcess'
import PaymentQR from '../../components/payment/PaymentQR'
import { type Product, type User } from '../../libs/types/types';

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProduct } from '../../api/product';
import { getSession } from '../../libs/session';
import { getRole } from '../../api/user';

const paymentSteps = [
  {
    numberOrder: 1,
    title: "Mã QR",
    description: "Người bán cấp mã QR",
    complete: true,
  },
  {
    numberOrder: 2,
    title: "Thanh toán",
    description: "Người mua quét mã QR",
    complete: true,
  },
  {
    numberOrder: 3,
    title: "Vận chuyển",
    description: "Người bán gửi hàng",
    complete: false,
  },
  {
    numberOrder: 4,
    title: "Nhận hàng",
    description: "Người mua xác nhận",
    complete: false,
  },
  {
    numberOrder: 5,
    title: "Đánh giá",
    description: "Cả hai đánh giá",
    complete: false,
  },
];



const PaymentPage = () => {
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [user, setUser] = useState<User | undefined>(undefined);
  const { id } = useParams();
  const [loading, setIsLoading] = useState(true);


  useEffect(() => {
    setIsLoading(true);
    const init = async () => {
      if (!id) return;

      try {
        const session = await getSession();
        const token = typeof session?.token === 'string' ? session.token : '';

        const [productData, userData] = await Promise.all([
          getProduct(id),
          getRole({ token }),
        ])
        setProduct(productData);
        setUser(userData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, [id])

  if (loading) return <div className='loader' />;
  if (!product) return <div>Không tìm thấy sản phẩm</div>;
  return (
    <div className='gap-2 flex flex-col'>
      <PaymentHeader title={product.title} price={Number(product?.currentPrice)} seller={product?.seller.fullname || "Người bán"} bidder={user?.fullname || "Người mua"} userRole ={user?.role || "BIDDER"} />
      <div className="sm:mx-30 sm: mt-3 flex flex-col  gap-2">
        <PaymentProcess steps={paymentSteps} />
        <PaymentQR userRole={user?.role || "BIDDER"} onComplete={() => { }} />
      </div>

    </div>
  )
}

export default PaymentPage