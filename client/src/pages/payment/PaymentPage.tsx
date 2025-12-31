import PaymentHeader from '../../components/payment/PaymentHeader'
import PaymentProcess from '../../components/payment/PaymentProcess'
import PaymentQR from '../../components/payment/PaymentQR'
import PaymentBuyer from '../../components/payment/PaymentBuyer'
import PaymentShipping from '../../components/payment/PaymentShipping'
import PaymentReceive from '../../components/payment/PaymentReceive'
import PaymentRating from '../../components/payment/PaymentRating'
import { type Orders } from '../../libs/types/types';
import { ORDER_STATUS_TO_STEP } from '../../libs/contants/orderStep';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { getSession } from '../../libs/session';
import { getOrderInfo } from '../../api/order';

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
  const [order, setOrder] = useState<Orders | undefined>(undefined);
  const { id } = useParams(); // orderId
  const [loading, setIsLoading] = useState(true);
  const [step, setStep] = useState(1);

  const fetchOrder = useCallback(async () => {
    try {
      if (!id) return;
      const session = await getSession();
      const token = typeof session?.token === 'string' ? session.token : '';

      const orderData: Orders = await getOrderInfo(id, token);
      console.log("Dữ liệu của order", orderData);
      const step = ORDER_STATUS_TO_STEP[orderData.status];
      setOrder(orderData);
      setStep(step);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin đơn hàng:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);


  useEffect(() => {
    setIsLoading(true);
    fetchOrder();
  }, [fetchOrder])



  const computedSteps = paymentSteps.map((s) => ({
    ...s,
    complete: s.numberOrder < step,
  }));

  if (loading) return <div className='loader' />;
  if (!order) return <div>Không tìm thấy đơn hàng</div>;
  return (
    <div className='gap-2 flex flex-col'>
      <PaymentHeader title={order.product.title} price={Number(order.totalAmount)} seller={order.seller.fullname || "Người bán"} bidder={order.buyer.fullname || "Người mua"} userRole={order.role || "BIDDER"} />
      <div className="sm:mx-60 sm: mt-3 flex flex-col  gap-2">
        <PaymentProcess steps={computedSteps} />
        {
          (step === 1) && (<PaymentQR userRole={order.role || "BIDDER"} onComplete={fetchOrder} />)
        }
        {
          (step === 2) && (<PaymentBuyer userRole={order.role || "BIDDER"} onComplete={fetchOrder} order={order} />)
        }
        {
          (step === 3) && (<PaymentShipping userRole={order.role || "BIDDER"} onComplete={fetchOrder} />)
        }
        {
          (step === 4) && (<PaymentReceive userRole={order.role || "BIDDER"} onComplete={fetchOrder} />)
        }
        {
          (step === 5) && (<PaymentRating userRole={order?.role || "BIDDER"} otherPartyName={order.role === "BIDDER" ? order.seller.fullname || "Người bán" : order.buyer.fullname || "Người mua"} onComplete={() => { }} />)
        }
      </div>

    </div>
  )
}

export default PaymentPage