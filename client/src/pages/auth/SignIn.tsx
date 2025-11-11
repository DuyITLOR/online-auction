'use client';
import { Button } from '../../components/ui/button';
// import { signInFormAction } from '@/lib/actions/auth';
// import { CircleAlert } from 'lucide-react';

const signIn = () => {
  //   const [state, action] = React.useActionState(signInFormAction, undefined);
  return (
    <div className='min-h-screen flex items-center'>
      <form className='w-[450px] mx-auto'>
        <div className='flex items-center justify-center gap-2'>
          <img src='/vite.svg' width={50} height={50} />
          <h1 className='font-bold text-4xl text-teal-600'>Ebay</h1>
        </div>

        <div className='font-semibold mt-3 text-teal-700 text-center'>Sign in to your eBay account</div>

        <div className='flex flex-col gap-3 bg-slate-200 shadow-md rounded-md mt-7 py-5 px-5'>
          <div className='flex flex-col space-y-2 mb-3'>
            <h3 className='font-bold text-sm'>Email</h3>
            <input
              type='email'
              name='email'
              placeholder='ThDang@example.com'
              className=' py-1 px-3 bg-white border border-0.5 border-gray-400 focus-visible:outline-0 focus-visible:border-teal-500 focus-visible:border-2 rounded-lg w-full '
            />
            {/* {state?.errors?.email && <p className='text-red-500 text-sm'>{state.errors.email}</p>} */}
          </div>

          <div className='flex flex-col space-y-2 mb-3'>
            <h3 className='font-bold text-sm'>Password</h3>
            <input
              type='password'
              name='password'
              className=' py-1 px-3 bg-white border border-0.5 border-gray-400 focus-visible:outline-0 focus-visible:border-teal-500 focus-visible:border-2 rounded-lg w-full '
            />

            {/* {state?.errors?.password && <p className='text-red-500 text-sm'>{state?.errors.password[0]}</p>} */}
          </div>

          <Button type='submit' className='bg-teal-600 text-white font-bold mt-2 hover:opacity-80'>
            Sign In
          </Button>

          <Button variant='outline' className='font-bold mt-2 hover:opacity-80 bg-white border border-gray-300'>
            <img src='/gg-logo.svg' width={18} height={18} />
            <span>Sign in with Google</span>
          </Button>

          <div className='flex items-center gap-1 justify-center'>
            <h3 className='font-semibold text-sm'>Don't have an account? </h3>
            <a href='/auth/signup' className='font-extrabold text-sm text-teal-700'>
              Sign Up
            </a>
          </div>
        </div>

        <h3 className='text-center text-sm mt-7 font-semibold text-teal-700'>Continue shopping with eBay</h3>
      </form>
    </div>
  );
};

export default signIn;
