/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { getSession } from '../libs/session';

const Header = () => {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    async function fetchSession() {
      const sess = await getSession();
      setSession(sess);
    }
    fetchSession();
  }, []);

  const onSignOut = () => {
    localStorage.removeItem('session'); // hoặc logic sign out của bạn
    setSession(null);
  };

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
          <div className='flex gap-2 items-center ml-3'>
            <span className='font-semibold'>Xin chào, {session.user?.name}</span>

            <Button variant={'ghost'} className='underline' onClick={onSignOut}>
              Đăng xuất
            </Button>
            <Avatar>
              <AvatarImage
                src={session.user?.avatar || '/gg-logo.svg'}
                alt='User Avatar'
                className='border border-gray-400 rounded-full'
              />
              <AvatarFallback>{session.user?.name?.charAt(0)?.toUpperCase() || '?'}</AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
