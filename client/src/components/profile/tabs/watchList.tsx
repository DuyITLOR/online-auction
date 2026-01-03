import { Link } from 'react-router-dom';
import { getAllWatchList } from '../../../api/watchlist';
import type { WatchList } from '../../../libs/types/types';
import { Heart } from 'lucide-react';
import Pagination from '../../pagination';
import { usePaginationFetch } from '../../../libs/hooks/pagination';

const WatchProducts = ({ token }: { token: string }) => {
  const { data, loading, page, totalPages, setPage } = usePaginationFetch(getAllWatchList, token);

  if (loading) {
    return (
      <div className='flex items-center justify-center py-20 min-w-full'>
        <div className='animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent'></div>
      </div>
    );
  }
  return (
    <div className='border border-gray-300 px-8 py-4 rounded-md flex flex-col w-full mt-5'>
      <p className='text-lg font-bold mb-5'>Sản phẩm yêu thích</p>
      <div className='grid grid-cols-4 gap-3'>
        {(data as WatchList[]).map((item) => (
          <Link
            to={`/product/${item.productId}`}
            key={`${item.productId}-${item.userId}`}
            className='flex flex-col gap-2 border border-gray-200 rounded-md px-3 py-2 h-fit w-78 relative cursor-pointer z-0'
          >
            <img
              src={item.product.images?.[0].url}
              alt={item.product.title}
              className='w-full h-40 object-cover mb-2'
            />
            <p className='font-semibold text-xl line-clamp-2 min-h-15'>{item.product.title}</p>

            <span className='font-semibold text-2xl'>{Number(item.product.currentPrice).toLocaleString()} VND</span>

            <span className=' text-gray-700 text-sm'>
              {' '}
              Mua ngay: {Number(item.product.buyNowPrice).toLocaleString()} VND
            </span>

            <div className='border-t border-gray-300 mt-2 mb-2' />

            <div className='flex items-center justify-between text-sm'>
              <span>Lượt ra giá: </span>
              <span>{item.product.countbids}</span>
            </div>

            <div className='flex items-center justify-between text-sm'>
              <span>Người bán: </span>
              <span>{item?.product?.seller?.fullname}</span>
            </div>

            <Heart
              className={`w-10 h-10 ${
                item.productId ? 'stroke-0 fill-red-600' : 'stroke-2'
              } absolute right-1 top-1  bg-white hover:bg-gray-100 p-2 rounded-full`}
            />
          </Link>
        ))}
      </div>

      <Pagination page={page} totalPage={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default WatchProducts;
