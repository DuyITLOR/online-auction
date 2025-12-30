/* eslint-disable @typescript-eslint/no-explicit-any */
import { Camera, LogOut, Mail, MapPin, CalendarDays, Store, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '../../components/ui/dialog';

const RoleBadge = ({ roles }: { roles: string[] }) => {
  const isSeller = roles.includes('SELLER');
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
        isSeller ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-teal-50 text-teal-700 border-teal-200'
      }`}
    >
      {isSeller ? <Store size={12} /> : <User size={12} />}
      {isSeller ? 'Người bán hàng' : 'Thành viên'}
    </span>
  );
};

const ProfileHeader = ({
  user,
  signout,
  handleUpgradeSubmit,
  upgradeReason,
  setUpgradeReason,
  handleUpdateProfile,
  formData,
  handleChange,
  previewAvatar,
  handleChangeAvatar,
  fileInputRef,
}: any) => {
  return (
    <div className='relative mb-20'>
      <div className='h-48 w-full bg-linear-to-r from-teal-500 to-emerald-600 rounded-b-[2rem] shadow-sm relative overflow-hidden'></div>
      <div className='container mx-auto px-4 sm:px-10'>
        <div className='relative -mt-20 flex flex-col md:flex-row items-end md:items-start gap-6'>
          <div className='relative group shrink-0'>
            <div
              className='relative w-40 h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white cursor-pointer group'
              onClick={() => fileInputRef.current?.click()}
            >
              <Avatar className='w-full h-full'>
                <AvatarImage src={previewAvatar || user?.avtUrl} className='object-cover' />
                <AvatarFallback className='text-4xl bg-gray-100 text-gray-400'>
                  {user?.fullname?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className='absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <Camera className='text-white w-10 h-10 drop-shadow-md' />
              </div>
            </div>

            <input type='file' ref={fileInputRef} className='hidden' accept='image/*' onChange={handleChangeAvatar} />

            <div
              className='absolute bottom-3 right-3 w-5 h-5 bg-green-500 border-4 border-white rounded-full'
              title='Online'
            ></div>
          </div>

          <div className='flex-1 w-full pt-4 md:pt-20'>
            {' '}
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
              <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-3 flex-wrap'>
                  <h1 className='text-3xl font-bold text-gray-900'>{user?.fullname}</h1>
                  <RoleBadge roles={user?.currentRoles || []} />
                </div>

                <div className='flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 mt-1'>
                  <div className='flex items-center gap-2'>
                    <Mail size={16} className='text-gray-400' />
                    <span>{user?.email}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <CalendarDays size={16} className='text-gray-400' />
                    <span>
                      Tham gia: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <MapPin size={16} className='text-gray-400' />
                    <span>{user?.address || 'Chưa cập nhật địa chỉ'}</span>
                  </div>
                </div>
              </div>

              <div className='flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0'>
                {!user?.currentRoles.includes('SELLER') && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className='bg-linear-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white border-0 shadow-md'>
                        <Store className='mr-2 h-4 w-4' /> Nâng cấp Shop
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Đăng ký bán hàng</DialogTitle>
                        <DialogDescription>Mô tả ngắn gọn về cửa hàng của bạn.</DialogDescription>
                      </DialogHeader>
                      <div className='py-4'>
                        <textarea
                          className='w-full border p-2 rounded-md focus:ring-2 ring-teal-500 outline-none'
                          rows={4}
                          placeholder='Tôi muốn bán...'
                          value={upgradeReason}
                          onChange={(e) => setUpgradeReason(e.target.value)}
                        />
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant='outline'>Hủy</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button onClick={handleUpgradeSubmit} className='bg-teal-600 text-white'>
                            Gửi yêu cầu
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant='outline'
                      className='border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-teal-600'
                    >
                      Chỉnh sửa
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='sm:max-w-[500px]'>
                    <DialogHeader>
                      <DialogTitle>Cập nhật thông tin</DialogTitle>
                    </DialogHeader>
                    <div className='grid gap-4 py-4'>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <label className='text-right text-sm font-medium'>Họ tên</label>
                        <input
                          name='fullname'
                          value={formData.fullname}
                          onChange={handleChange}
                          className='col-span-3 border rounded px-3 py-2 outline-none focus:border-teal-500'
                        />
                      </div>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <label className='text-right text-sm font-medium'>Ngày sinh</label>
                        <input
                          type='date'
                          name='dateOfBirth'
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          className='col-span-3 border rounded px-3 py-2 outline-none focus:border-teal-500'
                        />
                      </div>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <label className='text-right text-sm font-medium'>Địa chỉ</label>
                        <input
                          name='address'
                          value={formData.address}
                          onChange={handleChange}
                          className='col-span-3 border rounded px-3 py-2 outline-none focus:border-teal-500'
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button onClick={handleUpdateProfile} className='bg-teal-600 text-white'>
                          Lưu thay đổi
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button
                  variant='ghost'
                  size='icon'
                  onClick={signout}
                  className='text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors'
                  title='Đăng xuất'
                >
                  <LogOut size={20} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
