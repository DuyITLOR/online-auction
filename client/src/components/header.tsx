/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { clearSession, getSession } from '../libs/session';
import { Popover } from './ui/popover';
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { LogOut, Plus, Search, UserRound } from 'lucide-react';
import { UserContext } from '../libs/contexts/user.context';

const Header = () => {
  const [session, setSession] = useState<any>(null);
  const { user } = useContext(UserContext);
  console.log(user);
  const [searchValue, setSearchValue] = useState('');

  const [, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    if (location.pathname !== '/products') {
      navigate(`/products?q=${value}`);
    }
    const next = new URLSearchParams();
    if (!value) {
      next.delete('q');
    } else {
      next.set('q', value);
    }
    setSearchParams(next);
  };

  useEffect(() => {
    async function fetchSession() {
      const sess = await getSession();
      setSession(sess);
    }
    fetchSession();
  }, []);

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
                className='h-10 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 pl-4 pr-10 py-2  transition-all w-3xl'
                placeholder='Search...'
              />

              <Search
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer hover:text-teal-500 transition-colors'
                onClick={() => handleSearch(searchValue)}
              />
            </div>
            <Plus
              onClick={handleAddProduct}
              className={`w-8 h-8 stroke-2 text-white p-1 rounded-full bg-teal-500 ${
                user?.currentRoles.includes('SELLER') ? '' : 'hidden'
              }`}
            />
          </div>
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
            <span className='font-semibold'>Xin chào, {user?.fullname}</span>

            <Button variant={'ghost'} className='underline' onClick={onSignOut}>
              Đăng xuất
            </Button>
            <Popover>
              <PopoverTrigger>
                <Avatar>
                  <AvatarImage src={user?.avtUrl} alt='User Avatar' className='border border-gray-400 rounded-full' />
                  <AvatarFallback>{user?.fullname?.charAt(0)?.toUpperCase() || '?'}</AvatarFallback>
                </Avatar>
              </PopoverTrigger>

              <PopoverContent className='w-52 mt-1 bg-slate-50 border border-gray-300 shadow-lg rounded-md px-2 py-2 gap-2'>
                <div className='flex flex-col justify-end gap-1'>
                  <div className='flex items-center gap-2'>
                    <Avatar>
                      <AvatarImage
                        src={user?.avtUrl}
                        alt='User Avatar'
                        className='border border-gray-400 rounded-full'
                      />
                      <AvatarFallback>{user?.fullname?.charAt(0)?.toUpperCase() || '?'}</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col'>
                      <span className='font-semibold text-start'>{user?.fullname}</span>
                      <span className='text-xs text-start text-gray-500'>{user?.email}</span>
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
