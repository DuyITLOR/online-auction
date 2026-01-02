import { Card} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AlertTriangle, X } from "lucide-react"

import { useState } from "react"

const PaymentCancle = () => {
    const [reason, setReason] = useState("");

    return (
        <div>
            <Card className="p-6 space-y-6 bg-destructive/10  border-destructive/30">
                <div className="flex items-start gap-2">
                    <div className="flex-1">
                        <div className="flex-1">
                            <div className="flex flex-row gap-4">
                                <AlertTriangle className="h-6 w-6 text-destructive" />
                                <h3 className="text-lg font-semibold text-foreground mb-2">Huỷ giao dịch</h3>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                                Bạn có thể huỷ giao dịch bất kỳ lúc nào nếu người mua không đáp ứng yêu cầu thanh toán. Người mua sẽ nhận
                                đánh giá -1 điểm.
                            </p>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive">Hủy giao dịch</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Bạn có chắc chắn muốn hủy giao dịch?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Sau khi hủy giao dịch, người mua sẽ nhận đánh giá -1 điểm và đơn hàng sẽ bị hủy.
                                        </AlertDialogDescription>
                                        
                                        <div className="flex flex-col">
                                            <label className="block text-sm font-medium text-foreground mb-2">Lý do hủy:</label>
                                            <textarea
                                                className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                                placeholder="Vui lòng nêu lý do..."
                                                value={reason}
                                                onChange = {(e) => setReason(e.target.value)}
                                                rows={3}
                                            />
                                        </div>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Không</AlertDialogCancel>
                                        <AlertDialogAction className="bg-destructive">Đồng ý</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default PaymentCancle