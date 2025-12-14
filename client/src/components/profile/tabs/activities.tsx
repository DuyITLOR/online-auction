import { getActivitiesOfUser } from '../../../api/historyBid';
import { usePaginationFetch } from '../../../libs/hooks/pagination';
import type { AutoBids } from '../../../libs/types/types';
import Pagination from '../../pagination';

const convertISO = (isoString: string | undefined) => {
  if (!isoString) return;
  const date = new Date(isoString);

  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();

  return `${dd}-${mm}-${yyyy}`;
};

const Activities = ({ token }: { token: string }) => {
  const { data, loading, page, totalPages, setPage } = usePaginationFetch(getActivitiesOfUser, token);

  if (loading) {
    return (
      <div className='flex items-center justify-center py-20 min-w-full'>
        <div className='animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent'></div>
      </div>
    );
  }
  return (
    <div className='border border-gray-300 mt-5 w-full px-7 py-3 flex flex-col rounded-md'>
      <p className='text-lg font-bold mb-5'>Hoạt động gần đây</p>

      <div className='flex flex-col gap-3'>
        {(data as AutoBids[]).map((a) => (
          <div
            key={a.id}
            className='border border-gray-300 rounded-md px-4 py-4 w-full flex items-center justify-between'
          >
            <div className='flex flex-col gap-1'>
              <p className='font-bold'>{a.product?.title}</p>
              <p className='text-sm text-gray-400'>Đặt giá {a?.amount.toLocaleString()} VND</p>
            </div>

            <span className='text-sm'>{convertISO(a.createdAt)}</span>
          </div>
        ))}
      </div>

      <Pagination page={page} totalPage={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default Activities;
