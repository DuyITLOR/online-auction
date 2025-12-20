import { Package, CheckCircle2, User, BadgeDollarSign } from "lucide-react"
import { formatCurrency } from "../../utils/format";

interface PaymentHeaderProps {
    title: string;
    price: number;
    seller: string;
    bidder: string;
    userRole: "buyer" | "seller";
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
        <div className="bg-background from-primary/5 via-background to-background border-b border-border shadow-sm shadow-primary/10">
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex items-start gap-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-lg shadow-primary/20">
                        <Package className="h-8 w-8" />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                            <h1 className="text-3xl font-bold text-foreground text-balance leading-tight">{title}</h1>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-sm shrink-0">
                                <CheckCircle2 className="h-4 w-4" />
                                Đấu giá kết thúc
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                            {/* Price Card */}
                            <div className="flex items-center gap-3 bg-card rounded-xl px-4 py-3 border border-border shadow-sm">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                                    <BadgeDollarSign className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">Giá thắng</p>
                                    <p className="text-lg font-bold text-primary">{formatCurrency(price)}</p>
                                </div>
                            </div>

                            {/* Buyer Card */}
                            <div className="flex items-center gap-3 bg-card rounded-xl px-4 py-3 border border-border shadow-sm">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                                    <User className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">Người mua</p>
                                    <p className="text-sm font-semibold text-foreground">{bidder}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-card rounded-xl px-4 py-3 border border-border shadow-sm">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                                    <User className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">Người bán</p>
                                    <p className="text-sm font-semibold text-foreground">{seller}</p>
                                </div>
                            </div>

                            {/* User Role Badge */}
                            {userRole && (
                                <div className="flex items-center justify-center bg-primary rounded-xl px-4 py-3 border border-border shadow-md shadow-primary/10">
                                    <p className="text-sm font-bold text-primary-foreground">
                                        Bạn là {userRole === "buyer" ? "người mua" : "người bán"}
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