import { useState } from "react";
import UsersTab from "../../components/admin/UsersTab";
import ProductsTab from "../../components/admin/ProductsTab";
import CategoriesTab from "../../components/admin/Categories";
import ModerationTab from "../../components/admin/ModerationTab";

import { ProductProvider } from "../../libs/contexts/admin/product.context";
import { CategoryProvider } from "../../libs/contexts/admin/cate.context";
import { UserProvider } from "../../libs/contexts/admin/user.context";
import { ModerationProvider } from "../../libs/contexts/admin/moderation.context";

import { AdminProvider } from "../../libs/contexts/admin/admin.context";
const TAB_LIST = [
  { key: "tongquan", label: "Tổng quan" },
  { key: "nguoidung", label: "Người dùng" },
  { key: "sanpham", label: "Sản phẩm" },
  { key: "danhmuc", label: "Danh mục" },
  { key: "kiemduyet", label: "Kiểm duyệt" },
];

export default function DashboardTabs() {
  const [activeTab, setActiveTab] = useState("nguoidung");

  return (
    <div>
      {/* Mobile: show select */}
      <div className='block md:hidden mb-4'>
        <label htmlFor='admin-tab-select' className='sr-only'>
          Chọn tab
        </label>
        <select
          id='admin-tab-select'
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className='w-full p-2 border rounded-md'
        >
          {TAB_LIST.map((t) => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tabs (desktop/tablet) */}
      <ul className='hidden md:flex border border-gray-200 text-sm font-medium text-center bg-gray-100 rounded'>
        <li className='me-2 hover:cursor-pointer hover:bg-gray-200 rounded'>
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

        <li className='me-2 hover:cursor-pointer hover:bg-gray-200 rounded'>
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

        <li className='me-2 hover:cursor-pointer hover:bg-gray-200 rounded'>
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

        <li className='me-2 hover:cursor-pointer hover:bg-gray-200 rounded'>
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
      </ul>

      {/* Nội dung tuỳ tab */}
      <div className='mt-6'>
        <AdminProvider>
          {activeTab === "nguoidung" && (
            <UserProvider>
              <UsersTab />
            </UserProvider>
          )}
          {activeTab === "sanpham" && (
            <ProductProvider>
              <ProductsTab />
            </ProductProvider>
          )}

          {activeTab === "danhmuc" && (
            <CategoryProvider>
              <CategoriesTab />
            </CategoryProvider>
          )}
          {activeTab === "kiemduyet" && (
            <ModerationProvider>
              <ModerationTab />
            </ModerationProvider>
          )}
        </AdminProvider>
      </div>
    </div>
  );
}
