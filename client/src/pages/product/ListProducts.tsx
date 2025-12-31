/* eslint-disable @typescript-eslint/no-explicit-any */
import { Heart, ChevronRight, Clock, Gavel, ChevronDown, Filter, SearchX } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ProductContext } from '../../libs/contexts/product.context';
import { getAllProduct } from '../../api/product';
import { getCategories } from '../../api/category';
import type { Category, Product } from '../../libs/types/types';
import Pagination from '../../components/pagination';
// Giả sử bạn có UI components, nếu không có thể dùng thẻ div thường
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import SortBar from '../../components/product/sortBar';

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

const getTimeStatusStyle = (date: string) => {
  const now = new Date();
  const end = new Date(date);
  const diff = end.getTime() - now.getTime();
  const diffHours = diff / (1000 * 60 * 60);

  if (diff <= 0) return 'bg-gray-200 text-gray-500';
  if (diffHours < 24) return 'bg-red-100 text-red-600 animate-pulse';
  if (diffHours < 72) return 'bg-orange-100 text-orange-600';
  return 'bg-emerald-100 text-emerald-600';
};

const formatTimeLeft = (date: string) => {
  const now = new Date();
  const end = new Date(date);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return 'Đã kết thúc';

  const diffDays = diff / (1000 * 60 * 60 * 24);
  const diffHours = diff / (1000 * 60 * 60);
  const diffMinutes = diff / (1000 * 60);

  if (diffDays > 3) {
    return `${end.getDate()}/${end.getMonth() + 1}`;
  } else if (diffDays >= 1) {
    return `${Math.ceil(diffDays)} ngày`;
  } else if (diffHours >= 1) {
    return `${Math.ceil(diffHours)} giờ`;
  } else {
    return `${Math.ceil(diffMinutes)} phút`;
  }
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
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const searchQuery = searchParams.get('q') || '';
  const [priceRange, setPriceRange] = useState({
    min: minPriceParam,
    max: maxPriceParam,
  });

  useEffect(() => {
    setPriceRange({
      min: minPriceParam,
      max: maxPriceParam,
    });
  }, [minPriceParam, maxPriceParam]);

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
      try {
        const productRes = await getAllProduct({
          page,
          limit: '9',
          categoryId,
          sort: sortType,
          minPrice: minPriceParam,
          maxPrice: maxPriceParam,
          q: searchQuery,
          isBidder: 'true',
        });
        setProducts(productRes.data);
        setTotalPage(productRes.totalPage);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
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
  }, [page, categoryId, sortType, minPriceParam, maxPriceParam, searchQuery]);

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

  const handleApplyPriceFilter = () => {
    const next = new URLSearchParams(searchParams);

    next.set('page', '1');

    if (priceRange.min) next.set('minPrice', priceRange.min);
    else next.delete('minPrice');

    if (priceRange.max) next.set('maxPrice', priceRange.max);
    else next.delete('maxPrice');

    setSearchParams(next);
  };

  const formatCurrency = (value: string | number) => {
    if (!value) return '';
    const cleanValue = String(value).replace(/\D/g, '');
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const rawValue = value.replace(/\./g, '');
    if (name === 'Max') {
      setPriceRange({ ...priceRange, max: rawValue });
    } else {
      setPriceRange({ ...priceRange, min: rawValue });
    }
  };

  return (
    <div className='bg-[#F8F9FA] min-h-screen font-sans text-gray-800'>
      <div className='container mx-auto px-4 lg:px-8 py-6'>
        <div className='flex flex-col lg:flex-row gap-8'>
          <div className='w-full lg:w-64 shrink-0 space-y-8'>
            <div>
              <h3 className='font-bold text-xs text-gray-900 uppercase tracking-wider mb-4'>Danh mục</h3>

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
              <h3 className='font-bold text-xs text-gray-900 uppercase tracking-wider mb-4'>Khoảng giá</h3>
              <div className='flex items-center gap-2 mb-4'>
                <div className='relative w-full'>
                  <span className='absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs'>$</span>
                  <input
                    name='Min'
                    type='text'
                    placeholder='Min'
                    value={formatCurrency(priceRange.min)}
                    onChange={handleChange}
                    className='w-full border border-gray-200 rounded px-2 pl-4 py-1.5 text-sm bg-white focus:outline-none focus:border-teal-500 transition-colors'
                  />
                </div>
                <span className='text-gray-400'>-</span>
                <div className='relative w-full'>
                  <span className='absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs'>$</span>
                  <input
                    name='Max'
                    type='text'
                    placeholder='Max'
                    value={formatCurrency(priceRange.max)}
                    onChange={handleChange}
                    className='w-full border border-gray-200 rounded px-2 pl-4 py-1.5 text-sm bg-white focus:outline-none focus:border-teal-500 transition-colors'
                  />
                </div>
              </div>

              <button
                onClick={handleApplyPriceFilter}
                className='w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2 rounded transition-colors flex items-center justify-center gap-2'
              >
                <Filter size={14} />
                ÁP DỤNG
              </button>
            </div>
          </div>

          <div className='flex-1'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4'>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>Danh sách sản phẩm</h1>
              </div>

              <SortBar />
            </div>
            {loading ? (
              <div className='flex items-center justify-center h-128'>
                <div className='animate-spin rounded-full h-10 w-10 border-4 border-teal-500 border-t-transparent'></div>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
                  {products.map((item) => {
                    const timeStatus = convertTime(item.endAt);

                    return (
                      <Link
                        to={`/product/${item.id}`}
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

                          <div
                            className={`absolute top-2 left-2 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm ${getTimeStatusStyle(
                              item?.endAt
                            )}`}
                          >
                            <Clock size={12} />
                            {formatTimeLeft(item?.endAt)}
                          </div>
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
                      </Link>
                    );
                  })}
                </div>

                <div className='mt-10 flex justify-end'>
                  <Pagination page={page} totalPage={totalPage} onPageChange={handlePage} />
                </div>
              </>
            ) : (
              <div className='flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in zoom-in duration-500'>
                <div className='bg-gray-100 p-6 rounded-full mb-6 relative'>
                  <SearchX className='w-12 h-12 text-gray-400' />
                  <div className='absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm'>
                    <div className='w-4 h-4 bg-red-400 rounded-full animate-pulse'></div>
                  </div>
                </div>

                <h3 className='text-xl font-bold text-gray-900 mb-2'>Không tìm thấy sản phẩm nào</h3>

                <p className='text-gray-500 max-w-md mb-8 leading-relaxed'>
                  Chúng tôi không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại. Hãy thử điều chỉnh khoảng giá hoặc
                  danh mục khác.
                </p>
              </div>
            )}
            x
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
