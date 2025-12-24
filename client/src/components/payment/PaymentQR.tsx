import type React from "react"
import { useState } from "react"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { Upload, QrCode, AlertCircle } from "lucide-react"

interface StepQrSetupProps {
    userRole: "ADMIN" | "SELLER" | "BIDDER";
    onComplete: () => void
}

const PaymentQR = ({ userRole, onComplete }: StepQrSetupProps) => {
    const [qrImage, setQrImage] = useState<File | null>(null)
    const [qrPreview, setQrPreview] = useState<string | null>(null)
    const [bankInfo, setBankInfo] = useState("")

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setQrImage(file)
        setQrPreview(URL.createObjectURL(file))
    }

    const isFormValid = Boolean(qrImage && bankInfo.trim())

    if (userRole === "BIDDER") {
        return (
            <Card className="p-6">
                <div className="text-center py-10">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary mb-4">
                        <QrCode className="h-8 w-8 text-secondary-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                        Đang chờ người bán cung cấp mã QR
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Người bán đang thiết lập thông tin thanh toán
                    </p>
                </div>
            </Card>
        )
    }

    return (
        <Card className="p-6 space-y-6">
            <h3 className="text-lg font-semibold">
                Bước 1: Cung cấp mã QR thanh toán
            </h3>

            {/* Hướng dẫn */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Hướng dẫn tạo mã QR:</p>
                        <ul className="list-disc ml-4 space-y-1">
                            <li>Mở ứng dụng ngân hàng của bạn</li>
                            <li>Chọn tính năng “Nhận tiền qua QR”</li>
                            <li>Chụp ảnh màn hình mã QR</li>
                            <li>Tải ảnh lên bên dưới</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Thông tin ngân hàng */}
            <div>
                <label className="block text-sm font-medium mb-2">
                    Thông tin tài khoản <span className="text-destructive">*</span>
                </label>
                <textarea
                    rows={3}
                    value={bankInfo}
                    onChange={(e) => setBankInfo(e.target.value)}
                    placeholder="Ví dụ: Vietcombank - STK: 1234567890 - NGUYEN VAN A"
                    className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm focus:ring-2 focus:ring-ring"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                    Nhập đầy đủ tên ngân hàng, số tài khoản và tên chủ tài khoản
                </p>
            </div>

            {/* Upload QR */}
            <div>
                <label className="block text-sm font-medium mb-2">
                    Mã QR thanh toán <span className="text-destructive">*</span>
                </label>

                <div className="relative rounded-lg border-2 border-dashed border-border p-6 text-center hover:border-primary transition">
                    <input
                        type="file"
                        id="qr-upload"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    <label
                        htmlFor="qr-upload"
                        className="cursor-pointer flex flex-col items-center gap-3"
                    >
                        {qrPreview ? (
                            <>
                                <img
                                    src={qrPreview}
                                    alt="QR preview"
                                    className="max-h-40 rounded-md border"
                                />
                                <p className="text-sm text-muted-foreground">
                                    Nhấn để thay đổi ảnh
                                </p>
                            </>
                        ) : (
                            <>
                                <Upload className="h-10 w-10 text-muted-foreground" />
                                <p className="text-sm font-medium">
                                    Tải lên mã QR thanh toán
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    PNG, JPG – tối đa 10MB
                                </p>
                            </>
                        )}
                    </label>
                </div>
            </div>

            {/* Submit */}
            <Button
                size="lg"
                className="w-full"
                disabled={!isFormValid}
                onClick={onComplete}
            >
                Xác nhận thông tin
            </Button>
        </Card>
    )
}


export default PaymentQR