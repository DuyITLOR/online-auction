import { supabase } from '../libs/supabaseClient';
import { useAuth } from '../layouts/AuthLayout';

export default function Home() {
  const { session, user } = useAuth();

  async function onGoogleSignIn() {
    try {
      const redirectTo = `${window.location.origin}/auth/callback`;
      console.log('Chuyển hướng về:', redirectTo);

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

  async function onSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Lỗi khi đăng xuất:', error);
    } else {
      console.log('Đã đăng xuất!');
    }
  }

  return (
    <div className='max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg'>
      <h1 className='text-2xl font-bold mb-6 text-center'>Supabase + React + Google</h1>

      {session ? (
        <div>
          <h2 className='text-xl mb-4'>Chào mừng trở lại!</h2>
          <img src={user?.user_metadata?.avatar_url} alt='Avatar' className='w-20 h-20 rounded-full mx-auto mb-4' />
          <p className='mb-2'>
            <strong>Email:</strong> {user?.email}
          </p>
          <p className='mb-4'>
            <strong>Tên:</strong> {user?.user_metadata?.full_name}
          </p>

          <button
            onClick={onSignOut}
            className='w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded'
          >
            Đăng xuất
          </button>
        </div>
      ) : (
        <div>
          <h2 className='text-xl mb-4 text-center'>Vui lòng đăng nhập</h2>
          <button
            onClick={onGoogleSignIn}
            className='w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2'
          >
            <svg className='w-5 h-5' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
              <path
                fill='#FFC107'
                d='M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z'
              ></path>
              <path
                fill='#FF3D00'
                d='m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z'
              ></path>
              <path
                fill='#4CAF50'
                d='m24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z'
              ></path>
              <path
                fill='#1976D2'
                d='M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.021 35.596 44 30.032 44 24c0-1.341-.138-2.65-.389-3.917z'
              ></path>
            </svg>
            Đăng nhập với Google
          </button>
        </div>
      )}
    </div>
  );
}
