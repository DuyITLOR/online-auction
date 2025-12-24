/* eslint-disable @typescript-eslint/no-explicit-any */
import { Heart, ChevronRight, Clock, Gavel, ChevronDown } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ProductContext } from '../../libs/contexts/product.context';
import { getAllProduct } from '../../api/product';
import { getCategories } from '../../api/category';
import type { Category, Product } from '../../libs/types/types';
import Pagination from '../../components/pagination';
// Giả sử bạn có UI components, nếu không có thể dùng thẻ div thường
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';

const convertTime = (date: string) => {
  const now = new Date();
  const endDate = new Date(date);
  const diffTime = endDate.getTime() - now.getTime();
  const diffHours = diffTime / (1000 * 60 * 60);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffTime < 0) return { text: 'Ended', type: 'ended' };
  if (diffHours < 24) return { text: `${Math.ceil(diffHours)}h left`, type: 'urgent' };
  return { text: `${diffDays} days`, type: 'normal' };
};

const ProductList = () => {
  const { watchList, toggleWatchList } = useContext(ProductContext);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Params & Pagination
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPage, setTotalPage] = useState(1);
  const [categories, setCategories] = useState<(Category & { children: Category[] })[]>([]);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const categoryId = searchParams.get('categoryId') || '';
  const sortType = searchParams.get('sort') || '';
  const [expandedCatId, setExpandedCatId] = useState<string | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const map: Record<string, boolean> = {};
    watchList.forEach((item) => {
      map[item.productId] = true;
    });
    setLikedMap(map);
  }, [watchList]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const productRes = await getAllProduct({ page, limit: '9', categoryId, sort: sortType });
      setProducts(productRes.data);
      setTotalPage(productRes.totalPage);

      setLoading(false);
    };

    const fetchCategories = async () => {
      const cats = await getCategories();
      const categoriesMap: Record<string, Category & { children: Category[] }> = {};

      cats.forEach((cat: Category) => {
        categoriesMap[cat.id] = { ...cat, children: [] };
      });

      cats.forEach((cat: Category) => {
        if (cat.parentId) {
          categoriesMap[cat.parentId].children.push(categoriesMap[cat.id]);
        }
      });

      const rootCategories = Object.values(categoriesMap).filter((c) => !c.parentId);
      setCategories(rootCategories);
    };

    fetchData();
    fetchCategories();
  }, [page, categoryId, sortType]);

  useEffect(() => {
    if (categoryId && categories.length > 0) {
      const parent = categories.find((p) => p.children.some((c) => c.id === categoryId));
      if (parent) {
        setExpandedCatId(parent.id);
      }
    }
  }, [categoryId, categories]);

  const handlePage = (newPage: string) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', newPage);
    setSearchParams(next);
  };

  return (
    <div className='bg-[#F8F9FA] min-h-screen font-sans text-gray-800'>
      <div className='container mx-auto px-4 lg:px-8 py-6'>
        <div className='flex flex-col lg:flex-row gap-8'>
          <div className='w-full lg:w-64 shrink-0 space-y-8'>
            <div>
              <h3 className='font-bold text-xs text-gray-900 uppercase tracking-wider mb-4'>Categories</h3>

              <div className='flex flex-col gap-2'>
                <div
                  onClick={() => {
                    const next = new URLSearchParams(searchParams);
                    next.delete('categoryId');
                    next.set('page', '1');
                    setSearchParams(next);
                    setExpandedCatId(null);
                  }}
                  className={`cursor-pointer text-sm font-medium flex items-center justify-between transition-colors ${
                    !categoryId ? 'text-teal-600' : 'text-gray-600 hover:text-teal-600'
                  }`}
                >
                  <span>Tất cả sản phẩm</span>
                  {!categoryId && <ChevronRight size={14} />}
                </div>

                <div className='flex flex-col gap-2 mt-2'>
                  {categories.map((parentCat) => {
                    const isExpanded = expandedCatId === parentCat.id;

                    const isChildActive = parentCat.children?.some((child) => child.id === categoryId);

                    return (
                      <div key={parentCat.id} className='flex flex-col'>
                        <div
                          onClick={() => {
                            setExpandedCatId((prev) => (prev === parentCat.id ? null : parentCat.id));
                          }}
                          className={`flex items-center justify-between cursor-pointer text-sm py-1.5 transition-colors ${
                            isExpanded || isChildActive
                              ? 'text-teal-800 font-bold'
                              : 'text-gray-600 hover:text-teal-600'
                          }`}
                        >
                          <span>{parentCat.name}</span>
                          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </div>

                        {isExpanded && parentCat.children && parentCat.children.length > 0 && (
                          <div className='flex flex-col gap-1 mt-1 ml-2 pl-3 border-l-2 border-gray-100 animate-in slide-in-from-left-1 duration-200'>
                            {parentCat.children.map((childCat) => {
                              const isActive = categoryId === childCat.id;
                              return (
                                <div
                                  key={childCat.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const next = new URLSearchParams(searchParams);
                                    next.set('categoryId', childCat.id);
                                    next.set('page', '1');
                                    setSearchParams(next);
                                  }}
                                  className={`text-sm cursor-pointer py-1 transition-colors ${
                                    isActive ? 'text-teal-600 font-bold' : 'text-gray-500 hover:text-teal-600'
                                  }`}
                                >
                                  {childCat.name}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <h3 className='font-bold text-xs text-gray-900 uppercase tracking-wider mb-4'>Price Range</h3>
              <div className='flex items-center gap-2 mb-4'>
                <input
                  type='text'
                  value='$ 10'
                  className='w-full border border-gray-200 rounded px-2 py-1.5 text-sm bg-white'
                  readOnly
                />
                <span className='text-gray-400'>-</span>
                <input
                  type='text'
                  value='$ 1500'
                  className='w-full border border-gray-200 rounded px-2 py-1.5 text-sm bg-white'
                  readOnly
                />
              </div>
              <div className='h-1 bg-gray-200 rounded-full relative'>
                <div className='absolute left-0 w-1/2 h-full bg-teal-400 rounded-full'></div>
                <div className='absolute left-1/2 w-3 h-3 bg-teal-400 rounded-full -top-1 border-2 border-white shadow'></div>
              </div>
            </div>

            <div>
              <h3 className='font-bold text-xs text-gray-900 uppercase tracking-wider mb-4'>Condition</h3>
            </div>
          </div>

          <div className='flex-1'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4'>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>Danh sách sản phẩm</h1>
              </div>

              <div className='flex items-center gap-3'>
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-gray-500'>Sort by:</span>
                  <select
                    className='border-none bg-white text-sm font-medium text-gray-900 focus:ring-0 cursor-pointer'
                    onChange={(e) => {
                      const next = new URLSearchParams(searchParams);
                      next.set('sort', e.target.value);
                      setSearchParams(next);
                    }}
                  >
                    <option value='relevance'>Relevance</option>
                    <option value='price_asc'>Price: Low to High</option>
                    <option value='price_desc'>Price: High to Low</option>
                    <option value='ending_soon'>Ending Soon</option>
                  </select>
                </div>
              </div>
            </div>

            {loading ? (
              <div className='flex items-center justify-center h-64'>
                <div className='animate-spin rounded-full h-10 w-10 border-4 border-teal-500 border-t-transparent'></div>
              </div>
            ) : (
              <>
                <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
                  {products.map((item) => {
                    const timeStatus = convertTime(item.endAt);

                    return (
                      <div
                        key={item.id}
                        className='bg-white rounded-xl p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] hover:shadow-lg transition-all duration-300 group border border-gray-100'
                      >
                        <div className='relative aspect-4/3 bg-gray-50 rounded-lg overflow-hidden mb-4 flex items-center justify-center'>
                          <img
                            src={item?.images?.[0]?.url}
                            alt={item.title}
                            className='w-full h-full object-contain mix-blend-multiply p-4 group-hover:scale-105 transition-transform duration-500'
                          />

                          <button
                            onClick={(e) => {
                              e.preventDefault();

                              setLikedMap((prev) => ({
                                ...prev,
                                [item.id]: !prev[item.id],
                              }));

                              toggleWatchList(item.id);
                            }}
                            className='absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 text-gray-400 hover:text-red-500 transition-all'
                          >
                            <Heart size={16} className={likedMap[item.id] ? 'fill-red-500 text-red-500' : ''} />
                          </button>
                        </div>

                        <div>
                          <h3 className='font-bold text-gray-900 text-lg leading-tight mb-1 truncate'>{item.title}</h3>
                          <p className='text-gray-500 text-xs mb-2 truncate'>{item.category?.name || 'Electronics'}</p>

                          <div className='flex flex-col gap-2'>
                            {Number(item.buyNowPrice) > 0 && (
                              <div className='flex items-center gap-2'>
                                <p className='text-[10px] text-gray-400 uppercase font-bold tracking-wider'>Buy Now</p>
                                <p className='text-sm font-medium text-teal-700 leading-none'>
                                  {Number(item.buyNowPrice).toLocaleString()} VND
                                </p>
                              </div>
                            )}

                            <p className='text-xl font-bold text-gray-900 leading-none'>
                              {Number(item.currentPrice).toLocaleString()} VND
                            </p>
                          </div>

                          <div className='flex items-center justify-between pt-3 mt-2 border-t border-gray-100'>
                            <div className='flex items-center gap-2'>
                              <Avatar className='w-6 h-6 border border-gray-200'>
                                <AvatarImage src={item.seller?.avtUrl} />
                                <AvatarFallback className='text-[10px]'>
                                  {item.seller?.fullname?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className='text-xs font-medium text-gray-600 truncate max-w-20'>
                                {item.seller?.fullname}
                              </span>
                            </div>

                            {timeStatus.type === 'urgent' ? (
                              <div className='flex items-center gap-1.5 bg-red-50 text-red-600 px-2 py-1 rounded text-[11px] font-bold'>
                                <Clock size={12} />
                                <span>{timeStatus.text}</span>
                              </div>
                            ) : (
                              <div className='flex items-center gap-1.5 text-gray-500 text-xs font-medium'>
                                <Gavel size={14} />
                                <span>{item.countbids || 0} Bids</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className='mt-10 flex justify-end'>
                  <Pagination page={page} totalPage={totalPage} onPageChange={handlePage} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
