
import type { FC } from "react";
import { Eye, Pencil, Ban } from "lucide-react";

interface User {
  name: string;
  email: string;
  role: "Buyer" | "Seller";
  joined: string;
  status: "Active" | "Suspended";
}

const usersDefault: User[] = [
  {
    name: "Nguyễn Văn A",
    email: "a@example.com",
    role: "Buyer",
    joined: "2024-01-15",
    status: "Active",
  },
  {
    name: "Trần Thị B",
    email: "b@example.com",
    role: "Seller",
    joined: "2024-02-20",
    status: "Active",
  },
  {
    name: "Phạm Văn C",
    email: "c@example.com",
    role: "Buyer",
    joined: "2024-03-10",
    status: "Suspended",
  },
  {
    name: "Lê Thị D",
    email: "d@example.com",
    role: "Seller",
    joined: "2024-04-05",
    status: "Active",
  },
  {
    name: "Hoàng Văn E",
    email: "e@example.com",
    role: "Buyer",
    joined: "2024-05-12",
    status: "Active",
  },
];


const TabUsers: FC<{ data?: User[] }> = ({ data }) => {
    const users = data || usersDefault;
  return (
    <div className="flex-1 outline-none">
      <div className="rounded-lg border bg-white ">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 ">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Tên</th>
                <th className="px-6 py-3 text-left font-semibold">Email</th>
                <th className="px-6 py-3 text-left font-semibold">Vai trò</th>
                <th className="px-6 py-3 text-left font-semibold">
                  Ngày tham gia
                </th>
                <th className="px-6 py-3 text-left font-semibold">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left font-semibold">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 "
                >
                  <td className="px-6 py-4 font-medium">{user.name}</td>
                  <td className="px-6 py-4 text-gray-500">{user.email}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4 text-gray-500">{user.joined}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-1 rounded hover:bg-gray-100 ">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-1 rounded hover:bg-gray-100 ">
                        <Pencil className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-1 rounded hover:bg-red-100 ">
                        <Ban className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TabUsers;
