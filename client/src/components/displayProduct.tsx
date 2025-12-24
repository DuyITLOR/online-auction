/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductContext } from '../libs/contexts/product.context';
import { Heart, Gavel, Clock, Users, Sparkles } from 'lucide-react';
import type { WatchList } from '../libs/types/types';
import { getSession } from '../libs/session';

const checkIsNew = (dateString: string) => {
  if (!dateString) return false;
  const now = new Date().getTime();
  const start = new Date(dateString).getTime();
  const diffMinutes = (now - start) / (1000 * 60);

  return diffMinutes <= 10 && diffMinutes >= 0;
};

const getTimeStatusStyle = (date: string) => {
  const now = new Date();
  const end = new Date(date);
  const diff = end.getTime() - now.getTime();
  const diffHours = diff / (1000 * 60 * 60);

  if (diff <= 0) return 'bg-gray-200 text-gray-500';
  if (diffHours < 24) return 'bg-red-100 text-red-600 animate-pulse';
  if (diffHours < 72) return 'bg-orange-100 text-orange-600';
  return 'bg-emerald-100 text-emerald-600';
};

const formatTimeLeft = (date: string) => {
  const now = new Date();
  const end = new Date(date);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return 'Đã kết thúc';

  const diffDays = diff / (1000 * 60 * 60 * 24);
  const diffHours = diff / (1000 * 60 * 60);
  const diffMinutes = diff / (1000 * 60);

  if (diffDays > 3) {
    return `${end.getDate()}/${end.getMonth() + 1}`;
  } else if (diffDays >= 1) {
    return `${Math.ceil(diffDays)} ngày`;
  } else if (diffHours >= 1) {
    return `${Math.ceil(diffHours)} giờ`;
  } else {
    return `${Math.ceil(diffMinutes)} phút`;
  }
};

const ProductSection = ({
  title,
  products,
  toggleWatchList,
  watchList,
}: {
  title: string;
  products: any[];
  toggleWatchList: (id: string) => void;
  watchList: WatchList[];
}) => {
  const isLike = (id: string) => {
    return watchList.some((item) => id === item.productId || id === item.userId);
  };

  if (!products || products.length === 0) return null;

  return (
    <div className='flex flex-col gap-5 py-2'>
      <div className='flex items-center gap-3'>
        <div className='w-1 h-8 bg-teal-500 rounded-full'></div>
        <p className='font-bold text-2xl text-gray-800'>{title}</p>
      </div>

      <div className='flex flex-1 items-stretch gap-4 overflow-x-auto scroll-container pb-8 px-1'>
        {products.map((item: any) => {
          const productData = item.product || item;
          const productId = item.productId || item.id;
          const timeStyle = getTimeStatusStyle(productData?.endAt);
          const isNew = checkIsNew(productData?.startedAt);
          return (
            <Link
              to={`/product/${productId}`}
              key={productId}
              className={`flex flex-col min-w-[calc(20%-12.8px)] bg-white rounded-xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative ${
                isNew ? 'border-purple-300 ring-4 ring-purple-200' : 'border-gray-100'
              }`}
            >
              <div className='relative w-full aspect-square overflow-hidden'>
                <img
                  src={productData?.images?.[0]?.url}
                  className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                  alt={productData?.title}
                />

                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300'></div>
                {isNew && (
                  <div className='absolute top-9 left-2 z-10 animate-bounce-slow'>
                    <div className='bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 border border-white/50'>
                      <Sparkles size={10} className='fill-yellow-200 text-yellow-200 animate-pulse' />
                      <span>NEW</span>
                    </div>
                  </div>
                )}
                <div
                  className={`absolute top-2 left-2 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm ${timeStyle}`}
                >
                  <Clock size={12} />
                  {formatTimeLeft(productData?.endAt)}
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWatchList(productData?.id);
                  }}
                  className='absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-red-500 transition-colors shadow-sm backdrop-blur-sm'
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isLike(productData?.id) ? 'fill-red-500 text-red-500' : ''
                    }`}
                  />
                </button>

                <div className='absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out'>
                  <button className='w-full bg-teal-600 text-white py-2 rounded-lg font-semibold shadow-lg flex items-center justify-center gap-2 hover:bg-teal-700'>
                    <Gavel size={16} /> Đặt giá ngay
                  </button>
                </div>
              </div>

              <div className='flex flex-col flex-1 p-3 gap-2'>
                <p className='font-medium text-gray-700 line-clamp-2 text-sm min-h-9 group-hover:text-teal-600 transition-colors'>
                  {productData?.title}
                </p>
                <div className='mt-auto pt-2 border-t border-gray-100 flex items-end justify-between'>
                  <div className='flex flex-col'>
                    <span className='text-[10px] uppercase font-bold text-gray-400'>Giá hiện tại</span>
                    <span className='font-bold text-lg text-teal-600 leading-none'>
                      {Number(productData?.currentPrice).toLocaleString()} đ
                    </span>
                  </div>

                  <div className='flex flex-col items-end'>
                    <span className='text-[10px] uppercase font-bold text-gray-400'>Lượt đấu</span>
                    <div className='flex items-center gap-1 text-gray-600'>
                      <Users size={14} />
                      <span className='font-semibold text-sm'>
                        {productData?.countbids > 0 ? productData?.countbids : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const DisplayProduct = () => {
  const [session, setSession] = useState<any>(null);
  const { endingSoonProducts, highestPriceProducts, highestBidProducts, watchList, toggleWatchList, loading, refresh } =
    useContext(ProductContext);

  useEffect(() => {
    const getToken = async () => {
      const sessionValue = await getSession();
      setSession(sessionValue || {});
    };
    getToken();
  }, []);

  useEffect(() => {
    refresh();
  }, [session]);

  return (
    <>
      {loading && (
        <div className='flex items-center justify-center py-20 min-w-full'>
          <div className='animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent'></div>
        </div>
      )}

      {!loading && (
        <div className='flex flex-col mx-auto max-w-[1400px] px-5 md:px-10 mb-5 gap-8'>
          <ProductSection
            title='Sản phẩm yêu thích'
            products={watchList}
            watchList={watchList}
            toggleWatchList={toggleWatchList}
          />

          <ProductSection
            title='Sắp kết thúc'
            products={endingSoonProducts}
            watchList={watchList}
            toggleWatchList={toggleWatchList}
          />

          <ProductSection
            title='Nhiều lượt ra giá nhất'
            products={highestBidProducts}
            watchList={watchList}
            toggleWatchList={toggleWatchList}
          />

          <ProductSection
            title='Giá cao nhất'
            products={highestPriceProducts}
            watchList={watchList}
            toggleWatchList={toggleWatchList}
          />
        </div>
      )}
    </>
  );
};

export default DisplayProduct;
