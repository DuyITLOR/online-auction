import PaymentHeader from '../../components/payment/PaymentHeader'
import PaymentProcess from '../../components/payment/PaymentProcess'

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
  return (
    <div className='gap-2 flex flex-col'>
      <PaymentHeader title="Le Nhut Duy" price={1000000} seller="Seller Name" bidder="Bidder Name" userRole="buyer" />
      <div className = "sm:mx-24 sm: mt-3 ">
        <PaymentProcess steps={paymentSteps} />
      </div>
    </div>
  )
}

export default PaymentPage