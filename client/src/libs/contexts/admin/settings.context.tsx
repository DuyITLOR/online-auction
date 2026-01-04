import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  getSettings,
  updateSetting,
  type Setting,
} from "../../../api/settings";
import { useAdmin } from "./admin.context";

interface SettingsContextType {
  settings: Setting[];
  isLoading: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
  updateSettingValue: (id: string, value: string) => Promise<boolean>;
  getSettingByKey: (key: string) => Setting | undefined;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { token } = useAdmin();
  const [settings, setSettings] = useState<Setting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await getSettings();
      setSettings(response.data);
    } catch (err) {
      console.error("Failed to fetch settings:", err);
      setError(err instanceof Error ? err.message : "Lỗi khi tải cài đặt");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchSettings();
    }
  }, [token, fetchSettings]);

  const refreshSettings = useCallback(async () => {
    await fetchSettings();
  }, [fetchSettings]);

  const updateSettingValue = useCallback(
    async (id: string, value: string): Promise<boolean> => {
      try {
        console.log("Updating setting:", id, value);
        const response = await updateSetting(id, value);
        // Update local state with the new value
        setSettings((prev) =>
          prev.map((setting) =>
            setting.id === id ? response.data : setting
          )
        );
        return true;
      } catch (err) {
        console.error("Failed to update setting:", err);
        setError(
          err instanceof Error ? err.message : "Lỗi khi cập nhật cài đặt"
        );
        return false;
      }
    },
    []
  );

  const getSettingByKey = useCallback(
    (key: string): Setting | undefined => {
      return settings.find((setting) => setting.key === key);
    },
    [settings]
  );

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        error,
        refreshSettings,
        updateSettingValue,
        getSettingByKey,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
