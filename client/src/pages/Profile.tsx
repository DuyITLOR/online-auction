/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Camera,
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
import { Progress } from '../components/ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
// Import thêm các component UI cho Dialog và Form
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '../components/ui/dialog';

import { useEffect, useRef, useState } from 'react';
import { clearSession, getSession } from '../libs/session';
import { getRole, requestToUpgrade, updateUser } from '../api/user';
import { type WatchList, type User } from '../libs/types/types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getAllWatchList } from '../api/watchlist';

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

const convertDay = (date: string) => {
  const now = new Date();
  const endDate = new Date(date);
  const diffTime = Math.abs(endDate.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const convertISO = (isoString: string | undefined) => {
  if (!isoString) return;
  const date = new Date(isoString);

  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();

  return `${dd}-${mm}-${yyyy}`;
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
  const navigate = useNavigate();
  const [selectOption, SetSelectOption] = useState(sortValue[0]);
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<User>();
  const [watchList, setWatchList] = useState<WatchList[]>([]);

  const [upgradeReason, setUpgradeReason] = useState('');
  const [previewAvatar, setPreviewAvatar] = useState<string | undefined>(undefined);
  const [image, setImage] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
  });

  useEffect(() => {
    if (user?.avtUrl) {
      setPreviewAvatar(user?.avtUrl);
    }

    if (user?.fullname) {
      setFormData((prev) => ({ ...prev, ['fullname']: user.fullname! }));
      setFormData((prev) => ({ ...prev, ['email']: user.email }));
    }
  }, [user]);

  useEffect(() => {
    async function fetchSession() {
      const sess = await getSession();
      setSession(sess);
    }
    fetchSession();
  }, []);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        if (!session) {
          return;
        }
        const token = session.token as string;

        const user = await getRole({ token: token });
        setUser(user);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchWatchList = async () => {
      const data = await getAllWatchList({ token: session.token });
      setWatchList(data);
    };

    fetchRole();
    fetchWatchList();
  }, [session]);

  const handleUpgradeSubmit = async () => {
    const data = await requestToUpgrade({ note: upgradeReason, token: session.token });
    if (data) {
      toast.success('Gửi yêu cầu thành công');
    } else {
      toast.error('Gửi yêu cầu thất bại');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewAvatar(url);
    }
  };

  const handleUpdateProfile = () => {
    const payload: any = {
      fullname: formData.fullname,
      email: formData.email,
    };

    if (image) {
      payload.avatar = image;
    }

    updateUser({ user: payload, token: session.token });
    window.location.reload();
  };

  const signout = () => {
    clearSession();
    setSession(null);
    navigate('/');
    window.location.reload();
  };

  return (
    <>
      <Header />
      <div className='mx-18 mt-5'>
        <div className='border border-gray-200 h-[150px] rounded-xl flex items-center justify-between px-10'>
          <div className='flex items-center gap-5'>
            <Avatar className='w-24 h-24'>
              <AvatarImage src={user?.avtUrl} alt='User Avatar' className='border border-gray-400 rounded-full' />
              <AvatarFallback>?</AvatarFallback>
            </Avatar>

            <div className='flex flex-col justify-start gap-1'>
              <div className='flex items-center gap-5'>
                <span className='text-2xl font-bold'>{user?.fullname}</span>

                {user?.currentRoles.includes('SELLER') ? (
                  <div className='border border-amber-500 bg-amber-100 rounded-2xl px-2 py-0.5 text-xs font-semibold text-amber-700'>
                    Người bán
                  </div>
                ) : (
                  <div className='border border-blue-400 bg-blue-100 rounded-2xl px-2 py-0.5 text-xs font-semibold text-blue-700'>
                    Người mua
                  </div>
                )}
              </div>

              <span className='text-gray-500'>{user?.email}</span>
              <span className='text-gray-500'>Tham gia từ: {convertISO(user?.createdAt)}</span>
            </div>
          </div>

          <div className='flex items-center justify-center gap-5'>
            {!user?.currentRoles.includes('SELLER') && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant={'outline'} className='bg-teal-600 text-white hover:bg-teal-700 hover:text-white'>
                    <ShoppingBasket size={16} />
                    Nâng cấp người bán hàng
                  </Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-[500px]'>
                  <DialogHeader>
                    <DialogTitle>Đăng ký trở thành người bán</DialogTitle>
                    <DialogDescription>
                      Vui lòng cho chúng tôi biết lý do bạn muốn trở thành người bán hàng trên nền tảng.
                    </DialogDescription>
                  </DialogHeader>
                  <div className='grid gap-4 py-4'>
                    <div className='grid w-full gap-1.5'>
                      <textarea
                        id='reason'
                        placeholder='Tôi muốn bán các sản phẩm...'
                        className='outline-0 border border-gray-200 rounded-md px-2 py-3'
                        value={upgradeReason}
                        onChange={(e) => setUpgradeReason(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type='button' variant='outline'>
                        Hủy
                      </Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button type='submit' onClick={handleUpgradeSubmit} className='bg-teal-600 text-white border-0'>
                        Gửi yêu cầu
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            <Dialog>
              <DialogTrigger asChild>
                <Button variant='outline' className=''>
                  <UserRound size={16} />
                  Chỉnh sửa hồ sơ
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[500px]'>
                <DialogHeader>
                  <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
                  <DialogDescription>
                    Thay đổi thông tin cá nhân của bạn tại đây. Nhấn lưu khi hoàn tất.
                  </DialogDescription>
                </DialogHeader>
                <div className='flex flex-col items-center justify-center gap-3 py-1'>
                  <div className='relative group cursor-pointer' onClick={() => fileInputRef.current?.click()}>
                    <Avatar className='w-24 h-24 border-2 border-gray-200'>
                      <AvatarImage src={previewAvatar || user?.avtUrl} className='object-cover' />
                      <AvatarFallback className='text-2xl'>
                        {user?.fullname ? user.fullname.charAt(0).toUpperCase() : '?'}
                      </AvatarFallback>
                    </Avatar>

                    <div className='absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                      <Camera className='text-white w-8 h-8' />
                    </div>
                  </div>
                  <span className='text-xs text-gray-500'>Nhấn vào ảnh để thay đổi</span>

                  <input
                    type='file'
                    ref={fileInputRef}
                    className='hidden'
                    accept='image/*'
                    onChange={handleChangeAvatar}
                  />
                </div>

                <div className='grid gap-4 py-4'>
                  <div className='grid grid-cols-4 items-center gap-2'>
                    <p id='name' className=''>
                      Họ tên
                    </p>
                    <input
                      name='fullname'
                      className='outline-0 border border-gray-200 rounded-md px-2 py-1 min-w-[320px]'
                      value={formData.fullname}
                      onChange={handleChange}
                    />
                  </div>
                  <div className='grid grid-cols-4 items-center gap-2'>
                    <p id='email' className=''>
                      Email
                    </p>
                    <input
                      id='email'
                      value={formData.email}
                      disabled
                      className='outline-0 border border-gray-200 rounded-md px-2 py-1 min-w-[320px]'
                    />
                  </div>
                  <div className='grid grid-cols-4 items-center gap-2'>
                    <p id='birth' className=''>
                      Ngày sinh
                    </p>
                    <input
                      type='date'
                      id='date'
                      value={formData.email}
                      disabled
                      className='outline-0 border border-gray-200 rounded-md px-2 py-1 min-w-[320px]'
                    />
                  </div>

                  <div className='grid grid-cols-4 items-center gap-2'>
                    <p id='address' className=''>
                      Địa chỉ
                    </p>
                    <input
                      id='address'
                      value={formData.email}
                      disabled
                      className='outline-0 border border-gray-200 rounded-md px-2 py-1 min-w-[320px]'
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type='submit' className='bg-teal-600 text-white border-0' onClick={handleUpdateProfile}>
                      Lưu thay đổi
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button onClick={() => signout()} variant={'outline'} className='text-red-500'>
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
              <p className='text-lg font-bold mb-5'>Hoạt động gần đây</p>

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
              <p className='text-lg font-bold mb-5'>Sản phẩm yêu thích</p>
              <div className='grid grid-cols-4 gap-3'>
                {watchList.map((item: WatchList) => (
                  <div
                    key={`${item.productId}-${item.userId}`}
                    className='flex flex-col gap-2 border border-gray-200 rounded-md px-3 py-2 h-fit w-78 relative cursor-pointer z-0'
                  >
                    <img
                      src={item.product.images?.[0].url}
                      alt={item.product.title}
                      className='w-full h-40 object-cover mb-2'
                    />
                    <p className='font-semibold text-xl line-clamp-2'>{item.product.title}</p>

                    <span className='font-semibold text-2xl'>
                      {Number(item.product.currentPrice).toLocaleString()} VND
                    </span>

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
                      <span>{item.user?.fullname}</span>
                    </div>

                    <Heart
                      className={`w-10 h-10 ${
                        item.productId ? 'stroke-0 fill-red-600' : 'stroke-2'
                      } absolute right-1 top-1  bg-white hover:bg-gray-100 p-2 rounded-full`}
                    />

                    <div className='w-20 h-7 text-sm bg-gray-800 text-white absolute left-1 top-1 px-2 py-1 rounded-md'>
                      {convertDay(item.product.endAt)} Ngày
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value='review'>
            <div className='border border-gray-300 mt-5 w-full px-7 py-3 flex flex-col rounded-md'>
              <p className='text-lg font-bold'>Đánh giá nhận được</p>
              <p className='text-sm font-semibold text-gray-400 mb-5'>
                Các đánh giá về sản phẩm và dịch vụ của bạn từ người mua
              </p>

              <div className='flex items-center gap-5 bg-gray-100 rounded-md py-3 px-5 w-full'>
                <div className='flex flex-col items-center py-5 gap-2 w-50'>
                  <p className='text-4xl font-bold'>{totalRating().toFixed(1)}</p>
                  <div className='flex items-center gap-1'>
                    {[...Array(5)].map((_, index) => (
                      <Star key={index} className='w-5 h-5 fill-amber-400 text-amber-400' />
                    ))}
                  </div>

                  <p className='text-gray-500 font-semibold text-sm'>{review.length} đánh giá </p>
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
                  <p className='text-lg font-bold'>Lịch sử đánh giá</p>
                  <p className='text-sm font-semibold text-gray-400 mb-5'>
                    Các đánh giá bạn đã để lại cho người mua và sản phẩm.
                  </p>
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
