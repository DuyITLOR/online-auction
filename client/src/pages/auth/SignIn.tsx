'use client';
import { useActionState, useRef, useState } from 'react';
import { Button } from '../../components/ui/button';
import { SignInFormAction } from '../../libs/actions/auth';
import { supabase } from '../../libs/supabaseClient';
import { CircleAlert } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';

const SignIn = () => {
  const [state, action] = useActionState(SignInFormAction, undefined);

  const [captchaValue, setCaptchaValue] = useState(null);
  const recaptchaRef = useRef(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRecaptcha = (value: any) => {
    setCaptchaValue(value);
  };

  async function onGoogleSignIn() {
    try {
      const redirectTo = `${window.location.origin}/auth/callback`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) {
        console.error('[auth-form][form-submit::google]:', error);
        alert('Đã xảy ra lỗi khi đăng nhập: ' + error.message);
      }
    } catch (error) {
      console.error('[auth-form][form-submit::google]:', error);
    }
  }
  return (
    <div className='min-h-screen flex items-center'>
      <div className='w-[450px] mx-auto'>
        <div className='flex items-center justify-center gap-2'>
          <img src='/vite.svg' width={50} height={50} />
          <h1 className='font-bold text-4xl text-teal-600'>Ebay</h1>
        </div>

        <div className='font-semibold mt-3 text-teal-700 text-center'>Đăng nhập vào tài khoản Ebay của bạn</div>

        <div className='flex flex-col gap-3 bg-slate-200 shadow-md rounded-md mt-7 py-5 px-5'>
          <form action={action}>
            <div className='flex flex-col space-y-2 mb-3'>
              <h3 className='font-bold text-sm'>Email</h3>
              <input
                type='email'
                name='email'
                placeholder='ThDang@example.com'
                className=' py-1 px-3 bg-white border border-0.5 border-gray-400 focus-visible:outline-0 focus-visible:border-teal-500 focus-visible:border-2 rounded-lg w-full '
              />
              {state?.errors?.email && <p className='text-red-500 text-sm'>{state.errors.email}</p>}
            </div>

            <div className='flex flex-col space-y-2 mb-3'>
              <h3 className='font-bold text-sm'>Mật khẩu</h3>
              <input
                type='password'
                name='password'
                className=' py-1 px-3 bg-white border border-0.5 border-gray-400 focus-visible:outline-0 focus-visible:border-teal-500 focus-visible:border-2 rounded-lg w-full '
              />

              {state?.errors?.password && <p className='text-red-500 text-sm'>{state?.errors.password[0]}</p>}
            </div>

            <input type='hidden' name='recaptcha' value={captchaValue || ''} />

            {state?.messages && (
              <div className='w-full border border-red-300 rounded bg-[#fcc4c4] py-1 px-3 items-center flex gap-2'>
                <CircleAlert className='w-5 h-5' color='red' />
                <p className='text-red-500 font-semibold text-sm'>{state?.messages}</p>
              </div>
            )}

            <div className='flex justify-center mt-10 mb-5'>
              <div
                style={{
                  transform: 'scale(1.355)',
                }}
              >
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  onChange={handleRecaptcha}
                />
              </div>
            </div>

            <Button
              disabled={!captchaValue}
              type='submit'
              className='bg-teal-600 text-white font-bold mt-2 hover:opacity-80 w-full'
            >
              Đăng nhập
            </Button>
          </form>

          <Button
            onClick={onGoogleSignIn}
            variant='outline'
            className='font-bold mt-2 hover:opacity-80 bg-white border border-gray-300'
          >
            <img src='/gg-logo.svg' width={18} height={18} />
            <span>Đăng nhập bằng Google</span>
          </Button>

          <div className='flex items-center gap-1 justify-center'>
            <h3 className='font-semibold text-sm'>Bạn mới biết đến Ebay? </h3>
            <a href='/auth/signup' className='font-extrabold text-sm text-teal-700'>
              Đăng ký
            </a>
          </div>
        </div>

        <h3 className='text-center text-sm mt-7 font-semibold text-teal-700'>Tiếp tục mua sắp với Ebay</h3>
      </div>
    </div>
  );
};

export default SignIn;
