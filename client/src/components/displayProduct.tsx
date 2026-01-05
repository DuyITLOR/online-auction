/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductContext } from '../libs/contexts/product.context';
import { Heart, Gavel, Clock, Users, Sparkles, Calendar, User, ShoppingCart, ArrowRight } from 'lucide-react';
import type { WatchList } from '../libs/types/types';
import { getSession } from '../libs/session';

const checkIsNew = (dateString: string) => {
  if (!dateString) return false;
  const now = new Date().getTime();
  const start = new Date(dateString).getTime();
  const diffMinutes = (now - start) / (1000 * 60);
  return diffMinutes <= 10 && diffMinutes >= 0;
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${date.getFullYear()}`;
};

const maskBidderName = (name: string) => {
  if (!name) return 'Chưa có';
  if (name.length <= 3) return '***';
  const count = Math.max(0, name.length - 5);
  const stars = '*'.repeat(count);
  return stars + name.slice(-5);
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
  isWatchMore,
}: {
  title: string;
  products: any[];
  toggleWatchList: (id: string) => void;
  watchList: WatchList[];
  isWatchMore: boolean;
}) => {
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const map: Record<string, boolean> = {};
    watchList.forEach((item) => {
      map[item.productId] = true;
    });
    setLikedMap(map);
  }, [watchList]);

  if (!products || products.length === 0) return null;

  return (
    <div className='flex flex-col gap-4 md:gap-5 py-2'>
      {/* Header Section */}
      <div className='flex items-center justify-between mb-2 md:mb-6 px-1'>
        <div className='flex items-center gap-2 md:gap-3'>
          <div className='w-1 h-6 md:h-8 bg-teal-500 rounded-full'></div>
          {/* Responsive Font Size */}
          <p className='font-bold text-xl md:text-2xl lg:text-3xl text-gray-800 truncate max-w-[200px] md:max-w-none'>
            {title}
          </p>
        </div>
        <Link
          to={'/products'}
          className={`group flex items-center gap-1 md:gap-2 text-sm font-semibold text-teal-600 hover:text-teal-800 transition-colors duration-300 ${
            !isWatchMore ? 'hidden' : ''
          }`}
        >
          <span className='text-xs md:text-base underline whitespace-nowrap'>Xem thêm</span>
          <ArrowRight className='w-3 h-3 md:w-4 md:h-4 transition-transform duration-300 group-hover:translate-x-1' />
        </Link>
      </div>

      <div className='flex flex-1 items-stretch gap-3 md:gap-4 overflow-x-auto scroll-container pb-4 md:pb-8 px-1 snap-x snap-mandatory'>
        {products.map((item: any) => {
          const productData = item.product || item;
          const productId = item.productId || item.id;

          const timeStyle = getTimeStatusStyle(productData?.endAt);
          const isNew = checkIsNew(productData?.startedAt);
          const bidCount = productData?.countbids || productData?.bids?.length || 0;

          const highestBidderName =
            productData?.highestBidder?.fullName || productData?.bidHistory?.[0]?.bidder?.fullname || null;

          return (
            <Link
              to={`/product/${productId}`}
              key={productId}
              className={`
                flex flex-col shrink-0 
                bg-white rounded-xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative 
                snap-start 
                /* RESPONSIVE WIDTHS */
                min-w-[260px] max-w-[260px]      /* Mobile: Card to, chiếm gần hết màn hình hoặc 80% */
                sm:min-w-[300px] sm:max-w-[300px] 
                md:min-w-[calc(33.33%-11px)] md:max-w-[calc(33.33%-11px)]  /* Tablet: 3 items */
                lg:min-w-[calc(25%-12px)] lg:max-w-[calc(25%-12px)]      /* Laptop: 4 items */
                xl:min-w-[calc(20%-12.8px)] xl:max-w-[calc(20%-12.8px)]  /* Desktop: 5 items */
                ${isNew ? 'border-purple-300 ring-2 md:ring-4 ring-purple-100' : 'border-gray-100'}
              `}
            >
              {/* Image Container */}
              <div className='relative w-full aspect-square overflow-hidden'>
                <img
                  src={productData?.images?.[0]?.url}
                  className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                  alt={productData?.title}
                />

                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300'></div>

                {isNew && (
                  <div className='absolute top-3 left-2 md:top-9 z-10 animate-bounce-slow'>
                    <div className='bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-lg flex items-center gap-1 border border-white/50'>
                      <Sparkles size={10} className='fill-yellow-200 text-yellow-200 animate-pulse' />
                      <span>NEW</span>
                    </div>
                  </div>
                )}

                <div
                  className={`absolute top-2 left-2 px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg text-[10px] md:text-xs font-bold flex items-center gap-1 shadow-sm ${timeStyle}`}
                >
                  <Clock size={12} />
                  {formatTimeLeft(productData?.endAt)}
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setLikedMap((prev) => ({
                      ...prev,
                      [productId]: !prev[productId],
                    }));
                    toggleWatchList(productId);
                  }}
                  className='absolute top-2 right-2 p-1.5 md:p-2 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-red-500 transition-colors shadow-sm backdrop-blur-sm z-20'
                >
                  <Heart
                    className={`w-4 h-4 md:w-5 md:h-5 transition-colors ${
                      likedMap[productId] ? 'fill-red-500 text-red-500' : ''
                    }`}
                  />
                </button>

                <div className='absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out hidden md:block'>
                  <button className='w-full bg-teal-600 text-white py-2 rounded-lg font-semibold shadow-lg flex items-center justify-center gap-2 hover:bg-teal-700'>
                    <Gavel size={16} /> Đặt giá ngay
                  </button>
                </div>
              </div>

              <div className='flex flex-col flex-1 p-2 md:p-3 gap-1 md:gap-2'>
                <p className='font-bold text-gray-800 line-clamp-2 text-sm min-h-10 group-hover:text-teal-600 transition-colors'>
                  {productData?.title}
                </p>

                <div className='flex flex-col gap-1 md:gap-1.5 mt-1 border-b border-dashed border-gray-100 pb-2 mb-1'>
                  <div className='flex items-center gap-1.5 text-[10px] md:text-[11px] text-gray-400'>
                    <Calendar size={12} />
                    <span>Đăng: {formatDate(productData?.startedAt || productData?.createdAt)}</span>
                  </div>

                  <div className='flex items-center gap-1.5 text-[10px] md:text-[11px] text-gray-500 bg-gray-50 px-2 py-1 rounded-md w-fit'>
                    <User size={12} className='text-teal-500' />
                    <span className='font-medium'>Top Bid:</span>
                    <span className='text-gray-700 font-semibold'>{maskBidderName(highestBidderName)}</span>
                  </div>
                </div>

                <div className='mt-auto flex flex-col gap-1'>
                  {productData?.buyNowPrice && (
                    <div className='flex justify-between items-center text-[10px] md:text-[11px] mb-1'>
                      <span className='text-gray-400 flex items-center gap-1'>
                        <ShoppingCart size={10} /> Mua ngay:
                      </span>
                      <span className='font-bold text-orange-500'>
                        {Number(productData.buyNowPrice).toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className='flex items-end justify-between'>
                    <div className='flex flex-col'>
                      <span className='text-[9px] md:text-[10px] uppercase font-bold text-gray-400'>Giá hiện tại</span>
                      <span className='font-bold text-base md:text-lg text-teal-600 leading-none'>
                        {Number(productData?.currentPrice).toLocaleString()}{' '}
                        <span className='text-xs font-normal text-gray-500'>đ</span>
                      </span>
                    </div>

                    <div className='flex flex-col items-end'>
                      <span className='text-[9px] md:text-[10px] uppercase font-bold text-gray-400'>Lượt đấu</span>
                      <div className='flex items-center gap-1 text-gray-600 bg-gray-100 px-1.5 py-0.5 md:px-2 md:py-0.5 rounded'>
                        <Users size={12} />
                        <span className='font-bold text-xs'>{bidCount > 0 ? bidCount : '-'}</span>
                      </div>
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
          <div className='animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-4 border-teal-500 border-t-transparent'></div>
        </div>
      )}

      {!loading && (
        <div className='flex flex-col mx-auto max-w-full px-4 md:px-8 lg:px-10 mb-5 gap-6 md:gap-8'>
          <ProductSection
            title='Sản phẩm yêu thích'
            products={watchList}
            watchList={watchList}
            toggleWatchList={toggleWatchList}
            isWatchMore={false}
          />

          <ProductSection
            title='Sắp kết thúc'
            products={endingSoonProducts}
            watchList={watchList}
            toggleWatchList={toggleWatchList}
            isWatchMore={true}
          />

          <ProductSection
            title='Nhiều lượt ra giá nhất'
            products={highestBidProducts}
            watchList={watchList}
            toggleWatchList={toggleWatchList}
            isWatchMore={true}
          />

          <ProductSection
            title='Giá cao nhất'
            products={highestPriceProducts}
            watchList={watchList}
            toggleWatchList={toggleWatchList}
            isWatchMore={true}
          />
        </div>
      )}
    </>
  );
};

export default DisplayProduct;
