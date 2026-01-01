import { CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"

const PaymentComplete = () => {
    return (
        <>
            <div className="md:min-w-3xl max-xl mx-auto space-y-6">
                {/* Success Header */}
                <Card className="p-8 text-center bg-[rgb(230,240,230)]">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-primary/10 p-4">
                            <CheckCircle2 className="h-16 w-16 text-[rgb(73,201,73)]/40" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-black mb-2">Giao dịch hoàn tất!</h2>
                    <p className="text-muted-foreground">Cảm ơn bạn đã sử dụng SnapBid để hoàn tất giao dịch</p>
                </Card>
            </div>
        </>
    )
}
export default PaymentComplete