import Header from '../../components/header';
import { Heart } from 'lucide-react';
import Rating from '../../components/rating';
import SideBar from '../../components/product/sideBar';
import SortBar from '../../components/product/sortBar';

const products = [
  {
    id: 1,
    name: 'Chia Harvester / JBOD Kit | Up to 44x 3.5" HDDs! | Custom Frame, Cables, & PSU',
    price: 1000000,
    buyNowPrice: 1500000,
    endTime: '2025-12-31T23:59:59Z',
    totalBids: 10,
    thumbnail: 'https://picsum.photos/id/1011/600/400',
    isLike: false,
    seller: 'Nguyen Van A',
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Dell PowerEdge R720 Server | Dual Xeon E5 | 128GB RAM | Ready for Virtualization',
    price: 850000,
    buyNowPrice: 1200000,
    endTime: '2025-12-20T18:00:00Z',
    totalBids: 5,
    thumbnail: 'https://picsum.photos/id/1025/600/400',
    isLike: false,
    seller: 'Tran Van B',
    rating: 4.2,
  },
  {
    id: 3,
    name: 'NVIDIA RTX 3080 Founders Edition | 10GB GDDR6X | Excellent Condition',
    price: 2500000,
    buyNowPrice: 3000000,
    endTime: '2025-11-30T20:00:00Z',
    totalBids: 18,
    thumbnail: 'https://picsum.photos/id/1035/600/400',
    isLike: false,
    seller: 'Le Thi C',
    rating: 4.8,
  },
  {
    id: 4,
    name: 'Seagate IronWolf 10TB NAS HDD | 7200RPM | 256MB Cache | Enterprise Grade',
    price: 500000,
    buyNowPrice: 900000,
    endTime: '2025-10-15T12:00:00Z',
    totalBids: 3,
    thumbnail: 'https://picsum.photos/id/1041/600/400',
    isLike: false,
    seller: 'Pham D',
    rating: 3.9,
  },
  {
    id: 5,
    name: 'ASUS ROG Strix B550-F Gaming Motherboard | AM4 | PCIe 4.0 | RGB Sync',
    price: 700000,
    buyNowPrice: 1100000,
    endTime: '2025-09-22T08:30:00Z',
    totalBids: 12,
    thumbnail: 'https://picsum.photos/id/1050/600/400',
    isLike: false,
    seller: 'Nguyen E',
    rating: 4.1,
  },
  {
    id: 6,
    name: 'Intel Core i9-12900K Processor | 16 Cores | Up to 5.2GHz | Unlocked',
    price: 3200000,
    buyNowPrice: 3800000,
    endTime: '2025-08-10T21:00:00Z',
    totalBids: 25,
    thumbnail: 'https://picsum.photos/id/1062/600/400',
    isLike: false,
    seller: 'Tran F',
    rating: 4.7,
  },
  {
    id: 7,
    name: 'Corsair RM850x 80+ Gold Power Supply | Fully Modular | Silent Fan',
    price: 420000,
    buyNowPrice: 700000,
    endTime: '2025-07-05T09:00:00Z',
    totalBids: 2,
    thumbnail: 'https://picsum.photos/id/1074/600/400',
    isLike: false,
    seller: 'Le G',
    rating: 3.8,
  },
  {
    id: 8,
    name: 'Samsung 980 PRO NVMe SSD 1TB | PCIe 4.0 | Up to 7000MB/s',
    price: 960000,
    buyNowPrice: 1500000,
    endTime: '2025-06-28T16:45:00Z',
    totalBids: 7,
    thumbnail: 'https://picsum.photos/id/1084/600/400',
    isLike: false,
    seller: 'Pham H',
    rating: 4.0,
  },
  {
    id: 9,
    name: 'HP Z840 Workstation | Dual Xeon E5 | 64GB DDR4 ECC | 1TB SSD',
    price: 1800000,
    buyNowPrice: 2500000,
    endTime: '2025-05-12T11:30:00Z',
    totalBids: 14,
    thumbnail: 'https://picsum.photos/id/109/600/400',
    isLike: false,
    seller: 'Do I',
    rating: 4.6,
  },
  {
    id: 10,
    name: 'Synology DS920+ NAS | Quad-Core CPU | 4-Bay | Ideal for Home & Office Storage',
    price: 290000,
    buyNowPrice: 600000,
    endTime: '2025-04-01T22:10:00Z',
    totalBids: 4,
    thumbnail: 'https://picsum.photos/id/110/600/400',
    isLike: false,
    seller: 'Vo J',
    rating: 3.7,
  },
];

const convertDay = (date: string) => {
  const now = new Date();
  const endDate = new Date(date);
  const diffTime = Math.abs(endDate.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const ProductList = () => {
  return (
    <>
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
                <img src={item.thumbnail} alt={item.name} className='w-full h-40 object-cover mb-2' />
                <p className='font-semibold text-xl line-clamp-2'>{item.name}</p>

                {Rating(item.rating)}
                <span className='font-semibold text-2xl'>{item.price.toLocaleString()} VND</span>

                <span className=' text-gray-700 text-sm'> Mua ngay: {item.buyNowPrice.toLocaleString()} VND</span>

                <div className='border-t border-gray-300 mt-2 mb-2' />

                <div className='flex items-center justify-between text-sm'>
                  <span>Lượt ra giá: </span>
                  <span>{item.totalBids}</span>
                </div>

                <div className='flex items-center justify-between text-sm'>
                  <span>Người bán: </span>
                  <span>{item.seller}</span>
                </div>

                <Heart
                  className={`w-10 h-10 ${
                    item.isLike ? 'stroke-0 fill-red-600' : 'stroke-2'
                  } absolute right-1 top-1  bg-white hover:bg-gray-100 p-2 rounded-full`}
                />

                <div className='w-20 h-7 text-sm bg-gray-800 text-white absolute left-1 top-1 px-2 py-1 rounded-md'>
                  {convertDay(item.endTime)} Ngày
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductList;
