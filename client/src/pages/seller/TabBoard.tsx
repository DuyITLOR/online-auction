import { useState, useTransition } from "react";
import {
  Loader2,
  LayoutDashboard,
  Box,
  ShoppingCart,
  CreditCard,
} from "lucide-react";
import OverviewTab from "../../components/seller/OverviewTab";
import ProductsTab from "../../components/seller/ProductsTab";
import OrdersTab from "../../components/seller/OrdersTab";
import PayoutsTab from "../../components/seller/PayoutsTab";
import { ProductProvider } from "../../libs/contexts/sellerProduct.context.tsx";

const TAB_LIST = [
  { key: "overview", label: "Tổng quan", icon: LayoutDashboard },
  { key: "products", label: "Sản phẩm", icon: Box },
  { key: "orders", label: "Đơn hàng", icon: ShoppingCart },
  { key: "payouts", label: "Thanh toán", icon: CreditCard },
];

export default function TabBoard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (key: string) => {
    startTransition(() => {
      setActiveTab(key);
    });
  };

  return (
    <div className='space-y-6'>
      {/* --- TAB NAVIGATION --- */}
      <div className='bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden'>
        {/* Mobile View: Select menu */}
        <div className='block md:hidden p-4 bg-gray-50/50'>
          <select
            id='seller-tab-select'
            value={activeTab}
            onChange={(e) => handleTabChange(e.target.value)}
            className='w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none'
          >
            {TAB_LIST.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop View: Tabs */}
        <ul className='hidden md:flex items-center bg-white border-b border-gray-100'>
          {TAB_LIST.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <li key={tab.key} className='flex-1'>
                <button
                  onClick={() => handleTabChange(tab.key)}
                  className={`
                    w-full flex items-center justify-center gap-2 py-4 px-1 text-sm font-semibold transition-all relative
                    ${
                      isActive
                        ? "text-teal-600 bg-teal-50/30"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }
                  `}
                >
                  <Icon
                    size={18}
                    className={isActive ? "text-teal-600" : "text-gray-400"}
                  />
                  {tab.label}
                  {/* Active Indicator */}
                  {isActive && (
                    <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 animate-in fade-in slide-in-from-bottom-1' />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* --- TAB CONTENT AREA --- */}
      <div className='relative min-h-[400px]'>
        {/* Loading Overlay khi chuyển tab (Sử dụng Transition) */}
        {isPending && (
          <div className='absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-xl'>
            <div className='flex flex-col items-center gap-2 bg-white p-4 rounded-lg shadow-lg border border-gray-100'>
              <Loader2 className='w-8 h-8 animate-spin text-teal-600' />
              <span className='text-sm font-medium text-gray-600'>
                Đang chuyển tab...
              </span>
            </div>
          </div>
        )}

        <div
          className={`transition-all duration-300 ${
            isPending ? "opacity-30 scale-[0.99]" : "opacity-100 scale-100"
          }`}
        >
          {activeTab === "overview" && <OverviewTab />}

          {activeTab === "products" && (
            <ProductProvider>
              <ProductsTab />
            </ProductProvider>
          )}

          {activeTab === "orders" && (
            <div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
              <OrdersTab />
            </div>
          )}

          {activeTab === "payouts" && (
            <div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
              <PayoutsTab />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
