/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { clearSession, getSession } from '../libs/session';
import { Popover } from './ui/popover';
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { LogOut, Plus, Search, UserRound } from 'lucide-react';
import { UserContext } from '../libs/contexts/user.context';
import { MessageCircleMore } from 'lucide-react';

const Header = () => {
  const [session, setSession] = useState<any>(null);
  const { user, refresh } = useContext(UserContext);
  const [searchValue, setSearchValue] = useState('');

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchValue(query);
    } else {
      setSearchValue('');
    }
  }, [searchParams]);

  const executeSearch = () => {
    const trimmedValue = searchValue.trim();
    if (trimmedValue) {
      navigate(`/products?q=${encodeURIComponent(trimmedValue)}`);
    } else {
      navigate('/products');
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  useEffect(() => {
    const getToken = async () => {
      try {
        const sessionValue = await getSession();
        if (sessionValue != null) {
          setSession(sessionValue);
        } else {
          setSession(null);
        }
      } catch (err) {
        console.error(err);
        throw err;
      }
    };

    getToken();
  }, []);

  useEffect(() => {
    refresh();
  }, [session]);

  const onSignOut = () => {
    clearSession();
    setSession(null);
    navigate('/');
    window.location.reload();
  };

  const handleAddProduct = () => {
    navigate('/post-product');
  };

  return (
    <header className='sticky top-0 z-50 border-b border-b-gray-200 bg-white'>
      <div className='flex flex-1 items-center justify-between mx-3 py-4 lg:px-8'>
        <div className='flex items-center gap-10 justify-between'>
          <Link to='/' className='flex items-center gap-2 text-2xl font-bold mr-10'>
            <img
              src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rockylinux/rockylinux-original.svg'
              className='w-10 h-10'
            />

            <div className='font-bold tracking-tight text-slate-800'>
              Snap<span className='text-teal-600'>Bid</span>
            </div>
          </Link>
          <div className='flex items-center gap-4'>
            <div className='relative'>
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className='h-10 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 pl-4 pr-10 py-2 transition-all max-w-3xl md:min-w-3xl'
                placeholder='Search...'
              />

              <Search
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer hover:text-teal-500 transition-colors'
                onClick={executeSearch}
              />
            </div>
            <Plus
              onClick={handleAddProduct}
              className={`w-8 h-8 stroke-2 text-white p-1 rounded-full bg-teal-500 cursor-pointer hover:bg-teal-600 transition-colors ${
                user?.currentRoles.includes('SELLER') ? '' : 'hidden'
              }`}
            />
          </div>
        </div>

        {!session && !user ? (
          <div className='flex gap-2 items-center ml-3'>
            <Link to='/auth/signin'>
              <button className='border border-gray-300 px-3 py-2 text-sm font-semibold rounded-md bg-slate-100 hover:bg-slate-200 transition-colors'>
                Đăng nhập
              </button>
            </Link>

            <Link to='/auth/signup'>
              <button className='border border-transparent px-3 py-2 text-sm font-semibold rounded-md bg-teal-500 text-white hover:bg-teal-600 transition-colors'>
                Đăng Ký
              </button>
            </Link>
          </div>
        ) : (
          <div className='flex gap-2 items-center ml-3 text-sm'>
            <span className='font-semibold hidden xl:flex'>Xin chào, {user?.fullname}</span>

            <Popover>
              <PopoverTrigger>
                <Avatar className='cursor-pointer hover:opacity-80 transition-opacity'>
                  <AvatarImage src={user?.avtUrl} alt='User Avatar' className='border border-gray-400 rounded-full' />
                  <AvatarFallback>{user?.fullname?.charAt(0)?.toUpperCase() || '?'}</AvatarFallback>
                </Avatar>
              </PopoverTrigger>

              <PopoverContent className='w-64 mt-2 bg-white border border-gray-200 shadow-xl rounded-lg p-3 z-50'>
                <div className='flex flex-col gap-1'>
                  <div className='flex items-center gap-3 pb-3 border-b border-gray-100 mb-2'>
                    <Avatar>
                      <AvatarImage
                        src={user?.avtUrl}
                        alt='User Avatar'
                        className='border border-gray-200 rounded-full'
                      />
                      <AvatarFallback>{user?.fullname?.charAt(0)?.toUpperCase() || '?'}</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col overflow-hidden'>
                      <span className='font-bold text-gray-800 truncate'>{user?.fullname}</span>
                      <span className='text-xs text-gray-500 truncate'>{user?.email}</span>
                    </div>
                  </div>

                  <Link
                    className='flex items-center px-2 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-teal-50 hover:text-teal-700 transition-colors'
                    to='/profile'
                  >
                    <UserRound className='mr-3 h-4 w-4' />
                    Tài khoản của tôi
                  </Link>
                  <Link
                    className='flex items-center px-2 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-teal-50 hover:text-teal-700 transition-colors'
                    to='/chat'
                  >
                    <MessageCircleMore className='mr-3 h-4 w-4' />
                    Hội thoại
                  </Link>
                  <button
                    className='flex items-center w-full px-2 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors text-left'
                    onClick={onSignOut}
                  >
                    <LogOut className='mr-3 h-4 w-4' />
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
