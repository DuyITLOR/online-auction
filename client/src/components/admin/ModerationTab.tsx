import { type FC, useState } from "react";
import {
  Check,
  X,
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Calendar,
  AlertTriangle,
  Loader2,
} from "lucide-react";

// Import Pagination Component
import Pagination from "../pagination"; // Đảm bảo đường dẫn đúng tới file Pagination của bạn

import { useModeration } from "../../libs/contexts/moderationTab.context";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

// Define ActionType locally to avoid import errors
type ActionType = "APPROVE" | "REFUSE";

const ModerationTab: FC = () => {
  // Lấy data và hàm từ Context (Bao gồm các state Pagination mới)
  const {
    filteredData,
    loading,
    filterStatus,
    searchTerm,
    page,
    totalPage,
    totalRecords,
    setFilterStatus,
    setSearchTerm,
    setPage,
    processRequest,
  } = useModeration();

  // --- UI States ---
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<{
    id: string;
    action: ActionType;
  } | null>(null);

  // Mở Dialog
  const openConfirmDialog = (id: string, action: ActionType) => {
    setSelectedRequest({ id, action });
    setIsDialogOpen(true);
  };

  // Xác nhận hành động
  const handleConfirmAction = async () => {
    if (!selectedRequest) return;
    setActionLoading(true);
    try {
      await processRequest(selectedRequest.id, selectedRequest.action);
      setIsDialogOpen(false);
    } catch (error) {
      // Error handled in context
    } finally {
      setActionLoading(false);
    }
  };

  // Helper render Badge
  const renderStatusBadge = (status: string) => {
    const s = status?.toUpperCase() || "";
    if (s === "PENDING") {
      return (
        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
          <span className='w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1.5'></span>
          Chờ duyệt
        </span>
      );
    }
    if (s === "VALID" || s === "APPROVED") {
      return (
        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
          <span className='w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5'></span>
          Đã duyệt
        </span>
      );
    }
    return (
      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
        <span className='w-1.5 h-1.5 bg-gray-500 rounded-full mr-1.5'></span>
        {s === "EXPIRED" ? "Hết hạn" : "Từ chối"}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  // Handle Page Change
  const onPageChange = (newPage: string | number) => {
    if (newPage === "...") return;
    setPage(Number(newPage));
  };

  return (
    <div className='flex-1 space-y-6 flex flex-col h-full'>
      {/* --- TOOLBAR & FILTERS --- */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm'>
        <div className='flex p-1 bg-gray-100 rounded-lg'>
          {[
            { id: "ALL", label: "Tất cả" },
            { id: "PENDING", label: "Chờ duyệt" },
            { id: "APPROVED", label: "Đã duyệt" },
            { id: "REJECTED", label: "Đã hủy/Từ chối" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                filterStatus === tab.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className='relative w-full sm:w-64'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <Search className='h-4 w-4 text-gray-400' />
          </div>
          <input
            type='text'
            className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm'
            placeholder='Tìm theo tên hoặc email...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- DATA TABLE --- */}
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex-1 flex flex-col'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm text-left'>
            <thead className='bg-gray-50 text-gray-500 uppercase font-medium text-xs border-b border-gray-200'>
              <tr>
                <th className='px-6 py-4 font-semibold'>Người dùng</th>
                <th className='px-6 py-4 font-semibold'>Ghi chú</th>
                <th className='px-6 py-4 font-semibold'>Trạng thái</th>
                <th className='px-6 py-4 font-semibold'>Thời gian</th>
                <th className='px-6 py-4 font-semibold text-right'>
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className='animate-pulse'>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-9 h-9 rounded-full bg-gray-200 shrink-0' />
                        <div className='space-y-2'>
                          <div className='h-4 w-32 bg-gray-200 rounded' />
                          <div className='h-3 w-40 bg-gray-200 rounded' />
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='h-4 w-48 bg-gray-200 rounded' />
                    </td>
                    <td className='px-6 py-4'>
                      <div className='h-6 w-24 bg-gray-200 rounded-full' />
                    </td>
                    <td className='px-6 py-4'>
                      <div className='h-4 w-32 bg-gray-200 rounded' />
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex justify-end gap-2'>
                        <div className='h-8 w-8 bg-gray-200 rounded-lg' />
                        <div className='h-8 w-8 bg-gray-200 rounded-lg' />
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className='px-6 py-12 text-center text-gray-500 italic'
                  >
                    <div className='flex flex-col items-center gap-2'>
                      <Filter className='w-8 h-8 text-gray-300' />
                      <span>Không tìm thấy yêu cầu nào phù hợp.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className='hover:bg-gray-50 transition-colors duration-150'
                  >
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-9 h-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-bold shrink-0'>
                          {item.user?.fullName?.charAt(0) || "U"}
                        </div>
                        <div className='min-w-0'>
                          <p className='font-semibold text-gray-900 truncate'>
                            {item.user?.fullName}
                          </p>
                          <div className='flex items-center text-xs text-gray-500 mt-0.5'>
                            <Mail className='w-3 h-3 mr-1' />
                            <span className='truncate'>{item.user?.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 max-w-xs'>
                      <p className='text-gray-600 truncate' title={item.note}>
                        {item.note || "Không có ghi chú"}
                      </p>
                    </td>
                    <td className='px-6 py-4'>
                      {renderStatusBadge(item.status)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-gray-500'>
                      <div className='flex items-center gap-1.5'>
                        <Calendar className='w-3.5 h-3.5' />
                        {formatDate(item.createdAt)}
                      </div>
                    </td>
                    <td className='px-6 py-4 text-right'>
                      {item.status === "PENDING" ? (
                        <div className='flex items-center justify-end gap-2'>
                          <button
                            onClick={() =>
                              openConfirmDialog(item.id, "APPROVE")
                            }
                            className='p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-200'
                            title='Duyệt yêu cầu'
                          >
                            <Check className='w-4 h-4' />
                          </button>
                          <button
                            onClick={() => openConfirmDialog(item.id, "REFUSE")}
                            className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200'
                            title='Từ chối yêu cầu'
                          >
                            <X className='w-4 h-4' />
                          </button>
                        </div>
                      ) : (
                        <button
                          className='p-2 text-gray-400 cursor-not-allowed'
                          disabled
                        >
                          <MoreHorizontal className='w-4 h-4' />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION SECTION --- */}
        {!loading && totalRecords > 0 && (
          <div className='p-4 border-t border-gray-100 mt-auto'>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-gray-500'>
                Hiển thị trang <span className='font-medium'>{page}</span> /{" "}
                <span className='font-medium'>{totalPage}</span>
              </div>
              <Pagination
                className='flex justify-end'
                page={page}
                onPageChange={onPageChange}
                totalPage={totalPage}
              />
            </div>
          </div>
        )}
      </div>

      {/* --- CONFIRMATION DIALOG --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <AlertTriangle
                className={`w-5 h-5 ${
                  selectedRequest?.action === "REFUSE"
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              />
              Xác nhận hành động
            </DialogTitle>
            <DialogDescription>
              {selectedRequest?.action === "APPROVE"
                ? "Bạn có chắc chắn muốn DUYỆT yêu cầu nâng cấp này không?"
                : "Bạn có chắc chắn muốn TỪ CHỐI yêu cầu này không?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='gap-2 sm:gap-0'>
            <button
              onClick={() => setIsDialogOpen(false)}
              disabled={actionLoading}
              className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleConfirmAction}
              disabled={actionLoading}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                selectedRequest?.action === "APPROVE"
                  ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                  : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
              }`}
            >
              {actionLoading ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                "Xác nhận"
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModerationTab;
