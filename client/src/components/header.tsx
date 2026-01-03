/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { clearSession, getSession } from '../libs/session';
import { Popover } from './ui/popover';
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { LogOut, Plus, Search, UserRound, MessageCircleMore } from 'lucide-react'; // Import thêm Menu nếu cần hamburger sau này
import { UserContext } from '../libs/contexts/user.context';

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
    <header className='sticky top-0 z-50 border-b border-b-gray-200 bg-white shadow-sm'>
      <div className='container mx-auto px-4 py-3 lg:px-8'>
        {/* Container chính sử dụng flex-wrap để xử lý responsive */}
        <div className='flex flex-wrap items-center justify-between gap-y-3 md:gap-y-0'>
          {/* 1. LOGO */}
          <Link to='/' className='flex items-center gap-2 text-2xl font-bold flex-shrink-0'>
            <img
              src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rockylinux/rockylinux-original.svg'
              className='w-8 h-8 md:w-10 md:h-10'
              alt='Logo'
            />
            <div className='font-bold tracking-tight text-slate-800 text-xl md:text-2xl'>
              Snap<span className='text-teal-600'>Bid</span>
            </div>
          </Link>

          {/* 2. RIGHT ACTIONS (Auth, Avatar, Add Button) - Đảo vị trí DOM để Search nằm giữa trên desktop */}
          <div className='flex items-center gap-2 md:gap-4 flex-shrink-0 md:order-3'>
            {/* Nút Add Product */}
            <Plus
              onClick={handleAddProduct}
              className={`w-8 h-8 md:w-9 md:h-9 stroke-2 text-white p-1.5 rounded-full bg-teal-500 cursor-pointer hover:bg-teal-600 transition-colors ${
                user?.currentRoles.includes('SELLER') ? '' : 'hidden'
              }`}
            />

            {!session && !user ? (
              <div className='flex gap-2 items-center'>
                <Link to='/auth/signin'>
                  <button className='border border-gray-300 px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm font-semibold rounded-md bg-slate-100 hover:bg-slate-200 transition-colors whitespace-nowrap'>
                    Đăng nhập
                  </button>
                </Link>

                <Link to='/auth/signup'>
                  <button className='border border-transparent px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm font-semibold rounded-md bg-teal-500 text-white hover:bg-teal-600 transition-colors whitespace-nowrap'>
                    Đăng Ký
                  </button>
                </Link>
              </div>
            ) : (
              <div className='flex gap-2 items-center text-sm'>
                <span className='font-semibold hidden xl:flex text-gray-700'>Xin chào, {user?.fullname}</span>

                <Popover>
                  <PopoverTrigger asChild>
                    <Avatar className='cursor-pointer hover:opacity-80 transition-opacity w-8 h-8 md:w-10 md:h-10'>
                      <AvatarImage
                        src={user?.avtUrl}
                        alt='User Avatar'
                        className='border border-gray-400 rounded-full object-cover'
                      />
                      <AvatarFallback className='bg-teal-100 text-teal-700'>
                        {user?.fullname?.charAt(0)?.toUpperCase() || '?'}
                      </AvatarFallback>
                    </Avatar>
                  </PopoverTrigger>

                  <PopoverContent className='w-64 mt-2 bg-white border border-gray-200 shadow-xl rounded-lg p-3 z-50 mr-4'>
                    <div className='flex flex-col gap-1'>
                      <div className='flex items-center gap-3 pb-3 border-b border-gray-100 mb-2'>
                        <Avatar>
                          <AvatarImage
                            src={user?.avtUrl}
                            alt='User Avatar'
                            className='border border-gray-200 rounded-full object-cover'
                          />
                          <AvatarFallback>{user?.fullname?.charAt(0)?.toUpperCase() || '?'}</AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col overflow-hidden'>
                          <span className='font-bold text-gray-800 truncate text-sm'>{user?.fullname}</span>
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

          {/* 3. SEARCH BAR */}
          {/* - Mobile: width full, order last (xuống dòng dưới cùng)
              - Tablet/Desktop: nằm giữa (md:order-2), flex-1 để chiếm khoảng trống
          */}
          <div className='w-full order-last md:order-2 md:w-auto md:flex-1 md:mx-6 lg:mx-10'>
            <div className='relative group'>
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className='w-full h-10 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 pl-4 pr-10 py-2 transition-all bg-gray-50 focus:bg-white'
                placeholder='Tìm kiếm sản phẩm...'
              />

              <Search
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer hover:text-teal-500 transition-colors'
                onClick={executeSearch}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
