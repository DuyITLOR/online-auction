import { useContext, useState } from 'react';
import Card from './Card';
import type { dataDto } from './Card';
import { UserContext } from '../../libs/contexts/user.context';
import { Pencil, House } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AsideChatProps {
  data: dataDto[];
  chatIdx: number;
  updateChatIdx: (idx: number) => void;
  updateFilter: (value: string) => void;
}

const AsideChat = ({
  data,
  chatIdx,
  updateChatIdx,
  updateFilter,
}: AsideChatProps) => {
  const { user } = useContext(UserContext);
  const [filterChat, setFilterChat] = useState('');

  const handleOnChange = (value: string) => {
    setFilterChat(value);
    updateFilter(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filterChat.trim()) {
      updateFilter('');
      setFilterChat('');
    }
  };

  return (
    <div
      className={`flex flex-col gap-2 h-screen overflow-y-auto p-2 bg-gray-100 md:w-[320px] overflow-hidden
    ${chatIdx === -1 ? 'w-full' : 'hidden md:block'}`}
    >
      {/* Information block */}
      <div className='flex items-center p-4'>
        <div className='shrink-0'>
          <img
            className='w-8 h-8 rounded-full'
            src={user?.avtUrl}
            alt='image'
          />
        </div>
        <div className='flex-1 min-w-0 ms-2'>
          <p className='font-medium text-heading truncate'>{user?.fullname}</p>
        </div>
        <div className='cursor-pointer flex gap-2'>
          <Link to='/' className='w-5 h-5 hover:text-teal-500'>
            <Pencil />
          </Link>
          <Link to='/' className='w-5 h-5 hover:text-teal-500'>
            <House />
          </Link>
        </div>
      </div>
      {/* Search input */}
      <div className='pb-4 border-b-2 mb-4 border-gray-400'>
        <form className='relative'>
          <label htmlFor='search' className='sr-only'>
            Search
          </label>

          {/* Icon */}
          <div className='pointer-events-none absolute inset-y-0 left-3 flex items-center'>
            <svg
              className='h-4 w-4 text-body'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z'
              />
            </svg>
          </div>

          {/* Input */}
          <input
            type='search'
            id='search'
            onChange={(e) => handleOnChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Tìm kiếm'
            className='
            w-full rounded-full
            bg-neutral-secondary-medium
            border border-default-medium 
            py-2.5 pl-9 pr-20
            text-sm text-heading
            placeholder:text-body
            shadow-xs
            focus:border-brand
            focus:ring-2 focus:ring-brand/30
            outline-none
          '
          />
        </form>
      </div>
      {/* List chats */}
      {data.map((item, index) => (
        <Card
          key={index}
          idx={index}
          data={item}
          picked={index === chatIdx}
          switchChat={updateChatIdx}
        />
      ))}
    </div>
  );
};

export default AsideChat;
