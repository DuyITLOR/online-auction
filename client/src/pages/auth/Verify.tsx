'use client';
import { Button } from '../../components/ui/button';
import { VerifyFormAction } from '../../libs/actions/auth';
import { CircleAlert } from 'lucide-react';
import { useActionState } from 'react';

const Verify = () => {
  const [state, action] = useActionState(VerifyFormAction, undefined);
  return (
    <div className='min-h-screen flex items-center'>
      <form action={action} className='w-[450px] mx-auto'>
        <div className='flex items-center justify-center gap-2'>
          <img src='/vite.svg' width={50} height={50} />
          <h1 className='font-bold text-4xl text-teal-600'>Ebay</h1>
        </div>

        <div className='font-semibold mt-3 text-teal-700 text-center'>Đăng ký tài khoản gia nhập cùng Ebay</div>

        <div className='flex flex-col gap-6 bg-slate-200 shadow-md rounded-md mt-7 py-7 px-5'>
          <div className='flex flex-col space-y-2'>
            <h3 className='font-bold text-sm'>Tên đăng nhập</h3>
            <input
              type='text'
              name='name'
              placeholder='ThDang'
              className=' py-1 px-3 bg-white border border-0.5 border-gray-400 focus-visible:outline-0 focus-visible:border-teal-500 focus-visible:border-2 rounded-lg w-full '
            />
            {state?.errors?.name && <p className='text-red-500 text-sm'> {state?.errors?.name} </p>}
          </div>

          <div className='flex flex-col space-y-2'>
            <h3 className='font-bold text-sm'>Email</h3>
            <input
              type='email'
              name='email'
              placeholder='ThDang@example.com'
              className=' py-1 px-3 bg-white border border-0.5 border-gray-400 focus-visible:outline-0 focus-visible:border-teal-500 focus-visible:border-2 rounded-lg w-full '
            />

            {state?.errors?.email && <p className='text-red-500 text-sm'>{state.errors.email}</p>}
          </div>

          <div className='flex flex-col space-y-3'>
            <h3 className='font-bold text-sm'>Mật khẩu</h3>
            <input
              type='password'
              name='password'
              className=' py-1 px-3 bg-white border border-0.5 border-gray-400 focus-visible:outline-0 focus-visible:border-teal-500 focus-visible:border-2 rounded-lg w-full '
            />

            {state?.errors?.password && <p className='text-red-500 text-sm'>{state?.errors.password[0]}</p>}
          </div>

          <div className='flex flex-col space-y-2'>
            <h3 className='font-bold text-sm'>Code</h3>
            <input
              type='text'
              name='code'
              className=' py-1 px-3 bg-white border border-0.5 border-gray-400 focus-visible:outline-0 focus-visible:border-teal-500 focus-visible:border-2 rounded-lg w-full '
            />

            {state?.errors?.code && <p className='text-red-500 text-sm'>{state.errors.code}</p>}
          </div>

          {state?.messages && (
            <div className='w-full border border-red-300 rounded bg-[#fcc4c4] py-1 px-3 items-center flex gap-2'>
              <CircleAlert className='w-5 h-5' color='red' />
              <p className='text-red-500 font-semibold text-sm'>{state?.messages}</p>
            </div>
          )}

          <Button className='bg-teal-600 text-white font-bold mt-2 hover:opacity-80'>Đăng ký</Button>

          <div className='flex items-center gap-1 justify-center'>
            <h3 className='font-semibold text-sm'>Bạn đã có tài khoản Ebay rồi? </h3>
            <a href='/auth/signin' className='font-extrabold text-sm text-teal-700'>
              Đăng nhập
            </a>
          </div>
        </div>

        <h3 className='text-center text-sm mt-7 font-semibold text-teal-700'>Tiếp tục mua sắp cũng Ebay</h3>
      </form>
    </div>
  );
};

export default Verify;
