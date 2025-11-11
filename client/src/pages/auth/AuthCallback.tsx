import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 100);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50'>
      <div className='bg-white shadow-lg rounded-lg p-8 max-w-sm text-center'>
        <h1 className='text-2xl font-semibold mb-4 text-gray-800'>Đang xử lý đăng nhập...</h1>
        <p className='text-gray-600'>Vui lòng đợi trong giây lát. Bạn sẽ được chuyển hướng tự động.</p>
        <div className='mt-6'>
          <div className='inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
        </div>
      </div>
    </div>
  );
}
