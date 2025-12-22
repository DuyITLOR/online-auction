/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'; // Sửa đường dẫn nếu cần
import { Button } from '../../components/ui/button';
import { Heart, MapPin, MessageCircle, Plus, Search, Star, Store, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { type Product } from '../../libs/types/types'; // Import type của bạn

// --- Mock Data (Xóa khi tích hợp API thật) ---
// Hàm format thời gian đơn giản
const formatTimeLeft = (dateStr: string) => {
  const end = new Date(dateStr).getTime();
  const now = new Date().getTime();
  const diff = end - now;
  if (diff <= 0) return 'Đã kết thúc';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return days > 0 ? `${days} ngày nữa` : 'Sắp kết thúc';
};

const ShopPage = () => {
  const { sellerId } = useParams(); // Lấy ID người bán từ URL
  const [activeTab, setActiveTab] = useState<'all' | 'auction' | 'sold'>('all');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [sellerInfo, setSellerInfo] = useState<any>(null);

  // Giả lập Fetch Data
  useEffect(() => {
    // Gọi API lấy thông tin Seller và Product by SellerId ở đây
    const fetchData = async () => {
      setLoading(true);
      try {
        // await getSellerInfo(sellerId);
        // await getProductsBySeller(sellerId);

        // Mock data
        setTimeout(() => {
          setSellerInfo({
            id: sellerId,
            fullname: 'Minh Hieu Store',
            avtUrl: 'https://github.com/shadcn.png',
            joinDate: '2023-10-20',
            rating: 4.8,
            totalReviews: 120,
            followers: 450,
            description: 'Chuyên các sản phẩm công nghệ, laptop, điện thoại cũ giá tốt. Uy tín là vàng.',
            address: 'Thủ Đức, TP.HCM',
          });
          setProducts([
            {
              id: '1',
              title: 'MacBook Pro M1 2020 16GB/512GB Like New',
              currentPrice: 18500000,
              buyNowPrice: 20000000,
              images: [
                {
                  url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop',
                },
              ],
              endAt: '2025-12-30T00:00:00.000Z',
              countbids: 12,
            } as any,
            {
              id: '2',
              title: 'iPhone 13 Pro Max 128GB Blue',
              currentPrice: 12000000,
              buyNowPrice: 15000000,
              images: [
                {
                  url: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?q=80&w=1000&auto=format&fit=crop',
                },
              ],
              endAt: '2025-12-25T00:00:00.000Z',
              countbids: 5,
            } as any,
            // Thêm các sản phẩm khác...
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [sellerId]);

  if (loading)
    return (
      <div className='min-h-screen flex justify-center items-center'>
        <div className='loader'></div>
      </div>
    );

  return (
    <div className='bg-gray-50 min-h-screen pb-10'>
      {/* --- 1. SHOP HEADER SECTION --- */}
      <div className='bg-white border-b border-gray-200 shadow-sm'>
        <div className='container mx-auto px-4 py-6'>
          <div className='flex flex-col md:flex-row gap-6 items-start md:items-center'>
            {/* Avatar & Basic Info */}
            <div className='flex items-center gap-5 flex-1'>
              <div className='relative'>
                <Avatar className='w-24 h-24 border-4 border-white shadow-md'>
                  <AvatarImage src={sellerInfo?.avtUrl} />
                  <AvatarFallback>{sellerInfo?.fullname[0]}</AvatarFallback>
                </Avatar>
                <div className='absolute -bottom-2 -right-2 bg-teal-500 text-white text-[10px] px-2 py-0.5 rounded-full border-2 border-white font-bold flex items-center gap-1'>
                  <Store size={12} /> SHOP
                </div>
              </div>

              <div className='flex flex-col gap-1'>
                <h1 className='text-2xl font-bold text-gray-800 flex items-center gap-2'>
                  {sellerInfo?.fullname}
                  <UserCheck className='w-5 h-5 text-blue-500 fill-blue-100' />
                </h1>
                <p className='text-gray-500 text-sm line-clamp-1 max-w-md'>{sellerInfo?.description}</p>

                <div className='flex items-center gap-4 mt-1 text-sm text-gray-600'>
                  <div className='flex items-center gap-1 text-yellow-500 font-semibold'>
                    <Star className='w-4 h-4 fill-yellow-500' /> {sellerInfo?.rating}
                    <span className='text-gray-400 font-normal'>({sellerInfo?.totalReviews} đánh giá)</span>
                  </div>
                  <div className='w-[1px] h-4 bg-gray-300'></div>
                  <div className='flex items-center gap-1'>
                    <UserCheck className='w-4 h-4' /> {sellerInfo?.followers} Người theo dõi
                  </div>
                </div>
              </div>
            </div>

            {/* Actions & Extra Info */}
            <div className='flex flex-col gap-3 w-full md:w-auto'>
              <div className='flex gap-2'>
                <Button className='flex-1 bg-white border border-teal-500 text-teal-600 hover:bg-teal-50 gap-2'>
                  <Plus size={18} /> Theo dõi
                </Button>
                <Button className='flex-1 bg-teal-600 hover:bg-teal-700 text-white gap-2'>
                  <MessageCircle size={18} /> Chat ngay
                </Button>
              </div>
              <div className='text-xs text-gray-500 flex items-center justify-end gap-1'>
                <MapPin size={14} /> {sellerInfo?.address} • Tham gia {sellerInfo?.joinDate}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 2. MAIN CONTENT --- */}
      <div className='container mx-auto px-4 mt-6'>
        <div className='flex flex-col md:flex-row gap-6'>
          {/* Sidebar Filter (Optional - Left Side) */}
          <div className='w-full md:w-64 flex-shrink-0 hidden md:block'>
            <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100 sticky top-24'>
              <h3 className='font-bold text-gray-800 mb-4 flex items-center gap-2'>
                <Search size={18} /> Tìm trong Shop
              </h3>
              <input
                className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-teal-500'
                placeholder='Tên sản phẩm...'
              />

              <div className='border-t border-gray-100 my-4'></div>

              <h3 className='font-bold text-gray-800 mb-2'>Danh mục</h3>
              <ul className='space-y-2 text-sm text-gray-600'>
                <li className='cursor-pointer hover:text-teal-600 font-medium text-teal-600'>Tất cả sản phẩm</li>
                <li className='cursor-pointer hover:text-teal-600'>Điện tử & Công nghệ</li>
                <li className='cursor-pointer hover:text-teal-600'>Thời trang</li>
                <li className='cursor-pointer hover:text-teal-600'>Đồ gia dụng</li>
              </ul>
            </div>
          </div>

          {/* Product List (Right Side) */}
          <div className='flex-1'>
            {/* Tabs */}
            <div className='bg-white rounded-xl p-2 shadow-sm border border-gray-100 mb-4 flex gap-2 overflow-x-auto'>
              {['all', 'auction', 'sold'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                    activeTab === tab
                      ? 'bg-teal-50 text-teal-700 border border-teal-200'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {tab === 'all' && 'Tất cả sản phẩm'}
                  {tab === 'auction' && 'Đang đấu giá'}
                  {tab === 'sold' && 'Đã bán'}
                </button>
              ))}
            </div>

            {/* Grid Products */}
            {products.length === 0 ? (
              <div className='text-center py-20'>
                <p className='text-gray-500'>Shop chưa có sản phẩm nào.</p>
              </div>
            ) : (
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {products.map((item) => (
                  <Link
                    to={`/product/${item.id}`}
                    key={item.id}
                    className='group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-teal-300 flex flex-col'
                  >
                    {/* Image */}
                    <div className='relative aspect-square overflow-hidden bg-gray-100'>
                      <img
                        src={item.images[0].url}
                        alt={item.title}
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                      />
                      <div className='absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm hover:bg-red-50 cursor-pointer'>
                        <Heart className='w-4 h-4 text-gray-400 hover:fill-red-500 hover:text-red-500 transition-colors' />
                      </div>
                      <div className='absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-2'>
                        <p className='text-white text-xs font-medium flex items-center gap-1'>
                          ⏱ {formatTimeLeft(item.endAt)}
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className='p-3 flex flex-col gap-2 flex-1'>
                      <h3 className='text-sm font-medium text-gray-800 line-clamp-2 min-h-[2.5rem] group-hover:text-teal-600 transition-colors'>
                        {item.title}
                      </h3>

                      <div className='mt-auto'>
                        <div className='flex items-end justify-between'>
                          <div>
                            <p className='text-xs text-gray-500'>Giá hiện tại</p>
                            <p className='text-base font-bold text-teal-600'>
                              {Number(item.currentPrice).toLocaleString()}₫
                            </p>
                          </div>
                        </div>
                        <div className='flex justify-between items-center mt-2 text-xs text-gray-500 border-t pt-2 border-gray-100'>
                          <span>{item.countbids} lượt trả giá</span>
                          <span className='bg-gray-100 px-2 py-0.5 rounded text-gray-600'>
                            Mua ngay: {Number(item.buyNowPrice).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
