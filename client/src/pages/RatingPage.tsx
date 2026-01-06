/* eslint-disable @typescript-eslint/no-explicit-any */
import { Loader2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Avatar, AvatarImage } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';

import { useEffect, useState } from 'react';
import { getSession } from '../libs/session';
import { type Ratings } from '../libs/types/types';
import { getAllRaters, getAllRatingsByUserId } from '../api/rating';
import { calculateRating } from '../libs/utils';
import { ProfileHeader } from '@/components/profile/header';
import { useParams } from 'react-router-dom';
import Pagination from '@/components/pagination';

const RatingPage = () => {
  const { id } = useParams();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [raters, setRaters] = useState<Ratings[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPages] = useState(1);

  const [pos, setPos] = useState(0);
  const [neg, setNeg] = useState(0);

  useEffect(() => {
    async function fetchSession() {
      const sess = await getSession();
      setSession(sess);
    }
    fetchSession();
  }, []);

  useEffect(() => {
    const fetchRaters = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await getAllRatingsByUserId({ id: id, token: session.token, page });
          setRaters(data.ratings);
          setTotalPages(data.totalPage);
          setPos(data.positiveCount);
          setNeg(data.negativeCount);
        } else {
          const data = await getAllRaters({ token: session.token });
          setRaters(data.ratings);
          setPos(data.pos);
          setNeg(data.neg);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRaters();
  }, [session, page]);

  const handlePageChange = (newPage: string) => {
    setPage(Number(newPage));
  };

  return (
    <>
      <div className='mx-18 mt-5 mb-5'>
        <ProfileHeader session={session} />

        <div className='w-full flex flex-col gap-6 mt-5 mb-5'>
          <div className='bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6'>
            <div className='flex flex-col items-start gap-1 w-full md:w-1/3'>
              <h3 className='text-lg font-bold text-gray-800'>Độ uy tín</h3>
              <div className='flex items-baseline gap-2'>
                <span className='text-5xl font-extrabold text-emerald-600'>
                  {Number(calculateRating(pos, neg)) * 10}%
                </span>
                <span className='text-gray-500 font-medium'>Đánh giá tích cực</span>
              </div>
              <p className='text-sm text-gray-400'>Dựa trên {pos + neg} lượt đánh giá gần nhất</p>
            </div>
            <div className='flex flex-col gap-3 w-full md:w-2/3 border-l border-gray-100 pl-0 md:pl-6'>
              <div className='flex items-center gap-3'>
                <ThumbsUp className='w-5 h-5 text-emerald-500' />
                <div className='w-full'>
                  <div className='flex justify-between text-sm mb-1'>
                    <span className='font-semibold text-gray-700'>Hài lòng</span>
                    <span className='text-gray-500'>{pos}</span>
                  </div>
                  <Progress value={(Number(pos) / (Number(pos) + Number(neg))) * 100} className='h-2 bg-gray-100' />
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <ThumbsDown className='w-5 h-5 text-rose-500' />
                <div className='w-full'>
                  <div className='flex justify-between text-sm mb-1'>
                    <span className='font-semibold text-gray-700'>Không hài lòng</span>
                    <span className='text-gray-500'>{neg}</span>
                  </div>
                  <Progress value={(Number(neg) / (Number(pos) + Number(neg))) * 100} className='h-2 bg-gray-100' />
                </div>
              </div>
            </div>
          </div>

          {loading && (
            <div className='p-8 flex flex-col mt-5 items-center justify-center gap-3'>
              <Loader2 className='w-10 h-10 text-teal-500 animate-spin' />
            </div>
          )}

          {!loading && (
            <>
              <div className='flex flex-col gap-4'>
                <h4 className='text-base font-bold text-gray-800 uppercase tracking-wide'>Đánh giá nhận được</h4>
                {raters.map((item: Ratings) => (
                  <div
                    key={item.id}
                    className='bg-white border border-gray-200 rounded-lg p-5 flex flex-col md:flex-row gap-4 transition-all hover:shadow-md'
                  >
                    <div className='flex flex-col justify-between gap-3 w-full md:w-48'>
                      <div className='flex items-center gap-3'>
                        <Avatar>
                          <AvatarImage src={item?.rater?.avtUrl} />
                        </Avatar>
                        <div className='flex flex-col'>
                          <p className='font-semibold text-gray-900 text-sm'>{item?.rater?.fullname}</p>
                        </div>
                      </div>
                    </div>
                    <div className='grow border-l-0 md:border-l border-gray-100 pl-0 md:pl-4 flex flex-col justify-between'>
                      <div>
                        <div className='flex items-center justify-between mb-2'>
                          <p className='text-sm font-medium text-gray-500 uppercase'>{item.product.title}</p>
                          {item.value === 1 ? (
                            <div className='flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100'>
                              <ThumbsUp className='w-3.5 h-3.5 fill-current' />
                              <span className='text-xs font-bold'>Hài lòng</span>
                            </div>
                          ) : (
                            <div className='flex items-center gap-1 text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100'>
                              <ThumbsDown className='w-3.5 h-3.5 fill-current' />
                              <span className='text-xs font-bold'>Không hài lòng</span>
                            </div>
                          )}
                        </div>
                        <p className='text-gray-700 text-sm leading-relaxed'>{item?.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className='mt-8 flex justify-end'>
                <Pagination page={page} totalPage={totalPage} onPageChange={handlePageChange} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default RatingPage;
