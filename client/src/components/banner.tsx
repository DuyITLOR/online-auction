import { CircleChevronLeft, CircleChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Dữ liệu phù hợp với Auction Platform
const banners = [
  {
    id: 1,
    title: 'Săn Đồ Độc - Giá Cực Sốc',
    description:
      'Tham gia đấu giá ngay để sở hữu những món đồ cổ, hàng hiệu và vật phẩm sưu tầm quý hiếm với mức giá khởi điểm hấp dẫn.',
    image: '/banner1.webp',
  },
  {
    id: 2,
    title: 'Đấu Giá Trực Tiếp 24/7',
    description:
      'Trải nghiệm cảm giác hồi hộp từng giây phút. Đặt giá thầu theo thời gian thực và chiến thắng những món hời.',
    image: '/banner1.webp',
  },
  {
    id: 3,
    title: 'Biến Tài Sản Thành Tiền Mặt',
    description: 'Bạn có món đồ giá trị? Đăng ký trở thành người bán ngay hôm nay để tiếp cận hàng triệu nhà sưu tầm.',
    image: '/banner1.webp',
  },
];

export default function Banner() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextBanner = () => {
    setIndex((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleStartShopping = () => {
    navigate('/products');
  };

  const banner = banners[index];

  return (
    <section className='relative bg-slate-200 py-10 px-10 md:py-20 md:px-20 flex flex-col-reverse md:flex-row items-center justify-between overflow-hidden mx-4 md:mx-10 mt-5 rounded-xl mb-8'>
      {/* Phần Text */}
      <div className='w-full md:w-1/2 transition-all duration-500 ease-in-out z-10'>
        <p className='text-3xl md:text-5xl font-bold mb-4 text-slate-800 leading-tight'>{banner.title}</p>
        <p className='text-base md:text-lg mb-6 max-w-md text-slate-600'>{banner.description}</p>
        <button
          onClick={handleStartShopping}
          className='bg-green-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-green-700 transition shadow-lg'
        >
          Khám phá ngay
        </button>
      </div>

      <div className='w-full md:w-1/2 flex justify-center items-center mb-6 md:mb-0'>
        <img
          src={banner.image}
          alt={banner.title}
          className='w-full max-w-sm md:max-w-md object-contain drop-shadow-xl transition-transform duration-500 ease-in-out hover:scale-105'
        />
      </div>

      <button
        onClick={prevBanner}
        className='absolute left-2 top-1/2 -translate-y-1/2  hover:bg-white/80 p-2 rounded-full transition z-20'
      >
        <CircleChevronLeft className='w-6 h-6 md:w-8 md:h-8 stroke-slate-700' />
      </button>
      <button
        onClick={nextBanner}
        className='absolute right-2 top-1/2 -translate-y-1/2  hover:bg-white/80 p-2 rounded-full transition z-20'
      >
        <CircleChevronRight className='w-6 h-6 md:w-8 md:h-8 stroke-slate-700 stroke-2' />
      </button>

      <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20'>
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2.5 w-2.5 rounded-full transition-all ${i === index ? 'bg-green-600 w-8' : 'bg-slate-400'}`}
          />
        ))}
      </div>
    </section>
  );
}
