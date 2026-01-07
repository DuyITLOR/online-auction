import { getSession } from '@/libs/session';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export interface Setting {
  id: string;
  key: string;
  value: string;
  updatedAt: string;
  updatedBy: string;
  user: {
    fullname: string;
  };
}

export interface SettingsResponse {
  code: number;
  data: Setting[];
  message: string;
}

export interface UpdateSettingResponse {
  code: number;
  data: Setting;
  message: string;
}

export const getSettings = async (): Promise<SettingsResponse> => {
  const session = await getSession();
  const token = session?.token;

  const res = await fetch(`${API_URL}/settings`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Không thể lấy cài đặt');
  }

  return res.json();
};

export const updateSetting = async (
  id: string,
  value: string
): Promise<UpdateSettingResponse> => {
  const session = await getSession();
  const token = session?.token;

  const res = await fetch(`${API_URL}/settings/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ value }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Không thể cập nhật cài đặt');
  }

  return res.json();
};
