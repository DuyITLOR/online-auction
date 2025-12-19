import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'react-router-dom';

const emailSchema = z.object({
  email: z
    .string()
    .min(1, 'Vui lòng nhập email')
    .email('Địa chỉ email không hợp lệ'),
});

type EmailForm = z.infer<typeof emailSchema>;

const ForgetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    mode: 'onTouched',
  });

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const onSubmit = async (data: EmailForm) => {
    try {
      const email = data.email;
      const res = await fetch(`${API_URL}/forget-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      console.log(res);
      reset();
    } catch (err) {
      console.error(err);
      // xử lý lỗi server nếu cần
    }
  };

  return (
    <>
      <header className='flex justify-around mt-5 shadow-[0_4px_10px_rgba(0,0,0,0.08)] pb-5'>
        <div className='flex gap-5'>
          <img src='/vite.svg' width={40} height={40} alt='logo' />
          <h3 className='text-lg font-semibold'>Bạn quên mật khẩu?</h3>
        </div>
        <Link
          to={'/auth/signin'}
          className='hover:text-orange-500 hover:underline transition-all font-semibold'
        >
          Đăng nhập
        </Link>
      </header>

      <div className='max-w-md mx-auto mt-30 p-6 border rounded-md mb-30'>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <label htmlFor='email' className='block text-sm font-medium mb-1'>
            Email
          </label>

          <input
            id='email'
            type='email'
            placeholder='your@example.com'
            {...register('email')}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />

          {errors.email && (
            <p id='email-error' className='mt-1 text-sm text-red-600'>
              {errors.email.message}
            </p>
          )}

          <div className='mt-4 flex items-center gap-3'>
            <button
              type='submit'
              disabled={isSubmitting}
              className='px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60'
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </button>

            {isSubmitSuccessful && (
              <span className='text-sm text-green-600'>
                Đã gửi thành công ✔️
              </span>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default ForgetPassword;
