import React from 'react'
import PaymentHeader from '../../components/payment/PaymentHeader'
import PaymentProcess from '../../components/payment/PaymentProcess'

const paymentSteps = [
  {
    numberOrder: 1,
    title: "Thanh toán",
    description: "Người mua thanh toán",
    complete: true,
  },
  {
    numberOrder: 2,
    title: "Xác nhận đơn hàng",
    description: "Người bán xác nhận hóa đơn và vận chuyển",
    complete: true,
  },
  {
    numberOrder: 3,
    title: "Nhận hàng",
    description: "Người mua xác nhận đã nhận hàng",
    complete: true,
  },
  {
    numberOrder: 4,
    title: "Đánh giá",
    description: "Người bán và người mua đánh giá",
    complete: true,
  },
];


const PaymentPage = () => {
  return (
    <div className='gap-2 flex flex-col'>
      <PaymentHeader title = "Le Nhut Duy" price={1000000} seller="Seller Name" bidder="Bidder Name" userRole="buyer"/>
      <PaymentProcess steps = {paymentSteps} />
    </div>
  )
}

export default PaymentPage