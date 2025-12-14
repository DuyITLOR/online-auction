/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Calendar,
  Camera,
  Edit,
  Gavel,
  Heart,
  LogOut,
  MessageCircle,
  ScrollText,
  ShoppingBag,
  ShoppingBasket,
  ThumbsDown,
  ThumbsUp,
  UserRound,
} from 'lucide-react';
import Header from '../components/header';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList } from '../components/ui/tab';
import { TabsTrigger } from '@radix-ui/react-tabs';
import { Progress } from '../components/ui/progress';
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

import { useContext, useEffect, useRef, useState } from 'react';
import { clearSession, getSession } from '../libs/session';
import { requestToUpgrade, updateUser } from '../api/user';
import { type Ratings } from '../libs/types/types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { UserContext } from '../libs/contexts/user.context';
import { getAllRatees, getAllRaters, updateRating } from '../api/rating';
import { isoToYYYYMMDD } from '../libs/utils';
import Activities from '../components/profile/tabs/activities';
import WatchProducts from '../components/profile/tabs/watchList';

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

const ratingCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

review.forEach((r) => {
  ratingCount[r.rating as keyof typeof ratingCount] += 1;
});

const Profile = () => {
  const navigate = useNavigate();
  const { user, refresh } = useContext(UserContext);
  const [session, setSession] = useState<any>(null);
  const [raters, setRaters] = useState<Ratings[]>([]);
  const [ratees, setRatees] = useState<Ratings[]>([]);

  const [upgradeReason, setUpgradeReason] = useState('');
  const [previewAvatar, setPreviewAvatar] = useState<string | undefined>(undefined);
  const [image, setImage] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalReviews = raters.length;
  const positiveCount = raters.filter((r) => r.value === 1).length;
  const negativeCount = raters.filter((r) => r.value === -1).length;
  const positiveRatio = totalReviews > 0 ? ((positiveCount + 10 - negativeCount) / (totalReviews + 10)) * 100 : 0;

  // update rating
  const [status, setStatus] = useState(false);
  const [comment, setComment] = useState('');

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
    const fetchRaters = async () => {
      const data = await getAllRaters({ token: session.token });
      setRaters(data.ratings);
    };

    const fetchRatees = async () => {
      const data = await getAllRatees({ token: session.token });
      setRatees(data.ratings);
    };

    fetchRaters();
    fetchRatees();
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
    refresh();
    window.location.reload();
  };

  const handleUpdateRating = async (id: string, statusValue: boolean, commentValue: string) => {
    try {
      const value = statusValue ? 1 : -1;
      await updateRating({ id: id, token: session.token, value: value, comment: commentValue });
      toast.success('Cập nhật đánh giá thành công');
      const fetchRatees = async () => {
        const data = await getAllRatees({ token: session.token });
        setRatees(data.ratings);
      };

      await fetchRatees();
    } catch (err) {
      toast.error('Cập nhật đánh giá thất bại');
      console.error(err);
    }
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
      <div className='mx-18 mt-5 mb-5'>
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
              className='data-[state=active]:bg-teal-500 font-semibold data-[state=active]:py-1 data-[state=active]:rounded-md '
              value='activity'
            >
              Hoạt động
            </TabsTrigger>
            <TabsTrigger
              className='data-[state=active]:bg-teal-500 data-[state=active]:py-1 data-[state=active]:rounded-md '
              value='wishlist'
            >
              Yêu thích
            </TabsTrigger>
            <TabsTrigger
              className='data-[state=active]:bg-teal-500 font-semibold data-[state=active]:py-1 data-[state=active]:rounded-md '
              value='review'
            >
              Đánh giá
            </TabsTrigger>
            <TabsTrigger
              className='data-[state=active]:bg-teal-500 font-semibold data-[state=active]:py-1 data-[state=active]:rounded-md '
              value='my-review'
            >
              Đã đánh giá
            </TabsTrigger>
          </TabsList>

          <TabsContent value='activity'>
            <Activities token={session?.token} />
          </TabsContent>

          <TabsContent value='wishlist'>
            <WatchProducts token={session?.token} />
          </TabsContent>

          <TabsContent value='review'>
            <div className='w-full flex flex-col gap-6 mt-5 mb-5'>
              <div className='bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6'>
                <div className='flex flex-col items-start gap-1 w-full md:w-1/3'>
                  <h3 className='text-lg font-bold text-gray-800'>Độ uy tín của Shop</h3>
                  <div className='flex items-baseline gap-2'>
                    <span className='text-5xl font-extrabold text-emerald-600'>{positiveRatio.toFixed(0)}%</span>
                    <span className='text-gray-500 font-medium'>Đánh giá tích cực</span>
                  </div>
                  <p className='text-sm text-gray-400'>Dựa trên {totalReviews} lượt đánh giá gần nhất</p>
                </div>

                <div className='flex flex-col gap-3 w-full md:w-2/3 border-l border-gray-100 pl-0 md:pl-6'>
                  <div className='flex items-center gap-3'>
                    <ThumbsUp className='w-5 h-5 text-emerald-500' />
                    <div className='w-full'>
                      <div className='flex justify-between text-sm mb-1'>
                        <span className='font-semibold text-gray-700'>Hài lòng</span>
                        <span className='text-gray-500'>{positiveCount}</span>
                      </div>
                      <Progress value={positiveRatio} className='h-2 bg-gray-100' />
                    </div>
                  </div>

                  <div className='flex items-center gap-3'>
                    <ThumbsDown className='w-5 h-5 text-rose-500' />
                    <div className='w-full'>
                      <div className='flex justify-between text-sm mb-1'>
                        <span className='font-semibold text-gray-700'>Không hài lòng</span>
                        <span className='text-gray-500'>{negativeCount}</span>
                      </div>
                      <Progress value={100 - positiveRatio} className='h-2 bg-gray-100' />
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex flex-col gap-4'>
                <h4 className='text-base font-bold text-gray-800 uppercase tracking-wide'>Đánh giá nhận được</h4>

                {raters.map((item: Ratings) => (
                  <div
                    key={item.id}
                    className='bg-white border border-gray-200 rounded-lg p-5 flex flex-col md:flex-row gap-4 transition-all hover:shadow-md'
                  >
                    <div className='flex flex-col justify-between gap-3 w-full md:w-48'>
                      <div className='flex items-center gap-3'>
                        <Avatar>
                          <AvatarImage src={item?.rater?.avtUrl} />
                        </Avatar>
                        <div className='flex flex-col'>
                          <div className='flex items-center gap-2 mt-1'>
                            <span
                              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                                !(item.rater.role === 'BIDDER')
                                  ? 'border-orange-200 bg-orange-50 text-orange-700'
                                  : 'border-blue-200 bg-blue-50 text-blue-700'
                              }`}
                            >
                              {!(item?.rater.role === 'BIDDER') ? 'Người bán' : 'Người mua'}
                            </span>
                          </div>
                          <p className='font-semibold text-gray-900 text-sm'>{item?.rater?.fullname}</p>
                        </div>
                      </div>
                      <div className='flex items-center gap-1 mt-2 text-sm text-gray-400'>
                        <Calendar className='w-3 h-3' />
                        <span>{isoToYYYYMMDD(item?.createdAt)}</span>
                      </div>
                    </div>

                    <div className='grow border-l-0 md:border-l border-gray-100 pl-0 md:pl-4 flex flex-col justify-between'>
                      <div>
                        <div className='flex items-center justify-between mb-2'>
                          <p className='text-sm font-medium text-gray-500 uppercase'>{item.productId}</p>

                          {item.value === 1 ? (
                            <div className='flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100'>
                              <ThumbsUp className='w-3.5 h-3.5 fill-current' />
                              <span className='text-xs font-bold'>Hài lòng</span>
                            </div>
                          ) : (
                            <div className='flex items-center gap-1 text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100'>
                              <ThumbsDown className='w-3.5 h-3.5 fill-current' />
                              <span className='text-xs font-bold'>Không hài lòng</span>
                            </div>
                          )}
                        </div>

                        <p className='text-gray-700 text-sm leading-relaxed'>{item?.comment}</p>
                      </div>

                      <div className='mt-4 flex justify-end'>
                        <Button
                          variant='outline'
                          size='sm'
                          className='text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 gap-2 transition-colors'
                          onClick={() => console.log('Open chat with', item.rater.fullname)}
                        >
                          <MessageCircle className='w-4 h-4' />
                          Nhắn tin
                        </Button>
                      </div>
                    </div>
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
              </div>

              <div className='flex flex-col gap-4'>
                {ratees.map((item: Ratings) => (
                  <div
                    key={item.id}
                    className='bg-white border border-gray-200 rounded-lg p-5 flex flex-col md:flex-row gap-4 transition-all hover:shadow-md'
                  >
                    <div className='flex flex-col justify-between gap-3 w-full md:w-48'>
                      <div className='flex items-center gap-3'>
                        <Avatar>
                          <AvatarImage src={item?.ratee?.avtUrl} />
                        </Avatar>
                        <div className='flex flex-col'>
                          <div className='flex items-center gap-2 mt-1'>
                            <span
                              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                                !(item.ratee.role === 'BIDDER')
                                  ? 'border-orange-200 bg-orange-50 text-orange-700'
                                  : 'border-blue-200 bg-blue-50 text-blue-700'
                              }`}
                            >
                              {!(item?.ratee.role === 'BIDDER') ? 'Người bán' : 'Người mua'}
                            </span>
                          </div>
                          <p className='font-semibold text-gray-900 text-sm'>{item?.ratee?.fullname}</p>
                        </div>
                      </div>
                      <div className='flex items-center gap-1 mt-2 text-sm text-gray-400'>
                        <Calendar className='w-3 h-3' />
                        <span>{isoToYYYYMMDD(item?.createdAt)}</span>
                      </div>
                    </div>

                    <div className='grow border-l-0 md:border-l border-gray-100 pl-0 md:pl-4 flex flex-col justify-between'>
                      <div>
                        <div className='flex items-center justify-between mb-2'>
                          <p className='text-sm font-medium text-gray-500 uppercase'>{item.productId}</p>

                          {item.value === 1 ? (
                            <div className='flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100'>
                              <ThumbsUp className='w-3.5 h-3.5 fill-current' />
                              <span className='text-xs font-bold'>Hài lòng</span>
                            </div>
                          ) : (
                            <div className='flex items-center gap-1 text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100'>
                              <ThumbsDown className='w-3.5 h-3.5 fill-current' />
                              <span className='text-xs font-bold'>Không hài lòng</span>
                            </div>
                          )}
                        </div>

                        <p className='text-gray-700 text-sm leading-relaxed'>{item?.comment}</p>
                      </div>

                      <div className='mt-4 flex justify-end'>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant='outline'
                              size='sm'
                              className='text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 gap-2 transition-colors'
                              onClick={() => {
                                setStatus(item?.value === 1);
                                setComment(item?.comment ? item?.comment : '');
                              }}
                            >
                              <Edit className='w-4 h-4' />
                              Chỉnh sửa
                            </Button>
                          </DialogTrigger>

                          <DialogContent className='min-w-[500px]'>
                            <DialogHeader>
                              <DialogTitle>Chỉnh sửa</DialogTitle>
                              <DialogDescription>Chỉnh sửa thông tin đánh giá</DialogDescription>
                            </DialogHeader>

                            <div className='flex flex-col gap-3 w-full mx-1'>
                              <div className=' p-1 rounded-lg grid grid-cols-2 gap-1'>
                                <button
                                  onClick={() => setStatus(true)}
                                  className={`flex items-center justify-center gap-2 border py-2 rounded-md text-sm font-medium transition-all ${
                                    status
                                      ? 'bg-green-50 text-green-600 shadow-sm border-green-700'
                                      : 'text-gray-500 hover:text-gray-700 border-gray-200 '
                                  }`}
                                >
                                  <ThumbsUp className='w-4 h-4' /> Hài lòng
                                </button>
                                <button
                                  onClick={() => setStatus(false)}
                                  className={`flex items-center justify-center border gap-2 py-2 rounded-md text-sm font-medium transition-all ${
                                    !status
                                      ? 'bg-red-50 text-red-600 shadow-sm border-red-700'
                                      : 'text-gray-500 hover:text-gray-700 border-gray-200 '
                                  }`}
                                >
                                  <ThumbsDown className='w-4 h-4' /> Không hài lòng
                                </button>
                              </div>
                              <textarea
                                className='w-full border border-gray-300 outline-0 px-2 py-2 h-[100px] focus:border-gray-600 rounded-md'
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                              />
                            </div>

                            <DialogFooter>
                              <DialogFooter>
                                <DialogClose>
                                  <div className='flex items-center gap-2'>
                                    <Button variant={'outline'}>Hủy</Button>
                                    <Button
                                      variant={'outline'}
                                      onClick={() => handleUpdateRating(item.id, status, comment)}
                                      className='bg-teal-700 text-white'
                                    >
                                      Chỉnh sửa
                                    </Button>
                                  </div>
                                </DialogClose>
                              </DialogFooter>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
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
