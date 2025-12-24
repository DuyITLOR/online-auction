import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft, Home, SearchX } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center'>
      <div className='bg-teal-50 p-6 rounded-full mb-6 animate-bounce-slow'>
        <SearchX className='w-20 h-20 text-teal-600' />
      </div>

      <h1 className='text-9xl font-extrabold text-teal-600 tracking-widest'>404</h1>


      <h2 className='text-2xl md:text-3xl font-bold text-gray-800 mt-8 mb-4'>Oops! Trang này không tồn tại.</h2>

      <p className='text-gray-500 max-w-md mb-8 text-base md:text-lg'>
        Có vẻ như đường dẫn bạn đang truy cập bị hỏng hoặc trang đã bị xóa. Hãy thử quay lại hoặc về trang chủ nhé.
      </p>

      <div className='flex flex-col sm:flex-row gap-4'>
        <Button
          onClick={() => navigate(-1)}
          variant='outline'
          className='flex items-center gap-2 border-gray-300 hover:bg-gray-100 hover:text-gray-900 px-6 py-6 text-base'
        >
          <ArrowLeft className='w-5 h-5' />
          Quay lại trang trước
        </Button>

        <Button
          onClick={() => navigate('/')}
          className='flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 text-base shadow-lg shadow-teal-200'
        >
          <Home className='w-5 h-5' />
          Về trang chủ
        </Button>
      </div>

      <div className='mt-16 text-gray-400 text-sm'>
        Snap<span className='text-teal-600 font-semibold'>Bid</span> &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default NotFoundPage;
