/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import {
  ArrowRight,
  ChevronRight,
  Clock,
  Crown,
  Heart,
  Minus,
  Package,
  Plus,
  SquarePen,
  Loader2,
  Ban,
  UserMinus,
  AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import ProductDescription from './description';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tab';
import Review from './review';
import { useNavigate } from 'react-router-dom';

import type { BidHistory, Product, ProductImage, User, WatchList } from '../../libs/types/types';
import ImageSlider from './ImageSlider';
import { useContext, useEffect, useState } from 'react';
import {
  DialogFooter,
  DialogHeader,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { autoBid } from '../../api/autoBid';
import { toast } from 'sonner';
import { ProductContext } from '../../libs/contexts/product.context';
import { buyNow, getAllProduct } from '../../api/product';
import { calculateRating } from '../../libs/utils';
import { getOrderByProductId } from '@/api/order';
import { formatCurrency } from '@/utils/format';
import { blockUserFromBidding } from '@/api/user';

interface ProductProp {
  product: Product;
  historyBid: BidHistory[];
  token: string;
  onRefresh: () => void;
  user: User | undefined;
}

const maskName = (fullname: string | null | undefined) => {
  if (!fullname) return 'Người dùng ẩn danh';
  const parts = fullname.trim().split(' ');

  if (parts.length === 1) {
    return parts[0].length > 2 ? parts[0].substring(0, 2) + '***' : '***';
  }
  const lastName = parts[0];
  const maskedParts = parts.slice(1).map(() => '****');
  return `${lastName} ${maskedParts.join(' ')}`;
};

function formatDate(isoString: string | undefined, options = { time: false }) {
  if (!isoString) return;
  const d = new Date(isoString);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  if (!options.time) {
    return `${year}-${month}-${day}`;
  }

  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const formatTimeLeft = (date: string) => {
  const now = new Date();
  const end = new Date(date);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return 'Hết hạn';

  const diffDays = diff / (1000 * 60 * 60 * 24);
  const diffHours = diff / (1000 * 60 * 60);
  const diffMinutes = diff / (1000 * 60);

  if (diffDays > 3) {
    return `Kết thúc: ${end.getDate()}/${end.getMonth() + 1}/${end.getFullYear()}`;
  } else if (diffDays >= 1) {
    return `Thời gian còn lại: ${Math.ceil(diffDays)} ngày`;
  } else if (diffHours >= 1) {
    return `Thời gian còn lại: ${Math.ceil(diffHours)} giờ`;
  } else {
    return `Thời gian còn lại: ${Math.ceil(diffMinutes)} phút`;
  }
};

const isExpired = (date: string) => {
  const now = new Date();
  const end = new Date(date);
  const diff = end.getTime() - now.getTime();
  return diff < 0;
};

const Detail = ({ product, historyBid, token, onRefresh, user }: ProductProp) => {
  const minBidPrice = Number(product?.currentPrice) + Number(product?.stepPrice);
  const [price, setPrice] = useState(minBidPrice);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isBidding, setIsBidding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [isOrder, setOrder] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const [kickDialog, setKickDialog] = useState(false);
  const [selectedBidder, setSelectedBidder] = useState<{ id: string; name: string } | null>(null);
  const [isKicking, setIsKicking] = useState(false);
  const [reason, setReason] = useState('');

  const navigate = useNavigate();

  const isSeller = user?.id === product?.sellerId;

  const { watchList, toggleWatchList } = useContext(ProductContext);
  const isLike = (id: string) => {
    return watchList.some((item: WatchList) => item.productId === id);
  };

  const fetchProducts = async () => {
    try {
      const products = await getAllProduct({ categoryId: product.categoryId, isBidder: 'true' });
      const filterProducts = products.data.filter((item: Product) => item.id !== product.id);
      setSimilarProducts(filterProducts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    setPrice((prev) => Math.max(prev, minBidPrice));
  }, [product?.currentPrice, minBidPrice]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    value = value.replace(/[^0-9]/g, '');

    const numericValue = Number(value);
    setPrice(numericValue);
  };

  const plusPriceHandle = () => {
    const curPrice = price;
    const stepPrice = Number(product.stepPrice);
    setPrice(curPrice + stepPrice);
  };

  const minusPriceHandle = () => {
    const curPrice = price;
    const stepPrice = Number(product.stepPrice);
    setPrice(curPrice - stepPrice);
  };

  const handleBuyNow = async () => {
    try {
      setIsBuying(true);
      const data = await buyNow({ productId: product.id, token });
      await autoBid({ productId: product.id, maxAutoBidAmount: Number(product.buyNowPrice), token });
      navigate(`/payment/${data.id}`);
    } catch (err) {
      toast.error('Có lỗi trong quá trình mua ngay. Vui lòng thử lại');
      console.error(err);
      setIsBuying(false);
    } finally {
      setOpen(false);
      setConfirm(false);
    }
  };

  const handleAutoBid = async ({
    productId,
    maxAutoBidAmount,
    token,
  }: {
    productId: string;
    maxAutoBidAmount: number;
    token: string;
  }) => {
    if (price < minBidPrice) {
      toast.error('Giá không hợp lệ', {
        description: `Mức giá tối thiểu phải là ${minBidPrice.toLocaleString()} VND`,
      });
      setPrice(minBidPrice);
      return;
    }

    if (product.buyNowPrice && price >= Number(product.buyNowPrice)) {
      setOpen(true);
      setConfirm(false);
      return;
    }

    try {
      setIsBidding(true);

      await autoBid({ productId, maxAutoBidAmount, token });

      onRefresh();

      toast.success('Thành công!', {
        description: 'Bạn đã đặt giá thành công sản phẩm này.',
      });
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Unexpected error';
      toast.error('Thất bại', {
        description: message,
      });
    } finally {
      setIsBidding(false);
      setConfirm(false);
    }
  };

  const handleKickBidder = async () => {
    if (!selectedBidder) return;

    if (!reason.trim()) {
      toast.error('Vui lòng nhập lý do loại người dùng này');
      return;
    }

    try {
      setIsKicking(true);
      await blockUserFromBidding(selectedBidder.id, product.id, reason, token);
      toast.success('Đã loại người dùng khỏi phiên đấu giá');
      onRefresh();
    } catch (err) {
      toast.error('Không thể loại người dùng này');
      console.error(err);
    } finally {
      setIsKicking(false);
      setKickDialog(false);
      setSelectedBidder(null);
      setReason('');
    }
  };

  const navigateToOrder = async () => {
    try {
      setOrder(true);
      const data = await getOrderByProductId(product.id, token);

      navigate(`/payment/${data.id}`);
    } catch (err) {
      console.error(err);
      setOrder(false);
    }
  };

  if (!product) return <div className='loader' />;

  return (
    <div className='w-full flex flex-col px-4 md:px-8 mt-4 md:mt-10 mb-10'>
      <div className='flex flex-col lg:flex-row gap-8'>
        <div className='flex flex-col lg:flex-row gap-3 w-full lg:w-3/5'>
          {/* Left vertical thumbnails - keep all images visible like before */}
          <div className='flex lg:flex-col gap-2 lg:overflow-x-hidden min-w-20 overflow-y-auto w-full lg:w-24 h-20 lg:h-[500px] scrollbar-hide order-2 lg:order-1'>
            {product?.images?.map((item: ProductImage, index: number) => (
              <div
                onClick={() => setCurrentIdx(index)}
                key={index}
                className={`
                  min-w-17 w-17 h-17 lg:w-full lg:h-24 rounded-xl shrink-0 cursor-pointer
                  bg-gray-200 border-2
                  ${index === currentIdx ? 'border-teal-400 ' : 'border-gray-300'}
                  transition-all duration-300 ease-in-out
                `}
              >
                <img src={item?.url} className='rounded-lg w-full h-full object-cover' />
              </div>
            ))}
          </div>

          {/* Main image slider */}
          <div className='relative w-full flex-1 h-[300px] sm:h-[400px] lg:h-[500px] border border-gray-300 rounded-xl bg-gray-200 flex justify-center items-center order-1 lg:order-2 overflow-hidden'>
            <ImageSlider
              images={(product?.images as ProductImage[]) || []}
              className='w-full h-full'
              currentIndex={currentIdx}
              onChange={setCurrentIdx}
              autoplay
              interval={3500}
            />
            <Heart
              onClick={(e) => {
                e.preventDefault();
                toggleWatchList(product?.id);
              }}
              className={`w-10 h-10 ${
                isLike(product?.id) ? 'stroke-0 fill-red-600' : 'stroke-2'
              } absolute right-2 top-2 bg-white hover:bg-gray-100 p-2 rounded-full cursor-pointer shadow-sm`}
            />
          </div>
        </div>

        <div className='flex flex-col w-full lg:w-2/5'>
          <p className='text-xl md:text-2xl font-bold'>{product?.title}</p>
          <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-10 mt-3'>
            <div className='flex items-center gap-1 text-gray-500'>
              <Clock className='w-4 h-4' />
              <p className='text-xs md:text-sm'>Đăng: {formatDate(product?.startedAt)} </p>
            </div>

            <div className='flex items-center gap-1 text-gray-500'>
              <SquarePen className='w-4 h-4' />
              <p className='text-xs md:text-sm'>Chỉnh sửa: {formatDate(product?.updatedAt)}</p>
            </div>
          </div>
          <div className='border-spacing-0.5 border-t border-gray-200 mt-2 mb-4 w-full' />
          <div className='flex justify-start items-center'>
            <Avatar className='w-10 h-10 md:w-12 md:h-12'>
              <AvatarImage
                src={product.seller.avtUrl}
                alt='User Avatar'
                className='border border-gray-400 rounded-full'
              />
            </Avatar>

            <div className='flex items-center justify-between w-full ml-3 md:ml-5'>
              <div>
                <p className='text-sm font-semibold'> {product?.seller?.fullname} </p>
                <div className='flex items-center gap-3'>
                  <Link
                    to={`/rating/${product.sellerId}`}
                    className='text-xs md:text-sm text-teal-600 font-semibold underline'
                  >
                    Đánh giá: {calculateRating(product.seller.ratingPos, product.seller.ratingNeg)}
                  </Link>
                  <Link
                    to={`/shop/${product?.sellerId}`}
                    className='text-xs md:text-sm text-gray-500 underline hover:text-teal-600'
                  >
                    Sản phẩm khác
                  </Link>
                </div>
              </div>
              <ChevronRight className='text-end w-8 h-8 md:w-10 md:h-10 rounded-full p-2 hover:bg-gray-200 cursor-pointer' />
            </div>
          </div>
          <div className='border-spacing-0.5 border-t border-gray-200 mt-4 mb-2 w-full' />
          <div className='flex flex-col gap-2'>
            <div className='flex items-end gap-5'>
              <p className='font-semibold text-gray-700 text-sm md:text-base'>Giá hiện tại: </p>
              <span className='text-xl md:text-2xl font-bold text-teal-700'>
                {Number(product?.currentPrice).toLocaleString()} VND
              </span>
            </div>

            <p className='text-gray-700 text-sm md:text-base'>Lượt ra giá: {product?.countbids}</p>

            <p className='text-gray-700 text-sm md:text-base font-medium'> {formatTimeLeft(product?.endAt)} </p>
          </div>
          <div className='border-spacing-0.5 border-t border-gray-200 mt-2 mb-3 w-full' />

          <div className='flex flex-col'>
            {!isExpired(product.endAt) && product.status === 'ACTIVE' && !isSeller && (
              <>
                <p className='text-gray-700 font-semibold text-base md:text-lg mb-2'>Đặt mức giá tối đa cho sản phẩm</p>

                <div className='flex flex-wrap gap-2 md:gap-3 items-center'>
                  <div className='flex items-center gap-2 w-full sm:w-auto'>
                    <Plus
                      onClick={plusPriceHandle}
                      className='h-8 w-8 p-1 border border-gray-200 stroke-2 bg-slate-300 rounded-full cursor-pointer hover:bg-slate-400 transition-colors'
                    />
                    <div className='relative flex-1 sm:flex-none'>
                      <input
                        type='text'
                        value={price.toLocaleString('vi-VN')}
                        onChange={handleChange}
                        className='h-10 p-2 border text-lg border-gray-200 rounded-md focus-visible:outline-0.5 focus-visible:outline-gray-600 w-full sm:w-[200px] md:w-[260px] pl-2'
                      />
                    </div>
                    <div className='bg-gray-400 p-2 font-semibold rounded-md w-15 h-10 flex items-center justify-center text-sm'>
                      VND
                    </div>
                  </div>

                  {price > Number(product.currentPrice) + Number(product.stepPrice) && (
                    <Minus
                      onClick={minusPriceHandle}
                      className='h-8 w-8 p-1 border border-gray-200 stroke-2 bg-slate-300 rounded-full cursor-pointer hover:bg-slate-400 transition-colors'
                    />
                  )}
                </div>

                <p className='text-gray-600 text-xs mt-3 '>
                  Mức giá tối thiểu có thể đặt là:{' '}
                  {(Number(product?.currentPrice) + Number(product?.stepPrice)).toLocaleString()} VND (Bước giá:{' '}
                  {Number(product.stepPrice).toLocaleString()} VND)
                </p>
              </>
            )}
          </div>

          {isExpired(product.endAt) || product.status !== 'ACTIVE' ? (
            <div className='mt-4'>
              <div className='bg-linear-to-br from-gray-50 to-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs'>
                <div
                  className={`p-4 md:p-6 ${
                    !product.winnerId
                      ? 'bg-gray-100'
                      : user?.id === product.winnerId
                      ? 'bg-linear-to-r from-yellow-50 to-orange-50'
                      : user?.id === product.seller.id
                      ? 'bg-linear-to-r from-blue-50 to-indigo-50'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className='flex flex-col sm:flex-row justify-between items-start mb-4 gap-2'>
                    <div>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                          !product.winnerId
                            ? 'bg-gray-200 text-gray-500 border-gray-300'
                            : user?.id === product.winnerId
                            ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                            : user?.id === product.seller.id
                            ? 'bg-blue-100 text-blue-700 border-blue-200'
                            : 'bg-gray-200 text-gray-600 border-gray-300'
                        }`}
                      >
                        {!product.winnerId ? (
                          <>
                            <Ban className='w-3 h-3' />
                            Không thành công
                          </>
                        ) : user?.id === product.winnerId ? (
                          <>
                            <Crown className='w-3 h-3' />
                            Bạn đã thắng
                          </>
                        ) : user?.id === product.seller.id ? (
                          <>
                            <Package className='w-3 h-3' />
                            Sản phẩm của bạn
                          </>
                        ) : (
                          <>
                            <Package className='w-3 h-3' />
                            Đã kết thúc
                          </>
                        )}
                      </span>
                      <h3 className='mt-3 text-lg md:text-xl font-bold text-gray-900'>
                        {!product.winnerId ? 'Kết thúc - Không có người mua' : 'Phiên đấu giá hoàn tất'}
                      </h3>
                    </div>
                    {(!isExpired(product.endAt) || product.winnerId) && (
                      <div className='text-left sm:text-right'>
                        <p className='text-sm text-gray-500 mb-1'>Giá chốt</p>
                        <p className='text-xl md:text-2xl font-mono font-bold text-teal-700 mt-1 sm:mt-3'>
                          {Number(product.currentPrice).toLocaleString()} ₫
                        </p>
                      </div>
                    )}
                  </div>

                  {(user?.id === product.winnerId || user?.id === product.seller.id) && (
                    <div className='flex flex-col gap-3 mt-4 pt-4 border-t border-gray-200/60'>
                      <div className='flex items-start gap-3 text-sm text-gray-600 mb-2'>
                        <div className='bg-white p-2 rounded-full shadow-xs shrink-0'>
                          {!product.winnerId ? (
                            <Ban className='w-5 h-5 text-gray-400' />
                          ) : user?.id === product.winnerId ? (
                            <Package className='w-5 h-5 text-teal-600' />
                          ) : (
                            <Crown className='w-5 h-5 text-yellow-500' />
                          )}
                        </div>

                        {!product.winnerId ? (
                          <p className='mt-1'>Phiên đấu giá kết thúc mà chưa có người đặt giá hợp lệ.</p>
                        ) : user?.id === product.winnerId ? (
                          <p className='mt-1'>Vui lòng kiểm tra đơn hàng và tiến hành thanh toán để nhận sản phẩm.</p>
                        ) : (
                          <p className='mt-1'>
                            Người chiến thắng:{' '}
                            <span className='font-bold text-gray-900'>
                              {maskName(historyBid[0]?.bidder?.fullname || 'Ẩn danh')}
                            </span>
                            . Vui lòng chuẩn bị hàng.
                          </p>
                        )}
                      </div>

                      {product.winnerId && (
                        <Button
                          onClick={navigateToOrder}
                          className={`w-full h-12 text-base shadow-sm group ${
                            user?.id === product.winnerId
                              ? 'bg-teal-600 hover:bg-teal-700'
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          {isOrder ? (
                            <>
                              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                              Đang xử lý
                            </>
                          ) : user?.id === product.winnerId ? (
                            'Xem đơn hàng'
                          ) : (
                            'Quản lý đơn hàng này'
                          )}
                          <ArrowRight className='ml-2 w-4 h-4 transition-transform group-hover:translate-x-1' />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              {!isSeller ? (
                <>
                  <Button
                    variant={'outline'}
                    className='bg-black text-white transition delay-150 duration-200 ease-in-out hover:scale-102 mt-5 hover:cursor-pointer h-12 w-full'
                    onClick={() => setConfirm(true)}
                    disabled={isBidding}
                  >
                    {isBidding ? 'Đang xử lý...' : 'Đặt giá ngay'}
                  </Button>
                  {product.buyNowPrice && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant={'outline'}
                          className='bg-teal-500 transition delay-150 duration-200 ease-in-out hover:scale-102 mt-3 md:mt-5 text-gray-100 hover:cursor-pointer h-12 w-full'
                        >
                          <div className='flex flex-col items-center leading-tight'>
                            <p className='text-sm md:text-base'>Mua ngay</p>
                            <p className='text-xs md:text-sm'>{Number(product?.buyNowPrice).toLocaleString()} VND</p>
                          </div>
                        </Button>
                      </DialogTrigger>

                      <DialogContent className='max-w-[90vw] sm:max-w-[480px] rounded-xl'>
                        <DialogHeader>
                          <DialogTitle className='text-xl font-semibold text-gray-800'>Xác nhận mua ngay</DialogTitle>

                          <div className='mt-3 space-y-3 text-gray-700 leading-relaxed text-sm md:text-base'>
                            <p>
                              Bạn đang chọn <span className='font-medium text-teal-600'>Mua ngay</span> với mức giá:
                            </p>

                            <p className='text-center text-xl md:text-2xl font-bold text-teal-600'>
                              [{Number(product.buyNowPrice).toLocaleString()}] VND
                            </p>

                            <p>
                              Sau khi xác nhận, phiên đấu giá sẽ kết thúc và sản phẩm sẽ thuộc về bạn với mức giá này.
                            </p>

                            <p>Bạn có chắc chắn muốn tiếp tục không?</p>
                          </div>
                        </DialogHeader>

                        <DialogFooter className='mt-4 flex-col gap-2 sm:flex-row'>
                          <div className='flex items-center justify-end gap-2 w-full'>
                            <DialogClose asChild>
                              <Button variant='outline' className='flex-1 sm:flex-none'>
                                Hủy
                              </Button>
                            </DialogClose>
                            <Button
                              onClick={handleBuyNow}
                              className='bg-teal-600 hover:bg-teal-700 flex-1 sm:flex-none sm:min-w-[100px]'
                              disabled={isBuying}
                            >
                              {isBuying ? (
                                <>
                                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                  Đang xử lý
                                </>
                              ) : (
                                'Xác nhận'
                              )}
                            </Button>
                          </div>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                  <Dialog open={confirm} onOpenChange={setConfirm}>
                    <DialogContent className='max-w-[90vw] sm:max-w-[480px] rounded-xl'>
                      <DialogHeader>
                        <DialogTitle className='text-lg md:text-xl font-bold text-gray-800 text-center'>
                          Xác nhận đấu giá
                        </DialogTitle>

                        <div className='mt-4 space-y-4 text-gray-700 leading-relaxed text-sm md:text-base text-center'>
                          <p>Bạn đang thực hiện yêu cầu đấu giá cho sản phẩm này.</p>

                          <div className='bg-teal-50 py-3 px-4 rounded-lg border border-teal-100'>
                            <span className='block text-gray-600 text-xs uppercase font-semibold mb-1'>
                              Tổng thanh toán
                            </span>
                            <span className='font-bold text-2xl text-teal-600 block'>{formatCurrency(price)} VND</span>
                          </div>

                          <p>Bạn có chắc chắn muốn hoàn tất giao dịch này không?</p>
                        </div>
                      </DialogHeader>

                      <DialogFooter className='mt-5 flex-col gap-3 sm:flex-row sm:justify-center'>
                        <div className='flex items-center gap-3 w-full'>
                          <DialogClose asChild onClick={() => setConfirm(false)}>
                            <Button variant='outline' className='flex-1 border-gray-300 hover:bg-gray-100'>
                              Đóng
                            </Button>
                          </DialogClose>

                          <Button
                            disabled={isBidding}
                            onClick={() => handleAutoBid({ productId: product.id, maxAutoBidAmount: price, token })}
                            className='bg-teal-500 hover:bg-teal-600 text-white flex-1 font-medium'
                            type='submit'
                          >
                            {isBidding ? (
                              <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Đang xử lý
                              </>
                            ) : (
                              'Xác nhận'
                            )}
                          </Button>
                        </div>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className='max-w-[90vw] sm:max-w-[480px] rounded-xl'>
                      <DialogHeader>
                        <DialogTitle className='text-lg md:text-xl font-semibold text-gray-800'>
                          Giá bạn đặt cao hơn giá Mua ngay
                        </DialogTitle>

                        <div className='mt-3 space-y-3 text-gray-700 leading-relaxed text-sm md:text-base'>
                          <p>
                            Giá bạn vừa đặt đang <span className='font-medium text-red-600'>cao hơn</span> mức{' '}
                            <span className='font-medium text-teal-600'>Mua ngay</span> của sản phẩm.
                          </p>

                          <p className='text-center text-xl md:text-2xl font-bold text-teal-600'>
                            Giá Mua ngay: [{Number(product.buyNowPrice).toLocaleString()}] VND
                          </p>

                          <p>
                            Bạn có muốn <span className='font-medium text-teal-600'>mua ngay</span> sản phẩm với mức giá
                            này để kết thúc phiên đấu giá không?
                          </p>
                        </div>
                      </DialogHeader>

                      <DialogFooter className='mt-4 flex-col gap-2 sm:flex-row'>
                        <div className='flex items-center justify-end gap-2 w-full'>
                          <DialogClose asChild onClick={() => setOpen(false)}>
                            <Button variant='outline' className='flex-1 sm:flex-none'>
                              Hủy
                            </Button>
                          </DialogClose>
                          <Button
                            onClick={handleBuyNow}
                            className='bg-teal-500 hover:bg-teal-600 text-white flex-1 sm:flex-none px-5'
                            type='submit'
                          >
                            {isBuying ? (
                              <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Đang xử lý
                              </>
                            ) : (
                              'Xác nhận'
                            )}
                          </Button>
                        </div>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              ) : (
                <div className='flex flex-col gap-3 mt-5'>
                  <div className='flex items-center gap-3 p-4 bg-teal-50 text-teal-800 rounded-xl border border-teal-200'>
                    <AlertCircle className='w-5 h-5 shrink-0' />
                    <div>
                      <p className='font-semibold'>Đây là sản phẩm của bạn</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className='border-spacing-0.5 border-t border-gray-300 mt-10 md:mt-20 mb-5' />

      <div className='flex flex-col gap-1'>
        <p className='text-xl md:text-2xl font-semibold mb-5'>Giao dịch</p>
        <div className='flex flex-col gap-3'>
          {historyBid.length === 0 ? (
            <div className='text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300'>
              <p className='text-gray-500'>Chưa có ai đặt giá cho sản phẩm này.</p>
            </div>
          ) : (
            historyBid.map((item: BidHistory, index: number) => (
              <div
                key={item.id}
                className={`
                  flex items-center justify-between border px-3 py-3 md:px-6 md:py-4 rounded-xl transition-all
                  ${
                    index === 0
                      ? 'bg-linear-to-r from-teal-50 to-white border-teal-400 shadow-md'
                      : 'bg-white border-gray-300 hover:border-gray-500'
                  }
                `}
              >
                <Link to={`/rating/${item.bidderId}`} className='flex items-center gap-2 md:gap-4'>
                  <div
                    className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center border border-gray-300 justify-center font-bold text-xs md:text-sm ${
                      index === 0 ? 'bg-yellow-400 text-white shadow-sm' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index === 0 ? <Crown className='w-4 h-4 md:w-5 md:h-5 fill-yellow-600' /> : index + 1}
                  </div>

                  <Avatar className={`${index === 0 ? 'border-2 border-teal-300' : ''} w-8 h-8 md:w-10 md:h-10`}>
                    <AvatarImage src={item.bidder.avtUrl} />
                  </Avatar>

                  <div className='flex flex-col'>
                    <span
                      className={`font-semibold text-sm md:text-lg ${index === 0 ? 'text-gray-900' : 'text-gray-700'}`}
                    >
                      {maskName(item?.bidder?.fullname!)}
                      {index === 0 && (
                        <span className='ml-2 text-[10px] md:text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-bold whitespace-nowrap'>
                          Dẫn đầu
                        </span>
                      )}
                    </span>
                    <span className='text-[10px] md:text-xs text-gray-400'>
                      {formatDate(item.createdAt, { time: true })}
                    </span>
                  </div>
                </Link>
                <div className='flex items-center gap-3'>
                  <div className='text-right'>
                    <p
                      className={`text-sm md:text-xl font-bold font-mono ${
                        index === 0 ? 'text-teal-700' : 'text-gray-600'
                      }`}
                    >
                      {Number(item.amount).toLocaleString()} <span className='hidden sm:inline'>VND</span>
                    </p>
                  </div>
                  {user?.id === product.seller.id && (
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-red-500 hover:text-red-700 hover:bg-red-50'
                      onClick={() => {
                        setSelectedBidder({ id: item.bidder.id, name: item.bidder.fullname || 'Ẩn danh' });
                        setKickDialog(true);
                      }}
                      title='Loại người dùng này'
                    >
                      <UserMinus className='w-5 h-5' />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Dialog open={kickDialog} onOpenChange={setKickDialog}>
        <DialogContent className='max-w-md rounded-xl'>
          <DialogHeader>
            <DialogTitle className='text-teal-600 flex items-center gap-2'>
              <Ban className='w-5 h-5' /> Xác nhận loại người dùng
            </DialogTitle>
            <div className='mt-4 text-gray-600'>
              <p>
                Bạn có chắc chắn muốn loại người dùng{' '}
                <span className='font-bold text-gray-900'>{maskName(selectedBidder?.name)}</span> khỏi phiên đấu giá này
                không?
              </p>
              <textarea
                className='w-full mt-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-200 text-sm'
                placeholder='Nhập lý do loại người dùng...'
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <p className='mt-2 text-sm italic'>
                Hành động này sẽ hủy mức giá họ đã đặt và chặn họ tham gia lại phiên đấu giá này.
              </p>
            </div>
          </DialogHeader>
          <DialogFooter className='mt-4 gap-2'>
            <Button variant='outline' onClick={() => setKickDialog(false)} disabled={isKicking}>
              Hủy
            </Button>
            <Button
              variant='outline'
              className='bg-teal-600 text-white'
              onClick={handleKickBidder}
              disabled={isKicking}
            >
              {isKicking ? <Loader2 className='w-4 h-4 animate-spin mr-2' /> : 'Xác nhận loại'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className='border-spacing-0.5 border-t border-gray-300 mt-10 md:mt-20 mb-5' />

      {similarProducts.length > 0 && (
        <div className='flex justify-between items-center'>
          <p className='text-xl md:text-2xl font-semibold mb-5'>Sản phẩm tương tự</p>
          <Link to={'/products'} className='underline text-sm md:text-base'>
            Xem thêm
          </Link>
        </div>
      )}

      {loading && (
        <div className='flex items-center justify-center py-20 min-w-full'>
          <div className='animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent'></div>
        </div>
      )}
      {!loading && (
        <div className='flex flex-1 items-stretch gap-3 overflow-x-auto scroll-container pb-5'>
          {similarProducts.map((item: Product) => (
            <Link
              to={`/product/${item.id}`}
              key={item.id}
              className='flex flex-col gap-2 min-w-[200px] max-w-[200px] md:min-w-[250px] md:max-w-[250px] relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow'
            >
              <img src={item?.images?.[0]?.url} className='rounded-md w-full h-[200px] md:h-[250px] object-cover' />
              <div className='p-2'>
                <p className='line-clamp-2 text-sm md:text-base font-medium'>{item.title}</p>
                <span className='font-bold text-lg md:text-xl block mt-1'>
                  {Number(item.currentPrice).toLocaleString()} VND
                </span>
              </div>
              <div
                className={`font-semibold h-7 absolute text-xs left-1 top-1 bg-white hover:bg-gray-100 px-2 py-1 rounded-full shadow-sm`}
              >
                {formatTimeLeft(item.endAt)}
              </div>

              <Heart
                onClick={(e) => {
                  e.preventDefault();
                  toggleWatchList(item.id);
                }}
                className={`w-8 h-8 md:w-10 md:h-10 ${
                  isLike(item?.id) ? 'stroke-0 fill-red-600' : 'stroke-2'
                } absolute right-1 top-1 bg-white hover:bg-gray-100 p-2 rounded-full cursor-pointer shadow-sm`}
              />
            </Link>
          ))}
        </div>
      )}

      <Tabs className='mt-10 md:mt-15 w-full' defaultValue='description'>
        <TabsList className='grid w-full md:w-1/4 grid-cols-1'>
          <TabsTrigger
            className='data-[state=active]:bg-gray-100 font-semibold data-[state=active]:py-1 data-[state=active]:rounded-md '
            value='description'
          >
            Mô tả sản phẩm
          </TabsTrigger>
        </TabsList>

        <TabsContent value='description' className='w-full overflow-x-auto'>
          {product ? <ProductDescription product={product} currentUser={user} token={token} /> : null}
        </TabsContent>
      </Tabs>

      <Review seller={product?.seller} productId={product.id} user={user} token={token} />
    </div>
  );
};

export default Detail;
