import { getSession } from '../libs/session';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export interface SellerStats {
  products: unknown[];
  orders: unknown[];
  revenue: number;
  ratingValue: string;
}

export interface SellerStatsResponse {
  code: number;
  data: SellerStats;
  message: string;
}

export async function getSellerStats(): Promise<SellerStatsResponse> {
  const session = await getSession();
  const token = session?.token as string;

  const response = await fetch(`${API_URL}/sellers/stats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch seller stats');
  }

  return response.json();
}
