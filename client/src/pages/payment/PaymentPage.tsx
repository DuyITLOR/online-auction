import PaymentHeader from '../../components/payment/PaymentHeader'
import PaymentProcess from '../../components/payment/PaymentProcess'
import PaymentQR from '../../components/payment/PaymentQR'
import PaymentBuyer from '../../components/payment/PaymentBuyer'
import PaymentShipping from '../../components/payment/PaymentShipping'
import PaymentReceive from '../../components/payment/PaymentReceive'
import PaymentRating from '../../components/payment/PaymentRating'

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
    complete: false,
  },
  {
    numberOrder: 2,
    title: "Thanh toán",
    description: "Người mua quét mã QR",
    complete: false,
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
  const [step, setStep] = useState(5);


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

        console.log('Role: ', userData)
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

  const computedSteps = paymentSteps.map((s) => ({
    ...s,
    complete: s.numberOrder < step,
  }));

  if (loading) return <div className='loader' />;
  if (!product) return <div>Không tìm thấy sản phẩm</div>;
  return (
    <div className='gap-2 flex flex-col'>
      <PaymentHeader title={product.title} price={Number(product?.currentPrice)} seller={product?.seller.fullname || "Người bán"} bidder={user?.fullname || "Người mua"} userRole={user?.role || "BIDDER"} />
      <div className="sm:mx-60 sm: mt-3 flex flex-col  gap-2">
        <PaymentProcess steps={computedSteps} />
        {
          (step === 1) && (<PaymentQR userRole={user?.role || "BIDDER"} onComplete={() => { }} />)   
        } 
        {
          (step === 2) && (<PaymentBuyer userRole={user?.role || "BIDDER"} onComplete={() => { }} />)
        }
        {
          (step === 3) && (<PaymentShipping userRole={user?.role || "BIDDER"} onComplete={() => { }} />)
        }
        {
          (step === 4) && (<PaymentReceive userRole={user?.role || "BIDDER"} onComplete={() => { }} />)
        }
        {
          (step === 5) && (<PaymentRating userRole={user?.role || "BIDDER"} otherPartyName={user?.role === "BIDDER" ? product.seller.fullname || "Người bán" : user?.fullname || "Người mua"} onComplete={() => { }} />)
        }
      </div>

    </div>
  )
}

export default PaymentPage