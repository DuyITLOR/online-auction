import { ChevronRight, Clock, Heart, SquarePen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import ProductDescription from './description';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tab';
import Review from './review';

import type { Product, ProductImage } from '../../libs/types/types';
import { useState } from 'react';

interface ProductProp {
  product: Product;
}

const similarProducts = [
  {
    id: 1,
    name: 'Chia Harvester / JBOD Kit | Up to 44x 3.5" HDDs! | Custom Frame, Cables, & PSU',
    price: 7892737,
    isLike: false,
    thumbnail: 'https://i.ebayimg.com/images/g/JBsAAeSwsttpDQoH/s-l1600.webp',
  },
  {
    id: 2,
    name: 'Thermaltake Micro ATX Mini ITX PC Case Dual Tempered Glass Compact Tower Black',
    price: 13999000,
    isLike: false,
    thumbnail: 'https://i.ebayimg.com/images/g/O68AAeSwiC1pBjeg/s-l1600.webp',
  },
  {
    id: 3,
    name: 'NVIDIA GeForce RTX 4090 Founders Edition | 24GB GDDR6X',
    price: 44990000,
    isLike: true,
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 4,
    name: 'Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz RGB RAM Kit',
    price: 4390000,
    isLike: false,
    thumbnail: 'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 5,
    name: 'Meta Quest 3S 256GB (Refurbished)',
    price: 4990000,
    isLike: true,
    thumbnail: 'https://i.ebayimg.com/images/g/E-4AAOSwFsJoGMRU/s-l1600.webp',
  },
  {
    id: 6,
    name: 'UMIDIGI G9 5G 6GB+128GB 6.75 Android 14 Unlocked 18W Octa Core Smartphone Good',
    price: 10990000,
    isLike: false,
    thumbnail: 'https://i.ebayimg.com/images/g/1K4AAOSwQY5mqHz6/s-l1600.webp',
  },
  {
    id: 7,
    name: '[Near MINT] Nikon AF NIKKOR 80-200mm F2.8 ED Zoom Telephoto Lens From JAPAN',
    price: 3190000,
    isLike: true,
    thumbnail: 'https://i.ebayimg.com/images/g/elAAAeSwZilpDuiw/s-l1600.webp',
  },
  {
    id: 8,
    name: 'Lian Li O11 Dynamic EVO Case | Tempered Glass | White Edition',
    price: 3990000,
    isLike: false,
    thumbnail: 'https://images.unsplash.com/photo-1593642634367-d91a135587b5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 9,
    name: 'Noctua NH-D15 Chromax Black | Dual Tower CPU Cooler',
    price: 2990000,
    isLike: false,
    thumbnail: 'https://images.unsplash.com/photo-1620207418302-439b387441b0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 10,
    name: 'Raspberry Pi 5 (8GB) Developer Kit | Cooling Fan + Power Adapter',
    price: 2590000,
    isLike: true,
    thumbnail: 'https://images.unsplash.com/photo-1587202372775-98927aab2cae?auto=format&fit=crop&w=1200&q=80',
  },
];

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

function timeFromNow(dateString: string | Date | undefined) {
  const now = new Date();
  if (!dateString) return;
  const target = new Date(dateString);

  const diffMs = -now.getTime() + target.getTime();

  if (diffMs < 0) return '';

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays} ngày trước`;
  if (diffHours > 0) return `${diffHours} giờ trước`;
  if (diffMinutes > 0) return `${diffMinutes} phút trước`;
  return `${diffSeconds} giây trước`;
}

const Detail = ({ product }: ProductProp) => {
  const [image, setImage] = useState<string>(() => product?.images?.[0]?.url ?? '');

  if (!product) return <div className='loader' />;
  return (
    <div className='w-full flex flex-col px-10 mt-10 mb-10'>
      <div className='flex gap-5'>
        <div className='flex flex-col'>
          <div className='flex gap-3'>
            <div className='flex flex-col items-center gap-4 w-35 h-140 overflow-y-auto scroll-container-hidden-scroll pt-2'>
              {product?.images?.map((item: ProductImage, index: number) => (
                <div
                  onClick={() => setImage(item?.url)}
                  key={index}
                  className={`
                    w-30 min-h-30 rounded-xl
                    bg-gray-200
                    border-2 
                    ${
                      item?.url === image
                        ? 'border-teal-400 transition delay-100 duration-300 ease-in-out scale-110'
                        : 'border-gray-300'
                    }
                  `}
                >
                  <img src={item?.url} className='rounded-xl' />
                </div>
              ))}
            </div>

            <div className='border border-gray-300 rounded-xl w-190 h-140 bg-gray-200 flex justify-center items-center'>
              <img src={image} className='w-170 h-full' />
            </div>
          </div>
        </div>

        <div className='flex flex-col w-full'>
          <p className='text-2xl font-bold line-clamp-1'>{product?.title}</p>
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
              <AvatarImage src={'/gg-logo.svg'} alt='User Avatar' className='border border-gray-400 rounded-full' />
              <AvatarFallback>{'Thanh Dang'.charAt(0)?.toUpperCase() || '?'}</AvatarFallback>
            </Avatar>

            <div className='flex items-center justify-between w-full'>
              <div className='ml-5'>
                <p className='text-sm font-semibold'> {product?.seller?.fullname} </p>
                <div className='flex items-center gap-3'>
                  <Link to={'/'} className='text-sm text-teal-600 font-semibold underline'>
                    Đánh giá: 10
                  </Link>
                  <Link to={'/'} className='text-sm text-gray-500 underline'>
                    Sản phẩm khác
                  </Link>
                  <Link to={'/'} className='text-sm text-gray-500 underline'>
                    Liên hệ
                  </Link>
                </div>
              </div>
              <ChevronRight className='text-end w-10 h-10 rounded-full p-2 hover:bg-gray-200' />
            </div>
          </div>

          <div className='border-spacing-0.5 border-t border-gray-200 mt-4 mb-5 w-full' />

          <div className='flex flex-col gap-2'>
            <div className='flex items-end gap-5'>
              <p className='font-semibold text-gray-700'>Giá hiện tại: </p>
              <span className='text-xl font-bold'>{product?.startPrice.toLocaleString()} VND</span>
            </div>

            <p className='text-gray-700'>Lượt ra giá: 10</p>

            <p className='text-gray-700'>Thời gian còn lại: {timeFromNow(product?.startedAt)} </p>
          </div>

          <div className='border-spacing-0.5 border-t border-gray-200 mt-5 mb-6 w-full' />

          <div className='flex flex-col'>
            <p className='text-gray-700 font-semibold text-lg mb-2'>Đặt mức giá tối đa cho sản phẩm</p>

            <div className='flex gap-5'>
              <input
                type='number'
                defaultValue={product?.currentPrice}
                min={product?.currentPrice != null ? product.currentPrice + product?.stepPrice : undefined}
                step={100000}
                className='h-10 p-2 border text-lg border-gray-200 rounded-md focus-visible:outline-0.5 focus-visible:outline-gray-600 w-full pl-2'
              />

              <div className='bg-gray-400 p-2 font-semibold rounded-md w-15 h-10 text-center'>VND</div>
            </div>

            <p className='text-gray-600 text-xs mt-4 '>
              Mức giá tối thiểu có thể đặt là: {(product?.currentPrice ?? 0).toLocaleString()} VND (Bước giá:{' '}
              {(product?.stepPrice ?? 0).toLocaleString()} VND)
            </p>
          </div>

          <Button
            variant={'outline'}
            className='bg-black text-white transition delay-150 duration-200 ease-in-out hover:scale-102 mt-8 hover:cursor-pointer h-12'
          >
            Đặt giá ngay
          </Button>

          <Button
            variant={'outline'}
            className='bg-teal-500 transition delay-150 duration-200 ease-in-out hover:scale-102 mt-5 text-gray-100 hover:cursor-pointer h-12'
          >
            <div>
              <p className='text-base'>Mua ngay</p>
              <p>{product?.buyNowPrice.toLocaleString()} VND</p>
            </div>
          </Button>
        </div>
      </div>

      <div className='border-spacing-0.5 border-t border-gray-300 mt-20 mb-5' />

      <div className='flex justify-between'>
        <p className='text-2xl font-semibold mb-5'>Sản phẩm tương tự</p>
        <Link to={'/products'} className='underline'>
          Xem thêm
        </Link>
      </div>

      <div className='flex flex-1 items-center gap-3 overflow-x-auto scroll-container h-[400px] pb-5'>
        {similarProducts.map((item) => (
          <div key={item.id} className='flex flex-col gap-2 min-w-[250px] relative'>
            <img src={item.thumbnail} className='rounded-md w-[250px] h-[250px] object-cover' />
            <p className='line-clamp-2'>{item.name}</p>
            <span className='font-semibold text-xl'>{item.price.toLocaleString()} VND</span>

            <Heart
              className={`w-10 h-10 ${
                item.isLike ? 'stroke-0 fill-red-600' : 'stroke-2'
              } absolute right-1 top-1  bg-white hover:bg-gray-100 p-2 rounded-full`}
            />
          </div>
        ))}
      </div>

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
          {product ? <ProductDescription product={product} currentUser={product?.seller} /> : null}
        </TabsContent>
      </Tabs>

      <Review seller={product?.seller} />
    </div>
  );
};

export default Detail;
