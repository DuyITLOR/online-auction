import { useState } from "react";
import { useSettings } from "../../libs/contexts/admin/settings.context";
import { Settings, Clock, RefreshCw, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

const SETTING_LABELS: Record<string, { label: string; description: string }> = {
  triggerMinute: {
    label: "Thời gian kích hoạt",
    description: "Số phút trước khi kết thúc để kích hoạt gia hạn đấu giá",
  },
  extendMinute: {
    label: "Thời gian gia hạn",
    description: "Số phút gia hạn thêm khi có lượt đấu giá mới",
  },
};

const ConfigTab = () => {
  const { settings, isLoading, error, refreshSettings, updateSettingValue } =
    useSettings();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = (id: string, currentValue: string) => {
    setEditingId(id);
    setEditValue(currentValue);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleSave = async (id: string) => {
    setIsSaving(true);
    const success = await updateSettingValue(id, editValue);
    setIsSaving(false);
    if (success) {
      toast.success("Cập nhật cài đặt thành công");
      setEditingId(null);
      setEditValue("");
    } else {
      toast.error("Cập nhật cài đặt thất bại");
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">
            Cấu hình hệ thống
          </h2>
        </div>
        <button
          onClick={refreshSettings}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Làm mới
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Settings List */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
            <span className="text-gray-500">Đang tải cài đặt...</span>
          </div>
        ) : settings.length === 0 ? (
          <div className="p-8 flex flex-col items-center justify-center gap-3">
            <Settings className="w-8 h-8 text-gray-300" />
            <span className="text-gray-500 italic">
              Không có cài đặt nào được tìm thấy.
            </span>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {settings.map((setting) => {
              const labelInfo = SETTING_LABELS[setting.key] || {
                label: setting.key,
                description: "",
              };
              const isEditing = editingId === setting.id;

              return (
                <div
                  key={setting.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-500" />
                        <h3 className="font-medium text-gray-900">
                          {labelInfo.label}
                        </h3>
                        
                      </div>
                      {labelInfo.description && (
                        <p className="text-sm text-gray-500 mt-1 ml-6">
                          {labelInfo.description}
                        </p>
                      )}
                      <div className="text-xs text-gray-400 mt-2 ml-6">
                        Cập nhật lần cuối: {formatDate(setting.updatedAt)} bởi{" "}
                        {setting.updatedBy}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <>
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-20 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            min="1"
                          />
                          <button
                            onClick={() => handleSave(setting.id)}
                            disabled={isSaving}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                          >
                            {isSaving ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Save className="w-3 h-3" />
                            )}
                            Lưu
                          </button>
                          <button
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="px-3 py-1.5 text-gray-600 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 transition-colors"
                          >
                            Hủy
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="text-lg font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-md min-w-[60px] text-center">
                            {setting.value}
                          </span>
                          <span className="text-sm text-gray-500">phút</span>
                          <button
                            onClick={() =>
                              handleEdit(setting.id, setting.value)
                            }
                            className="ml-2 px-3 py-1.5 text-sm text-green-600 border border-green-300 rounded-md hover:bg-green-50 transition-colors"
                          >
                            Sửa
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigTab;
