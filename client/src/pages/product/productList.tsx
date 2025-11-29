import Header from '../../components/header';
import { Heart } from 'lucide-react';
import SideBar from '../../components/product/sideBar';
import SortBar from '../../components/product/sortBar';
import { useEffect, useState } from 'react';
import type { Product } from '../../libs/types/types';
import { getAllProduct } from '../../api/product';

// const products = [
//   {
//     id: 1,
//     title: 'Chia Harvester / JBOD Kit | Up to 44x 3.5" HDDs!',
//     currentPrice: 1000000,
//     startPrice: 1000000,
//     stepPrice: 100000,
//     buyNowPrice: 1500000,
//     endAt: '2025-12-31T23:59:59Z',
//     totalBids: 10,
//     thumbnail: 'https://picsum.photos/id/1011/600/400',
//     isLike: false,
//     seller: 'Nguyen Van A',
//     rating: 4.5,
//   },
//   {
//     id: 2,
//     title: 'Dell PowerEdge R720 Server | Dual Xeon E5 | 128GB RAM',
//     currentPrice: 850000,
//     startPrice: 800000,
//     stepPrice: 50000,
//     buyNowPrice: 1200000,
//     endAt: '2025-12-20T18:00:00Z',
//     totalBids: 5,
//     thumbnail: 'https://picsum.photos/id/1025/600/400',
//     isLike: false,
//     seller: 'Tran Van B',
//     rating: 4.2,
//   },
//   {
//     id: 3,
//     title: 'NVIDIA RTX 3080 Founders Edition | 10GB GDDR6X',
//     currentPrice: 2500000,
//     startPrice: 2400000,
//     stepPrice: 100000,
//     buyNowPrice: 3000000,
//     endAt: '2025-11-30T20:00:00Z',
//     totalBids: 18,
//     thumbnail: 'https://picsum.photos/id/1035/600/400',
//     isLike: false,
//     seller: 'Le Thi C',
//     rating: 4.8,
//   },
//   {
//     id: 4,
//     title: 'Seagate IronWolf 10TB NAS HDD | 7200RPM',
//     currentPrice: 500000,
//     startPrice: 450000,
//     stepPrice: 30000,
//     buyNowPrice: 900000,
//     endAt: '2025-10-15T12:00:00Z',
//     totalBids: 3,
//     thumbnail: 'https://picsum.photos/id/1041/600/400',
//     isLike: false,
//     seller: 'Pham D',
//     rating: 3.9,
//   },
//   {
//     id: 5,
//     title: 'ASUS ROG Strix B550-F Gaming Motherboard | AM4',
//     currentPrice: 700000,
//     startPrice: 650000,
//     stepPrice: 50000,
//     buyNowPrice: 1100000,
//     endAt: '2025-09-22T08:30:00Z',
//     totalBids: 12,
//     thumbnail: 'https://picsum.photos/id/1050/600/400',
//     isLike: false,
//     seller: 'Nguyen E',
//     rating: 4.1,
//   },
//   {
//     id: 6,
//     title: 'Intel Core i9-12900K Processor | 16 Cores',
//     currentPrice: 3200000,
//     startPrice: 3000000,
//     stepPrice: 150000,
//     buyNowPrice: 3800000,
//     endAt: '2025-08-10T21:00:00Z',
//     totalBids: 25,
//     thumbnail: 'https://picsum.photos/id/1062/600/400',
//     isLike: false,
//     seller: 'Tran F',
//     rating: 4.7,
//   },
//   {
//     id: 7,
//     title: 'Corsair RM850x 80+ Gold Power Supply | Modular',
//     currentPrice: 420000,
//     startPrice: 400000,
//     stepPrice: 20000,
//     buyNowPrice: 700000,
//     endAt: '2025-07-05T09:00:00Z',
//     totalBids: 2,
//     thumbnail: 'https://picsum.photos/id/1074/600/400',
//     isLike: false,
//     seller: 'Le G',
//     rating: 3.8,
//   },
//   {
//     id: 8,
//     title: 'Samsung 980 PRO NVMe SSD 1TB | PCIe 4.0',
//     currentPrice: 960000,
//     startPrice: 900000,
//     stepPrice: 50000,
//     buyNowPrice: 1500000,
//     endAt: '2025-06-28T16:45:00Z',
//     totalBids: 7,
//     thumbnail: 'https://picsum.photos/id/1084/600/400',
//     isLike: false,
//     seller: 'Pham H',
//     rating: 4.0,
//   },
//   {
//     id: 9,
//     title: 'HP Z840 Workstation | Dual Xeon E5 | 64GB DDR4',
//     currentPrice: 1800000,
//     startPrice: 1700000,
//     stepPrice: 80000,
//     buyNowPrice: 2500000,
//     endAt: '2025-05-12T11:30:00Z',
//     totalBids: 14,
//     thumbnail: 'https://picsum.photos/id/109/600/400',
//     isLike: false,
//     seller: 'Do I',
//     rating: 4.6,
//   },
//   {
//     id: 10,
//     title: 'Synology DS920+ NAS | Quad-Core | 4-Bay',
//     currentPrice: 290000,
//     startPrice: 250000,
//     stepPrice: 20000,
//     buyNowPrice: 600000,
//     endAt: '2025-04-01T22:10:00Z',
//     totalBids: 4,
//     thumbnail: 'https://picsum.photos/id/110/600/400',
//     isLike: false,
//     seller: 'Vo J',
//     rating: 3.7,
//   },
// ];

const convertDay = (date: string) => {
  const now = new Date();
  const endDate = new Date(date);
  const diffTime = Math.abs(endDate.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProduct = async () => {
      const products = await getAllProduct();
      setProducts(products);
      setLoading(false);
      return products;
    };

    fetchAllProduct();
  }, []);

  return (
    <>
      {loading && <div className='loader' />}

      {!loading && (
        <div>
          <Header />

          <div className='flex mx-10'>
            <SideBar />

            <div className='flex flex-col ml-5 mt-10'>
              <SortBar />
              <div className='grid grid-cols-3 gap-5 mt-3'>
                {products.map((item) => (
                  <div
                    key={item.id}
                    className='flex flex-col gap-2 border border-gray-200 rounded-md px-3 py-2 h-fit w-95 relative cursor-pointer z-0'
                  >
                    <img src={item?.images?.[0].url} alt={item.title} className='w-full h-40 object-cover mb-2' />
                    <p className='font-semibold text-xl line-clamp-2'>{item.title}</p>

                    <span className='font-semibold text-2xl'>{item?.currentPrice.toLocaleString()} VND</span>

                    <span className=' text-gray-700 text-sm'> Mua ngay: {item?.buyNowPrice.toLocaleString()} VND</span>

                    <div className='border-t border-gray-300 mt-2 mb-2' />

                    <div className='flex items-center justify-between text-sm'>
                      <span>Lượt ra giá: </span>
                      <span>10</span>
                    </div>

                    <div className='flex items-center justify-between text-sm'>
                      <span>Người bán: </span>
                      <span>{item.seller.fullname}</span>
                    </div>

                    <Heart
                      className={`w-10 h-10 ${'stroke-0 fill-red-600'} absolute right-1 top-1  bg-white hover:bg-gray-100 p-2 rounded-full`}
                    />

                    <div className='w-20 h-7 text-sm bg-gray-800 text-white absolute left-1 top-1 px-2 py-1 rounded-md'>
                      {convertDay(item.endAt)} Ngày
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductList;
