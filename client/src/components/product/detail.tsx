/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { ArrowRight, ChevronRight, Clock, Crown, Heart, Minus, Package, Plus, SquarePen, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import ProductDescription from './description';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tab';
import Review from './review';
import { useNavigate } from 'react-router-dom';

import type { BidHistory, Product, ProductImage, User, WatchList } from '../../libs/types/types';
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
  const [image, setImage] = useState<string>(() => product?.images?.[0]?.url ?? '');
  const [price, setPrice] = useState(minBidPrice);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isBidding, setIsBidding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [isOrder, setOrder] = useState(false);
  const navigate = useNavigate();

  const { watchList, toggleWatchList } = useContext(ProductContext);
  const isLike = (id: string) => {
    return watchList.some((item: WatchList) => item.productId === id);
  };

  const fetchProducts = async () => {
    try {
      const products = await getAllProduct({ categoryId: product.categoryId });
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
      setPrice(minBidPrice); // Reset về giá sàn
      return;
    }

    if (price >= Number(product.buyNowPrice)) {
      setOpen(true);
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
  console.log(token);
  return (
    <div className='w-full flex flex-col px-8 mt-10 mb-10'>
      <div className='flex gap-8'>
        <div className='flex flex-col w-full'>
          <div className='flex gap-3'>
            <div className='flex flex-col items-center gap-4 w-35 h-140 overflow-y-auto scroll-container-hidden-scroll pt-2'>
              {product?.images?.map((item: ProductImage, index: number) => (
                <div
                  onClick={() => setImage(item?.url)}
                  key={index}
                  className={`
                    w-30 min-h-30 max-h-30 rounded-xl
                    bg-gray-200
                    border-2 
                    ${
                      item?.url === image
                        ? 'border-teal-400 transition delay-100 duration-300 ease-in-out scale-110'
                        : 'border-gray-300'
                    }
                  `}
                >
                  <img src={item?.url} className='rounded-xl w-full h-full object-cover' />
                </div>
              ))}
            </div>
            <div className='relative'>
              <div className='border border-gray-300 rounded-xl w-190 h-140 bg-gray-200 flex justify-center items-center'>
                <img src={image} className='h-140 object-cover' />
              </div>
              <Heart
                onClick={(e) => {
                  e.preventDefault();
                  toggleWatchList(product?.id);
                }}
                className={`w-10 h-10 ${
                  isLike(product?.id) ? 'stroke-0 fill-red-600' : 'stroke-2'
                } absolute right-1 top-1  bg-white hover:bg-gray-100 p-2 rounded-full`}
              />
            </div>
          </div>
        </div>

        <div className='flex flex-col w-full'>
          <p className='text-2xl font-bold'>{product?.title}</p>
          <div className='flex items-center gap-10 mt-3'>
            <div className='flex items-center gap-1 text-gray-500'>
              <Clock className='w-4 h-4' />
              <p className='text-sm '>Đăng: {formatDate(product?.startedAt)} </p>
            </div>

            <div className='flex items-center gap-1 text-gray-500'>
              <SquarePen className='w-4 h-4' />
              <p className='text-sm '>Chỉnh sửa: {formatDate(product?.updatedAt)}</p>
            </div>
          </div>
          <div className='border-spacing-0.5 border-t border-gray-200 mt-2 mb-4 w-full' />
          <div className='flex justify-start'>
            <Avatar>
              <AvatarImage
                src={product.seller.avtUrl}
                alt='User Avatar'
                className='border border-gray-400 rounded-full'
              />
            </Avatar>

            <div className='flex items-center justify-between w-full'>
              <div className='ml-5'>
                <p className='text-sm font-semibold'> {product?.seller?.fullname} </p>
                <div className='flex items-center gap-3'>
                  <Link to={'/'} className='text-sm text-teal-600 font-semibold underline'>
                    Đánh giá: {calculateRating(product.seller.ratingPos, product.seller.ratingNeg)}
                  </Link>
                  <Link
                    to={`/shop/${product?.sellerId}`}
                    className='text-sm text-gray-500 underline hover:text-teal-600'
                  >
                    Sản phẩm khác
                  </Link>
                </div>
              </div>
              <ChevronRight className='text-end w-10 h-10 rounded-full p-2 hover:bg-gray-200' />
            </div>
          </div>
          <div className='border-spacing-0.5 border-t border-gray-200 mt-4 mb-2 w-full' />
          <div className='flex flex-col gap-2'>
            <div className='flex items-end gap-5'>
              <p className='font-semibold text-gray-700'>Giá hiện tại: </p>
              <span className='text-xl font-bold'>{Number(product?.currentPrice).toLocaleString()} VND</span>
            </div>

            <p className='text-gray-700'>Lượt ra giá: {product?.countbids}</p>

            <p className='text-gray-700'> {formatTimeLeft(product?.endAt)} </p>
          </div>
          <div className='border-spacing-0.5 border-t border-gray-200 mt-2 mb-3 w-full' />
          <div className='flex flex-col'>
            {!isExpired(product.endAt) && !product.winnerId && (
              <>
                <p className='text-gray-700 font-semibold text-lg mb-2'>Đặt mức giá tối đa cho sản phẩm</p>

                <div className='flex gap-3 items-center'>
                  <Plus
                    onClick={plusPriceHandle}
                    className='h-8 w-8 p-1 border border-gray-200 stroke-2 bg-slate-300 rounded-full'
                  />
                  <input
                    type='text'
                    value={price.toLocaleString('vi-VN')}
                    onChange={handleChange}
                    className='h-10 p-2 border text-lg border-gray-200 rounded-md focus-visible:outline-0.5 focus-visible:outline-gray-600 w-[330px] pl-2'
                  />

                  <div className='bg-gray-400 p-2 font-semibold rounded-md w-15 h-10 text-center'>VND</div>

                  {price > Number(product.currentPrice) + Number(product.stepPrice) && (
                    <Minus
                      onClick={minusPriceHandle}
                      className='h-8 w-8 p-1 border border-gray-200 stroke-2 bg-slate-300 rounded-full'
                    />
                  )}
                </div>

                <p className='text-gray-600 text-xs mt-4 '>
                  Mức giá tối thiểu có thể đặt là:{' '}
                  {(Number(product?.currentPrice) + Number(product?.stepPrice)).toLocaleString()} VND (Bước giá:{' '}
                  {Number(product.stepPrice).toLocaleString()} VND)
                </p>
              </>
            )}
          </div>
          {isExpired(product.endAt) || product.winnerId ? (
            <div className='mt-4'>
              <div className='bg-linear-to-br from-gray-50 to-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs'>
                <div
                  className={`p-6 ${
                    user?.id === product.winnerId
                      ? 'bg-linear-to-r from-yellow-50 to-orange-50'
                      : user?.id === product.seller.id
                      ? 'bg-linear-to-r from-blue-50 to-indigo-50'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className='flex justify-between items-start mb-4'>
                    <div>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                          user?.id === product.winnerId
                            ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                            : user?.id === product.seller.id
                            ? 'bg-blue-100 text-blue-700 border-blue-200'
                            : 'bg-gray-200 text-gray-600 border-gray-300'
                        }`}
                      >
                        {user?.id === product.winnerId ? (
                          <Crown className='w-3 h-3' />
                        ) : (
                          <Package className='w-3 h-3' />
                        )}
                        {user?.id === product.winnerId
                          ? 'Bạn đã thắng'
                          : user?.id === product.seller.id
                          ? 'Sản phẩm của bạn'
                          : 'Đã kết thúc'}
                      </span>
                      <h3 className='mt-3 text-xl font-bold text-gray-900'>Phiên đấu giá hoàn tất</h3>
                    </div>
                    <div className='text-right'>
                      <p className='text-sm text-gray-500 mb-1'>Giá chốt</p>
                      <p className='text-2xl font-mono font-bold text-teal-700'>
                        {Number(product.currentPrice).toLocaleString()} ₫
                      </p>
                    </div>
                  </div>

                  {(user?.id === product.winnerId || user?.id === product.seller.id) && (
                    <div className='flex flex-col gap-3 mt-4 pt-4 border-t border-gray-200/60'>
                      <div className='flex items-center gap-3 text-sm text-gray-600 mb-2'>
                        <div className='bg-white p-2 rounded-full shadow-xs'>
                          {user?.id === product.winnerId ? (
                            <Package className='w-5 h-5 text-teal-600' />
                          ) : (
                            <Crown className='w-5 h-5 text-yellow-500' />
                          )}
                        </div>
                        {user?.id === product.winnerId ? (
                          <p>Vui lòng kiểm tra đơn hàng và tiến hành thanh toán để nhận sản phẩm.</p>
                        ) : (
                          <p>
                            Người chiến thắng:{' '}
                            <span className='font-bold text-gray-900'>
                              {maskName(historyBid[0]?.bidder?.fullname || 'Ẩn danh')}
                            </span>
                            . Vui lòng chuẩn bị hàng.
                          </p>
                        )}
                      </div>
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
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              <Button
                variant={'outline'}
                className='bg-black text-white transition delay-150 duration-200 ease-in-out hover:scale-102 mt-5 hover:cursor-pointer h-12'
                onClick={() => handleAutoBid({ productId: product.id, maxAutoBidAmount: price, token })}
                disabled={isBidding}
              >
                {isBidding ? 'Đang xử lý...' : 'Đặt giá ngay'}
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant={'outline'}
                    className='bg-teal-500 transition delay-150 duration-200 ease-in-out hover:scale-102 mt-5 text-gray-100 hover:cursor-pointer h-12'
                  >
                    <div>
                      <p className='text-base'>Mua ngay</p>
                      <p>{Number(product?.buyNowPrice).toLocaleString()} VND</p>
                    </div>
                  </Button>
                </DialogTrigger>

                <DialogContent className='sm:max-w-[480px]'>
                  <DialogHeader>
                    <DialogTitle className='text-xl font-semibold text-gray-800'>Xác nhận mua ngay</DialogTitle>

                    <div className='mt-3 space-y-3 text-gray-700 leading-relaxed'>
                      <p>
                        Bạn đang chọn <span className='font-medium text-teal-600'>Mua ngay</span> với mức giá:
                      </p>

                      <p className='text-center text-2xl font-bold text-teal-600'>
                        [{Number(product.buyNowPrice).toLocaleString()}] VND
                      </p>

                      <p>Sau khi xác nhận, phiên đấu giá sẽ kết thúc và sản phẩm sẽ thuộc về bạn với mức giá này.</p>

                      <p>Bạn có chắc chắn muốn tiếp tục không?</p>
                    </div>
                  </DialogHeader>

                  <DialogFooter className='mt-4'>
                    <div className='flex items-center justify-end gap-2 w-full'>
                      <DialogClose asChild>
                        <Button variant='outline'>Hủy</Button>
                      </DialogClose>
                      <Button
                        onClick={handleBuyNow}
                        className='bg-teal-600 hover:bg-teal-700 min-w-[100px]'
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
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className='sm:max-w-[480px]'>
                  <DialogHeader>
                    <DialogTitle className='text-xl font-semibold text-gray-800'>
                      Giá bạn đặt cao hơn giá Mua ngay
                    </DialogTitle>

                    <div className='mt-3 space-y-3 text-gray-700 leading-relaxed'>
                      <p>
                        Giá bạn vừa đặt đang <span className='font-medium text-red-600'>cao hơn</span> mức{' '}
                        <span className='font-medium text-teal-600'>Mua ngay</span> của sản phẩm.
                      </p>

                      <p className='text-center text-2xl font-bold text-teal-600'>
                        Giá Mua ngay: [{Number(product.buyNowPrice).toLocaleString()}] VND
                      </p>

                      <p>
                        Bạn có muốn <span className='font-medium text-teal-600'>mua ngay</span> sản phẩm với mức giá này
                        để kết thúc phiên đấu giá không?
                      </p>
                    </div>
                  </DialogHeader>

                  <DialogFooter className='mt-4'>
                    <div className='flex items-center justify-end gap-2 w-full'>
                      <DialogClose asChild onClick={() => setOpen(false)}>
                        <Button variant='outline'>Hủy</Button>
                      </DialogClose>
                      <Button
                        onClick={() => setOpen(false)}
                        className='bg-teal-500 hover:bg-teal-600 text-white px-5'
                        type='submit'
                      >
                        Xác nhận
                      </Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      <div className='border-spacing-0.5 border-t border-gray-300 mt-20 mb-5' />

      <div className='flex flex-col gap-1'>
        <p className='text-2xl font-semibold mb-5'>Giao dịch</p>
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
                                    flex items-center justify-between border px-6 py-4 rounded-xl bordertransition-all
                                    ${
                                      index === 0
                                        ? 'bg-linear-to-r from-teal-50 to-white border-teal-400 shadow-md'
                                        : 'bg-white border-gray-300 hover:border-gray-500'
                                    }
                                `}
              >
                <div className='flex items-center gap-4'>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center border border-gray-300 justify-center font-bold text-sm${
                      index === 0 ? 'bg-yellow-400 text-white shadow-sm' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index === 0 ? <Crown className='w-5 h-5 fill-yellow-600' /> : index + 1}
                  </div>

                  <Avatar className={`${index === 0 ? 'border-2 border-teal-300' : ''}`}>
                    <AvatarImage src={item.bidder.avtUrl} />
                  </Avatar>

                  <div className='flex flex-col'>
                    <span className={`font-semibold text-lg ${index === 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                      {maskName(item?.bidder?.fullname!)}
                      {index === 0 && (
                        <span className='ml-2 text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-bold'>
                          Dẫn đầu
                        </span>
                      )}
                    </span>
                    <span className='text-xs text-gray-400'>{formatDate(item.createdAt, { time: true })}</span>
                  </div>
                </div>
                <div className='text-right'>
                  <p className={`text-xl font-bold font-mono ${index === 0 ? 'text-teal-700' : 'text-gray-600'}`}>
                    {Number(item.amount).toLocaleString()} VND
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className='border-spacing-0.5 border-t border-gray-300 mt-20 mb-5' />

      <div className='flex justify-between'>
        <p className='text-2xl font-semibold mb-5'>Sản phẩm tương tự</p>
        <Link to={'/products'} className='underline'>
          Xem thêm
        </Link>
      </div>

      {loading && (
        <div className='flex items-center justify-center py-20 min-w-full'>
          <div className='animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent'></div>
        </div>
      )}
      {!loading && (
        <div className='flex flex-1 items-center gap-3 overflow-x-auto scroll-container h-[400px] pb-5'>
          {similarProducts.map((item: Product) => (
            <Link
              to={`/product/${item.id}`}
              key={item.id}
              className='flex flex-col gap-2 min-w-[250px] max-w-[250px] relative'
            >
              <img src={item?.images?.[0]?.url} className='rounded-md w-[250px] h-[250px] object-cover' />
              <p className='line-clamp-2'>{item.title}</p>
              <span className='font-semibold text-xl'>{Number(item.currentPrice).toLocaleString()} VND</span>
              <div
                className={`font-semibold h-7 absolute text-xs left-1 top-1 bg-white hover:bg-gray-100 px-2 py-1 rounded-full`}
              >
                {formatTimeLeft(item.endAt)}
              </div>

              <Heart
                onClick={(e) => {
                  e.preventDefault();
                  toggleWatchList(item.id);
                }}
                className={`w-10 h-10 ${
                  isLike(item?.id) ? 'stroke-0 fill-red-600' : 'stroke-2'
                } absolute right-1 top-1  bg-white hover:bg-gray-100 p-2 rounded-full`}
              />
            </Link>
          ))}
        </div>
      )}

      <Tabs className='mt-15' defaultValue='description'>
        <TabsList className='grid w-1/4 grid-cols-1'>
          <TabsTrigger
            className='data-[state=active]:bg-gray-100 font-semibold data-[state=active]:py-1 data-[state=active]:rounded-md '
            value='description'
          >
            Mô tả sản phẩm
          </TabsTrigger>
        </TabsList>

        <TabsContent value='description'>
          {product ? <ProductDescription product={product} currentUser={user} token={token} /> : null}
        </TabsContent>
      </Tabs>

      <Review seller={product?.seller} productId={product.id} user={user} token={token} />
    </div>
  );
};

export default Detail;
