/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Gavel, Trophy, Clock, CalendarDays } from 'lucide-react';
import { getActivitiesOfUser } from '../../../api/historyBid';
import { getAllProductByBidder } from '../../../api/order';
import Pagination from '../../../components/pagination';

interface ActivityItem {
  id: string;
  type: 'BID' | 'WIN';
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

const Activities = ({ token }: { token: string }) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bidRes, winRes] = await Promise.all([
          getActivitiesOfUser({ page, limit: 10, token }),
          getAllProductByBidder(token),
        ]);

        const bids: ActivityItem[] = (bidRes.data || []).map((item: any) => ({
          id: `bid-${item.id}`,
          type: 'BID',
          title: item.product?.title || 'Unknown Product',
          amount: item.amount,
          createdAt: item.createdAt,
        }));

        const wins: ActivityItem[] = (winRes.data || []).map((item: any) => ({
          id: `win-${item.id}`,
          type: 'WIN',
          title: item.product?.title || 'Winning Order',
          amount: item.totalPrice || item.totalAmount || 0,
          createdAt: item.createdAt,
          status: item.status,
        }));

        const combined = [...bids, ...wins].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setActivities(combined);
        setTotalPages(Math.max(bidRes.totalPage || 1, winRes.totalPage || 1));
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
        <Clock className='text-teal-600' size={20} />
        <h2 className='text-lg font-bold text-gray-800'>Lịch sử hoạt động</h2>
      </div>

      {activities.length === 0 ? (
        <div className='text-center text-gray-400 py-10 bg-gray-50 rounded-lg border border-dashed border-gray-200'>
          Chưa có hoạt động nào gần đây.
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          {activities.map((item) => {
            const { time, date } = formatTimeDate(item.createdAt);
            const isWin = item.type === 'WIN';

            return (
              <div
                key={item.id}
                className='group relative flex items-center justify-between p-4 rounded-lg border transition-all duration-200 
                  
                      bg-white border-gray-100 hover:border-teal-200 hover:bg-slate-50'
              >
                <div className='absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-teal-400'></div>

                <div className='flex items-center gap-4 pl-3'>
                  {/* Icon Box */}
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-full border shadow-sm shrink-0 ${
                      isWin
                        ? 'bg-linear-to-br from-amber-50 to-orange-50 border-amber-100 text-amber-600'
                        : 'bg-white border-gray-100 text-gray-400 group-hover:text-teal-500 group-hover:border-teal-100'
                    }`}
                  >
                    {isWin ? <Trophy size={20} strokeWidth={2} /> : <Gavel size={20} strokeWidth={1.5} />}
                  </div>

                  <div className='flex flex-col gap-0.5'>
                    <p
                      className={`font-bold text-base truncate max-w-[200px] sm:max-w-xs ${
                        isWin ? 'text-gray-900' : 'text-gray-700'
                      }`}
                    >
                      {item.title}
                    </p>

                    <div className='flex items-center gap-2 mt-1'>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                          isWin
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-gray-100 text-gray-500 border-gray-200'
                        }`}
                      >
                        {isWin ? 'Thắng thầu' : 'Đặt giá'}
                      </span>

                      <span className={`text-sm font-semibold ${isWin ? 'text-amber-600' : 'text-teal-600'}`}>
                        {item.amount.toLocaleString()} đ
                      </span>
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
              </div>
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

export default Activities;
