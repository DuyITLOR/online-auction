import {
  ChevronDown,
  Gavel,
  Heart,
  LogOut,
  ScrollText,
  ShoppingBag,
  ShoppingBasket,
  Star,
  UserRound,
} from 'lucide-react';
import Header from '../components/header';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList } from '../components/ui/tab';
import { TabsTrigger } from '@radix-ui/react-tabs';
import Rating from '../components/rating';
import { Progress } from '../components/ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { useState } from 'react';

const activityData = [
  {
    name: 'iPhone 15 Pro Max',
    price: 25000000,
    date: '2025-01-12',
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    price: 23000000,
    date: '2025-01-10',
  },
  {
    name: 'MacBook Pro 14-inch M3',
    price: 45000000,
    date: '2025-01-09',
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    price: 8500000,
    date: '2025-01-08',
  },
  {
    name: 'Apple Watch Series 9',
    price: 11000000,
    date: '2025-01-05',
  },
];

const products = [
  {
    id: 1,
    name: 'Chia Harvester / JBOD Kit | Up to 44x 3.5" HDDs! | Custom Frame, Cables, & PSU',
    price: 1000000,
    buyNowPrice: 1500000,
    endTime: '2025-12-31T23:59:59Z',
    totalBids: 10,
    thumbnail: 'https://picsum.photos/id/1011/600/400',
    isLike: true,
    seller: 'Nguyen Van A',
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Dell PowerEdge R720 Server | Dual Xeon E5 | 128GB RAM | Ready for Virtualization',
    price: 850000,
    buyNowPrice: 1200000,
    endTime: '2025-12-20T18:00:00Z',
    totalBids: 5,
    thumbnail: 'https://picsum.photos/id/1025/600/400',
    isLike: true,
    seller: 'Tran Van B',
    rating: 4.2,
  },
  {
    id: 3,
    name: 'NVIDIA RTX 3080 Founders Edition | 10GB GDDR6X | Excellent Condition',
    price: 2500000,
    buyNowPrice: 3000000,
    endTime: '2025-11-30T20:00:00Z',
    totalBids: 18,
    thumbnail: 'https://picsum.photos/id/1035/600/400',
    isLike: true,
    seller: 'Le Thi C',
    rating: 4.8,
  },
  {
    id: 4,
    name: 'Seagate IronWolf 10TB NAS HDD | 7200RPM | 256MB Cache | Enterprise Grade',
    price: 500000,
    buyNowPrice: 900000,
    endTime: '2025-10-15T12:00:00Z',
    totalBids: 3,
    thumbnail: 'https://picsum.photos/id/1041/600/400',
    isLike: true,
    seller: 'Pham D',
    rating: 3.9,
  },
  {
    id: 5,
    name: 'ASUS ROG Strix B550-F Gaming Motherboard | AM4 | PCIe 4.0 | RGB Sync',
    price: 700000,
    buyNowPrice: 1100000,
    endTime: '2025-09-22T08:30:00Z',
    totalBids: 12,
    thumbnail: 'https://picsum.photos/id/1050/600/400',
    isLike: true,
    seller: 'Nguyen E',
    rating: 4.1,
  },
  {
    id: 6,
    name: 'Intel Core i9-12900K Processor | 16 Cores | Up to 5.2GHz | Unlocked',
    price: 3200000,
    buyNowPrice: 3800000,
    endTime: '2025-08-10T21:00:00Z',
    totalBids: 25,
    thumbnail: 'https://picsum.photos/id/1062/600/400',
    isLike: true,
    seller: 'Tran F',
    rating: 4.7,
  },
  {
    id: 7,
    name: 'Corsair RM850x 80+ Gold Power Supply | Fully Modular | Silent Fan',
    price: 420000,
    buyNowPrice: 700000,
    endTime: '2025-07-05T09:00:00Z',
    totalBids: 2,
    thumbnail: 'https://picsum.photos/id/1074/600/400',
    isLike: true,
    seller: 'Le G',
    rating: 3.8,
  },
  {
    id: 8,
    name: 'Samsung 980 PRO NVMe SSD 1TB | PCIe 4.0 | Up to 7000MB/s',
    price: 960000,
    buyNowPrice: 1500000,
    endTime: '2025-06-28T16:45:00Z',
    totalBids: 7,
    thumbnail: 'https://picsum.photos/id/1084/600/400',
    isLike: true,
    seller: 'Pham H',
    rating: 4.0,
  },
  {
    id: 9,
    name: 'HP Z840 Workstation | Dual Xeon E5 | 64GB DDR4 ECC | 1TB SSD',
    price: 1800000,
    buyNowPrice: 2500000,
    endTime: '2025-05-12T11:30:00Z',
    totalBids: 14,
    thumbnail: 'https://picsum.photos/id/109/600/400',
    isLike: true,
    seller: 'Do I',
    rating: 4.6,
  },
  {
    id: 10,
    name: 'Synology DS920+ NAS | Quad-Core CPU | 4-Bay | Ideal for Home & Office Storage',
    price: 290000,
    buyNowPrice: 600000,
    endTime: '2025-04-01T22:10:00Z',
    totalBids: 4,
    thumbnail: 'https://picsum.photos/id/110/600/400',
    isLike: true,
    seller: 'Vo J',
    rating: 3.7,
  },
];

const convertDay = (date: string) => {
  const now = new Date();
  const endDate = new Date(date);
  const diffTime = Math.abs(endDate.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const review = [
  {
    id: 1,
    name: 'Trần Minh Anh',
    from: 'bidder',
    product: 'Macbook Pro 16',
    rating: 5,
    review: 'Sản phẩm chất lượng, đóng gói cẩn thận',
    date: '2025-01-12',
  },
  {
    id: 2,
    name: 'Nguyễn Văn B',
    from: 'seller',
    product: 'iPhone 15 Pro Max',
    rating: 4,
    review: 'Hàng đẹp, giao nhanh nhưng hộp hơi móp',
    date: '2025-01-10',
  },
  {
    id: 3,
    name: 'Lê Thị C',
    from: 'bidder',
    product: 'RTX 3080 Founders Edition',
    rating: 5,
    review: 'Hiệu năng tuyệt vời, chơi game mượt',
    date: '2024-12-22',
  },
  {
    id: 4,
    name: 'Phạm Quốc D',
    from: 'bidder',
    product: 'ASUS ROG Strix B550-F',
    rating: 3,
    review: 'Main hoạt động ổn nhưng giao hàng hơi chậm',
    date: '2024-12-18',
  },
  {
    id: 5,
    name: 'Đỗ Thu E',
    from: 'bidder',
    product: 'Samsung 980 Pro 1TB SSD',
    rating: 4,
    review: 'Ổ nhanh nhưng giá hơi cao',
    date: '2025-01-02',
  },
  {
    id: 6,
    name: 'Võ Nhật F',
    from: 'bidder',
    product: 'Intel Core i9-12900K',
    rating: 5,
    review: 'CPU cực mạnh, render video nhanh',
    date: '2025-01-05',
  },
  {
    id: 7,
    name: 'Nguyễn Văn G',
    from: 'bidder',
    product: 'Seagate IronWolf 10TB',
    rating: 4,
    review: 'Ổ chạy êm, phù hợp cho NAS',
    date: '2024-12-27',
  },
  {
    id: 8,
    name: 'Trần Bích H',
    from: 'seller',
    product: 'Dell PowerEdge R720',
    rating: 5,
    review: 'Server mạnh, chạy ảo hoá ngon',
    date: '2025-01-08',
  },
];

const myReviewFromProduct = [
  {
    id: 1,
    name: 'Nguyen Van A',
    product: 'iPhone 15 Pro Max',
    rating: 4,
    review: 'Máy đẹp như mới, rất hài lòng!',
    date: '2025-01-12',
  },
  {
    id: 2,
    name: 'Tran Thi B',
    product: 'Samsung Galaxy S24 Ultra',
    rating: 5,
    review: 'Hiệu năng cực mạnh, pin trâu, camera quá đỉnh!',
    date: '2025-01-15',
  },
  {
    id: 3,
    name: 'Le Van C',
    product: 'MacBook Air M2',
    rating: 3,
    review: 'Máy nhẹ, đẹp nhưng chạy hơi nóng khi render video.',
    date: '2025-01-20',
  },
  {
    id: 4,
    name: 'Pham Thi D',
    product: 'AirPods Pro 2',
    rating: 5,
    review: 'Chống ồn tốt, đeo thoải mái, âm thanh tuyệt vời.',
    date: '2025-01-22',
  },
  {
    id: 5,
    name: 'Hoang Van E',
    product: 'Apple Watch Series 9',
    rating: 4,
    review: 'Dùng ngon, nhiều tính năng mới, pin ổn.',
    date: '2025-02-01',
  },
  {
    id: 6,
    name: 'Do Thi F',
    product: 'iPad Pro M1 11-inch',
    rating: 5,
    review: 'Màn đẹp, bút viết sướng, hiệu năng cực mạnh.',
    date: '2025-02-03',
  },
  {
    id: 7,
    name: 'Nguyen Van G',
    product: 'Xiaomi Redmi Note 13 Pro',
    rating: 4,
    review: 'Giá rẻ, cấu hình cao, nhưng camera hơi xử lý quá đà.',
    date: '2025-02-10',
  },
  {
    id: 8,
    name: 'Phan Thi H',
    product: 'Sony WH-1000XM5',
    rating: 5,
    review: 'Âm trầm sâu, chống ồn cực tốt, đeo lâu không đau tai.',
    date: '2025-02-17',
  },
];

const ratingCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

review.forEach((r) => {
  ratingCount[r.rating as keyof typeof ratingCount] += 1;
});

const totalRating = () => {
  let total = 0;
  review.forEach((r) => {
    total += r.rating;
  });

  return total / review.length;
};

const sortValue = [
  {
    item: 'Sản phẩm',
    value: 'product',
  },
  {
    item: 'Người mua',
    value: 'bidder',
  },
];

const Profile = () => {
  const [selectOption, SetSelectOption] = useState(sortValue[0]);
  return (
    <>
      <Header />
      <div className='mx-18 mt-5'>
        <div className='border border-gray-200 h-[150px] rounded-xl flex items-center justify-between px-10'>
          <div className='flex items-center gap-5'>
            <Avatar className='w-24 h-24'>
              <AvatarImage src='/gg-logo.svg' alt='User Avatar' className='border border-gray-400 rounded-full' />
              <AvatarFallback>?</AvatarFallback>
            </Avatar>

            <div className='flex flex-col justify-start gap-1'>
              <div className='flex items-center gap-5'>
                <span className='text-2xl font-bold'>Thanh Dang</span>
                <div className='border border-blue-400 bg-blue-100 rounded-2xl px-2 py-0.5 text-xs font-semibold text-blue-700'>
                  Người mua
                </div>
              </div>

              <span className='text-gray-500'>Dn156162@gmail.com</span>
              <span className='text-gray-500'>Tham gia từ: 20-10-2023</span>
            </div>
          </div>

          <div className='flex items-center justify-center gap-5'>
            <Button variant={'outline'} className='bg-teal-600 text-white'>
              <ShoppingBasket size={16} />
              Nâng cấp người bán hàng
            </Button>

            <Button variant='outline' className=''>
              <UserRound size={16} />
              Chỉnh sửa hồ sơ
            </Button>

            <Button variant={'outline'} className='text-red-500'>
              <LogOut size={16} />
              Đăng xuất
            </Button>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mt-5 mb-8'>
          <div className='border border-gray-200 rounded-lg p-6'>
            <div className='flex items-center justify-between'>
              <div className='flex flex-col'>
                <span className='text-gray-500'>Tổng số lượt ra giá</span>
                <span className='text-3xl  font-bold'>28</span>
              </div>

              <Gavel className='w-10 h-10 stroke-2' />
            </div>
          </div>

          <div className='border border-gray-200 rounded-lg p-6'>
            <div className='flex items-center justify-between'>
              <div className='flex flex-col'>
                <span className='text-gray-500'>Yêu thích</span>
                <span className='text-3xl  font-bold'>19</span>
              </div>

              <Heart className='w-10 h-10 stroke-2' />
            </div>
          </div>

          <div className='border border-gray-200 rounded-lg p-6'>
            <div className='flex items-center justify-between'>
              <div className='flex flex-col'>
                <span className='text-gray-500'>Đơn hàng</span>
                <span className='text-4xl  font-bold'>2</span>
              </div>

              <ShoppingBag className='w-10 h-10 stroke-2' />
            </div>
          </div>

          <div className='border border-gray-200 rounded-lg p-6'>
            <div className='flex items-center justify-between'>
              <div className='flex flex-col'>
                <span className='text-gray-500'>Đánh giá</span>
                <span className='text-4xl  font-bold'>19</span>
              </div>

              <ScrollText className='w-10 h-10 stroke-2' />
            </div>
          </div>
        </div>

        <Tabs className='w-full' defaultValue='activity'>
          <TabsList className='grid w-full grid-cols-4'>
            <TabsTrigger
              className='data-[state=active]:bg-gray-300 font-semibold data-[state=active]:py-1 data-[state=active]:rounded-md '
              value='activity'
            >
              Hoạt động
            </TabsTrigger>
            <TabsTrigger
              className='data-[state=active]:bg-gray-300 data-[state=active]:py-1 data-[state=active]:rounded-md '
              value='wishlist'
            >
              Yêu thích (3){' '}
            </TabsTrigger>
            <TabsTrigger
              className='data-[state=active]:bg-gray-300 font-semibold data-[state=active]:py-1 data-[state=active]:rounded-md '
              value='review'
            >
              Đánh giá (4){' '}
            </TabsTrigger>
            <TabsTrigger
              className='data-[state=active]:bg-gray-300 font-semibold data-[state=active]:py-1 data-[state=active]:rounded-md '
              value='my-review'
            >
              Đã đánh giá (5){' '}
            </TabsTrigger>
          </TabsList>

          <TabsContent value='activity'>
            <div className='border border-gray-300 mt-5 w-full px-7 py-3 flex flex-col rounded-md'>
              <h1 className='text-lg font-bold mb-5'>Hoạt động gần đây</h1>

              <div className='flex flex-col gap-3'>
                {activityData.map((a, index) => (
                  <div
                    key={index}
                    className='border border-gray-300 rounded-md px-4 py-4 w-full flex items-center justify-between'
                  >
                    <div className='flex flex-col gap-1'>
                      <p className='font-bold'>{a.name}</p>
                      <p className='text-sm text-gray-400'>Đặt giá {a.price.toLocaleString()} VND</p>
                    </div>

                    <span className='text-sm'>{a.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value='wishlist'>
            <div className='border border-gray-300 px-8 py-4 rounded-md flex flex-col w-full mt-5'>
              <h1 className='text-lg font-bold mb-5'>Sản phẩm yêu thích</h1>
              <div className='grid grid-cols-4 gap-3'>
                {products.map((item) => (
                  <div
                    key={item.id}
                    className='flex flex-col gap-2 border border-gray-200 rounded-md px-3 py-2 h-fit w-78 relative cursor-pointer z-0'
                  >
                    <img src={item.thumbnail} alt={item.name} className='w-full h-40 object-cover mb-2' />
                    <p className='font-semibold text-xl line-clamp-2'>{item.name}</p>

                    {Rating(item.rating)}
                    <span className='font-semibold text-2xl'>{item.price.toLocaleString()} VND</span>

                    <span className=' text-gray-700 text-sm'> Mua ngay: {item.buyNowPrice.toLocaleString()} VND</span>

                    <div className='border-t border-gray-300 mt-2 mb-2' />

                    <div className='flex items-center justify-between text-sm'>
                      <span>Lượt ra giá: </span>
                      <span>{item.totalBids}</span>
                    </div>

                    <div className='flex items-center justify-between text-sm'>
                      <span>Người bán: </span>
                      <span>{item.seller}</span>
                    </div>

                    <Heart
                      className={`w-10 h-10 ${
                        item.isLike ? 'stroke-0 fill-red-600' : 'stroke-2'
                      } absolute right-1 top-1  bg-white hover:bg-gray-100 p-2 rounded-full`}
                    />

                    <div className='w-20 h-7 text-sm bg-gray-800 text-white absolute left-1 top-1 px-2 py-1 rounded-md'>
                      {convertDay(item.endTime)} Ngày
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value='review'>
            <div className='border border-gray-300 mt-5 w-full px-7 py-3 flex flex-col rounded-md'>
              <h1 className='text-lg font-bold'>Đánh giá nhận được</h1>
              <h1 className='text-sm font-semibold text-gray-400 mb-5'>
                Các đánh giá về sản phẩm và dịch vụ của bạn từ người mua
              </h1>

              <div className='flex items-center gap-5 bg-gray-100 rounded-md py-3 px-5 w-full'>
                <div className='flex flex-col items-center py-5 gap-2 w-50'>
                  <h1 className='text-4xl font-bold'>{totalRating().toFixed(1)}</h1>
                  <div className='flex items-center gap-1'>
                    {[...Array(5)].map((_, index) => (
                      <Star key={index} className='w-5 h-5 fill-amber-400 text-amber-400' />
                    ))}
                  </div>

                  <h1 className='text-gray-500 font-semibold text-sm'>{review.length} đánh giá </h1>
                </div>

                <div className='flex flex-col gap-2 w-full'>
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className='flex items-center'>
                      <span className='mr-2'>{5 - index}</span>
                      <Star className='w-5 h-5 fill-amber-400 text-amber-400' />

                      <Progress
                        className='ml-5 mr-4'
                        value={(ratingCount[(5 - index) as keyof typeof ratingCount] / review.length) * 100}
                      />
                      <span>{ratingCount[(5 - index) as keyof typeof ratingCount]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className='flex flex-col gap-3 mt-5'>
                {review.map((item) => (
                  <div
                    key={item.id}
                    className='border border-gray-300 rounded-md px-4 py-4 w-full flex items-start justify-between'
                  >
                    <div className='flex flex-col gap-2'>
                      <div className='flex items-center gap-4'>
                        <p className='font-semibold'>{item.name}</p>
                        {item.from === 'seller' ? (
                          <div className='text-xs border-2 border-orange-500 bg-orange-300 text-orange-900 px-3 py-0.5 font-semibold rounded-2xl'>
                            Người bán
                          </div>
                        ) : (
                          <div className='text-xs border-2 border-blue-500 bg-blue-300 text-blue-900 px-3 py-0.5 font-semibold rounded-2xl'>
                            Người mua
                          </div>
                        )}
                      </div>

                      <p className='text-sm font-semibold text-gray-500'>{item.product}</p>
                      <div className='flex items-center gap-0.5'>
                        {[...Array(item.rating)].map((_, index) => (
                          <Star key={index} className='w-4 h-3 fill-amber-400 text-amber-400' />
                        ))}
                      </div>

                      <p>{item.review}</p>
                    </div>

                    <p className='text-sm text-gray-500'>{item.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value='my-review'>
            <div className='border border-gray-300 mt-5 w-full px-7 py-3 flex flex-col rounded-md'>
              <div className='flex items-center justify-between'>
                <div>
                  <h1 className='text-lg font-bold'>Lịch sử đánh giá</h1>
                  <h1 className='text-sm font-semibold text-gray-400 mb-5'>
                    Các đánh giá bạn đã để lại cho người mua và sản phẩm.
                  </h1>
                </div>
                <Popover>
                  <PopoverTrigger>
                    <Button
                      className='w-45 border border-gray-300 items-center justify-between cursor-pointer'
                      variant={'outline'}
                    >
                      <span className='text-gray-700 font-medium flex'>{selectOption.item}</span>
                      <ChevronDown className='w-5 h-5' />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className='w-45 border-gray-300 bg-white'>
                    <div className='w-full'>
                      <ul className='space-y-0.5'>
                        {sortValue.map((item) => (
                          <li
                            onClick={() => SetSelectOption(item)}
                            key={item.value}
                            className='px-3 py-1 text-sm hover:bg-gray-200 cursor-pointers!'
                          >
                            {item.item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className='flex flex-col gap-4'>
                {myReviewFromProduct.map((item) => (
                  <div className='border border-gray-300 w-full px-7 py-3 flex items-start justify-between gap-2 rounded-md'>
                    <div className='flex flex-col gap-1'>
                      <p className='font-semibold'>{item.name}</p>
                      <p className='text-sm font-semibold text-gray-500'>{item.product}</p>
                      <div className='flex items-center gap-0.5'>
                        {[...Array(item.rating)].map((_, index) => (
                          <Star key={index} className='w-4 h-3 fill-amber-400 text-amber-400' />
                        ))}
                      </div>

                      <p className='mt-2'>{item.review}</p>
                    </div>
                    <p className='text-sm text-gray-500'>{item.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Profile;
