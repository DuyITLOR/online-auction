import { CircleChevronLeft, CircleChevronRight } from 'lucide-react';
import { useState } from 'react';

const banners = [
  {
    id: 1,
    title: 'Welcome to Our Dashboard',
    description: 'Manage your data efficiently with our modern dashboard interface.',
    image: '/banner1.svg',
  },
  {
    id: 2,
    title: 'Track Your Performance',
    description: 'Visualize metrics and insights to make better decisions.',
    image: '/banner2.svg',
  },
  {
    id: 3,
    title: 'Collaborate with Your Team',
    description: 'Stay connected and productive with real-time collaboration tools.',
    image: '/banner3.svg',
  },
];

export default function Banner() {
  const [index, setIndex] = useState(0);

  const nextBanner = () => {
    setIndex((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const banner = banners[index];

  return (
    <section className='relative bg-slate-200  py-20 px-20 flex items-center justify-between overflow-hidden mx-10 mt-5 rounded-xl mb-8'>
      <div className='transition-all duration-500 ease-in-out'>
        <h1 className='text-5xl font-bold mb-4'>{banner.title}</h1>
        <p className='text-lg mb-6 max-w-md'>{banner.description}</p>
        <button className='bg-green-300 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition'>
          Get Started
        </button>
      </div>

      <img src={'/banner1.webp'} alt={banner.title} className='w-1/3 transition-transform duration-500 ease-in-out' />

      <button
        onClick={prevBanner}
        className='absolute left-1 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full'
      >
        <CircleChevronLeft className='w-10 h-10 stroke-1' />
      </button>

      <button
        onClick={nextBanner}
        className='absolute right-1 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full'
      >
        <CircleChevronRight className='w-10 h-10 stroke-1' />
      </button>

      <div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2'>
        {banners.map((_, i) => (
          <div key={i} className={`h-2 w-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/40'}`} />
        ))}
      </div>
    </section>
  );
}
