/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Camera,
  ChartArea,
  Edit,
  Gavel,
  Heart,
  KeyRound,
  LogOut,
  ScrollText,
  Settings,
  ShoppingBag,
  ShoppingBasket,
  Store,
  ThumbsDown,
  ThumbsUp,
  UserRound,
} from 'lucide-react';
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
  DialogClose,
  DialogTrigger,
} from '../components/ui/dialog';
// Thêm Dropdown Menu
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

import { useContext, useEffect, useRef, useState } from 'react';
import { clearSession, getSession } from '../libs/session';
import { getStatisticProfile, requestToUpgrade, updateUser } from '../api/user';
import { type Ratings } from '../libs/types/types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { UserContext } from '../libs/contexts/user.context';
import { getAllRatees, getAllRaters, updateRating } from '../api/rating';
import { calculateRating } from '../libs/utils';
import Activities from '../components/profile/tabs/activities';
import WatchProducts from '../components/profile/tabs/watchList';
import { updatePassword } from '@/api/auth';

const convertISO = (isoString: string | undefined, revert: boolean = false) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return revert ? `${yyyy}-${mm}-${dd}` : `${dd}-${mm}-${yyyy}`;
};

interface statisic {
  BidCount: number;
  WatchListCount: number;
  OrderCount: number;
  RatingCount: number;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, refresh } = useContext(UserContext);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [raters, setRaters] = useState<Ratings[]>([]);
  const [ratees, setRatees] = useState<Ratings[]>([]);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);

  const [upgradeReason, setUpgradeReason] = useState('');
  const [previewAvatar, setPreviewAvatar] = useState<string | undefined>(undefined);
  const [image, setImage] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalReviews = raters.length;
  const positiveCount = raters.filter((r) => r.value === 1).length;
  const negativeCount = raters.filter((r) => r.value === -1).length;

  const [status, setStatus] = useState(false);
  const [comment, setComment] = useState('');
  const [statistics, setStatistics] = useState<statisic>();

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    dateOfBirth: '',
    address: '',
  });

  const [passData, setPassData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user?.avtUrl) {
      setPreviewAvatar(user?.avtUrl);
    }

    if (user?.fullname) {
      setFormData((prev) => ({
        ...prev,
        ['fullname']: user.fullname || '',
        ['email']: user.email || '',
        ['dateOfBirth']: user.dateOfBirth ? convertISO(user?.dateOfBirth, true) : '',
        ['address']: user.address || '',
      }));
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

    const fetchStatistic = async () => {
      try {
        setLoading(true);
        const data = await getStatisticProfile({ token: session.token });
        setStatistics(data);
      } catch (err) {
        console.error(err);
        throw err;
      } finally {
        setLoading(false);
      }
    };

    fetchStatistic();
    fetchRaters();
    fetchRatees();
  }, [session]);

  const handleUpgradeSubmit = async () => {
    const data = await requestToUpgrade({ note: upgradeReason, token: session.token });
    if (data) {
      toast.success('Gửi yêu cầu thành công');
      setIsUpgradeOpen(false);
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

  const handleUpdateProfile = async () => {
    const payload: any = {
      fullname: formData.fullname,
      email: formData.email,
      dateOfBirth: formData.dateOfBirth,
      address: formData.address,
    };

    if (image) {
      payload.avatar = image;
    }

    await updateUser({ user: payload, token: session.token });
    refresh();
    setIsEditProfileOpen(false); // Đóng dialog
    toast.success('Cập nhật hồ sơ thành công');
  };

  const handleUpdateRating = async (id: string, statusValue: boolean, commentValue: string) => {
    try {
      const value = statusValue ? 1 : -1;
      await updateRating({ id: id, token: session.token, value: value, comment: commentValue });
      toast.success('Cập nhật đánh giá thành công');
      const data = await getAllRatees({ token: session.token });
      setRatees(data.ratings);
    } catch (err) {
      toast.error('Cập nhật đánh giá thất bại');
      console.error(err);
    }
  };

  const handleChangePassInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassData({ ...passData, [e.target.name]: e.target.value });
  };

  const handleSubmitPassword = async () => {
    try {
      if (passData.newPassword !== passData.confirmPassword) {
        toast.error('Mật khẩu xác nhận không khớp');
        return;
      }

      await updatePassword(session.token, passData.oldPassword, passData.newPassword);
      toast.success('Đổi mật khẩu thành công');
    } catch (err) {
      console.error(err);
      toast.error('Đổi mật khẩu thất bại');
      throw err;
    } finally {
      setIsChangePassOpen(false);
    }
  };

  const signout = () => {
    clearSession();
    setSession(null);
    navigate('/');
    window.location.reload();
  };

  if (loading) return <div className='loader'></div>;

  return (
    <>
      <div className='mx-18 mt-5 mb-5'>
        <div className='border border-gray-200 h-[150px] rounded-xl flex items-center justify-between px-10 bg-white shadow-sm'>
          <div className='flex items-center gap-5'>
            <div className='relative'>
              <Avatar className='w-24 h-24 border-4 border-white shadow-md'>
                <AvatarImage src={user?.avtUrl} />
                <AvatarFallback>{user?.fullname}</AvatarFallback>
              </Avatar>
              {user?.currentRoles.includes('SELLER') ? (
                <div className='absolute -bottom-2 -right-2 bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded-full border-2 border-white font-bold flex items-center gap-1'>
                  <Store size={12} /> Người bán
                </div>
              ) : (
                <div className='absolute -bottom-2 -right-2 bg-teal-500 text-white text-[10px] px-2 py-0.5 rounded-full border-2 border-white font-bold flex items-center gap-1'>
                  <Store size={12} /> Người mua
                </div>
              )}
            </div>

            <div className='flex flex-col justify-start gap-1'>
              <div className='flex items-center gap-5'>
                <span className='text-2xl font-bold'>{user?.fullname}</span>
              </div>
              <span className='text-gray-500'>{user?.email}</span>
              <span className='text-gray-500'>Tham gia từ: {convertISO(user?.createdAt)}</span>
            </div>
          </div>

          <div className='flex items-center justify-center gap-3'>
            <Button
              onClick={() => {
                navigate(`${user?.role === 'ADMIN' ? '/admin/dashboard' : '/seller/dashboard'}`);
              }}
              variant={'outline'}
              className='text-teal-600 border-teal-200 hover:bg-teal-50'
            >
              <ChartArea size={18} className='mr-2' />{' '}
              {user?.role === 'ADMIN' ? 'Hệ thống quản lý' : 'Quản lý sản phẩm'}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='border-gray-200 hover:bg-gray-100'>
                  <Settings size={18} className='mr-2' /> Cài đặt
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-56'>
                <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => setIsEditProfileOpen(true)} className='cursor-pointer'>
                  <UserRound className='mr-2 h-4 w-4' />
                  <span>Chỉnh sửa hồ sơ</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setIsChangePassOpen(true)} className='cursor-pointer'>
                  <KeyRound className='mr-2 h-4 w-4' />
                  <span>Đổi mật khẩu</span>
                </DropdownMenuItem>

                {!user?.currentRoles.includes('SELLER') && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setIsUpgradeOpen(true)}
                      className='cursor-pointer text-teal-600 focus:text-teal-700'
                    >
                      <ShoppingBasket className='mr-2 h-4 w-4' />
                      <span>Nâng cấp người bán</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={() => signout()}
              variant={'outline'}
              className='text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600'
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>

        <Dialog open={isUpgradeOpen} onOpenChange={setIsUpgradeOpen}>
          <DialogContent className='sm:max-w-[500px]'>
            <DialogHeader>
              <DialogTitle>Đăng ký trở thành người bán</DialogTitle>
              <DialogDescription>
                Vui lòng cho chúng tôi biết lý do bạn muốn trở thành người bán hàng trên nền tảng.
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <textarea
                placeholder='Tôi muốn bán các sản phẩm...'
                className='outline-0 border border-gray-200 rounded-md px-2 py-3 min-h-[100px]'
                value={upgradeReason}
                onChange={(e) => setUpgradeReason(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type='button' variant='outline' onClick={() => setIsUpgradeOpen(false)}>
                Hủy
              </Button>
              <Button type='submit' onClick={handleUpgradeSubmit} className='bg-teal-600 text-white'>
                Gửi yêu cầu
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
          <DialogContent className='sm:max-w-[500px]'>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
              <DialogDescription>Thay đổi thông tin cá nhân của bạn tại đây.</DialogDescription>
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
              <input type='file' ref={fileInputRef} className='hidden' accept='image/*' onChange={handleChangeAvatar} />
            </div>

            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-2'>
                <p className='text-sm font-medium'>Họ tên</p>
                <input
                  name='fullname'
                  className='col-span-3 outline-0 border border-gray-200 rounded-md px-3 py-2'
                  value={formData.fullname}
                  onChange={handleChange}
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-2'>
                <p className='text-sm font-medium'>Email</p>
                <input
                  value={formData.email}
                  disabled
                  className='col-span-3 outline-0 border border-gray-200 bg-gray-50 rounded-md px-3 py-2 text-gray-500'
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-2'>
                <p className='text-sm font-medium'>Ngày sinh</p>
                <input
                  type='date'
                  name='dateOfBirth'
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className='col-span-3 outline-0 border border-gray-200 rounded-md px-3 py-2'
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-2'>
                <p className='text-sm font-medium'>Địa chỉ</p>
                <input
                  name='address'
                  value={formData.address}
                  onChange={handleChange}
                  className='col-span-3 outline-0 border border-gray-200 rounded-md px-3 py-2'
                />
              </div>
            </div>

            <DialogFooter>
              <Button type='submit' className='bg-teal-600 text-white' onClick={handleUpdateProfile}>
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isChangePassOpen} onOpenChange={setIsChangePassOpen}>
          <DialogContent className='sm:max-w-[500px]'>
            <DialogHeader>
              <DialogTitle>Đổi mật khẩu</DialogTitle>
              <DialogDescription>Nhập mật khẩu hiện tại và mật khẩu mới để bảo vệ tài khoản.</DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='flex flex-col gap-2'>
                <p className='text-sm font-medium'>Mật khẩu hiện tại</p>
                <input
                  type='password'
                  name='oldPassword'
                  value={passData.oldPassword}
                  onChange={handleChangePassInput}
                  className='outline-0 border border-gray-200 rounded-md px-3 py-2'
                  placeholder='••••••'
                />
              </div>
              <div className='flex flex-col gap-2'>
                <p className='text-sm font-medium'>Mật khẩu mới</p>
                <input
                  type='password'
                  name='newPassword'
                  value={passData.newPassword}
                  onChange={handleChangePassInput}
                  className='outline-0 border border-gray-200 rounded-md px-3 py-2'
                  placeholder='••••••'
                />
              </div>
              <div className='flex flex-col gap-2'>
                <p className='text-sm font-medium'>Xác nhận mật khẩu mới</p>
                <input
                  type='password'
                  name='confirmPassword'
                  value={passData.confirmPassword}
                  onChange={handleChangePassInput}
                  className='outline-0 border border-gray-200 rounded-md px-3 py-2'
                  placeholder='••••••'
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant='outline' onClick={() => setIsChangePassOpen(false)}>
                Hủy
              </Button>
              <Button type='submit' className='bg-teal-600 text-white' onClick={handleSubmitPassword}>
                Cập nhật mật khẩu
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 mb-10'>
          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-300 group-hover:text-white transition-colors duration-300'>
                <Gavel className='w-6 h-6' />
              </div>
              <span className='text-xs font-bold px-2 py-1 bg-gray-50 text-gray-500 rounded-full'>Hoạt động</span>
            </div>
            <div>
              <span className='block text-3xl font-extrabold text-gray-900 mb-1'>{statistics?.BidCount || 0}</span>
              <span className='text-sm font-medium text-gray-500'>Lượt ra giá</span>
            </div>
          </div>
          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-300 group-hover:text-white transition-colors duration-300'>
                <Heart className='w-6 h-6' />
              </div>
              <span className='text-xs font-bold px-2 py-1 bg-gray-50 text-gray-500 rounded-full'>Quan tâm</span>
            </div>
            <div>
              <span className='block text-3xl font-extrabold text-gray-900 mb-1'>
                {statistics?.WatchListCount || 0}
              </span>
              <span className='text-sm font-medium text-gray-500'>Sản phẩm yêu thích</span>
            </div>
          </div>

          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-300 group-hover:text-white transition-colors duration-300'>
                <ShoppingBag className='w-6 h-6' />
              </div>
              <span className='text-xs font-bold px-2 py-1 bg-gray-50 text-gray-500 rounded-full'>Mua sắm</span>
            </div>
            <div>
              <span className='block text-3xl font-extrabold text-gray-900 mb-1'>{statistics?.OrderCount || 0}</span>
              <span className='text-sm font-medium text-gray-500'>Đơn hàng thành công</span>
            </div>
          </div>

          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-300 group-hover:text-white transition-colors duration-300'>
                <ScrollText className='w-6 h-6' />
              </div>
              <span className='text-xs font-bold px-2 py-1 bg-gray-50 text-gray-500 rounded-full'>Uy tín</span>
            </div>
            <div>
              <span className='block text-3xl font-extrabold text-gray-900 mb-1'>{statistics?.RatingCount || 0}</span>
              <span className='text-sm font-medium text-gray-500'>Lượt đánh giá</span>
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
                    <span className='text-5xl font-extrabold text-emerald-600'>
                      {calculateRating(positiveCount, negativeCount)}%
                    </span>
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
                      <Progress value={positiveCount} className='h-2 bg-gray-100' />
                    </div>
                  </div>
                  <div className='flex items-center gap-3'>
                    <ThumbsDown className='w-5 h-5 text-rose-500' />
                    <div className='w-full'>
                      <div className='flex justify-between text-sm mb-1'>
                        <span className='font-semibold text-gray-700'>Không hài lòng</span>
                        <span className='text-gray-500'>{negativeCount}</span>
                      </div>
                      <Progress value={negativeCount} className='h-2 bg-gray-100' />
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
                          <p className='font-semibold text-gray-900 text-sm'>{item?.rater?.fullname}</p>
                        </div>
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
                  <p className='text-sm font-semibold text-gray-400 mb-5'>Các đánh giá bạn đã để lại.</p>
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
                          <p className='font-semibold text-gray-900 text-sm'>{item?.ratee?.fullname}</p>
                        </div>
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
                              onClick={() => {
                                setStatus(item?.value === 1);
                                setComment(item?.comment ? item?.comment : '');
                              }}
                              className='text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 gap-2 transition-colors'
                            >
                              <Edit className='w-4 h-4' /> Chỉnh sửa
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
