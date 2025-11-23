import { TextAlignJustify } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 1,
    name: 'Điện tử',
    items: ['Điện thoại', 'Máy tính bảng', 'Laptop'],
  },
  {
    id: 2,
    name: 'Thời trang',
    items: ['Quần áo', 'Giày dép', 'Phụ kiện'],
  },
  {
    id: 3,
    name: 'Thể thao',
    items: ['Dụng cụ thể thao', 'Quần áo thể thao', 'Giày thể thao'],
  },
  {
    id: 4,
    name: 'Phương tiện',
    items: ['Ô tô', 'Xe máy', 'Xe đạp'],
  },
];

const SideBar = () => {
  return (
    <div className='sticky top-30 z-50 flex flex-col justify-start gap-5 border border-gray-200 rounded-md px-3 py-2 mt-10 h-fit w-48'>
      <div className='flex items-center gap-2'>
        <TextAlignJustify className='w-4 h-4' />
        <p className='font-bold text-lg'>Danh mục</p>
      </div>
      {categories.map((category) => (
        <div key={category.id} className='flex flex-col gap-2'>
          <p className='font-semibold'>{category.name}</p>
          <ul className='flex flex-col gap-1 ml-2'>
            {category.items.map((item, index) => (
              <li key={index}>
                <Link to={`/?category=${item}`} className='text-sm text-gray-600 hover:text-teal-600'>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SideBar;
