/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';

interface PaginationResult<T> {
  data: T[];
  loading: boolean;
  page: number;
  totalPages: number;
  setPage: (page: string) => void;
  refresh: () => void;
}

export function usePaginationFetch<T>(
  fetchFunction: (params: any) => Promise<any>,
  token: string | null,
  limit: number = 5
): PaginationResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('1');
  const [totalPage, setTotalPage] = useState(1);

  const fetchData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await fetchFunction({ token, page, limit });
      const items = response.data || response.ratings || response || [];
      const total = response.totalPages || 1;

      setData(items);
      setTotalPage(total);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, page]);

  return { data, loading, page: Number(page), totalPages: totalPage, setPage, refresh: fetchData };
}
