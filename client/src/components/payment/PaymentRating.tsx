import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown, Star, User} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { type Orders } from '../../libs/types/types'
import { getSession } from "../../libs/session"
import { toast } from "sonner";
import { ratingOrder } from "../../api/order"

interface StepRatingProps {
  userRole: "ADMIN" | "SELLER" | "BIDDER"
  onComplete: () => void
  order: Orders
}

export const PaymentRating = ({ userRole, onComplete, order }: StepRatingProps) => {
  const [rating, setRating] = useState<1 | -1 | null>(null)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false);

  const evaluatee = userRole === "BIDDER" ? order.sellerId : order.buyerId 

  const handleSubmit = async () => {
    if (!rating || !comment.trim()) return;
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const sesssion = await getSession();
      const token = typeof sesssion?.token === 'string' ? sesssion.token : '';
      await ratingOrder(token, evaluatee , order.productId ,rating, comment);
      toast.success('Thành công!', {
        description: 'Bạn đã gửi đánh giá thành công.',
      });

      onComplete();
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error('Thất bại', {
        description: `${error instanceof Error ? error.message : 'Đã có lỗi xảy ra khi gửi đánh giá.'}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const isFormValid = Boolean(rating && comment.trim())

  return (
    <Card className="p-6 space-y-6">
      <h3 className="text-lg font-semibold">
        Bước 5: Đánh giá giao dịch
      </h3>

      {/* Info */}
      <div className="bg-[rgb(240,246,242)] border border-border rounded-lg p-4 space-y-3">
        <InfoRow
          icon={User}
          label={userRole === "BIDDER" ? "Người bán" : "Người mua"}
          value={userRole === "BIDDER" ? order.seller.fullname || "" : order.buyer.fullname || ""}
          highlight
        />

        <div className="grid grid-cols-2 gap-4 pt-2">
          {/* Positive */}
          <button
            disabled={isSubmitting}
            onClick={() => setRating(1)}
            className={`rounded-lg border p-4 text-center transition
              ${rating === 1
                ? "border-[rgb(73,201,73)] bg-[rgb(73,201,73)]/10"
                : "border-border hover:border-[rgb(73,201,73)]/50"}
              ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <ThumbsUp className={`mx-auto h-7 w-7 ${rating === 1 ? "text-[rgb(73,201,73)]" : "text-muted-foreground"}`} />
            <p className="mt-2 text-sm font-medium">Tích cực (+1)</p>
            <p className="text-xs text-muted-foreground">Giao dịch tốt</p>
          </button>

          {/* Negative */}
          <button
            disabled={isSubmitting}
            onClick={() => setRating(-1)}
            className={`rounded-lg border p-4 text-center transition
              ${rating === -1
                ? "border-destructive bg-destructive/10"
                : "border-border hover:border-destructive/50"}
              ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <ThumbsDown className={`mx-auto h-7 w-7 ${rating === -1 ? "text-destructive" : "text-muted-foreground"}`} />
            <p className="mt-2 text-sm font-medium">Tiêu cực (-1)</p>
            <p className="text-xs text-muted-foreground">Giao dịch không tốt</p>
          </button>
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="text-sm font-medium mb-2 block">
          Nhận xét <span className="text-destructive">*</span>
        </label>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isSubmitting}
          rows={4}
          maxLength={200}
          placeholder="Chia sẻ trải nghiệm giao dịch của bạn..."
          className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm disabled:opacity-50"
        />

        <p className="text-xs text-muted-foreground mt-1 text-right">
          {comment.length}/200 ký tự
        </p>
      </div>

      {/* Action */}
        <Button
          size="lg"
          className="w-full bg-[#10b981] hover:bg-[#10b981]/50"
          disabled={!isFormValid || isSubmitting}
          onClick={handleSubmit}
        >
          <Star className="mr-2 h-5 w-5" />
          {isSubmitting ? 'Đang tải...' : 'Gửi đánh giá'}
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

export default PaymentRating
