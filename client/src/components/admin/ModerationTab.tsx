import { type FC, useState } from "react";
import { CircleAlert, CircleCheckBig, Trash2 } from "lucide-react";

interface ReportItem {
  id: number;
  type: "Product" | "User";
  title: string;
  reason: string;
  reports: number;
}

const initialReportsDefault: ReportItem[] = [
  { id: 1, type: "Product", title: "Suspected Counterfeit iPhone", reason: "Fake Product", reports: 5 },
  { id: 2, type: "User", title: "Nguyễn Văn A", reason: "Suspicious Activity", reports: 3 },
  { id: 3, type: "Product", title: "Stolen Laptop", reason: "Stolen Item", reports: 7 },
  { id: 4, type: "User", title: "Trần Thị B", reason: "Payment Fraud", reports: 4 },
];

const ModerationTab: FC<{ data?: ReportItem[] }> = ({ data }) => {
    const initialReports = data || initialReportsDefault;
  const [items, setItems] = useState(initialReports);

  const handleApprove = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="flex-1">
      <div className="space-y-6">

        <div className="border rounded-lg p-6 bg-white ">
          
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <CircleAlert className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold">Mục đánh dấu ({items.length})</h2>
          </div>

          {/* Content */}
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border bg-red-50  border-red-200 rounded-lg"
              >
                {/* Left */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-red-200 text-red-700">
                      {item.type}
                    </span>
                    <p className="font-semibold">{item.title}</p>
                  </div>
                  <p className="text-sm text-gray-600 ">
                    Lý do: {item.reason} • Báo cáo: {item.reports}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(item.id)}
                    className="flex items-center gap-1 px-3 py-2 border rounded-md text-xs hover:bg-gray-100  transition"
                  >
                    <CircleCheckBig className="w-4 h-4" />
                    Duyệt
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center gap-1 px-3 py-2 border rounded-md text-xs text-red-600 hover:bg-red-100  transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa
                  </button>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <p className="text-sm text-gray-500 italic text-center py-6">
                Không còn mục cần kiểm duyệt.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ModerationTab;
