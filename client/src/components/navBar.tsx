/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useMemo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import type { Category } from '../libs/types/types';

const THUMBNAIL_MAP: Record<string, string> = {
  'Điện tử': 'https://i.ebayimg.com/images/g/LNIAAeSweRlpDc2p/s-l2400.jpg',
  'Thời trang': 'https://i.ebayimg.com/images/g/ai4AAeSwsVtpDdIv/s-l2400.jpg',
  'Thể thao': 'https://i.ebayimg.com/images/g/VJIAAeSwrdZpDdJh/s-l2400.jpg',
  'Sức khỏe': 'https://i.ebayimg.com/images/g/XbIAAeSwO9ppDdmD/s-l2400.jpg',
  'Đặc biệt': 'https://i.ebayimg.com/images/g/e98AAeSwfzxpDdne/s-l2400.jpg',
};

const DropdownItem = ({ data, onMouseLeaveParent }: { data: any; onMouseLeaveParent: () => void }) => {
  const [open, setOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | number>(0);

  const handleMouseEnter = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current as ReturnType<typeof setTimeout>);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setOpen(false);
      onMouseLeaveParent();
    }, 200);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className=' outline-0!' asChild>
        <div
          className='text-base font-medium font-sans hover:underline hover:text-sky-800'
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className='flex items-end gap-2'>
            <span>{data.name}</span>
            <ChevronDown className='w-4 h-4' />
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className='relative bg-white p-5 flex justify-between overflow-hidden mx-10 rounded-xl mb-8 w-4xl border-gray-300'
      >
        <div className='w-[200px] transition-all duration-500 ease-in-out flex flex-col gap-2 text-gray-900 ml-10'>
          <p className='text-sm font-semibold'>{data.name}</p>
          <div className='border-t border-t-gray-300' />
          {data.items.map((item: { value: string; display: string }) => (
            <Link key={item.value} className='text-sm hover:text-sky-600' to={`/products?categoryId=${item.value}`}>
              {item.display}
            </Link>
          ))}
        </div>

        <img
          src={data.thumbnail}
          className='w-2/3 transition-transform duration-500 ease-in-out object-cover'
          alt={data.name}
        />
      </PopoverContent>
    </Popover>
  );
};

const NavBar = ({ categories }: { categories: Record<string, Category & { children: Category[] }> }) => {
  const mappedCategories = useMemo(() => {
    return Object.values(categories)
      .filter((categories) => categories.children && categories.children.length > 0)
      .map((cat) => {
        return {
          name: cat.name,
          thumbnail: THUMBNAIL_MAP[cat.name] || 'no',
          items: cat.children.map((child) => ({
            value: child.id,
            display: child.name,
          })),
        };
      });
  }, [categories]);
  return (
    <div className='flex items-center justify-center gap-20 mt-3'>
      {mappedCategories.map((product, index) => (
        <DropdownItem key={index} data={product} onMouseLeaveParent={() => {}} />
      ))}
    </div>
  );
};

export default NavBar;
