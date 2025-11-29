import { TextAlignJustify } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Category } from '../../libs/types/types';
import { getCategories } from '../../api/category';

const SideBar = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories();

      const categoriesMap: Record<string, Category & { children: Category[] }> = {};

      categories.forEach((cat: Category) => {
        categoriesMap[cat.id] = { ...cat, children: [] };
      });

      categories.forEach((cat: Category) => {
        if (cat.parentId) {
          categoriesMap[cat.parentId].children.push(categoriesMap[cat.id]);
        }
      });

      const rootCategories = Object.values(categoriesMap).filter((cat) => !cat.parentId);
      setCategories(rootCategories);

      console.log(categories[0].children);
      setLoading(false);
    };

    fetchCategories();
  }, []);
  return (
    <>
      {loading && <div className='loader' />}

      {!loading && (
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
                    <Link to={`/?category=${item.id}`} className='text-sm text-gray-600 hover:text-teal-600'>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default SideBar;
