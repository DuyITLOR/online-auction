import PaymentHeader from "../../components/payment/PaymentHeader";
import PaymentProcess from "../../components/payment/PaymentProcess";
import PaymentQR from "../../components/payment/PaymentQR";
import PaymentBuyer from "../../components/payment/PaymentBuyer";
import PaymentShipping from "../../components/payment/PaymentShipping";
import PaymentReceive from "../../components/payment/PaymentReceive";
import PaymentRating from "../../components/payment/PaymentRating";
import PaymentComplete from "../../components/payment/PaymentComplete";
import PaymentCancle from "../../components/payment/PaymentCancle";
import PaymnentFinalCancle from "../../components/payment/PaymnentFinalCancle";
import ChatBox from "../../components/chat/ChatBox";
import { type Orders } from "../../libs/types/types";
import { ORDER_STATUS_TO_STEP } from "../../libs/contants/orderStep";
import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { getSession } from "../../libs/session";
import { getOrderInfo } from "../../api/order";
import { MessageSquareMore } from "lucide-react";

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
  {
    numberOrder: 6,
    title: "Hoàn tất",
    description: "Giao dịch hoàn tất",
    complete: false,
  },
]

export interface chatInfoDto {
  id: string;
  productName: string;
  productId: string;
  avtUrl: string;
  name: string;
}

const PaymentPage = () => {
  const [order, setOrder] = useState<Orders | undefined>(undefined);
  const { id } = useParams(); // orderId
  const [loading, setIsLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [isOpenChat, setIsOpenChat] = useState(false);

  const handleOpenChat = () => {
    setIsOpenChat(!isOpenChat);
  };

  const fetchOrder = useCallback(async () => {
    try {
      if (!id) return;
      const session = await getSession();
      const token = typeof session?.token === "string" ? session.token : "";

      const orderData: Orders = await getOrderInfo(id, token);
      // console.log("Lấy được orderData:", orderData);
      // console.log("Dữ liệu của order", orderData);
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
  }, [fetchOrder]);


  const chatInfor: chatInfoDto = {
    id: order?.id || "",
    productId: order?.productId || "",
    productName: order?.product.title || "",
    name: order?.role === "SELLER" ? order?.buyer.fullname || "Người mua" : order?.seller.fullname || "Người bán",
    avtUrl: order?.role === "SELLER" ? order?.buyer.avtUrl || "" : order?.seller.avtUrl || "",
  }

  const computedSteps = paymentSteps.map((s) => 
    {
      if (s.numberOrder === 6) {
        return {
          ...s,
          title: order?.status === "CANCELLED" ? "Hủy giao dịch" : s.title,
          description: order?.status === "CANCELLED" ? "Giao dịch bị hủy" : s.description,
          complete: s.numberOrder < step,
        }
      }
      return { ...s, complete: s.numberOrder < step }
    });

  if (loading) return <div className="loader" />;
  if (!order) return <div>Không tìm thấy đơn hàng</div>;
  return (
    <div className="gap-2 flex flex-col">
      <PaymentHeader
        title={order.product.title}
        price={Number(order.totalAmount)}
        seller={order.seller.fullname || "Người bán"}
        bidder={order.buyer.fullname || "Người mua"}
        userRole={order.role || "BIDDER"}
      />
      <div className="sm:mx-50 sm:mt-3 flex flex-col gap-2">
        <PaymentProcess steps={computedSteps} />
        {step === 1 && (
          <PaymentQR
            userRole={order.role || "BIDDER"}
            onComplete={fetchOrder}
          />
        )}
        {step === 2 && (
          <PaymentBuyer
            userRole={order.role || "BIDDER"}
            onComplete={fetchOrder}
            order={order}
          />
        )}
        {step === 3 && (
          <PaymentShipping
            userRole={order.role || "BIDDER"}
            onComplete={fetchOrder}
            order={order}
          />
        )}
        {step === 4 && (
          <PaymentReceive
            userRole={order.role || "BIDDER"}
            onComplete={fetchOrder}
            order={order}
          />
        )}
        {step === 5 && (
          <PaymentRating
            userRole={order.role || "BIDDER"}
            onComplete={fetchOrder}
            order={order}
          />
        )}

        {step === 6 && order.status === "COMPLETED" && (
          <PaymentComplete />
        )}


        {step === 6 && order.status === "CANCELLED" && order.role === "BIDDER" && (
          <PaymnentFinalCancle
            reason={order.cancelReason || "Không có lý do"}
          />
        )}

        {step === 6 && order.status === "CANCELLED" && order.role === "SELLER" && (
          <PaymentRating
            userRole={order.role || "BIDDER"}
            onComplete={fetchOrder}
            order={order}
          />
        )}

        {order.role === "SELLER" && step < 5 && step > 0 && (
          <PaymentCancle order={order} onComplete={fetchOrder} />
        )}
      </div>

      <button
        onClick={handleOpenChat}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-lg hover:bg-teal-600 z-50"
      >
        <MessageSquareMore />
      </button>

      {isOpenChat &&
        <div className="fixed bottom-20 right-12 w-[400px] h-[500px] bg-white rounded-2xl shadow-xl z-50">
          <ChatBox chatInfor={chatInfor} hideBack />
        </div>
      }
    </div>
  );
};

export default PaymentPage;
