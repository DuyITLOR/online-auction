import { Heart } from 'lucide-react';
import SideBar from '../../components/product/sideBar';
import SortBar from '../../components/product/sortBar';
import { useContext, useEffect, useState } from 'react';
import type { Category, Product, WatchList } from '../../libs/types/types';
import { getAllProduct } from '../../api/product';
import { getCategories } from '../../api/category';
import { Link, useSearchParams } from 'react-router-dom';
import Pagination from '../../components/pagination';
import { ProductContext } from '../../libs/contexts/product.context';

const convertDay = (date: string) => {
  const now = new Date();
  const endDate = new Date(date);
  const diffTime = Math.abs(endDate.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const ProductList = () => {
  const { watchList, toggleWatchList } = useContext(ProductContext);
  const isLike = (id: string) => {
    return watchList.some((item: WatchList) => item.productId === id);
  };

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  // pagination

  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPage, setTotalPage] = useState(1);

  // handle params
  const page = parseInt(searchParams.get('page') || '1', 10);
  const categoryId = searchParams.get('categoryId') || '';
  const q = searchParams.get('q') || '';
  const sortType = searchParams.get('sort') || '';
  const coursePerPage = '6';

  useEffect(() => {
    const fetchAllProduct = async () => {
      setLoading1(true);

      const products = await getAllProduct({ page, limit: coursePerPage, categoryId, sort: sortType, q });
      setProducts(products.data);
      setTotalPage(products.totalPage);
      setLoading1(false);
    };

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
      setLoading2(false);
    };

    fetchAllProduct();
    fetchCategories();
  }, [page, categoryId, sortType, q]);

  const handlePage = (page: string) => {
    const next = new URLSearchParams(searchParams);
    if (!page) {
      next.delete('page');
    } else {
      next.set('page', page);
    }
    setSearchParams(next);
  };

  return (
    <>
      {loading2 && <div className='loader' />}
      {!loading2 && (
        <div>
          <div className='flex mx-10 mb-10'>
            <SideBar categories={categories} />

            <div className='flex flex-col ml-5 mt-10 w-full mr-4'>
              <SortBar />

              {loading1 ? (
                <div className='flex items-center justify-center py-20 w-6xl min-h-screen'>
                  <div className='animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent'></div>
                </div>
              ) : (
                <div className='flex flex-col justify-between'>
                  <div className='grid grid-cols-3 gap-5 mt-3'>
                    {products.map((item) => (
                      <Link
                        to={`/product/${item.id}`}
                        key={item.id}
                        className='flex flex-col gap-2 border border-gray-200 rounded-md px-3 py-2 h-fit w-97 relative cursor-pointer z-0'
                      >
                        <img src={item?.images?.[0]?.url} alt={item.title} className='w-full h-40 object-cover mb-2' />
                        <p className='font-semibold text-xl line-clamp-1'>{item.title}</p>

                        <span className='font-semibold text-2xl'>
                          {Number(item?.currentPrice).toLocaleString()} VND
                        </span>

                        <span className=' text-gray-700 text-sm'>
                          {' '}
                          Mua ngay: {Number(item?.buyNowPrice).toLocaleString()} VND
                        </span>

                        <div className='border-t border-gray-300 mt-2 mb-2' />

                        <div className='flex items-center justify-between text-sm'>
                          <span>Lượt ra giá: </span>
                          <span>{item?.countbids}</span>
                        </div>

                        <div className='flex items-center justify-between text-sm'>
                          <span>Người bán: </span>
                          <span>{item.seller.fullname}</span>
                        </div>

                        <Heart
                          onClick={(e) => {
                            e.preventDefault();
                            toggleWatchList(item?.id);
                          }}
                          className={`w-10 h-10 ${
                            isLike(item?.id) ? 'stroke-0 fill-red-600' : 'stroke-2'
                          } absolute right-1 top-1  bg-white hover:bg-gray-100 p-2 rounded-full`}
                        />

                        <div className='w-20 h-7 text-sm bg-gray-800 text-white absolute left-1 top-1 px-2 py-1 rounded-md'>
                          {convertDay(item.endAt)} Ngày
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Pagination page={page} totalPage={totalPage} onPageChange={handlePage} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductList;
