import { useState, useRef, useMemo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight, LayoutGrid, Sparkles } from 'lucide-react';
import type { Category } from '../libs/types/types';

const ListItem = ({ to, title }: { to: string; title: string }) => {
  return (
    <Link
      to={to}
      className='group flex items-center justify-between rounded-lg p-3 text-sm font-medium transition-all hover:bg-sky-50 hover:text-sky-700 text-slate-600'
    >
      <span>{title}</span>
      <ArrowRight className='h-4 w-4 opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 text-sky-600' />
    </Link>
  );
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
    }, 150);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className='outline-none focus:outline-none h-full' asChild>
        <div
          className='relative cursor-pointer px-4 py-3 group h-full flex items-center'
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className='flex items-center gap-1.5 z-10 relative'>
            <span
              className={`text-sm font-semibold transition-colors duration-200 ${
                open ? 'text-sky-700' : 'text-slate-600 group-hover:text-slate-900'
              }`}
            >
              {data.name}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                open ? 'rotate-180 text-sky-700' : 'text-slate-400 group-hover:text-slate-600'
              }`}
            />
          </div>

          <span
            className={`absolute bottom-0 left-0 h-0.5 w-full bg-sky-600 transform transition-transform duration-300 origin-left ${
              open ? 'scale-x-100' : 'scale-x-0'
            }`}
          />
        </div>
      </PopoverTrigger>

      <PopoverContent
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sideOffset={0}
        align='center'
        className='w-[650px] p-0 bg-white border border-slate-100 shadow-2xl rounded-xl overflow-hidden animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200'
      >
        <div className='flex flex-row h-full min-h-[150px]'>
          <div className='w-1/3 bg-slate-50 p-6 flex flex-col justify-between relative overflow-hidden border-r border-slate-100'>
            <div className='absolute -top-10 -left-10 w-40 h-40 bg-sky-200 rounded-full blur-3xl opacity-20'></div>
            <div className='absolute bottom-0 right-0 w-32 h-32 bg-indigo-200 rounded-full blur-3xl opacity-20'></div>

            <div className='relative z-10'>
              <h4 className='font-bold text-xl text-slate-900 mb-2'>{data.name}</h4>
              <p className='text-xs text-slate-500 leading-relaxed'>
                Khám phá bộ sưu tập {data.name.toLowerCase()} mới nhất và bán chạy nhất của chúng tôi.
              </p>
            </div>
          </div>

          <div className='w-2/3 p-6 bg-white'>
            <div className='flex items-center gap-2 mb-4'>
              <span className='text-xs font-semibold text-slate-400 uppercase tracking-wide px-3'>
                Danh mục phổ biến
              </span>
            </div>

            <div className='grid grid-cols-2 gap-x-2 gap-y-1'>
              {data.items.map((item: { value: string; display: string }) => (
                <ListItem key={item.value} to={`/products?categoryId=${item.value}`} title={item.display} />
              ))}
            </div>
          </div>
        </div>
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
          items: cat.children.map((child) => ({
            value: child.id,
            display: child.name,
          })),
        };
      });
  }, [categories]);

  return (
    // Bỏ sticky top-0, dùng relative để nó cuộn theo trang
    <div className='w-full bg-white border-b border-gray-200 relative z-40'>
      <div className='flex items-center justify-center h-16 gap-2'>
        {mappedCategories.map((product, index) => (
          <DropdownItem key={index} data={product} onMouseLeaveParent={() => {}} />
        ))}
      </div>
    </div>
  );
};

export default NavBar;
