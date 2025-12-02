import {
  ChevronRight,
  Clock,
  Heart,
  Minus,
  Plus,
  SquarePen,
  Crown, // Import thêm icon Vương miện
  Trophy, // Import thêm icon Cúp
  User,
  History,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import ProductDescription from './description';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tab';
import Review from './review';

import type { BidHistory, Product, ProductImage } from '../../libs/types/types';
import { useState, useMemo } from 'react';
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

// --- Helper Functions ---

// 1. Hàm ẩn tên người dùng (Ví dụ: Nguyễn Văn Nam -> Nguyễn V** ***)
const maskName = (fullname: string | undefined) => {
  if (!fullname) return 'Người dùng ẩn danh';
  const parts = fullname.trim().split(' ');

  if (parts.length === 1) {
    return parts[0].length > 2 ? parts[0].substring(0, 2) + '***' : '***';
  }

  // Giữ lại họ, ẩn các chữ lót và tên
  const lastName = parts[0];
  const maskedParts = parts.slice(1).map(() => '****');
  return `${lastName} ${maskedParts.join(' ')}`;
};

// 2. Format ngày giờ đẹp hơn
function formatDate(isoString: string | undefined, options = { time: false }) {
  if (!isoString) return '';
  const d = new Date(isoString);
  const dateStr = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  if (!options.time) return dateStr;
  const timeStr = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  return `${timeStr} - ${dateStr}`;
}

const formatTimeLeft = (date: string) => {
  // ... (giữ nguyên logic cũ của bạn)
  const now = new Date();
  const end = new Date(date);
  const diff = end.getTime() - now.getTime();
  if (diff <= 0) return 'Hết hạn';
  const diffDays = diff / (1000 * 60 * 60 * 24);
  const diffHours = diff / (1000 * 60 * 60);
  const diffMinutes = diff / (1000 * 60);
  if (diffDays > 3) return `Kết thúc: ${end.getDate()}/${end.getMonth() + 1}/${end.getFullYear()}`;
  else if (diffDays >= 1) return `${Math.ceil(diffDays)} ngày`;
  else if (diffHours >= 1) return `${Math.ceil(diffHours)} giờ`;
  else return `${Math.ceil(diffMinutes)} phút`;
};

// --- Main Component ---

interface ProductProp {
  product: Product;
  historyBid: BidHistory[];
  token: string;
  onRefresh: () => void;
}

// ... (Giữ nguyên mảng similarProducts)
const similarProducts = [
  // ... code cũ
  { id: 1, name: 'Sample', price: 100, isLike: false, thumbnail: '' },
];

const Detail = ({ product, historyBid, token, onRefresh }: ProductProp) => {
  const [image, setImage] = useState<string>(() => product?.images?.[0]?.url ?? '');
  const [price, setPrice] = useState(Number(product?.currentPrice) + Number(product.stepPrice) || 0);
  const [isBidding, setIsBidding] = useState(false);

  // Tìm người giữ giá cao nhất (Top Bidder) từ historyBid
  // Giả sử historyBid đã được sort giảm dần từ API. Nếu chưa thì cần sort ở đây.
  const topBidder = useMemo(() => {
    if (historyBid && historyBid.length > 0) {
      return historyBid[0];
    }
    return null;
  }, [historyBid]);

  // ... (Giữ nguyên các hàm handle change, plus, minus, autoBid)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    setPrice(Number(value));
  };
  const plusPriceHandle = () => setPrice(price + Number(product.stepPrice));
  const minusPriceHandle = () => setPrice(price - Number(product.stepPrice));

  const handleAutoBid = async ({ productId, maxAutoBidAmount, token }: any) => {
    try {
      setIsBidding(true);
      await autoBid({ productId, maxAutoBidAmount, token });
      onRefresh();
      setPrice(Number(product?.currentPrice) + Number(product.stepPrice));
      toast.success('Thành công!', { description: 'Bạn đã đặt giá thành công.' });
    } catch (err: any) {
      toast.error('Thất bại', { description: err.message || 'Lỗi không xác định' });
    } finally {
      setIsBidding(false);
    }
  };

  if (!product) return <div className='loader' />;

  return (
    <div className='w-full flex flex-col px-10 mt-10 mb-10'>
      <div className='flex gap-8'>
        {/* Cột trái: Ảnh sản phẩm (Giữ nguyên logic cũ, chỉnh lại CSS chút cho gọn) */}
        <div className='flex flex-col w-[500px] flex-shrink-0'>
          {/* ... Code hiển thị ảnh cũ của bạn ... */}
          <div className='flex gap-3'>
            <div className='flex flex-col items-center gap-4 w-35 h-140 overflow-y-auto scroll-container-hidden-scroll pt-2'>
              {product?.images?.map((item: ProductImage, index: number) => (
                <div
                  onClick={() => setImage(item?.url)}
                  key={index}
                  className={`w-30 min-h-30 rounded-xl bg-gray-200 border-2 cursor-pointer ${
                    item?.url === image ? 'border-teal-400 scale-105' : 'border-gray-300'
                  }`}
                >
                  <img src={item?.url} className='rounded-xl w-full h-full object-cover' />
                </div>
              ))}
            </div>
            <div className='border border-gray-300 rounded-xl flex-1 h-140 bg-gray-50 flex justify-center items-center overflow-hidden'>
              <img src={image} className='w-full h-full object-contain' />
            </div>
          </div>
        </div>

        {/* Cột phải: Thông tin & Đấu giá */}
        <div className='flex flex-col w-full'>
          <h1 className='text-3xl font-bold text-gray-900 leading-tight'>{product?.title}</h1>

          <div className='flex items-center gap-6 mt-4 text-sm text-gray-500'>
            <div className='flex items-center gap-1.5'>
              <Clock className='w-4 h-4' /> Đăng: {formatDate(product?.startedAt)}
            </div>
            <div className='flex items-center gap-1.5'>
              <SquarePen className='w-4 h-4' /> Sửa: {formatDate(product?.updatedAt)}
            </div>
          </div>

          <div className='border-t border-gray-200 my-5' />

          {/* Thông tin người bán */}
          <div className='flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100'>
            <div className='flex items-center gap-4'>
              <Avatar className='h-12 w-12 border-2 border-white shadow-sm'>
                <AvatarImage src={product.seller.avtUrl} />
                <AvatarFallback>{product.seller.fullname?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className='text-base font-bold text-gray-800'>{product?.seller?.fullname}</p>
                <div className='flex gap-3 text-xs'>
                  <span className='text-teal-600 font-medium cursor-pointer'>Đánh giá: 100%</span>
                  <span className='text-gray-500 underline cursor-pointer'>Xem shop</span>
                </div>
              </div>
            </div>
            <Button variant='ghost' size='icon'>
              <ChevronRight />
            </Button>
          </div>

          <div className='mt-6 space-y-6'>
            {/* Box Giá & Người giữ giá cao nhất */}
            <div className='flex items-stretch gap-4'>
              <div className='flex-1 bg-teal-50 border border-teal-100 rounded-xl p-5 relative overflow-hidden'>
                <p className='text-teal-800 font-medium mb-1'>Giá hiện tại</p>
                <p className='text-4xl font-bold text-teal-700'>
                  {Number(product?.currentPrice).toLocaleString()} <span className='text-lg align-top'>₫</span>
                </p>
                <p className='text-sm text-teal-600 mt-2 flex items-center gap-1'>
                  <Clock className='w-4 h-4' /> Còn lại: {formatTimeLeft(product?.endAt)}
                </p>
              </div>

              {/* Phần hiển thị NGƯỜI THẮNG HIỆN TẠI (Quan trọng) */}
              <div className='flex-1 bg-white border-2 border-yellow-400/50 rounded-xl p-5 relative shadow-sm'>
                <div className='absolute top-0 right-0 bg-yellow-400 text-white text-xs px-2 py-1 rounded-bl-lg font-bold flex items-center gap-1'>
                  <Crown className='w-3 h-3 fill-white' /> TOP 1
                </div>
                <p className='text-gray-500 font-medium mb-2 text-sm'>Người giữ giá cao nhất</p>
                {topBidder ? (
                  <div className='flex items-center gap-3'>
                    <Avatar className='h-10 w-10 border border-yellow-200'>
                      <AvatarImage src={topBidder.bidder.avtUrl} />
                      <AvatarFallback className='bg-yellow-100 text-yellow-700'>
                        <User className='w-5 h-5' />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='font-bold text-gray-800 text-lg leading-none'>
                        {maskName(topBidder.bidder.fullname)}
                      </p>
                      <p className='text-xs text-gray-400 mt-1'>{formatDate(topBidder.createdAt, { time: true })}</p>
                    </div>
                  </div>
                ) : (
                  <div className='flex items-center gap-2 text-gray-400 italic'>
                    <User className='w-8 h-8 opacity-50' /> Chưa có ai đặt giá
                  </div>
                )}
              </div>
            </div>

            {/* Input đặt giá */}
            <div className='bg-white border border-gray-200 rounded-xl p-6 shadow-sm'>
              <p className='font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                Đặt mức giá tối đa{' '}
                <span className='text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full'>
                  Bước giá: {Number(product.stepPrice).toLocaleString()} ₫
                </span>
              </p>

              <div className='flex items-center gap-3'>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={minusPriceHandle}
                  disabled={price <= Number(product.currentPrice) + Number(product.stepPrice)}
                  className='h-12 w-12 rounded-full border-gray-300'
                >
                  <Minus className='w-5 h-5' />
                </Button>

                <div className='relative flex-1'>
                  <input
                    type='text'
                    value={price.toLocaleString('vi-VN')}
                    onChange={handleChange}
                    className='w-full h-12 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none'
                  />
                  <span className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold'>VND</span>
                </div>

                <Button
                  variant='outline'
                  size='icon'
                  onClick={plusPriceHandle}
                  className='h-12 w-12 rounded-full border-gray-300 bg-gray-50'
                >
                  <Plus className='w-5 h-5' />
                </Button>
              </div>

              <div className='grid grid-cols-2 gap-4 mt-6'>
                <Button
                  className='h-12 text-base font-semibold bg-gray-900 hover:bg-gray-800 text-white transition-all hover:scale-[1.02]'
                  onClick={() => handleAutoBid({ productId: product.id, maxAutoBidAmount: price, token })}
                  disabled={isBidding}
                >
                  {isBidding ? 'Đang xử lý...' : 'Đặt giá tự động'}
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className='h-12 text-base font-semibold bg-teal-600 hover:bg-teal-700 text-white transition-all hover:scale-[1.02]'>
                      Mua ngay {Number(product.buyNowPrice).toLocaleString()} ₫
                    </Button>
                  </DialogTrigger>
                  {/* ... (Giữ nguyên Dialog content) ... */}
                  <DialogContent>
                    {/* Copy lại nội dung Dialog cũ vào đây */}
                    <DialogHeader>
                      <DialogTitle>Xác nhận mua ngay</DialogTitle>
                    </DialogHeader>
                    <p>Nội dung mua ngay...</p>
                    <DialogFooter>
                      <Button>Xác nhận</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='border-t border-gray-200 mt-16 mb-10' />

      {/* --- PHẦN LỊCH SỬ ĐẤU GIÁ (ĐÃ THIẾT KẾ LẠI) --- */}
      <div className='grid grid-cols-3 gap-10'>
        {/* Cột trái: Lịch sử đấu giá */}
        <div className='col-span-2'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-2xl font-bold text-gray-800 flex items-center gap-2'>
              <History className='w-6 h-6 text-teal-600' /> Lịch sử đấu giá
            </h3>
            <span className='text-sm text-gray-500'>{historyBid.length} lượt ra giá</span>
          </div>

          <div className='flex flex-col gap-3'>
            {historyBid.length === 0 ? (
              <div className='text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300'>
                <p className='text-gray-500'>Chưa có ai đặt giá cho sản phẩm này.</p>
              </div>
            ) : (
              historyBid.map((item: BidHistory, index: number) => {
                const isTop1 = index === 0;
                return (
                  <div
                    key={item.id}
                    className={`
                                    flex items-center justify-between px-6 py-4 rounded-xl border transition-all
                                    ${
                                      isTop1
                                        ? 'bg-gradient-to-r from-yellow-50 to-white border-yellow-400 shadow-md transform scale-[1.01]'
                                        : 'bg-white border-gray-100 hover:border-gray-300'
                                    }
                                `}
                  >
                    <div className='flex items-center gap-4'>
                      {/* Rank Badge */}
                      <div
                        className={`
                                        w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                                        ${isTop1 ? 'bg-yellow-400 text-white shadow-sm' : 'bg-gray-100 text-gray-500'}
                                    `}
                      >
                        {isTop1 ? <Crown className='w-4 h-4 fill-white' /> : index + 1}
                      </div>

                      {/* User Info */}
                      <Avatar className={`${isTop1 ? 'border-2 border-yellow-200' : ''}`}>
                        <AvatarImage src={item.bidder.avtUrl} />
                        <AvatarFallback>{item.bidder.fullname.charAt(0)}</AvatarFallback>
                      </Avatar>

                      <div className='flex flex-col'>
                        <span className={`font-semibold text-lg ${isTop1 ? 'text-gray-900' : 'text-gray-700'}`}>
                          {maskName(item.bidder.fullname)}
                          {isTop1 && (
                            <span className='ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold'>
                              Dẫn đầu
                            </span>
                          )}
                        </span>
                        <span className='text-xs text-gray-400'>{formatDate(item.createdAt, { time: true })}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className='text-right'>
                      <p className={`text-xl font-bold font-mono ${isTop1 ? 'text-teal-700' : 'text-gray-600'}`}>
                        {Number(item.amount).toLocaleString()} ₫
                      </p>
                      {isTop1 && <p className='text-xs text-green-600 font-medium'>Đang thắng</p>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Cột phải: Sản phẩm tương tự (Layout dạng dọc để cân đối) */}
        <div className='col-span-1'>
          <div className='flex justify-between items-center mb-6'>
            <h3 className='text-xl font-bold text-gray-800'>Sản phẩm tương tự</h3>
            <Link to='/products' className='text-sm text-teal-600 hover:underline'>
              Xem tất cả
            </Link>
          </div>
          <div className='flex flex-col gap-4 max-h-[600px] overflow-y-auto scroll-container pr-2'>
            {similarProducts.slice(0, 5).map((item) => (
              <Link
                to={`/product/${item.id}`}
                key={item.id}
                className='flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition border border-transparent hover:border-gray-200 group'
              >
                <img src={item.thumbnail} className='w-20 h-20 rounded-md object-cover border border-gray-200' />
                <div className='flex flex-col justify-center'>
                  <p className='text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-teal-600 transition'>
                    {item.name}
                  </p>
                  <p className='text-teal-700 font-bold mt-1'>{item.price.toLocaleString()} ₫</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className='mt-10'>
        {/* Tabs mô tả giữ nguyên */}
        <Tabs defaultValue='description'>{/* ... */}</Tabs>
      </div>
    </div>
  );
};

export default Detail;
