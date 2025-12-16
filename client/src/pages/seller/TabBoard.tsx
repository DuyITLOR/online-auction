import { useState } from "react";
import OverviewTab from "../../components/seller/OverviewTab";
import ProductsTab from "../../components/seller/ProductsTab";
import OrdersTab from "../../components/seller/OrdersTab";
import PayoutsTab from "../../components/seller/PayoutsTab";

const TAB_LIST = [
  { key: "overview", label: "Tổng quan" },
  { key: "products", label: "Sản phẩm" },
  { key: "orders", label: "Đơn hàng" },
  { key: "payouts", label: "Thanh toán" },
];

export default function TabBoard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div>
      {/* Mobile: show select */}
      <div className='block md:hidden mb-4'>
        <label htmlFor='seller-tab-select' className='sr-only'>
          Chọn tab
        </label>
        <select
          id='seller-tab-select'
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
      <ul className='hidden md:flex border border-gray-200 text-sm font-medium text-center bg-gray-100 rounded mb-6'>
        {TAB_LIST.map((tab) => (
          <li key={tab.key} className='me-2'>
            <button
              onClick={() => setActiveTab(tab.key)}
              className={`inline-block p-4 ${
                activeTab === tab.key
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Tab Content */}
      <div className='mt-4'>
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "products" && <ProductsTab />}
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "payouts" && <PayoutsTab />}
      </div>
    </div>
  );
}
