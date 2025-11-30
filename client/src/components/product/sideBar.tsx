import { TextAlignJustify } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Category } from '../../libs/types/types';

const SideBar = ({ categories }: { categories: Category[] }) => {
  return (
    <>
      <div className='sticky top-30 z-10 flex flex-col justify-start gap-5 border border-gray-200 rounded-md px-3 py-2 mt-5 h-fit w-54'>
        <div className='flex items-center gap-2'>
          <TextAlignJustify className='w-4 h-4' />
          <p className='font-bold text-lg'>Danh mục</p>
        </div>
        {categories.map((category) => (
          <div key={category.id} className='flex flex-col gap-2'>
            <p className='font-semibold'>{category.name}</p>
            <ul className='flex flex-col gap-1 ml-2'>
              {category?.children?.map((item, index) => (
                <li key={index}>
                  <Link to={`/products?categoryId=${item.id}`} className='text-sm text-gray-600 hover:text-teal-600'>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
};

export default SideBar;
