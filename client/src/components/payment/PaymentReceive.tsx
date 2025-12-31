import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useParams } from 'react-router-dom';
import {
    PackageCheck,
    Truck,
    MapPin,
    Phone,
} from "lucide-react"
import { type Orders } from '../../libs/types/types'
import type { LucideIcon } from "lucide-react"
import { getSession } from "../../libs/session"
import { toast } from "sonner";
import { confirmOrder } from "../../api/order"
import { is } from "zod/v4/locales";

interface StepDeliveryProps {
    userRole: "ADMIN" | "SELLER" | "BIDDER"
    onComplete: () => void
    order: Orders
}

export const PaymentReceive = ({ userRole, onComplete, order }: StepDeliveryProps) => {
    const [confirmed, setConfirmed] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { id } = useParams()

    const handleSubmit = async () => {
        if (!id) return
        if (!confirmed) return

        try {
            setIsSubmitting(true);
            const session = await getSession();
            const token = typeof session?.token === 'string' ? session.token : '';
            await confirmOrder(id, token);
            toast.success('Thành công!', {
                description: 'Bạn đã xác nhận nhận hàng thành công.',
            });

            onComplete();
        } catch (error) {
            console.error("Error confirming order receipt:", error);
            toast.error('Thất bại', {
                description: `Xác nhận nhận hàng thất bại. Vui lòng thử lại.`,
            });
        }
    }


    if (userRole === "SELLER") {
        return (
            <Card className="p-6">
                <div className="py-4">
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
                            <InfoRow icon={PackageCheck} label="Mã vận đơn" value={order.shippingCode || ""} highlight />
                            <InfoRow icon={MapPin} label="Địa chỉ" value={order.buyerAddress || ""} highlight />
                            <InfoRow icon={Phone} label="SĐT" value={order.buyerPhone || ""} highlight />
                        </div>
                    </div>
                </div>
            </Card>
        )
    }

    /* ================= BUYER ================= */
    return (
        <Card className="p-6 space-y-2">
            <h3 className="text-lg font-semibold">
                Bước 4: Xác nhận đã nhận hàng
            </h3>

            <div className="rounded-lg border border-border bg-[rgb(240,246,242)] p-2">
                <div className="bg-card rounded-lg p-4 flex flex-col items-center">
                    {order.shippingUrl && (
                        <img
                            src={order.shippingUrl}
                            alt="bill code"
                            className="h-32 w-32 text-muted-foreground"
                        />
                    )}
                </div>
            </div>
            {/* Shipping info */}
            <div className="bg-[rgb(240,246,242)] border border-border rounded-lg p-2 space-y-3">
                <h4 className="text-sm font-medium">Thông tin từ người bán</h4>
                <InfoRow icon={PackageCheck} label="Mã vận đơn" value={order.shippingCode || ""} highlight />
                <InfoRow icon={MapPin} label="Địa chỉ giao hàng" value={order.buyerAddress || ""} highlight />
                <InfoRow icon={Phone} label="SĐT liên hệ" value={order.buyerPhone || ""} highlight />

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
                disabled={!confirmed || isSubmitting}
                onClick={handleSubmit}
            >
                <PackageCheck className="mr-1 h-5 w-5" />
                {isSubmitting ? 'Đang tải...' : 'Xác nhận đã nhận hàng'}
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
