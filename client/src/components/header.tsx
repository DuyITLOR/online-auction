import { Link } from 'react-router-dom';
import { useAuth } from '../layouts/AuthLayout';
import { supabase } from '../libs/supabaseClient';
import { useEffect, useState } from 'react';
import { getUser } from '../api/user';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { clearSession, getSession } from '../libs/session';

const Header = () => {
  const { session } = useAuth();
  const [currentUser, setCurrentUser] = useState({ name: '' });
  const [localSession, setLocalSession] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      const s = await getSession();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const name = (s as any)?.user?.name ?? '';
      setLocalSession(name);
      console.log('Session (from cookies):', s);
    };
    fetchSession();
  }, [localSession]);

  useEffect(() => {
    const fetchUser = async () => {
      console.log('Session (from supabase):', session?.user?.id);
      if (session?.user?.id) {
        const userFetch = await getUser(session.user.id);
        setCurrentUser(userFetch);
      }
    };

    fetchUser();
  }, [session]);

  async function onSignOut() {
    const { error } = await supabase.auth.signOut();
    await clearSession();
    setLocalSession('');
    if (error) {
      console.error('Lỗi khi đăng xuất:', error);
    } else {
      console.log('Đã đăng xuất!');
    }
  }

  const isLoggedIn = !!session || !!localSession;

  return (
    <header className='sticky top-0 z-50 border-b border-b-gray-200 bg-white'>
      <div className='flex flex-1 items-center justify-between mx-10 py-4 lg:px-8'>
        <div className='flex items-center gap-10 justify-between'>
          <Link to='/' className='flex items-center gap-2 text-2xl font-bold mr-10'>
            <div className='w-8 h-8 bg-teal-600 rounded text-white flex items-center justify-center'>⚡</div>
            <span className='hidden sm:inline text-teal-600'>Ebay</span>
          </Link>

          <input
            className='w-3xl h-8 border border-gray-300 rounded-xl focus:outline-teal-400 px-3 ml-10 py-2'
            placeholder='Search...'
          />
        </div>

        {!isLoggedIn ? (
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
          <div className='flex gap-2 items-center ml-3'>
            {currentUser.name && <span className='font-semibold'>Xin chào, {currentUser.name}</span>}

            {localSession && <span className='font-semibold'>Xin chào, {localSession}</span>}

            <Button variant={'ghost'} className='underline' onClick={onSignOut}>
              Đăng xuất
            </Button>
            <Avatar>
              <AvatarImage src='/gg-logo.svg' alt='User Avatar' className='border border-gray-400 rounded-full' />
              <AvatarFallback>{localSession?.charAt(0)?.toUpperCase() || '?'}</AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
