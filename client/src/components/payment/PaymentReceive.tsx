import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    PackageCheck,
    Truck,
    MapPin,
    Phone,
    ImageIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface StepDeliveryProps {
    userRole: "ADMIN" | "SELLER" | "BIDDER"
    onComplete: () => void
}

export const PaymentReceive = ({ userRole, onComplete }: StepDeliveryProps) => {
    const [confirmed, setConfirmed] = useState(false)

    /* ================= SELLER ================= */
    if (!userRole) {
        return (
            <Card className="p-6">
                <div className="py-8">
                    <div className="text-center mb-6">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                            <Truck className="h-8 w-8 text-muted-foreground" />
                        </div>

                        <h3 className="text-lg font-semibold mb-2">
                            Hàng đang được giao
                        </h3>

                        <p className="text-sm text-muted-foreground">
                            Đang chờ người mua xác nhận đã nhận hàng
                        </p>
                    </div>

                    <div className="bg-[rgb(240,246,242)] border border-border rounded-lg p-4">
                        <h4 className="text-sm font-medium mb-3">
                            Thông tin giao hàng
                        </h4>

                        <div className="space-y-3">
                            <InfoRow icon={PackageCheck} label="Mã vận đơn" value="VN123456789" highlight />
                            <InfoRow icon={MapPin} label="Địa chỉ" value="123 Nguyễn Văn Linh, Q7, TP.HCM" highlight />
                            <InfoRow icon={Phone} label="SĐT" value="0901234567" highlight />
                        </div>
                    </div>
                </div>
            </Card>
        )
    }

    /* ================= BUYER ================= */
    return (
        <Card className="p-6 space-y-6">
            <h3 className="text-lg font-semibold">
                Bước 4: Xác nhận đã nhận hàng
            </h3>

            {/* Shipping info */}
            <div className="bg-[rgb(240,246,242)] border border-border rounded-lg p-4 space-y-3">
                <h4 className="text-sm font-medium">Thông tin từ người bán</h4>

                <InfoRow icon={ImageIcon} label="Ảnh mã vận đơn" value="Đã cung cấp" highlight />
                <InfoRow icon={PackageCheck} label="Mã vận đơn" value="VN123456789" highlight />
                <InfoRow icon={MapPin} label="Địa chỉ giao hàng" value="123 Nguyễn Văn Linh, Q7, TP.HCM" highlight />
                <InfoRow icon={Phone} label="SĐT liên hệ" value="0901234567" highlight />

                {/* Confirm checkbox */}
                <label className="flex items-start gap-3 cursor-pointer pt-2">
                    <input
                        type="checkbox"
                        checked={confirmed}
                        onChange={(e) => setConfirmed(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border border-input accent-[rgb(73,201,73)]"
                    />
                    <div>
                        <p className="text-sm font-medium">
                            Tôi xác nhận đã nhận được hàng và đúng mô tả
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Sau khi xác nhận, bạn sẽ chuyển sang bước đánh giá
                        </p>
                    </div>
                </label>
            </div>

            <Button
                size="lg"
                className="w-full bg-[#10b981] hover:bg-[#10b981]/50"
                disabled={!confirmed}
                onClick={onComplete}
            >
                <PackageCheck className="mr-2 h-5 w-5" />
                Xác nhận đã nhận hàng
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
            <Icon
                className={`h-4 w-4 mt-0.5 ${highlight ? "text-[rgb(73,201,73)]" : "text-muted-foreground"
                    }`}
            />
            <div>
                <p className="font-medium">{label}</p>
                <p className="text-muted-foreground text-xs">{value}</p>
            </div>
        </div>
    )
}

export default PaymentReceive
