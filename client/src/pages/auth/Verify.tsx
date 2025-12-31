'use client';
import { Button } from '../../components/ui/button';
import { VerifyFormAction } from '../../libs/actions/auth';
import { CircleAlert } from 'lucide-react';
import { useActionState, useEffect, useState } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../../components/ui/input-otp';

const Verify = () => {
  const [state, action] = useActionState(VerifyFormAction, undefined);
  const [otpValue, setOtpValue] = useState('');

  useEffect(() => {
    if (state?.errors?.code || state?.messages) {
      setOtpValue('');
    }
  }, [state]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-50 py-10'>
      <form action={action} className='w-full max-w-[480px] mx-auto'>
        <div className='flex items-center justify-center gap-2 mb-2'>
          <img
            src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rockylinux/rockylinux-original.svg'
            width={50}
            height={50}
            alt='Logo'
          />
          <p className='font-bold text-4xl text-black'>
            Snap<span className='text-teal-600'>Bid</span>
          </p>
        </div>

        <div className='font-semibold text-teal-700 text-center mb-6'>Hoàn tất đăng ký để gia nhập cùng SnapBid</div>

        <div className='flex flex-col gap-5 bg-white shadow-xl rounded-2xl p-8 border border-slate-100'>
          <div className='flex flex-col space-y-1.5'>
            <label htmlFor='name' className='font-bold text-sm text-slate-700'>
              Tên đăng nhập
            </label>
            <input
              id='name'
              type='text'
              name='name'
              placeholder='ThDang'
              className='py-2 px-3 bg-slate-50 border border-slate-300 focus-visible:outline-none focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500 rounded-md w-full transition-all'
            />
            {state?.errors?.name && <p className='text-red-500 text-xs mt-1'> {state?.errors?.name} </p>}
          </div>

          <div className='flex flex-col space-y-1.5'>
            <label htmlFor='email' className='font-bold text-sm text-slate-700'>
              Email
            </label>
            <input
              id='email'
              type='email'
              name='email'
              placeholder='ThDang@example.com'
              className='py-2 px-3 bg-slate-50 border border-slate-300 focus-visible:outline-none focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500 rounded-md w-full transition-all'
            />
            {state?.errors?.email && <p className='text-red-500 text-xs mt-1'>{state.errors.email}</p>}
          </div>

          <div className='flex flex-col space-y-1.5'>
            <label htmlFor='address' className='font-bold text-sm text-slate-700'>
              Địa chỉ
            </label>
            <input
              id='address'
              type='text'
              name='address'
              placeholder='106 Nguyễn Văn Cừ, Tp Hồ Chí Minh'
              className='py-2 px-3 bg-slate-50 border border-slate-300 focus-visible:outline-none focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500 rounded-md w-full transition-all'
            />
            {state?.errors?.address && <p className='text-red-500 text-xs mt-1'>{state.errors.address}</p>}
          </div>

          <div className='flex flex-col space-y-1.5'>
            <label htmlFor='password' className='font-bold text-sm text-slate-700'>
              Mật khẩu
            </label>
            <input
              id='password'
              type='password'
              name='password'
              className='py-2 px-3 bg-slate-50 border border-slate-300 focus-visible:outline-none focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500 rounded-md w-full transition-all'
            />
            {state?.errors?.password && <p className='text-red-500 text-xs mt-1'>{state?.errors.password[0]}</p>}
          </div>

          <div className='flex flex-col space-y-3 items-center pt-2'>
            <label className='font-bold text-sm text-slate-700'>Mã xác thực (Code)</label>
            <input type='hidden' name='code' value={otpValue} />
            <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
              <InputOTPGroup className='gap-1'>
                <InputOTPSlot
                  className='rounded-md border-slate-300 bg-slate-50 data-[active=true]:border-teal-500 data-[active=true]:ring-teal-500/30'
                  index={0}
                />
                <InputOTPSlot
                  className='rounded-md border-slate-300 bg-slate-50 data-[active=true]:border-teal-500 data-[active=true]:ring-teal-500/30'
                  index={1}
                />
                <InputOTPSlot
                  className='rounded-md border-slate-300 bg-slate-50 data-[active=true]:border-teal-500 data-[active=true]:ring-teal-500/30'
                  index={2}
                />
              </InputOTPGroup>
              <InputOTPGroup className='gap-1'>
                <InputOTPSlot
                  className='rounded-md border-slate-300 bg-slate-50 data-[active=true]:border-teal-500 data-[active=true]:ring-teal-500/30'
                  index={3}
                />
                <InputOTPSlot
                  className='rounded-md border-slate-300 bg-slate-50 data-[active=true]:border-teal-500 data-[active=true]:ring-teal-500/30'
                  index={4}
                />
                <InputOTPSlot
                  className='rounded-md border-slate-300 bg-slate-50 data-[active=true]:border-teal-500 data-[active=true]:ring-teal-500/30'
                  index={5}
                />
              </InputOTPGroup>
            </InputOTP>
            <p className='text-xs text-slate-500 text-center'>Nhập mã 6 số chúng tôi vừa gửi cho bạn.</p>

            {state?.errors?.code && <p className='text-red-500 text-xs'>{state.errors.code}</p>}
          </div>

          {state?.messages && (
            <div className='w-full border border-red-200 rounded-lg bg-red-50 py-2 px-3 items-center flex gap-2'>
              <CircleAlert className='w-5 h-5 text-red-500 shrink-0' />
              <p className='text-red-600 font-semibold text-sm'>{state?.messages}</p>
            </div>
          )}

          <Button className='bg-teal-600 text-white font-bold mt-4 hover:bg-teal-700 transition-colors py-6 text-base rounded-xl shadow-teal-600/20 shadow-lg'>
            Hoàn tất đăng ký
          </Button>

          <div className='flex items-center gap-1 justify-center mt-2'>
            <p className='font-medium text-sm text-slate-600'>Bạn đã có tài khoản? </p>
            <a href='/auth/signin' className='font-bold text-sm text-teal-700 hover:underline'>
              Đăng nhập ngay
            </a>
          </div>
        </div>

        <p className='text-center text-sm mt-8 font-medium text-slate-500'>
          Tiếp tục mua sắm cùng <span className='text-teal-700 font-bold'>SnapBid</span>
        </p>
      </form>
    </div>
  );
};

export default Verify;
