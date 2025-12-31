import React, { useState } from "react"
import { useParams } from 'react-router-dom';
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Package, CheckCircle2, MapPin, Phone, ImageIcon, User } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { type Orders } from '../../libs/types/types'
import { uploadShippingInfo } from "../../api/order";
import { getSession } from "../../libs/session"
import { toast } from "sonner";
interface StepShippingProps {
    userRole: "ADMIN" | "SELLER" | "BIDDER";
    onComplete: () => void
    order: Orders;
}


export const PaymentShipping = ({ userRole, onComplete, order }: StepShippingProps) => {
    const [shippingCode, setShippingCode] = useState("")
    const [shippingUrl, setShippingUrl] = useState<File | null>(null)
    const [shippingPreview, setShippingPreview] = useState<string | null>(null)
    const [paymentConfirmed, setPaymentConfirmed] = useState(false)
    const { id } = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setShippingUrl(file)
        setShippingPreview(URL.createObjectURL(file))
    }

    const handleSubmit = async () => {
        if (!id) return;
        if (!paymentConfirmed || !shippingCode || !shippingUrl) return;
        if (isSubmitting) return;

        try {
            setIsSubmitting(true);
            const session = await getSession();
            const token = typeof session?.token === 'string' ? session.token : '';
            await uploadShippingInfo(id, token, shippingCode, shippingUrl);
            
            toast.success('Thành công!', {
                description: 'Bạn đã xác nhận gửi hàng thành công.',
            });

            onComplete();
        } catch (error) {
            console.error("Error uploading shipping info:", error);
            toast.error('Thất bại', {
                description: `Xác nhận gửi hàng thất bại. Vui lòng thử lại.`,
            });
        } finally{
            setIsSubmitting(false);
        }
    }

    const isFormValid = Boolean(paymentConfirmed && shippingCode && shippingUrl)

    /* ================= BUYER ================= */
    if (userRole === "BIDDER") {
        return (
            <Card className="p-6">
                <div className="py-8">
                    <div className="text-center mb-6">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                            <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                            Đang chờ người bán gửi hàng
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Người bán đang kiểm tra thanh toán và chuẩn bị vận chuyển
                        </p>
                    </div>

                    <div className="bg-[rgb(240,246,242)] border border-border rounded-lg p-4">
                        <h4 className="text-sm font-medium mb-3">
                            Thông tin bạn đã cung cấp
                        </h4>

                        <div className="space-y-3">
                            <InfoRow icon={ImageIcon} label="Ảnh xác nhận thanh toán" value="Đã tải lên" highlight />
                            <InfoRow icon={User} label="Tên người nhận hàng" value={order.buyer.fullname || ""} highlight />
                            <InfoRow icon={MapPin} label="Địa chỉ giao hàng" value={order.buyerAddress?.toString() || ""} highlight />
                            <InfoRow icon={Phone} label="Số điện thoại" value={order.buyerPhone || ""} highlight />
                        </div>
                    </div>
                </div>
            </Card>
        )
    }

    /* ================= SELLER ================= */
    return (
        <Card className="p-6 space-y-6">

            <h3 className="text-lg font-semibold">
                Bước 3: Xác nhận thanh toán & gửi mã vận đơn
            </h3>

            {/* Display QR */}
            <div className="rounded-lg border border-border bg-[rgb(240,246,242)] p-2">
                <div className="bg-card rounded-lg p-4 flex flex-col items-center">
                    {order.billUrl && (
                        <img
                            src={order.billUrl}
                            alt="bill code"
                            className="h-32 w-32 text-muted-foreground"
                        />
                    )}
                </div>
            </div>

            {/* Buyer Info */}
            <div className="bg-[rgb(240,246,242)] border border-border rounded-lg p-4 space-y-3">
                <h4 className="text-sm font-medium">Thông tin từ người mua</h4>

                <InfoRow icon={CheckCircle2} label="Thanh toán" value={order.totalAmount.toString()} highlight />
                <InfoRow icon={MapPin} label="Địa chỉ" value={order.buyerAddress?.toString() || ""} highlight />
                <InfoRow icon={Phone} label="SĐT" value={order.buyerPhone || ""} highlight />

                {/* Confirm checkbox */}
                <label className="flex items-start gap-3 cursor-pointer pt-2">
                    <input
                        type="checkbox"
                        checked={paymentConfirmed}
                        onChange={(e) => setPaymentConfirmed(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border border-input text-primary focus:ring-primary accent-[rgb(73,201,73)]"
                    />
                    <div>
                        <p className="text-sm font-medium">
                            Tôi xác nhận đã nhận đủ tiền
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Vui lòng kiểm tra kỹ trước khi gửi hàng
                        </p>
                    </div>
                </label>
            </div>

            {/* Shipping form */}
            <div className={!paymentConfirmed ? "opacity-50 pointer-events-none" : "space-y-4"}>
                <div>
                    <label className="text-sm font-medium mb-2 block">
                        Mã vận đơn <span className="text-destructive">*</span>
                    </label>
                    <input
                        value={shippingCode}
                        onChange={(e) => setShippingCode(e.target.value)}
                        className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
                        placeholder="Nhập mã vận đơn..."
                    />
                </div>

                <div>
                    <label className="text-sm font-medium mb-2 block">
                        Ảnh mã vận đơn <span className="text-destructive">*</span>
                    </label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition">
                        <input
                            type="file"
                            id="shipping-invoice"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <label htmlFor="shipping-invoice" className="cursor-pointer flex flex-col items-center gap-2">
                            {shippingPreview ? (
                                <>
                                    <img
                                        src={shippingPreview}
                                        alt="shipping preview"
                                        className="max-h-40 rounded-md border"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Nhấn để thay đổi ảnh
                                    </p>
                                </>
                            ) : (
                                <>
                                    <Upload className="h-10 w-10 text-muted-foreground" />
                                    <p className="text-sm font-medium">Tải ảnh mã vận đơn</p>
                                    <p className="text-xs text-muted-foreground">PNG, JPG – tối đa 10MB</p>
                                </>
                            )}
                        </label>
                    </div>
                </div>
            </div>

            <Button
                size="lg"
                className="w-full bg-[#10b981] hover:bg-[#10b981]/50"
                disabled={!isFormValid || isSubmitting}
                onClick={handleSubmit}
            >
                Xác nhận đã gửi hàng
            </Button>
        </Card>
    )
}

/* ===== Helper ===== */
function InfoRow({
    icon: Icon,
    label,
    value,
    highlight = false,
}: {
    icon: LucideIcon
    label: string
    value: string
    highlight?: boolean
}) {
    return (
        <div className="flex items-start gap-3 text-sm">
            <Icon className={`h-4 w-4 mt-0.5 ${highlight ? "text-[rgb(73,201,73)]" : "text-muted-foreground"}`} />
            <div>
                <p className="font-medium">{label}</p>
                <p className="text-muted-foreground text-xs">{value}</p>
            </div>
        </div>
    )
}


export default PaymentShipping