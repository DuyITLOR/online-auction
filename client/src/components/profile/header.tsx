/* eslint-disable @typescript-eslint/no-explicit-any */
import { Camera, ChartArea, KeyRound, LogOut, Settings, ShoppingBasket, Store, UserRound } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { clearSession } from '@/libs/session';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { getUser, requestToUpgrade, updateUser } from '@/api/user';
import { toast } from 'sonner';
import { UserContext } from '@/libs/contexts/user.context';
import { updatePassword } from '@/api/auth';

const convertISO = (isoString: string | undefined, revert: boolean = false) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return revert ? `${yyyy}-${mm}-${dd}` : `${dd}-${mm}-${yyyy}`;
};

export const ProfileHeader = ({ session }: { session: any }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState('');
  const [previewAvatar, setPreviewAvatar] = useState<string | undefined>(undefined);
  const [fetchedUser, setFetchedUser] = useState<any>(null);
  const [image, setImage] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user: contextUser, refresh } = useContext(UserContext);

  const currentUser = id ? fetchedUser : contextUser;

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // 1. Fetch User nếu có ID
  useEffect(() => {
    if (id) {
      const fetchUserById = async () => {
        try {
          const data = await getUser({ id });
          setFetchedUser(data);
        } catch (err) {
          console.error(err);
          toast.error('Không thể tải thông tin người dùng');
        }
      };
      fetchUserById();
    } else {
      setFetchedUser(null);
    }
  }, [id]);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.avtUrl) {
        setPreviewAvatar(currentUser.avtUrl);
      }
      setFormData({
        fullname: currentUser.fullname || '',
        email: currentUser.email || '',
        dateOfBirth: currentUser.dateOfBirth ? convertISO(currentUser.dateOfBirth, true) : '',
        address: currentUser.address || '',
      });
    }
  }, [currentUser]);

  const handleUpgradeSubmit = async () => {
    setIsSubmitting(true);
    const data = await requestToUpgrade({ note: upgradeReason, token: session.token });
    if (data) {
      toast.success('Gửi yêu cầu thành công');
      setIsUpgradeOpen(false);
      setIsSubmitting(false);
    } else {
      toast.error('Gửi yêu cầu thất bại');
      setIsSubmitting(false);
    }
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
    refresh(); // Refresh context
    setIsEditProfileOpen(false);
    toast.success('Cập nhật hồ sơ thành công');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    navigate('/');
    window.location.reload();
  };

  if (!currentUser && id) return <div>Đang tải...</div>;

  return (
    <>
      <div className='border border-gray-200 h-[150px] rounded-xl flex items-center justify-between px-10 bg-white shadow-sm'>
        <div className='flex items-center gap-5'>
          <div className='relative'>
            <Avatar className='w-24 h-24 border-4 border-white shadow-md'>
              <AvatarImage src={currentUser?.avtUrl} />
              <AvatarFallback>{currentUser?.fullname}</AvatarFallback>
            </Avatar>
            {currentUser?.currentRoles?.includes('SELLER') ? (
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
              <span className='text-2xl font-bold'>{currentUser?.fullname}</span>
            </div>
            <span className='text-gray-500'>{currentUser?.email}</span>
            <span className='text-gray-500'>Tham gia từ: {convertISO(currentUser?.createdAt)}</span>
          </div>
        </div>

        {!id && (
          <div className='flex items-center justify-center gap-3'>
            <Button
              onClick={() => {
                navigate(`${currentUser?.role === 'ADMIN' ? '/admin/dashboard' : '/seller/dashboard'}`);
              }}
              variant={'outline'}
              className='text-teal-600 border-teal-200 hover:bg-teal-50'
            >
              <ChartArea size={18} className='mr-2' />{' '}
              {currentUser?.role === 'ADMIN' ? 'Hệ thống quản lý' : 'Quản lý sản phẩm'}
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

                {!currentUser?.currentRoles?.includes('SELLER') && (
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
        )}
      </div>

      {!id && (
        <>
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
                <Button type='submit' disabled={isSubmitting} onClick={handleUpgradeSubmit} className='bg-teal-600 text-white'>
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
                    <AvatarImage src={previewAvatar || currentUser?.avtUrl} className='object-cover' />
                    <AvatarFallback className='text-2xl'>
                      {currentUser?.fullname ? currentUser.fullname.charAt(0).toUpperCase() : '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className='absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                    <Camera className='text-white w-8 h-8' />
                  </div>
                </div>
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
        </>
      )}
    </>
  );
};
