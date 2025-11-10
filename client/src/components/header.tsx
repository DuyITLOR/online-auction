import { Link } from 'react-router-dom';

const Header = () => {
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

        <div className='flex gap-2 items-center ml-3'>
          <button className='border border-gray-300 px-1 text-sm font-semibold h-10 rounded-md bg-slate-200'>
            Đăng Nhập
          </button>
          <button className='border border-gray-300 px-2 text-sm font-semibold h-10 rounded-md bg-teal-500 text-white'>
            Đăng Ký
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
