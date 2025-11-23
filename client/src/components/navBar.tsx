import React, { useState, useRef } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const [productType, setProductType] = useState(0);
  const closeTimeout = useRef(1);

  const handleMouseEnter = (productIndex: number) => {
    setProductType(productIndex);
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => setOpen(false), 200);
  };

  const productTypes = [
    {
      name: 'Điện tử',
      thumbnail: 'https://i.ebayimg.com/images/g/LNIAAeSweRlpDc2p/s-l2400.jpg',
      items: [
        { value: 'phone', display: 'Điện thoại' },
        { value: 'laptop', display: 'Laptop' },
        { value: 'tablet', display: 'Tablet' },
        { value: 'watch', display: 'Đồng hồ' },
        { value: 'facility', display: 'Đồ gia dụng' },
      ],
    },
    {
      name: 'Thời trang',
      thumbnail: 'https://i.ebayimg.com/images/g/ai4AAeSwsVtpDdIv/s-l2400.jpg',
      items: [
        { value: 'shirt', display: 'Áo sơ mi' },
        { value: 'pants', display: 'Quần' },
        { value: 'shoes', display: 'Giày' },
        { value: 'bag', display: 'Túi xách' },
        { value: 'hat', display: 'Mũ' },
      ],
    },
    {
      name: 'Thể thao',
      thumbnail: 'https://i.ebayimg.com/images/g/VJIAAeSwrdZpDdJh/s-l2400.jpg',
      items: [
        { value: 'bicycle', display: 'Xe đạp' },
        { value: 'treadmill', display: 'Máy chạy bộ' },
        { value: 'dumbbell', display: 'Tạ tay' },
        { value: 'ball', display: 'Bóng' },
        { value: 'yoga', display: 'Thảm Yoga' },
      ],
    },
    {
      name: 'Sức khỏe',
      thumbnail: 'https://i.ebayimg.com/images/g/XbIAAeSwO9ppDdmD/s-l2400.jpg',
      items: [
        { value: 'vitamin', display: 'Vitamin & Khoáng chất' },
        { value: 'protein', display: 'Bột Protein' },
        { value: 'mask', display: 'Khẩu trang' },
        { value: 'thermometer', display: 'Nhiệt kế' },
        { value: 'firstaid', display: 'Bộ sơ cứu' },
      ],
    },
    {
      name: 'Đặc biệt',
      thumbnail: 'https://i.ebayimg.com/images/g/e98AAeSwfzxpDdne/s-l2400.jpg',
      items: [
        { value: 'gift', display: 'Quà tặng' },
        { value: 'limited', display: 'Sản phẩm giới hạn' },
        { value: 'holiday', display: 'Mùa lễ hội' },
        { value: 'exclusive', display: 'Hàng độc quyền' },
        { value: 'bundle', display: 'Combo khuyến mãi' },
      ],
    },
  ];

  return (
    <div className='flex items-center justify-center gap-20 mt-3'>
      <Link
        className='text-base font-medium font-sans hover:underline hover:text-sky-800'
        to={'/products'}
        onMouseEnter={() => handleMouseEnter(0)}
        onMouseLeave={handleMouseLeave}
      >
        <div className='flex items-end gap-2'>
          <span>Điện tử</span>
          <ChevronDown className='w-4 h-4' />
        </div>
      </Link>

      <Link
        className='text-base font-medium font-sans hover:underline hover:text-sky-800'
        to={'/products'}
        onMouseEnter={() => handleMouseEnter(1)}
        onMouseLeave={handleMouseLeave}
      >
        <div className='flex items-end gap-2'>
          <span>Thời Trang</span>
          <ChevronDown className='w-4 h-4' />
        </div>
      </Link>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Link
            className='text-base font-medium font-sans hover:underline hover:text-sky-800'
            to={'/products'}
            onMouseEnter={() => handleMouseEnter(2)}
            onMouseLeave={handleMouseLeave}
          >
            <div className='flex items-end gap-2'>
              <span>Thể thao</span>
              <ChevronDown className='w-4 h-4' />
            </div>
          </Link>
        </PopoverTrigger>

        <PopoverContent
          onMouseEnter={() => handleMouseEnter(productType)}
          onMouseLeave={handleMouseLeave}
          className='relative bg-white p-5 flex justify-between overflow-hidden mx-10 rounded-xl mb-8 w-4xl border-gray-300'
        >
          <div className='w-[200px] transition-all duration-500 ease-in-out flex flex-col gap-2 text-gray-900 ml-10'>
            <p className='text-sm font-semibold'>{productTypes[productType].name}</p>
            <div className='border-t border-t-gray-300' />
            {productTypes[productType].items.map((item) => (
              <Link className='text-sm' to={`/${item.value}`}>
                {item.display}
              </Link>
            ))}
          </div>

          <img
            src={productTypes[productType].thumbnail}
            className='w-2/3 transition-transform duration-500 ease-in-out'
            alt='electronics'
          />
        </PopoverContent>
      </Popover>

      <Link
        className='text-base font-medium font-sans hover:underline hover:text-sky-800'
        to={'/products'}
        onMouseEnter={() => handleMouseEnter(3)}
        onMouseLeave={handleMouseLeave}
      >
        <div className='flex items-end gap-2'>
          <span>Sức khỏe</span>
          <ChevronDown className='w-4 h-4' />
        </div>
      </Link>

      <Link
        className='text-base font-medium font-sans hover:underline hover:text-sky-800'
        to={'/products'}
        onMouseEnter={() => handleMouseEnter(4)}
        onMouseLeave={handleMouseLeave}
      >
        <div className='flex items-end gap-2'>
          <span>Đặc biệt</span>
          <ChevronDown className='w-4 h-4' />
        </div>
      </Link>
    </div>
  );
};

export default NavBar;
