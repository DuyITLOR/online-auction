import { useUsers } from "../../libs/contexts/userTab.context";
import { Loader2 } from "lucide-react";
import Pagination from "../pagination";

const TabUsers = () => {
  const { users, page, setPage, totalUsers, totalPages, isLoading } =
    useUsers();

  function splitDate(dateStr: string) {
    return dateStr.split("T")[0];
  }

  function onPageChange(newPage: number | string) {
    if (newPage !== "...") setPage(Number(newPage));
  }

  return (
    <div className='bg-white border rounded-lg flex flex-col overflow-hidden'>
      {isLoading ? (
        <div className='flex items-center justify-center h-90'>
          <Loader2 className='animate-spin text-green-600' />
          <span className='ml-2 text-gray-500'>Đang tải dữ liệu...</span>
        </div>
      ) : (
        <>
          <table className='w-full text-sm'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='px-6 py-3 text-left font-semibold'>Tên</th>
                <th className='px-6 py-3 text-left font-semibold'>Email</th>
                <th className='px-6 py-3 text-left font-semibold'>Vai trò</th>
                <th className='px-6 py-3 text-left font-semibold'>
                  Ngày tham gia
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id} className='border-b hover:bg-gray-50'>
                  <td className='px-6 py-4'>{user.fullname}</td>
                  <td className='px-6 py-4 text-gray-600'>{user.email}</td>
                  <td className='px-6 py-4'>{user.role}</td>
                  <td className='px-6 py-4 text-gray-600'>
                    {splitDate(user.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {/* Pagination */}
      {totalUsers > 0 && (
        <div className='h-20 border-t border-gray-200'>
          <Pagination
            className='flex justify-end'
            page={page}
            onPageChange={onPageChange}
            totalPage={totalPages}
          />
        </div>
      )}
    </div>
  );
};

export default TabUsers;
