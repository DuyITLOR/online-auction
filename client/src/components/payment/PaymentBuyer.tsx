import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, MapPin, Phone, QrCode, CheckCircle2 } from "lucide-react"
import { type Orders } from '../../libs/types/types';
import { formatCurrency } from "../../utils/format";
interface StepPaymentProps {
    userRole: "ADMIN" | "SELLER" | "BIDDER";
    onComplete: () => void;
    order: Orders;
}

const PaymentBuyer = ({ userRole, onComplete, order }: StepPaymentProps) => {
    const [paymentProof, setPaymentProof] = useState<File | null>(null)
    const [address, setAddress] = useState("")
    const [phone, setPhone] = useState("")

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setPaymentProof(e.target.files[0])
    }

    const handleSubmit = () => {
        if (paymentProof && address && phone) onComplete()
    }

    /* ===== SELLER VIEW ===== */
    if (userRole === "SELLER") {
        return (
            <Card className="p-6">
                <div className="text-center py-10">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                        <QrCode className="h-8 w-8 text-muted-foreground" />
                    </div>

                    <h3 className="text-lg font-semibold mb-2">
                        Đang chờ người mua thanh toán
                    </h3>

                    <p className="text-sm text-muted-foreground">
                        Người mua đang quét mã QR và thực hiện thanh toán
                    </p>

                    <div className="bg-muted/40 border border-border rounded-lg p-4 mt-6 max-w-md mx-auto text-left">
                        <h4 className="text-sm font-medium mb-2">
                            Thông tin thanh toán của bạn
                        </h4>

                        <div className="space-y-2 text-sm text-muted-foreground">
                            <p>💳  {order.qrInfo}</p>
                        </div>
                    </div>
                </div>
            </Card>
        )
    }

    /* ===== BUYER VIEW ===== */
    return (
        <Card className="p-6 space-y-6">
            <h3 className="text-lg font-semibold">
                Bước 2: Thanh toán & cung cấp thông tin giao hàng
            </h3>

            {/* QR */}
            <div className="rounded-lg border border-border bg-[rgb(240,246,242)] p-6">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <QrCode className="h-4 w-4 text-[rgb(73,201,73)]" />
                    Quét mã để thanh toán
                </h4>

                <div className="bg-card rounded-lg p-4 flex flex-col items-center">
                    {order.qrUrl && (
                        <img
                            src={order.qrUrl}
                            alt="QR Code"
                            className="h-32 w-32 text-muted-foreground"
                        />
                    )}


                    <div className="mt-4 text-center">
                        <p className="text-sm font-medium">{order.qrInfo}</p>
                        <p className="text-sm font-semibold text-primary mt-2">
                            Số tiền: {formatCurrency(order.totalAmount)} VND
                        </p>
                    </div>
                </div>
            </div>

            {/* Upload */}
            <div>
                <label className="block text-sm font-medium mb-2">
                    Ảnh xác nhận thanh toán <span className="text-destructive">*</span>
                </label>

                <p className="text-xs text-muted-foreground mb-2">
                    Sau khi chuyển khoản, chụp màn hình xác nhận giao dịch thành công
                </p>

                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition">
                    <input type="file" id="payment-proof" onChange={handleFileChange} className="hidden" />
                    <label htmlFor="payment-proof" className="cursor-pointer flex flex-col items-center gap-2">
                        {paymentProof ? (
                            <>
                                <CheckCircle2 className="h-10 w-10 text-primary" />
                                <p className="text-sm font-medium">{paymentProof.name}</p>
                            </>
                        ) : (
                            <>
                                <Upload className="h-10 w-10 text-muted-foreground" />
                                <p className="text-sm font-medium">Tải ảnh xác nhận</p>
                                <p className="text-xs text-muted-foreground">PNG, JPG – tối đa 10MB</p>
                            </>
                        )}
                    </label>
                </div>
            </div>

            {/* Address */}
            <div>
                <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4" />
                    Địa chỉ giao hàng <span className="text-destructive">*</span>
                </label>
                <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
                    placeholder="Nhập địa chỉ đầy đủ: Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                />
            </div>

            {/* Phone */}
            <div>
                <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4" />
                    Số điện thoại  <span className="text-destructive">*</span>
                </label>
                <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
                    placeholder="Nhập số điện thoại liên hệ..."
                />
            </div>

            <Button className="w-full bg-[#10b981] hover:bg-[#10b981]/50" size="lg" onClick={handleSubmit}>
                Xác nhận đã thanh toán
            </Button>
        </Card>
    )
}


export default PaymentBuyer