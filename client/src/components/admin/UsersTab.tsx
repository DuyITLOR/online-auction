import { useUsers } from "../../libs/contexts/userTab.context";
import { Loader2, Mail, User, Shield, Calendar, Search } from "lucide-react";
import Pagination from "../pagination";

const TabUsers = () => {
  const { users, page, setPage, totalUsers, totalPages, isLoading } =
    useUsers();

  function splitDate(dateStr: string) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  }

  function onPageChange(newPage: number | string) {
    if (newPage !== "...") setPage(Number(newPage));
  }

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
              </tr>
            </thead>

            <tbody className='divide-y divide-gray-100'>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={4}
                    className='px-6 py-12 text-center text-gray-500'
                  >
                    <div className='flex items-center justify-center gap-2'>
                      <Loader2 className='animate-spin w-5 h-5 text-teal-600' />
                      <span>Đang tải dữ liệu...</span>
                    </div>
                  </td>
                </tr>
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
                    className='hover:bg-gray-50 transition-colors duration-150'
                  >
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center'>
                          <User className='w-4 h-4' />
                        </div>
                        <span className='font-medium text-gray-900'>
                          {user.fullname}
                        </span>
                      </div>
                    </td>
                    <td className='px-6 py-4 text-gray-600'>
                      <div className='flex items-center gap-2'>
                        <Mail className='w-3.5 h-3.5 text-gray-400' />
                        {user.email}
                      </div>
                    </td>
                    <td className='px-6 py-4'>
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
                    <td className='px-6 py-4 text-gray-600'>
                      <div className='flex items-center gap-2'>
                        <Calendar className='w-3.5 h-3.5 text-gray-400' />
                        {splitDate(user.createdAt)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalUsers > 0 && (
          <div className='p-4 border-t border-gray-100 mt-auto bg-gray-50/50'>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-gray-500'>
                Hiển thị trang <span className='font-medium'>{page}</span> /{" "}
                <span className='font-medium'>{totalPages}</span>
              </div>
              <Pagination
                className='flex justify-end'
                page={page}
                onPageChange={onPageChange}
                totalPage={totalPages}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabUsers;
