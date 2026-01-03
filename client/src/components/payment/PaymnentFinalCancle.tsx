import { useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { Home } from "lucide-react";
import { OctagonX } from 'lucide-react';


interface PaymnentFinalCancleProps {
    reason: string
}

const PaymnentFinalCancle = ({ reason }: PaymnentFinalCancleProps) => {
    const navigate = useNavigate();


    return (
        <>
            <div className="md:min-w-3xl max-xl mx-auto space-y-2">
                {/* Success Header */}
                <Card className="p-8 text-center bg-white">
                    <div className="flex justify-center mb-2">
                        <div className="rounded-full bg-destructive/10 p-4">
                            <OctagonX className="h-16 w-16  text-destructive" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-black">Giao dịch đã bị hủy bởi người bán!</h2>
                    <p className="text-muted-foreground">Lý do hủy: {reason}</p>
                    <Button onClick={() => navigate('/')}
                        className='flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 text-base shadow-lg shadow-teal-200'
                    >
                        <Home className="h-5 w-5" />
                        <p>Quay về trang chủ</p>
                    </Button>
                </Card>
            </div>
        </>
    )
}

export default PaymnentFinalCancle