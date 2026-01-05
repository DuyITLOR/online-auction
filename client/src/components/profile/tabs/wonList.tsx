/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Trophy, Clock, CalendarDays } from 'lucide-react';
import { getAllProductByBidder } from '../../../api/order';
import Pagination from '../../pagination';
import { Link } from 'react-router-dom';

interface ActivityItem {
  id: string;
  title: string;
  amount: number;
  createdAt: string;
  status?: string;
}

const formatTimeDate = (isoString: string | undefined) => {
  if (!isoString) return { time: '--:--', date: '--/--' };
  const dateObj = new Date(isoString);

  const time = dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  const date = dateObj.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return { time, date };
};

const WonList = ({ token }: { token: string }) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const winRes = await getAllProductByBidder(token);

        const wins: ActivityItem[] = (winRes.data || []).map((item: any) => ({
          id: item.product?.id,
          title: item.product?.title || 'Winning Order',
          amount: item.totalPrice || item.totalAmount || 0,
          createdAt: item.createdAt,
          status: item.status,
        }));

        const sortedWins = wins.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setActivities(sortedWins);
        setTotalPages(winRes.totalPages || 1);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, token]);

  const handlePageChange = (newPage: string) => {
    setPage(Number(newPage));
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center py-20 w-full'>
        <div className='animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent'></div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-xl border border-gray-100 shadow-sm mt-5 w-full px-6 py-6 flex flex-col'>
      <div className='flex items-center gap-2 mb-6 border-b border-gray-100 pb-4'>
        <Trophy className='text-amber-500' size={20} />
        <h2 className='text-lg font-bold text-gray-800'>Lịch sử thắng thầu</h2>
      </div>

      {activities.length === 0 ? (
        <div className='text-center text-gray-400 py-10 bg-gray-50 rounded-lg border border-dashed border-gray-200'>
          Bạn chưa thắng sản phẩm nào.
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          {activities.map((item) => {
            const { time, date } = formatTimeDate(item.createdAt);

            return (
              <Link
                to={`/product/${item.id}`}
                key={item.id}
                className='group relative flex items-center justify-between p-4 rounded-lg border transition-all duration-200 
                   bg-white border-gray-100 hover:border-amber-200 hover:bg-amber-50/30'
              >
                <div className='absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-amber-400'></div>

                <div className='flex items-center gap-4 pl-3'>
                  <div className='w-12 h-12 flex items-center justify-center rounded-full border shadow-sm shrink-0 bg-linear-to-br from-amber-50 to-orange-50 border-amber-100 text-amber-600'>
                    <Trophy size={20} strokeWidth={2} />
                  </div>

                  <div className='flex flex-col gap-0.5'>
                    <p className='font-bold text-base truncate max-w-[200px] sm:max-w-xs text-gray-900'>{item.title}</p>

                    <div className='flex items-center gap-2 mt-1'>
                      <span className='text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border bg-amber-50 text-amber-700 border-amber-200'>
                        Thắng thầu
                      </span>

                      <span className='text-sm font-semibold text-amber-600'>{item.amount.toLocaleString()} đ</span>
                    </div>
                  </div>
                </div>

                <div className='flex flex-col items-end gap-1 ml-4'>
                  <div className='flex items-center gap-1.5 text-gray-900 font-semibold text-sm'>
                    <Clock size={14} className='text-gray-400' />
                    {time}
                  </div>
                  <div className='flex items-center gap-1.5 text-gray-400 text-xs font-medium'>
                    <CalendarDays size={12} />
                    {date}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div className='mt-8 flex justify-end'>
        <Pagination page={page} totalPage={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};

export default WonList;
