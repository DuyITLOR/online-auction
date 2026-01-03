import { Package, CheckCircle2, User, BadgeDollarSign } from "lucide-react"
import { formatCurrency } from "../../utils/format";

interface PaymentHeaderProps {
    title: string;
    price: number;
    seller: string;
    bidder: string;
    userRole: "ADMIN" | "SELLER" | "BIDDER";
}
const PaymentHeader = ({
    title,
    price,
    seller,
    bidder,
    userRole,
}: PaymentHeaderProps
) => {
    return (
        <div className="bg-white  border-b  shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex items-start gap-6">
                    <div className="bg-[#10b981] flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg shadow-primary/20">
                        <Package className="h-8 w-8" />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                            <h1 className="text-3xl font-bold text-foreground text-balance leading-tight">{title}</h1>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#10b981] px-4 py-1.5 text-sm font-semibold text-white shadow-sm shrink-0">
                                <CheckCircle2 className="h-4 w-4" />
                                Đấu giá kết thúc
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                            {/* Price Card */}
                            <div className="flex items-center gap-3 bg-card rounded-xl px-4 py-3 border border-white shadow-sm shadow-stone-300">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#14b8a6] text-white">
                                    <BadgeDollarSign className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Giá thắng</p>
                                    <p className="text-lg font-bold text-black/60">{formatCurrency(price)}</p>
                                </div>
                            </div>

                            {/* Buyer Card */}
                            <div className="flex items-center gap-3 bg-card rounded-xl px-4 py-3 border border-white shadow-sm shadow-stone-300">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#14b8a6] text-white">
                                    <User className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Người mua</p>
                                    <p className="text-sm font-semibold text-black/60">{bidder}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-card rounded-xl px-4 py-3 border border-white shadow-sm shadow-stone-300">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#14b8a6] text-white">
                                    <User className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Người bán</p>
                                    <p className="text-sm font-semibold text-black/60">{seller}</p>
                                </div>
                            </div>

                            {/* User Role Badge */}
                            {userRole && (
                                <div className="flex items-center justify-center bg-[#10b981] rounded-xl px-4 py-3 border border-white shadow-sm shadow-white">
                                    <p className="text-sm font-bold text-white">
                                        Bạn là {userRole === "BIDDER" ? "người mua" : "người bán"}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentHeader