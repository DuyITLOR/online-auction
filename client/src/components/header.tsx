/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { clearSession, getSession } from '../libs/session';
import { Popover } from './ui/popover';
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { CircleUserRound, LogOut, User, UserRound } from 'lucide-react';

const Header = () => {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    async function fetchSession() {
      const sess = await getSession();
      console.log('session: ', sess);
      setSession(sess);
    }

    window.addEventListener('storage', (e) => {
      if (e.key === 'session-updated') {
        console.log('session updated!');
        fetchSession();
      }
    });

    fetchSession();
  }, []);

  const onSignOut = () => {
    clearSession();
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
          <div className='flex gap-2 items-center ml-3 text-sm'>
            <span className='font-semibold'>Xin chào, {session.user?.name}</span>

            <Button variant={'ghost'} className='underline' onClick={onSignOut}>
              Đăng xuất
            </Button>
            <Popover>
              <PopoverTrigger>
                <Avatar>
                  <AvatarImage
                    src={session.user?.avatarUrl}
                    alt='User Avatar'
                    className='border border-gray-400 rounded-full'
                  />
                  <AvatarFallback>{session.user?.name?.charAt(0)?.toUpperCase() || '?'}</AvatarFallback>
                </Avatar>
              </PopoverTrigger>

              <PopoverContent className='w-52 mt-1 bg-slate-50 border border-gray-300 shadow-lg rounded-md px-2 py-2 gap-2'>
                <div className='flex flex-col justify-end gap-1'>
                  <div className='flex items-center gap-2'>
                    <Avatar>
                      <AvatarImage
                        src={session.user?.avatarUrl}
                        alt='User Avatar'
                        className='border border-gray-400 rounded-full'
                      />
                      <AvatarFallback>{session.user?.name?.charAt(0)?.toUpperCase() || '?'}</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col'>
                      <span className='font-semibold text-start'>{session.user?.name}</span>
                      <span className='text-xs text-start text-gray-500'>{session.user?.email}</span>
                    </div>
                  </div>

                  <Link
                    className='font-semibold hover:bg-gray-200 p-2 rounded-md text-start mt-2 items-center flex'
                    to='/profile'
                  >
                    <UserRound className='inline-block mr-2' size={16} />
                    Tài khoản của tôi
                  </Link>
                  <button
                    className='font-semibold hover:bg-gray-200 p-2 rounded-md text-start mt-2 items-center flex'
                    onClick={onSignOut}
                  >
                    <LogOut className='inline-block mr-2' size={16} />
                    Đăng xuất
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
