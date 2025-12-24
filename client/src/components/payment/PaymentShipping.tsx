import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Package, CheckCircle2, MapPin, Phone, ImageIcon } from "lucide-react"

interface StepShippingProps {
    userRole: "ADMIN" | "SELLER" | "BIDDER";
    onComplete: () => void
}

export const StepShipping = ({ userRole, onComplete }: StepShippingProps) => {
    const [shippingCode, setShippingCode] = useState("")
    const [shippingInvoice, setShippingInvoice] = useState<File | null>(null)
    const [paymentConfirmed, setPaymentConfirmed] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setShippingInvoice(e.target.files[0])
    }

    const handleSubmit = () => {
        if (paymentConfirmed && shippingCode && shippingInvoice) onComplete()
    }

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

                    <div className="bg-muted/40 border border-border rounded-lg p-4">
                        <h4 className="text-sm font-medium mb-3">
                            Thông tin bạn đã cung cấp
                        </h4>

                        <div className="space-y-3">
                            <InfoRow icon={ImageIcon} label="Ảnh xác nhận thanh toán" value="Đã tải lên" />
                            <InfoRow icon={MapPin} label="Địa chỉ giao hàng" value="123 Nguyễn Văn Linh, Q7, TP.HCM" />
                            <InfoRow icon={Phone} label="Số điện thoại" value="0901234567" />
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

            {/* Buyer Info */}
            <div className="bg-[rgb(240,246,242)] border border-border rounded-lg p-4 space-y-3">
                <h4 className="text-sm font-medium">Thông tin từ người mua</h4>

                <InfoRow icon={CheckCircle2} label="Thanh toán" value="Đã xác nhận" highlight />
                <InfoRow icon={MapPin} label="Địa chỉ" value="Nhà Nguyễn Văn cười" />
                <InfoRow icon={Phone} label="SĐT" value="HUHU" />

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
                            {shippingInvoice ? (
                                <>
                                    <CheckCircle2 className="h-10 w-10 text-primary" />
                                    <p className="text-sm font-medium">{shippingInvoice.name}</p>
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
                disabled={!paymentConfirmed || !shippingCode || !shippingInvoice}
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
    icon: any
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


export default StepShipping