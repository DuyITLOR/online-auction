import { type FC } from "react";

interface ReportType {
  label: string;
  count: number;
  color: string;
}

interface RecentReport {
  id: number;
  title: string;
  reason: string;
  reportedBy: string;
  date: string;
}

const reportTypesDefault: ReportType[] = [
  { label: "Sản phẩm giả mạo", count: 24, color: "text-red-500" },
  { label: "Gian lận thanh toán", count: 18, color: "text-orange-500" },
  { label: "Hành vi đáng ngờ", count: 15, color: "text-yellow-500" },
  { label: "Nội dung không phù hợp", count: 9, color: "text-purple-500" },
  { label: "Vấn đề với vận chuyển", count: 12, color: "text-blue-500" },
];

const recentReportsDefault: RecentReport[] = [
  { id: 1, title: "iPhone 15", reason: "Sản phẩm giả", reportedBy: "User123", date: "2024-06-15" },
  { id: 2, title: "MacBook Pro", reason: "Gian lận thanh toán", reportedBy: "User456", date: "2024-06-14" },
  { id: 3, title: "Apple Watch", reason: "Nội dung không phù hợp", reportedBy: "User789", date: "2024-06-13" },
  { id: 4, title: "Sony Headphones", reason: "Vấn đề vận chuyển", reportedBy: "User101", date: "2024-06-12" },
];

const ReportsTab: FC<{ reportTypes?: ReportType[]; recentReports?: RecentReport[] }> = ({
  reportTypes = reportTypesDefault,
  recentReports = recentReportsDefault,
}) => {
  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Report Types */}
        <div className="border rounded-lg p-6 bg-white ">
          <h2 className="text-lg font-semibold mb-4">Loại báo cáo</h2>

          <div className="space-y-3">
            {reportTypes.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <p className="text-sm">{item.label}</p>
                <span className={`font-bold text-lg ${item.color}`}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>

            {/* Recent Reports */}
            <div className="border rounded-lg p-6 bg-white ">
          <h2 className="text-lg font-semibold mb-4">Báo cáo gần đây</h2>

          <div className="space-y-3">
            {recentReports.map((item) => (
              <div
                key={item.id}
                className="p-3 border rounded-lg hover:bg-gray-100  transition cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold">{item.title}</p>
                  <span className="text-xs text-gray-500">{item.date}</span>
                </div>

                <p className="text-sm text-gray-600">
                  Lý do: <span className="font-medium">{item.reason}</span> • Báo cáo bởi: {item.reportedBy}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReportsTab;
