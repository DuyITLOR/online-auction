import { Avatar } from '@radix-ui/react-avatar';

import { AvatarFallback, AvatarImage } from '../ui/avatar';
import { Calendar, CircleMinus, CirclePlus } from 'lucide-react';
import type { User } from '../../libs/types/types';

interface UserProps {
  seller: User | undefined;
}

const review = [
  {
    id: 1,
    name: 'Trần Minh Anh',
    rating: 5,
    type: 'positive',
    review: 'Sản phẩm chất lượng, đóng gói cẩn thận',
    date: '2025-01-12',
  },
  {
    id: 2,
    name: 'Nguyễn Văn B',
    rating: 4,
    type: 'negative',
    review: 'Hàng đẹp, giao nhanh nhưng hộp hơi móp',
    date: '2025-01-10',
  },
  {
    id: 3,
    name: 'Lê Thị C',
    rating: 5,
    type: 'positive',
    review: 'Hiệu năng tuyệt vời, chơi game mượt',
    date: '2024-12-22',
  },
  {
    id: 4,
    name: 'Phạm Quốc D',
    rating: 3,
    type: 'negative',
    review: 'Main hoạt động ổn nhưng giao hàng hơi chậm',
    date: '2024-12-18',
  },
  {
    id: 5,
    name: 'Đỗ Thu E',
    rating: 4,
    type: 'positive',
    review: 'Ổ nhanh nhưng giá hơi cao',
    date: '2025-01-02',
  },
  {
    id: 6,
    name: 'Võ Nhật F',
    rating: 5,
    type: 'positive',
    review: 'CPU cực mạnh, render video nhanh',
    date: '2025-01-05',
  },
  {
    id: 7,
    name: 'Nguyễn Văn G',
    rating: 4,
    type: 'positive',
    review: 'Ổ chạy êm, phù hợp cho NAS',
    date: '2024-12-27',
  },
  {
    id: 8,
    name: 'Trần Bích H',
    rating: 5,
    type: 'positive',
    review: 'Server mạnh, chạy ảo hoá ngon',
    date: '2025-01-08',
  },
];

const Review = ({ seller }: UserProps) => {
  if (!seller) return <div className='loader' />;
  return (
    <div className='bg-gray-100 rounded-xl w-full px-10 py-5 flex'>
      <div className='flex flex-col w-[600px]'>
        <p className='text-2xl font-semibold mb-2'>Người bán</p>
        <div className='flex justify-start'>
          <Avatar>
            <AvatarImage src={'/gg-logo.svg'} alt='User Avatar' className='w-35 h-35' />
            <AvatarFallback>{'Thanh Dang'.charAt(0)?.toUpperCase() || '?'}</AvatarFallback>
          </Avatar>

          <div className='flex items-center justify-between w-full'>
            <div className='ml-5'>
              <p className='text-xl font-semibold'> {seller?.fullname} </p>
              <div className='flex items-center gap-3'>
                <p className=' text-gray-500 underline'>Đánh giá: 10</p>
                <p className=' text-gray-500 underline'>Đã bán: 1000</p>
              </div>
            </div>
          </div>
        </div>

        <div className='flex mt-3 items-start gap-2 font-semibold'>
          <Calendar className='w-5 h-5' />
          <p>Tham gia: 10/12/2024</p>
        </div>

        <button className='border border-gray-300 px-2 font-semibold h-10 w-7/8 rounded-2xl mt-5 bg-teal-500 text-white'>
          Sản phẩm khác
        </button>

        <button className='border border-teal-500 text-teal-500 px-1 font-semibold h-10 w-7/8 rounded-2xl mt-3'>
          Liên hệ
        </button>
      </div>

      <div className='flex flex-col w-full border-l border-l-gray-300 pl-10'>
        <p className='text-2xl font-semibold mb-4'>Phản hồi</p>
        <div className='flex flex-col gap-3 mt-2 w-full'>
          {review.map((item) => (
            <div
              key={item.id}
              className='border border-gray-300 rounded-md px-4 py-4 w-full flex items-start justify-between'
            >
              <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-2'>
                  {item.type === 'positive' ? (
                    <CirclePlus className='w-6 h-6 text-gray-100 fill-green-600 stroke-2' />
                  ) : (
                    <CircleMinus className='w-6 h-6 text-gray-100 fill-red-600 stroke-2' />
                  )}
                  <p className='font-semibold'>{item.name}</p>
                </div>

                <p>{item.review}</p>
              </div>

              <p className='text-sm text-gray-500'>{item.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Review;
