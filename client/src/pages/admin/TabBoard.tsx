import { useState } from "react";
import OverviewTab from "./sections/OverviewTab";
import UsersTab from "./sections/UsersTab";
import ProductsTab from "./sections/ProductsTab";
import CategoriesTab from "./sections/Categories";
import ReportsTab from "./sections/ReportsTab";
import ModerationTab from "./sections/ModerationTab";



export default function DashboardTabs() {
  const [activeTab, setActiveTab] = useState("nguoidung");

  return (
    <div>
      {/* Tabs */}
      <ul className="flex border-b text-sm font-medium text-center">
        <li className="me-2">
          <button
            onClick={() => setActiveTab("tongquan")}
            className={`inline-block p-4 ${
              activeTab === "tongquan"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
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
                : "text-gray-500"
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
                : "text-gray-500"
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
                : "text-gray-500"
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
                : "text-gray-500"
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
                : "text-gray-500"
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
