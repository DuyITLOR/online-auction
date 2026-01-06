import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useUsers } from '../../libs/contexts/admin/user.context';
import { resetPasswordByAdmin } from '@/api/user';
import {
  Mail,
  User,
  Shield,
  Calendar,
  Search,
  Eye,
  Trash2,
  Loader2,
  RotateCcw,
  KeySquare,
} from 'lucide-react';
import Pagination from '../pagination';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const TabUsers = () => {
  const [openId, setOpenId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetId, setResetId] = useState<string | null>(null);
  const [isSubmiting, setIsSubmiting] = useState(false);

  const {
    users,
    page,
    setPage,
    totalUsers,
    totalPages,
    isLoading,
    deactivateUser,
    refreshUsers,
    deactivatedUsers,
    isLoadingDeactivated,
    fetchDeactivatedUsers,
    activateUser,
  } = useUsers();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [tab, setTab] = useState<'ACTIVE' | 'DEACTIVATED'>('ACTIVE');

  const userToDelete = users.find((user) => user.id === deletingId);

  function splitDate(dateStr: string) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('vi-VN');
  }

  function onPageChange(newPage: number | string) {
    if (newPage !== '...') setPage(Number(newPage));
  }

  const handleDelete = async () => {
    if (!openId) return;
    try {
      setDeletingId(openId);
      await deactivateUser(openId);
      toast.success('Vô hiệu hoá người dùng thành công');
      setOpenId(null);
      refreshUsers();
    } catch (error) {
      console.error(error);
      toast.error('Vô hiệu hoá thất bại, vui lòng thử lại');
    } finally {
      setDeletingId(null);
    }
  };

  const handleActivate = async (userId: string) => {
    try {
      setActivatingId(userId);
      await activateUser(userId);
      toast.success('Kích hoạt tài khoản thành công');
      // Refresh active list cache in background
      refreshUsers();
      // Refresh deactivated list explicitly to remove the item
      fetchDeactivatedUsers();
    } catch (e) {
      console.error(e);
      toast.error('Kích hoạt thất bại, vui lòng thử lại');
    } finally {
      setActivatingId(null);
    }
  };

  const handleResetPassword = async () => {
    if (!resetId || !newPassword.trim()) {
      toast.error('Vui lòng nhập mật khẩu mới');
      return;
    }

    try {
      setIsSubmiting(true);
      await resetPasswordByAdmin(resetId, newPassword.trim());

      console.log('resettingId', resetId);
      toast.success('Đã reset mật khẩu và gửi email cho người dùng');
      setResetId(null);
      setNewPassword('');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Reset mật khẩu thất bại';
      toast.error(msg);
    } finally {
      setIsSubmiting(false);
    }
  };

  useEffect(() => {
    if (tab === 'DEACTIVATED') {
      fetchDeactivatedUsers();
    }
  }, [tab, fetchDeactivatedUsers]);

  // Helper function để render Role badge giống hệt nhau ở cả 2 bảng
  const renderRoleBadge = (role: string) => (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        role === 'ADMIN'
          ? 'bg-purple-100 text-purple-800'
          : 'bg-gray-100 text-gray-800'
      }`}
    >
      {role}
    </span>
  );

  return (
    <div className='flex-1 space-y-6'>
      {/* Header / Toolbar + Tabs */}
      <div className='bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between'>
        <h2 className='text-lg font-semibold text-gray-800'>
          Danh sách người dùng
        </h2>
        <div className='flex items-center gap-6'>
          <div className='flex items-center bg-gray-100 p-1 rounded-md text-sm'>
            <button
              onClick={() => setTab('ACTIVE')}
              className={`px-3 py-1 rounded ${
                tab === 'ACTIVE'
                  ? 'bg-white shadow text-gray-900'
                  : 'text-gray-600'
              }`}
            >
              Đang hoạt động
            </button>
            <button
              onClick={() => setTab('DEACTIVATED')}
              className={`px-3 py-1 rounded ${
                tab === 'DEACTIVATED'
                  ? 'bg-white shadow text-gray-900'
                  : 'text-gray-600'
              }`}
            >
              Đã xoá
            </button>
          </div>
          {tab === 'ACTIVE' && (
            <div className='w-40 text-sm text-gray-500'>
              Tổng số:{' '}
              <span className='font-medium text-gray-900'>{totalUsers}</span>{' '}
              thành viên
            </div>
          )}
          {tab === 'DEACTIVATED' && (
            <div className='w-40 text-sm text-gray-500'>
              Đã xoá:{' '}
              <span className='font-medium text-gray-900'>
                {deactivatedUsers.length}
              </span>{' '}
              thành viên
            </div>
          )}
        </div>
      </div>

      {/* --- DATA TABLE --- */}
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm text-left table-fixed'>
            <thead className='bg-gray-50 text-gray-500 uppercase font-medium text-xs border-b border-gray-200'>
              <tr>
                {/* Chia phần trăm cụ thể cho từng cột (Tổng = 100%) */}

                {/* Cột Tên: 30% */}
                <th className='px-6 py-4 font-semibold w-[30%]'>Tên</th>

                {/* Cột Email: 30% */}
                <th className='px-6 py-4 font-semibold w-[30%]'>Email</th>

                {/* Cột Vai trò: 15% */}
                <th className='px-6 py-4 font-semibold w-[15%]'>Vai trò</th>

                {/* Cột Ngày tham gia: 15% */}
                <th className='px-6 py-4 font-semibold w-[15%]'>
                  Ngày tham gia
                </th>

                {/* Cột Hành động: 10% */}
                <th className='px-6 py-4 font-semibold text-right w-[10%]'>
                  Hành động
                </th>
              </tr>
            </thead>

            <tbody className='divide-y divide-gray-100'>
              {tab === 'ACTIVE' ? (
                isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className='animate-pulse h-[72px]'>
                      <td className='px-6 py-3 align-middle'>
                        <div className='flex items-center gap-3'>
                          <div className='w-8 h-8 rounded-full bg-gray-200 shrink-0' />
                          <div className='h-4 w-32 bg-gray-200 rounded' />
                        </div>
                      </td>
                      <td className='px-6 py-3 align-middle'>
                        <div className='flex items-center gap-2'>
                          <div className='w-3.5 h-3.5 bg-gray-200 rounded-full' />
                          <div className='h-4 w-48 bg-gray-200 rounded' />
                        </div>
                      </td>
                      <td className='px-6 py-3 align-middle'>
                        <div className='flex items-center gap-2'>
                          <div className='w-3.5 h-3.5 bg-gray-200 rounded-full' />
                          <div className='h-5 w-16 bg-gray-200 rounded' />
                        </div>
                      </td>
                      <td className='px-6 py-3 align-middle'>
                        <div className='flex items-center gap-2'>
                          <div className='w-3.5 h-3.5 bg-gray-200 rounded-full' />
                          <div className='h-4 w-24 bg-gray-200 rounded' />
                        </div>
                      </td>
                      <td className='px-6 py-3 align-middle' />
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className='px-6 py-12 text-center text-gray-500 italic'
                    >
                      <div className='flex flex-col items-center gap-2'>
                        <Search className='w-8 h-8 text-gray-300' />
                        <span>Không tìm thấy người dùng nào.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className='hover:bg-gray-50 transition-colors duration-150 h-[72px]'
                    >
                      <td className='px-6 py-3 align-middle'>
                        <div className='flex items-center gap-3'>
                          <div className='w-8 h-8 rounded-full bg-green-200 text-green-700 flex items-center justify-center'>
                            <User className='w-4 h-4' />
                          </div>
                          <span className='font-medium text-gray-900'>
                            {user.fullname}
                          </span>
                        </div>
                      </td>
                      <td className='px-6 py-3 text-gray-600 align-middle'>
                        <div className='flex items-center gap-2'>
                          <Mail className='w-3.5 h-3.5 text-gray-400' />
                          {user.email}
                        </div>
                      </td>
                      <td className='px-6 py-3 align-middle'>
                        <div className='flex items-center gap-2'>
                          <Shield className='w-3.5 h-3.5 text-gray-400' />
                          {renderRoleBadge(user.role)}
                        </div>
                      </td>
                      <td className='px-6 py-3 text-gray-600 align-middle'>
                        <div className='flex items-center gap-2'>
                          <Calendar className='w-3.5 h-3.5 text-gray-400' />
                          {splitDate(user.createdAt)}
                        </div>
                      </td>
                      <td className='px-6 py-5 text-right align-middle'>
                        <div className='flex items-center justify-end gap-[0.5]'>
                          <Link
                            to={`/profile/${user.id}`}
                            className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200'
                            title='Xem chi tiết'
                          >
                            <Eye className='w-4 h-4' />
                          </Link>
                          <button
                            onClick={() => setOpenId(user.id)}
                            className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200'
                            title='Vô hiệu hoá người dùng'
                          >
                            <Trash2 className='w-4 h-4' />
                          </button>
                          <button
                            onClick={() => setResetId(user.id)}
                            className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200'
                            title='Đổi mật khẩu'
                          >
                            <KeySquare className='w-4 h-4' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )
              ) : isLoadingDeactivated ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className='animate-pulse h-[72px]'>
                    <td className='px-6 py-3 align-middle'>
                      <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 rounded-full bg-gray-200 shrink-0' />
                        <div className='h-4 w-32 bg-gray-200 rounded' />
                      </div>
                    </td>
                    <td className='px-6 py-3 align-middle'>
                      <div className='flex items-center gap-2'>
                        <div className='w-3.5 h-3.5 bg-gray-200 rounded-full' />
                        <div className='h-4 w-48 bg-gray-200 rounded' />
                      </div>
                    </td>
                    <td className='px-6 py-3 align-middle'>
                      <div className='flex items-center gap-2'>
                        <div className='w-3.5 h-3.5 bg-gray-200 rounded-full' />
                        <div className='h-5 w-16 bg-gray-200 rounded' />
                      </div>
                    </td>
                    <td className='px-6 py-3 align-middle'>
                      <div className='flex items-center gap-2'>
                        <div className='w-3.5 h-3.5 bg-gray-200 rounded-full' />
                        <div className='h-4 w-24 bg-gray-200 rounded' />
                      </div>
                    </td>
                    <td className='px-6 py-3 align-middle' />
                  </tr>
                ))
              ) : deactivatedUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className='px-6 py-12 text-center text-gray-500 italic'
                  >
                    <div className='flex flex-col items-center gap-2'>
                      <Search className='w-8 h-8 text-gray-300' />
                      <span>Không có tài khoản đã xoá.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                deactivatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className='hover:bg-gray-50 transition-colors duration-150 h-[72px]'
                  >
                    <td className='px-6 py-3 align-middle'>
                      <div className='flex items-center gap-3'>
                        {/* Dùng chung class màu sắc (green) hoặc đổi sang gray tùy bạn, nhưng giữ nguyên size */}
                        <div className='w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center'>
                          <User className='w-4 h-4' />
                        </div>
                        <span className='font-medium text-gray-900'>
                          {user.fullname}
                        </span>
                      </div>
                    </td>
                    <td className='px-6 py-3 text-gray-600 align-middle'>
                      <div className='flex items-center gap-2'>
                        <Mail className='w-3.5 h-3.5 text-gray-400' />
                        {user.email}
                      </div>
                    </td>
                    <td className='px-6 py-3 align-middle'>
                      <div className='flex items-center gap-2'>
                        <Shield className='w-3.5 h-3.5 text-gray-400' />
                        {/* Sử dụng chung helper function để badge có kích thước y hệt Active */}
                        {renderRoleBadge(user.role)}
                      </div>
                    </td>
                    <td className='px-6 py-3 text-gray-600 align-middle'>
                      <div className='flex items-center gap-2'>
                        <Calendar className='w-3.5 h-3.5 text-gray-400' />
                        {splitDate(user.createdAt)}
                      </div>
                    </td>

                    <td className='px-6 py-5 text-right align-middle'>
                      <div className='flex items-center justify-end gap-2'>
                        <button
                          onClick={() => handleActivate(user.id)}
                          disabled={activatingId === user.id}
                          className='p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-200 flex items-center justify-center disabled:opacity-50'
                          title='Kích hoạt lại người dùng'
                        >
                          {activatingId === user.id ? (
                            <Loader2 className='w-4 h-4 animate-spin' />
                          ) : (
                            <RotateCcw className='w-4 h-4' />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {tab === 'ACTIVE' && !isLoading && totalUsers > 0 && (
          <div className='pb-8 pr-8 flex justify-end'>
            <Pagination
              page={page}
              totalPage={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}

        <Dialog open={!!openId} onOpenChange={(val) => !val && setOpenId(null)}>
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle>Xác nhận vô hiệu hoá người dùng</DialogTitle>
              <DialogDescription className='text-red-600'>
                Hành động này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>

            <div className='py-4'>
              {userToDelete ? (
                <p className='text-sm text-gray-600'>
                  Bạn có chắc chắn muốn vô hiệu hoá người dùng: <br />
                  <span className='font-bold text-gray-900 text-base'>
                    {userToDelete.fullname + ' '}
                  </span>
                  ?
                </p>
              ) : (
                <p className='text-gray-500'>
                  Đang tải thông tin người dùng...
                </p>
              )}
            </div>

            <DialogFooter className='gap-2 sm:gap-0'>
              <button
                onClick={() => setOpenId(null)}
                disabled={!!deletingId}
                className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 '
              >
                Hủy bỏ
              </button>

              <button
                onClick={handleDelete}
                disabled={!!deletingId}
                className='ml-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 flex items-center gap-2 disabled:opacity-50'
              >
                {deletingId ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin' />
                    Đang vô hiệu hoá...
                  </>
                ) : (
                  'Xác nhận'
                )}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={!!resetId}
          onOpenChange={(val) => !val && setResetId(null)}
        >
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle>Đổi mật khẩu người dùng</DialogTitle>
            </DialogHeader>

            <div className='py-4 space-y-4'>
              <div className='space-y-1'>
                <label className='text-sm font-medium text-gray-700'>
                  Mật khẩu mới
                </label>
                <input
                  type='text'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder='Nhập mật khẩu mới...'
                  className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none'
                />
              </div>

              <p className='text-xs text-gray-500'>
                Mật khẩu này sẽ được gửi trực tiếp đến email của người dùng.
              </p>
            </div>

            <DialogFooter className='gap-2 sm:gap-0'>
              <button
                onClick={() => {
                  setResetId(null);
                  setNewPassword('');
                }}
                className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50'
              >
                Huỷ
              </button>

              <button
                onClick={handleResetPassword}
                disabled={isSubmiting}
                className='ml-2 px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 flex items-center gap-2 disabled:opacity-50'
              >
                {isSubmiting ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin' />
                    Đang reset...
                  </>
                ) : (
                  'Reset mật khẩu'
                )}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TabUsers;
