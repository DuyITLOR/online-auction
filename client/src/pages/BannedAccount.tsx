import { Ban, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { clearSession } from '@/libs/session';

const BannedAccount = () => {
  const navigate = useNavigate();
  const onSignOut = () => {
    clearSession();
    navigate('/');
    window.location.reload();
  };
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4'>
      <div className='max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center'>
        <div className='flex justify-center mb-6'>
          <div className='bg-teal-50 p-4 rounded-full ring-8 ring-teal-50/50'>
            <Ban className='w-12 h-12 text-teal-600' />
          </div>
        </div>

        <h1 className='text-2xl font-bold text-gray-900 mb-3'>Tài khoản bị vô hiệu hóa</h1>

        <p className='text-gray-500 mb-8 leading-relaxed'>
          Tài khoản của bạn hiện không thể truy cập do quyết định từ quản trị viên hoặc vi phạm chính sách hệ thống. Vui
          lòng liên hệ bộ phận hỗ trợ để được giải quyết.
        </p>

        <div className='space-y-3'>
          <Button
            onClick={onSignOut}
            variant='outline'
            className=' bg-teal-600 hover:bg-teal-800 text-white w-full h-11'
            asChild
          >
            <Link to='/'>
              <Home className='w-4 h-4 mr-2' />
              Quay về trang chủ
            </Link>
          </Button>
        </div>
      </div>

      <div className='mt-8 text-center'>
        <p className='text-xs text-gray-400'>Mã hỗ trợ: ACC_DISABLED_403</p>
      </div>
    </div>
  );
};

export default BannedAccount;
