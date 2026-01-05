import React, { useState } from "react";
import { toast } from "sonner";
import { useUsers } from "../../libs/contexts/admin/user.context";
import {
  Mail,
  User,
  Shield,
  Calendar,
  Search,
  Eye,
  Trash2,
} from "lucide-react";
import Pagination from "../pagination";
import { Link } from "react-router-dom";
import { de } from "zod/v4/locales";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const TabUsers = () => {
  const [openId, setOpenId] = useState<string | null>(null);
  const { users, page, setPage, totalUsers, totalPages, isLoading } =
    useUsers();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const userToDelete = users.find((user) => user.id === deletingId);
  function splitDate(dateStr: string) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  }

  function onPageChange(newPage: number | string) {
    if (newPage !== "...") setPage(Number(newPage));
  }

  const handleDelete = async () => {
    if (!openId) return;
    try {
      setDeletingId(openId);
      await deleteUser(openId);
      toast.success("Xoá sản phẩm thành công");
      setOpenId(null);
      refreshProducts(); // reload list
    } catch (error) {
      console.error(error);
      toast.error("Xoá thất bại, vui lòng thử lại");
    } finally {
      setDeletingId(null);
    }
  };
  return (
    <div className='flex-1 space-y-6'>
      {/* Header / Toolbar (Có thể thêm Search user ở đây sau này) */}
      <div className='bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between'>
        <h2 className='text-lg font-semibold text-gray-800'>
          Danh sách người dùng
        </h2>
        <div className='text-sm text-gray-500'>
          Tổng số:{" "}
          <span className='font-medium text-gray-900'>{totalUsers}</span> thành
          viên
        </div>
      </div>

      {/* --- DATA TABLE --- */}
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm text-left'>
            <thead className='bg-gray-50 text-gray-500 uppercase font-medium text-xs border-b border-gray-200'>
              <tr>
                <th className='px-6 py-4 font-semibold'>Tên</th>
                <th className='px-6 py-4 font-semibold'>Email</th>
                <th className='px-6 py-4 font-semibold'>Vai trò</th>
                <th className='px-6 py-4 font-semibold'>Ngày tham gia</th>
                <th className='px-6 py-4 font-semibold text-right w-[13%]'>
                  Hành động
                </th>
              </tr>
            </thead>

            <tbody className='divide-y divide-gray-100'>
              {isLoading ? (
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
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
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
                        <div className='w-8 h-8 rounded-full  bg-green-200 text-green-400 flex items-center justify-center'>
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
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            user.role === "ADMIN"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className='px-6 py-3 text-gray-600 align-middle'>
                      <div className='flex items-center gap-2'>
                        <Calendar className='w-3.5 h-3.5 text-gray-400' />
                        {splitDate(user.createdAt)}
                      </div>
                    </td>
                    <td className='px-6 py-5 text-right'>
                      <div className='flex items-center justify-end gap-2'>
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
                          title='Xóa người dùng'
                        >
                          <Trash2 className='w-4 h-4' />
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
        {!isLoading && totalUsers > 0 && (
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
              <DialogTitle>Xác nhận xoá sản phẩm</DialogTitle>
              <DialogDescription className='text-red-600'>
                Hành động này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>

            <div className='py-4'>
              {userToDelete ? (
                <p className='text-sm text-gray-600'>
                  Bạn có chắc chắn muốn xoá sản phẩm: <br />
                  <span className='font-bold text-gray-900 text-base'>
                    {userToDelete.fullname + " "}
                  </span>
                  ?
                </p>
              ) : (
                <p className='text-gray-500'>Đang tải thông tin sản phẩm...</p>
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
                    Đang xoá...
                  </>
                ) : (
                  "Xác nhận xoá"
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
