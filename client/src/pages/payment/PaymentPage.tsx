import React from 'react'
import PaymentHeader from '../../components/payment/PaymentHeader'

const PaymentPage = () => {
  return (
    <div>
      <PaymentHeader title = "Le Nhut Duy" price={1000000} seller="Seller Name" bidder="Bidder Name" userRole="buyer"></PaymentHeader>
    </div>
  )
}

export default PaymentPage