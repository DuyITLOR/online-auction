/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from 'react';
import { Gavel, Clock, CalendarDays, Trophy, AlertCircle } from 'lucide-react';
import { getActivitiesOfUser } from '../../../api/historyBid';
import Pagination from '../../../components/pagination';
import { Link } from 'react-router-dom';
import { UserContext } from '@/libs/contexts/user.context';
import { formatCurrency } from '@/utils/format';

interface ActivityItem {
  id: string;
  title: string;
  amount: number;
  createdAt: string;
  winnerId?: string;
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

const BidHistory = ({ token }: { token: string }) => {
  const { user } = useContext(UserContext);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getActivitiesOfUser({ page, limit: 10, token });

        const bids: ActivityItem[] = (res.data || []).map((item: any) => ({
          id: item.product?.id,
          title: item.product?.title || 'Unknown Product',
          amount: item.amount,
          createdAt: item.createdAt,
          winnerId: item.product?.winnerId,
        }));

        setActivities(bids);
        setTotalPages(res.totalPage || 1);
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
        <Gavel className='text-teal-600' size={20} />
        <h2 className='text-lg font-bold text-gray-800'>Lịch sử đấu giá</h2>
      </div>

      {activities.length === 0 ? (
        <div className='text-center text-gray-400 py-10 bg-gray-50 rounded-lg border border-dashed border-gray-200'>
          Chưa có hoạt động đấu giá nào gần đây.
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          {activities.map((item, index) => {
            const { time, date } = formatTimeDate(item.createdAt);
            const isLeading = user?.id === item.winnerId;

            const config = isLeading
              ? {
                  borderColor: 'border-green-200 hover:border-green-300',
                  bgColor: 'bg-green-50/50 hover:bg-green-50',
                  barColor: 'bg-green-500',
                  icon: <Trophy size={20} strokeWidth={1.5} />,
                  iconBg: 'bg-green-100 text-green-600 border-green-200',
                  titleColor: 'text-green-800',
                  badgeText: 'Đang dẫn đầu',
                  badgeStyle: 'bg-green-100 text-green-700 border-green-200',
                  amountColor: 'text-green-700',
                }
              : {
                  borderColor: 'border-gray-100 hover:border-red-200',
                  bgColor: 'bg-white hover:bg-red-50/10',
                  barColor: 'bg-gray-300',
                  icon: <AlertCircle size={20} strokeWidth={1.5} />,
                  iconBg: 'bg-white border-gray-200 text-gray-400',
                  titleColor: 'text-gray-700',
                  badgeText: 'Bị vượt',
                  badgeStyle: 'bg-gray-100 text-gray-500 border-gray-200',
                  amountColor: 'text-gray-600',
                };

            return (
              <Link
                to={`/product/${item.id}`}
                key={`${item.id}-${index}`}
                className={`group relative flex items-center justify-between p-4 rounded-lg border transition-all duration-200 
                    ${config.bgColor} ${config.borderColor}`}
              >
                <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full ${config.barColor}`}></div>

                <div className='flex items-center gap-4 pl-3'>
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-full border shadow-sm shrink-0 ${config.iconBg}`}
                  >
                    {config.icon}
                  </div>

                  <div className='flex flex-col gap-0.5'>
                    <p className={`font-bold text-base truncate max-w-[200px] sm:max-w-xs ${config.titleColor}`}>
                      {item.title}
                    </p>

                    <div className='flex items-center gap-2 mt-1'>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${config.badgeStyle}`}
                      >
                        {config.badgeText}
                      </span>

                      <span className={`text-sm font-semibold ${config.amountColor}`}>
                        {formatCurrency(item.amount)} VND
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

export default BidHistory;
