import { useState } from "react";
import OverviewTab from "../../components/admin/OverviewTab";
import UsersTab from "../../components/admin/UsersTab";
import ProductsTab from "../../components/admin/ProductsTab";
import CategoriesTab from "../../components/admin/Categories";
import ReportsTab from "../../components/admin/ReportsTab";
import ModerationTab from "../../components/admin/ModerationTab";

const TAB_LIST = [
  { key: "tongquan", label: "Tổng quan" },
  { key: "nguoidung", label: "Người dùng" },
  { key: "sanpham", label: "Sản phẩm" },
  { key: "danhmuc", label: "Danh mục" },
  { key: "kiemduyet", label: "Kiểm duyệt" },
  { key: "baocao", label: "Báo cáo" },
];

export default function DashboardTabs() {
  const [activeTab, setActiveTab] = useState("nguoidung");

  return (
    <div>
      {/* Mobile: show select */}
      <div className="block md:hidden mb-4">
        <label htmlFor="admin-tab-select" className="sr-only">
          Chọn tab
        </label>
        <select
          id="admin-tab-select"
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          {TAB_LIST.map((t) => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tabs (desktop/tablet) */}
      <ul className="hidden md:flex border border-gray-300 text-sm font-medium text-center bg-gray-100 rounded">
        <li className="me-2">
          <button
            onClick={() => setActiveTab("tongquan")}
            className={`inline-block p-4 ${
              activeTab === "tongquan"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-black-500"
            }`}
          >
            Tổng quan
          </button>
        </li>

        <li className="me-2">
          <button
            onClick={() => setActiveTab("nguoidung")}
            className={`inline-block p-4 ${
              activeTab === "nguoidung"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-black-500"
            }`}
          >
            Người dùng
          </button>
        </li>

        <li className="me-2">
          <button
            onClick={() => setActiveTab("sanpham")}
            className={`inline-block p-4 ${
              activeTab === "sanpham"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-black-500"
            }`}
          >
            Sản phẩm
          </button>
        </li>

        <li className="me-2">
          <button
            onClick={() => setActiveTab("danhmuc")}
            className={`inline-block p-4 ${
              activeTab === "danhmuc"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-black-500"
            }`}
          >
            Danh mục
          </button>
        </li>

        <li className="me-2">
          <button
            onClick={() => setActiveTab("kiemduyet")}
            className={`inline-block p-4 ${
              activeTab === "kiemduyet"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-black-500"
            }`}
          >
            Kiểm duyệt
          </button>
        </li>

        <li className="me-2">
          <button
            onClick={() => setActiveTab("baocao")}
            className={`inline-block p-4 ${
              activeTab === "baocao"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-black-500"
            }`}
          >
            Báo cáo
          </button>
        </li>
      </ul>

      {/* Nội dung tuỳ tab */}
      <div className="mt-6">
        {activeTab === "tongquan" && <OverviewTab />}
        {activeTab === "nguoidung" && <UsersTab />}
        {activeTab === "sanpham" && <ProductsTab />}
        {activeTab === "danhmuc" && <CategoriesTab />}
        {activeTab === "kiemduyet" && <ModerationTab />}
        {activeTab === "baocao" && <ReportsTab />}
      </div>
    </div>
  );
}
