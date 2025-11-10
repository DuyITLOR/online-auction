import { Heart } from 'lucide-react';

const products = [
  {
    id: 1,
    name: 'Chia Harvester / JBOD Kit | Up to 44x 3.5" HDDs! | Custom Frame, Cables, & PSU',
    price: 7892737,
    isLike: false,
    thumbnail: 'https://i.ebayimg.com/images/g/JBsAAeSwsttpDQoH/s-l1600.webp',
  },
  {
    id: 2,
    name: 'Thermaltake Micro ATX Mini ITX PC Case Dual Tempered Glass Compact Tower Black',
    price: 13999000,
    isLike: false,
    thumbnail: 'https://i.ebayimg.com/images/g/O68AAeSwiC1pBjeg/s-l1600.webp',
  },
  {
    id: 3,
    name: 'NVIDIA GeForce RTX 4090 Founders Edition | 24GB GDDR6X',
    price: 44990000,
    isLike: true,
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 4,
    name: 'Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz RGB RAM Kit',
    price: 4390000,
    isLike: false,
    thumbnail: 'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 5,
    name: 'Meta Quest 3S 256GB (Refurbished)',
    price: 4990000,
    isLike: true,
    thumbnail: 'https://i.ebayimg.com/images/g/E-4AAOSwFsJoGMRU/s-l1600.webp',
  },
  {
    id: 6,
    name: 'UMIDIGI G9 5G 6GB+128GB 6.75 Android 14 Unlocked 18W Octa Core Smartphone Good',
    price: 10990000,
    isLike: false,
    thumbnail: 'https://i.ebayimg.com/images/g/1K4AAOSwQY5mqHz6/s-l1600.webp',
  },
  {
    id: 7,
    name: '[Near MINT] Nikon AF NIKKOR 80-200mm F2.8 ED Zoom Telephoto Lens From JAPAN',
    price: 3190000,
    isLike: true,
    thumbnail: 'https://i.ebayimg.com/images/g/elAAAeSwZilpDuiw/s-l1600.webp',
  },
  {
    id: 8,
    name: 'Lian Li O11 Dynamic EVO Case | Tempered Glass | White Edition',
    price: 3990000,
    isLike: false,
    thumbnail: 'https://images.unsplash.com/photo-1593642634367-d91a135587b5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 9,
    name: 'Noctua NH-D15 Chromax Black | Dual Tower CPU Cooler',
    price: 2990000,
    isLike: false,
    thumbnail: 'https://images.unsplash.com/photo-1620207418302-439b387441b0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 10,
    name: 'Raspberry Pi 5 (8GB) Developer Kit | Cooling Fan + Power Adapter',
    price: 2590000,
    isLike: true,
    thumbnail: 'https://images.unsplash.com/photo-1587202372775-98927aab2cae?auto=format&fit=crop&w=1200&q=80',
  },
];

const DisplayProduct = () => {
  return (
    <div className='flex flex-col mx-10 mb-5 gap-10'>
      <p className='font-bold text-2xl'>Sản phẩm gần đây</p>
      <div className='flex flex-1 items-center gap-3 overflow-x-auto scroll-container h-[400px] pb-5'>
        {products.map((item) => (
          <div key={item.id} className='flex flex-col gap-2 min-w-[250px] relative'>
            <img src={item.thumbnail} className='rounded-md w-[250px] h-[250px] object-cover' />
            <p className='line-clamp-2'>{item.name}</p>
            <span className='font-semibold text-xl'>{item.price.toLocaleString()} VND</span>

            <Heart
              className={`w-10 h-10 ${
                item.isLike ? 'stroke-0 fill-red-600' : 'stroke-2'
              } absolute right-1 top-1  bg-white hover:bg-gray-100 p-2 rounded-full`}
            />
          </div>
        ))}
      </div>

      <p className='font-bold text-2xl'>Sắp kết thúc</p>
      <div className='flex flex-1 items-center gap-3 overflow-x-auto scroll-container h-[400px] pb-5'>
        {products.map((item) => (
          <div key={item.id} className='flex flex-col gap-2 min-w-[250px] relative'>
            <img src={item.thumbnail} className='rounded-md w-[250px] h-[250px] object-cover' />
            <p className='line-clamp-2'>{item.name}</p>
            <span className='font-semibold text-xl'>{item.price.toLocaleString()} VND</span>

            <Heart
              className={`w-10 h-10 ${
                item.isLike ? 'stroke-0 fill-red-600' : 'stroke-2'
              } absolute right-1 top-1  bg-white hover:bg-gray-100 p-2 rounded-full`}
            />
          </div>
        ))}
      </div>

      <p className='font-bold text-2xl'> Nhiều lượt ra giá nhất</p>
      <div className='flex flex-1 items-center gap-3 overflow-x-auto scroll-container h-[400px] pb-5'>
        {products.map((item) => (
          <div key={item.id} className='flex flex-col gap-2 min-w-[250px] relative'>
            <img src={item.thumbnail} className='rounded-md w-[250px] h-[250px] object-cover' />
            <p className='line-clamp-2'>{item.name}</p>
            <span className='font-semibold text-xl'>{item.price.toLocaleString()} VND</span>

            <Heart
              className={`w-10 h-10 ${
                item.isLike ? 'stroke-0 fill-red-600' : 'stroke-2'
              } absolute right-1 top-1  bg-white hover:bg-gray-100 p-2 rounded-full`}
            />
          </div>
        ))}
      </div>

      <p className='font-bold text-2xl'>Giá cao nhất</p>
      <div className='flex flex-1 items-center gap-3 overflow-x-auto scroll-container h-[400px] pb-5'>
        {products.map((item) => (
          <div key={item.id} className='flex flex-col gap-2 min-w-[250px] relative'>
            <img src={item.thumbnail} className='rounded-md w-[250px] h-[250px] object-cover' />
            <p className='line-clamp-2'>{item.name}</p>
            <span className='font-semibold text-xl'>{item.price.toLocaleString()} VND</span>

            <Heart
              className={`w-10 h-10 ${
                item.isLike ? 'stroke-0 fill-red-600' : 'stroke-2'
              } absolute right-1 top-1  bg-white hover:bg-gray-100 p-2 rounded-full`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayProduct;
