import Footer from '../../components/footer';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type formValues = {
  password: string;
  rePassword: string;
};

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const token = searchParams.get('token');
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<formValues>();

  const onSubmit = async (data: formValues) => {
    const pwd = data.password;
    const rePwd = data.rePassword;
    if (pwd !== rePwd) {
      setError('Mật khẩu không trùng');
      reset();
      return;
    }
    if (pwd.length < 6) {
      setError('Mật khẩu phải dài hơn 6 kí tự');
      reset();
      return;
    }
    try {
      const res = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: data.password,
        }),
      });
      const result = await res.json();

      if (!res.ok) {
        if (result.message === 'Token expired') setError('Quá hạn');
        else setError(result.message || 'Có lỗi xảy ra');
        return;
      }

      reset();
      navigate('/auth/signin');
    } catch (err) {
      console.log(err);
      setError('Không thể kết nối đến server');
    }
  };

  return (
    <>
      <header className='flex justify-around mt-5 shadow-[0_4px_10px_rgba(0,0,0,0.08)] pb-5'>
        <div className='flex gap-5'>
          <img src='/vite.svg' width={40} height={40} alt='logo' />
          <h3 className='text-lg font-semibold'>Đặt lại mật khẩu</h3>
        </div>
        <Link
          to={'/auth/signin'}
          className='hover:text-orange-500 hover:underline transition-all font-semibold'
        >
          Đăng nhập
        </Link>
      </header>

      <form
        className='max-w-md mx-auto bg-white p-6 rounded-xl shadow-md mt-20 mb-20'
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className='flex flex-col mb-5'>
          <label
            htmlFor='password'
            className='mb-1 text-sm font-medium text-gray-700'
          >
            Nhập mật khẩu mới
          </label>
          <input
            id='password'
            type='password'
            {...register('password', { required: true })}
            className='border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
            placeholder='Nhập mật khẩu mới...'
          />
        </div>

        <div className='flex flex-col mb-6'>
          <label
            htmlFor='re-password'
            className='mb-1 text-sm font-medium text-gray-700'
          >
            Nhập lại mật khẩu
          </label>
          <input
            id='re-password'
            type='password'
            {...register('rePassword', { required: true })}
            className='border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
            placeholder='Nhập lại mật khẩu...'
          />
        </div>
        {error !== '' && (
          <div className='text-red-600 font-semibold'>{error}</div>
        )}
        <button
          type='submit'
          className={`w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 transition cursor-pointer'
          }`}
        >
          Gửi
        </button>
      </form>
      <Footer />
    </>
  );
};

export default ResetPassword;
