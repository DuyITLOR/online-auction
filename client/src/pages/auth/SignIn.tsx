'use client';
import { useActionState, useContext, useEffect, useRef, useState } from 'react';
import { Button } from '../../components/ui/button';
import { SignInFormAction } from '../../libs/actions/auth';
import { CircleAlert, Loader2 } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../libs/contexts/user.context';

const SignIn = () => {
  const [state, action, isPending] = useActionState(SignInFormAction, undefined);

  const [isRedirecting, setIsRedirecting] = useState(false);

  const [captchaValue, setCaptchaValue] = useState(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const { refresh } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthResult = async () => {
      if (state?.errors || (state?.messages && !state?.success)) {
        toast.error('Đăng nhập thất bại');
        recaptchaRef.current?.reset();
        setCaptchaValue(null);
      }

      if (state?.success) {
        setIsRedirecting(true);
        toast.success(state.messages || 'Đăng nhập thành công');

        try {
          await refresh();
          if (state.role === 'ADMIN') {
            navigate('/admin/dashboard');
          } else {
            navigate('/');
          }
        } catch (error) {
          console.error('Lỗi khi refresh session:', error);
          setIsRedirecting(false); // Tắt loading nếu lỗi
        }
      }
    };

    handleAuthResult();
  }, [state, refresh, navigate]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRecaptcha = (value: any) => {
    // console.log(value);
    setCaptchaValue(value);
  };

  const isLoading = isPending || isRedirecting; // Gộp trạng thái loading

  return (
    <div className='min-h-screen flex items-center'>
      <div className='w-[450px] mx-auto'>
        <div className='flex items-center justify-center gap-2'>
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

        <div className='font-semibold mt-3 text-teal-700 text-center'>Đăng nhập vào tài khoản SnapBid của bạn</div>

        <div className='flex flex-col gap-3 bg-slate-200 shadow-md rounded-md mt-7 py-5 px-5'>
          <form action={action}>
            <div className='flex flex-col space-y-2 mb-3'>
              <h3 className='font-bold text-sm'>Email</h3>
              <input
                type='email'
                name='email'
                placeholder='ThDang@example.com'
                disabled={isLoading} // Disable khi loading
                className='py-1 px-3 bg-white border border-0.5 border-gray-400 focus-visible:outline-0 focus-visible:border-teal-500 focus-visible:border-2 rounded-lg w-full disabled:opacity-50'
              />
              {state?.errors?.email && <p className='text-red-500 text-sm'>{state.errors.email}</p>}
            </div>

            <div className='flex flex-col space-y-2 mb-3'>
              <h3 className='font-bold text-sm'>Mật khẩu</h3>
              <input
                type='password'
                name='password'
                disabled={isLoading} // Disable khi loading
                className='py-1 px-3 bg-white border border-0.5 border-gray-400 focus-visible:outline-0 focus-visible:border-teal-500 focus-visible:border-2 rounded-lg w-full disabled:opacity-50'
              />
              {state?.errors?.password && <p className='text-red-500 text-sm'>{state?.errors.password[0]}</p>}
            </div>

            <input type='hidden' name='recaptcha' value={captchaValue || ''} />

            {/* Chỉ hiện lỗi nếu không phải là success */}
            {state?.messages && !state?.success && (
              <div className='w-full border border-red-300 rounded bg-[#fcc4c4] py-1 px-3 items-center flex gap-2'>
                <CircleAlert className='w-5 h-5' color='red' />
                <p className='text-red-500 font-semibold text-sm'>{state?.messages}</p>
              </div>
            )}

            <Button
              disabled={!captchaValue || isLoading}
              type='submit'
              className='bg-teal-600 text-white font-bold mt-2 hover:opacity-80 w-full flex items-center justify-center gap-2'
            >
              {isLoading ? (
                <>
                  <Loader2 className='animate-spin h-5 w-5' />
                  Đang xử lý...
                </>
              ) : (
                'Đăng nhập'
              )}
            </Button>
          </form>

          <a
            href={`${import.meta.env.VITE_BACKEND_URL}/auth/google`}
            className={`flex items-center justify-center gap-2 rounded-md h-10 text-sm font-bold mt-2 hover:opacity-80 bg-white border border-gray-300 ${
              isLoading ? 'pointer-events-none opacity-50' : ''
            }`}
          >
            <img src='/gg-logo.svg' width={18} height={18} alt='Google Logo' />
            <span>Đăng nhập bằng Google</span>
          </a>

          <div className='flex justify-center mt-5 mb-5'>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={handleRecaptcha}
            />
          </div>

          <div className='flex items-center gap-1 justify-center'>
            <p className='font-semibold text-sm'>Bạn mới biết đến SnapBid? </p>
            <a href='/auth/signup' className='font-extrabold text-sm text-teal-700'>
              Đăng ký
            </a>
          </div>
          <Link
            to='/auth/forget-password'
            className='block text-center text-sm text-gray-600 font-semibold hover:text-orange-500 hover:underline transition-all'
          >
            Quên mật khẩu?
          </Link>
        </div>

        <p className='text-center text-sm mt-7 font-semibold text-teal-700'>Tiếp tục mua sắp với SnapBid</p>
      </div>
    </div>
  );
};

export default SignIn;
