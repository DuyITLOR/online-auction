import { Link } from 'react-router-dom';
import { useAuth } from '../layouts/AuthLayout';
import { supabase } from '../libs/supabaseClient';

const Header = () => {
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
    <header className='sticky top-0 z-50 border-b border-b-gray-200 bg-white'>
      <div className='flex flex-1 items-center justify-between mx-10 py-4 lg:px-8'>
        <div className='flex items-center gap-10 justify-between'>
          <Link to='/' className='flex items-center gap-2 text-2xl font-bold mr-10'>
            <div className='w-8 h-8 bg-teal-600 rounded text-white flex items-center justify-center'>⚡</div>
            <span className='hidden sm:inline text-teal-600'>Ebay</span>
          </Link>
          <input
            className='w-4xl h-8 border border-gray-300 rounded-xl focus:outline-teal-400 px-3 ml-10 py-2'
            placeholder='Search...'
          />
        </div>

        {!session ? (
          <div className='flex gap-2 items-center ml-3'>
            <Link to='/auth/signin'>
              <button className='border border-gray-300 px-1 text-sm font-semibold h-10 rounded-md bg-slate-200'>
                Đăng nhập
              </button>
            </Link>

            <Link to='/auth/signup'>
              <button className='border border-gray-300 px-2 text-sm font-semibold h-10 rounded-md bg-teal-500 text-white'>
                Đăng Ký
              </button>
            </Link>
          </div>
        ) : (
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
        )}
      </div>
    </header>
  );
};

export default Header;
