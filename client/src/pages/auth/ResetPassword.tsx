'use client';
import { ResetPasswordFormAction } from '@/libs/actions/auth';
import { Button } from '../../components/ui/button';
import { CircleAlert } from 'lucide-react';
import { useActionState } from 'react';
import { useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [state, action] = useActionState(ResetPasswordFormAction, undefined);

  return (
    <div className='min-h-screen flex items-center'>
      <form action={action} className='w-[450px] mx-auto'>
        <div className='flex items-center justify-center gap-2'>
          <img
            src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rockylinux/rockylinux-original.svg'
            width={50}
            height={50}
          />
          <p className='font-bold text-4xl text-black'>
            Snap<span className='text-teal-600'>Bid</span>
          </p>
        </div>

        <div className='font-semibold mt-3 text-teal-700 text-center'>Đặt lại mật khẩu mới cho tài khoản của bạn</div>

        <div className='flex flex-col gap-6 bg-slate-200 shadow-md rounded-md mt-7 py-7 px-5'>
          <input type='hidden' name='token' value={token || ''} />
          <div className='flex flex-col space-y-2'>
            <h3 className='font-bold text-sm'>Mật khẩu</h3>
            <input
              type='password'
              name='password'
              placeholder='ThDang@example.com'
              className=' py-1 px-3 bg-white border border-0.5 border-gray-400 focus-visible:outline-0 focus-visible:border-teal-500 focus-visible:border-2 rounded-lg w-full '
            />

            {state?.errors?.password && <p className='text-red-500 text-sm'>{state.errors.password}</p>}
          </div>

          <div className='flex flex-col space-y-2'>
            <h3 className='font-bold text-sm'>Nhập lại mật khẩu</h3>
            <input
              type='password'
              name='confirm-password'
              placeholder='ThDang@example.com'
              className=' py-1 px-3 bg-white border border-0.5 border-gray-400 focus-visible:outline-0 focus-visible:border-teal-500 focus-visible:border-2 rounded-lg w-full '
            />

            {state?.errors?.confirmPassword && <p className='text-red-500 text-sm'>{state.errors.confirmPassword}</p>}
          </div>

          {state?.messages && (
            <div className='w-full border border-red-300 rounded bg-[#fcc4c4] py-1 px-3 items-center flex gap-2'>
              <CircleAlert className='w-5 h-5' color='red' />
              <p className='text-red-500 font-semibold text-sm'>{state?.messages}</p>
            </div>
          )}

          <Button className='bg-teal-600 text-white font-bold mt-2 hover:opacity-80'>Xác nhận </Button>

          <div className='flex items-center gap-1 justify-center'>
            <p className='font-semibold text-sm'>Bạn nhớ mật khẩu cũ? </p>
            <a href='/auth/signin' className='font-extrabold text-sm text-teal-700'>
              Đăng nhập ngay
            </a>
          </div>
        </div>

        <p className='text-center text-sm mt-7 font-semibold text-teal-700'>Tiếp tục mua sắm với SnapBid</p>
      </form>
    </div>
  );
};

export default ResetPassword;
