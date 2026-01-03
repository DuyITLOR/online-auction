/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useMemo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight, Menu } from 'lucide-react';
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
              className={` font-semibold transition-colors duration-200 ${
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

const MobileNav = ({ categories }: { categories: any[] }) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className='p-2 -ml-2 text-slate-600 hover:text-slate-900 lg:hidden'>
          <Menu className='h-6 w-6' />
          <span className='sr-only'>Open menu</span>
        </button>
      </SheetTrigger>
      <SheetContent side='left' className='w-[300px] sm:w-[350px] pr-0'>
        <SheetHeader className='px-1 text-left'>
          <SheetTitle className='text-lg font-bold text-slate-900'>Danh mục</SheetTitle>
        </SheetHeader>
        <div className='h-full overflow-y-auto pb-10 pr-6 mt-6'>
          <Accordion type='single' collapsible className='w-full'>
            {categories.map((cat, index) => (
              <AccordionItem key={index} value={`item-${index}`} className='border-b-slate-100'>
                <AccordionTrigger className='ml-5 text-slate-700 hover:text-sky-700 hover:no-underline py-4 font-semibold'>
                  {cat.name}
                </AccordionTrigger>
                <AccordionContent>
                  <div className='flex flex-col space-y-1 pb-2 pl-2'>
                    {cat.items.map((item: { value: string; display: string }) => (
                      <Link
                        key={item.value}
                        to={`/products?categoryId=${item.value}`}
                        onClick={() => setOpen(false)} // Đóng menu khi click
                        className='block ml-3 rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-sky-50 hover:text-sky-700 transition-colors'
                      >
                        {item.display}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// --- MAIN NAVBAR ---

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
    <div className='w-full bg-white border-b lg:border-none border-gray-200 relative z-40'>
      <div className='flex items-center h-16 px-4 lg:px-0 lg:justify-center gap-2'>
        {/* MOBILE VIEW: Hiển thị nút menu khi màn hình nhỏ */}
        <div className='lg:hidden mr-auto'>
          <MobileNav categories={mappedCategories} />
        </div>

        {/* LOGO hoặc BRAND NAME (Optional cho Mobile) */}
        <div className='lg:hidden absolute left-1/2 -translate-x-1/2 font-bold text-slate-800'>
          {/* Thêm Logo mobile ở đây nếu cần */}
        </div>

        {/* DESKTOP VIEW: Ẩn khi màn hình nhỏ (< 1024px) */}
        <div className='hidden lg:flex items-center gap-2'>
          {mappedCategories.map((product, index) => (
            <DropdownItem key={index} data={product} onMouseLeaveParent={() => {}} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
