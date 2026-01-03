/* eslint-disable @typescript-eslint/no-explicit-any */
import { Edit, Gavel, Heart, ScrollText, ShoppingBag, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Avatar, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList } from '../components/ui/tab';
import { TabsTrigger } from '@radix-ui/react-tabs';
import { Progress } from '../components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from '../components/ui/dialog';

import { useEffect, useState } from 'react';
import { getSession } from '../libs/session';
import { getStatisticProfile } from '../api/user';
import { type Ratings } from '../libs/types/types';
import { toast } from 'sonner';
import { getAllRatees, getAllRaters, updateRating } from '../api/rating';
import { calculateRating } from '../libs/utils';
import Activities from '../components/profile/tabs/activities';
import WatchProducts from '../components/profile/tabs/watchList';
import { ProfileHeader } from '@/components/profile/header';

interface statisic {
  BidCount: number;
  WatchListCount: number;
  OrderCount: number;
  RatingCount: number;
}

const Profile = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [raters, setRaters] = useState<Ratings[]>([]);
  const [ratees, setRatees] = useState<Ratings[]>([]);

  const totalReviews = raters.length;
  const positiveCount = raters.filter((r) => r.value === 1).length;
  const negativeCount = raters.filter((r) => r.value === -1).length;

  const [status, setStatus] = useState(false);
  const [comment, setComment] = useState('');
  const [statistics, setStatistics] = useState<statisic>();

  useEffect(() => {
    async function fetchSession() {
      const sess = await getSession();
      setSession(sess);
    }
    fetchSession();
  }, []);

  useEffect(() => {
    const fetchRaters = async () => {
      const data = await getAllRaters({ token: session.token });
      setRaters(data.ratings);
    };

    const fetchRatees = async () => {
      const data = await getAllRatees({ token: session.token });
      setRatees(data.ratings);
    };

    const fetchStatistic = async () => {
      try {
        setLoading(true);
        const data = await getStatisticProfile({ token: session.token });
        setStatistics(data);
      } catch (err) {
        console.error(err);
        throw err;
      } finally {
        setLoading(false);
      }
    };

    fetchStatistic();
    fetchRaters();
    fetchRatees();
  }, [session]);

  const handleUpdateRating = async (id: string, statusValue: boolean, commentValue: string) => {
    try {
      const value = statusValue ? 1 : -1;
      await updateRating({ id: id, token: session.token, value: value, comment: commentValue });
      toast.success('Cập nhật đánh giá thành công');
      const data = await getAllRatees({ token: session.token });
      setRatees(data.ratings);
    } catch (err) {
      toast.error('Cập nhật đánh giá thất bại');
      console.error(err);
    }
  };

  if (loading) return <div className='loader'></div>;

  return (
    <>
      <div className='mx-18 mt-5 mb-5'>
        <ProfileHeader session={session} />

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 mb-10'>
          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-300 group-hover:text-white transition-colors duration-300'>
                <Gavel className='w-6 h-6' />
              </div>
              <span className='text-xs font-bold px-2 py-1 bg-gray-50 text-gray-500 rounded-full'>Hoạt động</span>
            </div>
            <div>
              <span className='block text-3xl font-extrabold text-gray-900 mb-1'>{statistics?.BidCount || 0}</span>
              <span className='text-sm font-medium text-gray-500'>Lượt ra giá</span>
            </div>
          </div>
          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-300 group-hover:text-white transition-colors duration-300'>
                <Heart className='w-6 h-6' />
              </div>
              <span className='text-xs font-bold px-2 py-1 bg-gray-50 text-gray-500 rounded-full'>Quan tâm</span>
            </div>
            <div>
              <span className='block text-3xl font-extrabold text-gray-900 mb-1'>
                {statistics?.WatchListCount || 0}
              </span>
              <span className='text-sm font-medium text-gray-500'>Sản phẩm yêu thích</span>
            </div>
          </div>

          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-300 group-hover:text-white transition-colors duration-300'>
                <ShoppingBag className='w-6 h-6' />
              </div>
              <span className='text-xs font-bold px-2 py-1 bg-gray-50 text-gray-500 rounded-full'>Mua sắm</span>
            </div>
            <div>
              <span className='block text-3xl font-extrabold text-gray-900 mb-1'>{statistics?.OrderCount || 0}</span>
              <span className='text-sm font-medium text-gray-500'>Đơn hàng thành công</span>
            </div>
          </div>

          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-300 group-hover:text-white transition-colors duration-300'>
                <ScrollText className='w-6 h-6' />
              </div>
              <span className='text-xs font-bold px-2 py-1 bg-gray-50 text-gray-500 rounded-full'>Uy tín</span>
            </div>
            <div>
              <span className='block text-3xl font-extrabold text-gray-900 mb-1'>{statistics?.RatingCount || 0}</span>
              <span className='text-sm font-medium text-gray-500'>Lượt đánh giá</span>
            </div>
          </div>
        </div>

        <Tabs className='w-full' defaultValue='activity'>
          <TabsList className='grid w-full grid-cols-4'>
            <TabsTrigger
              className='data-[state=active]:bg-teal-500 font-semibold data-[state=active]:py-1 data-[state=active]:rounded-md '
              value='activity'
            >
              Hoạt động
            </TabsTrigger>
            <TabsTrigger
              className='data-[state=active]:bg-teal-500 data-[state=active]:py-1 data-[state=active]:rounded-md '
              value='wishlist'
            >
              Yêu thích
            </TabsTrigger>
            <TabsTrigger
              className='data-[state=active]:bg-teal-500 font-semibold data-[state=active]:py-1 data-[state=active]:rounded-md '
              value='review'
            >
              Đánh giá
            </TabsTrigger>
            <TabsTrigger
              className='data-[state=active]:bg-teal-500 font-semibold data-[state=active]:py-1 data-[state=active]:rounded-md '
              value='my-review'
            >
              Đã đánh giá
            </TabsTrigger>
          </TabsList>

          <TabsContent value='activity'>
            <Activities token={session?.token} />
          </TabsContent>

          <TabsContent value='wishlist'>
            <WatchProducts token={session?.token} />
          </TabsContent>

          <TabsContent value='review'>
            <div className='w-full flex flex-col gap-6 mt-5 mb-5'>
              <div className='bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6'>
                <div className='flex flex-col items-start gap-1 w-full md:w-1/3'>
                  <h3 className='text-lg font-bold text-gray-800'>Độ uy tín của Shop</h3>
                  <div className='flex items-baseline gap-2'>
                    <span className='text-5xl font-extrabold text-emerald-600'>
                      {Number(calculateRating(positiveCount, negativeCount)) * 10}%
                    </span>
                    <span className='text-gray-500 font-medium'>Đánh giá tích cực</span>
                  </div>
                  <p className='text-sm text-gray-400'>Dựa trên {totalReviews} lượt đánh giá gần nhất</p>
                </div>
                <div className='flex flex-col gap-3 w-full md:w-2/3 border-l border-gray-100 pl-0 md:pl-6'>
                  <div className='flex items-center gap-3'>
                    <ThumbsUp className='w-5 h-5 text-emerald-500' />
                    <div className='w-full'>
                      <div className='flex justify-between text-sm mb-1'>
                        <span className='font-semibold text-gray-700'>Hài lòng</span>
                        <span className='text-gray-500'>{positiveCount}</span>
                      </div>
                      <Progress
                        value={(Number(positiveCount) / (Number(positiveCount) + Number(negativeCount))) * 100}
                        className='h-2 bg-gray-100'
                      />
                    </div>
                  </div>
                  <div className='flex items-center gap-3'>
                    <ThumbsDown className='w-5 h-5 text-rose-500' />
                    <div className='w-full'>
                      <div className='flex justify-between text-sm mb-1'>
                        <span className='font-semibold text-gray-700'>Không hài lòng</span>
                        <span className='text-gray-500'>{negativeCount}</span>
                      </div>
                      <Progress
                        value={(Number(negativeCount) / (Number(positiveCount) + Number(negativeCount))) * 100}
                        className='h-2 bg-gray-100'
                      />
                    </div>
                  </div>
                </div>
              </div>

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
            </div>
          </TabsContent>

          <TabsContent value='my-review'>
            <div className='border border-gray-300 mt-5 w-full px-7 py-3 flex flex-col rounded-md'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-lg font-bold'>Lịch sử đánh giá</p>
                  <p className='text-sm font-semibold text-gray-400 mb-5'>Các đánh giá bạn đã để lại.</p>
                </div>
              </div>

              <div className='flex flex-col gap-4'>
                {ratees.map((item: Ratings) => (
                  <div
                    key={item.id}
                    className='bg-white border border-gray-200 rounded-lg p-5 flex flex-col md:flex-row gap-4 transition-all hover:shadow-md'
                  >
                    <div className='flex flex-col justify-between gap-3 w-full md:w-48'>
                      <div className='flex items-center gap-3'>
                        <Avatar>
                          <AvatarImage src={item?.ratee?.avtUrl} />
                        </Avatar>
                        <div className='flex flex-col'>
                          <p className='font-semibold text-gray-900 text-sm'>{item?.ratee?.fullname}</p>
                        </div>
                      </div>
                    </div>
                    <div className='grow border-l-0 md:border-l border-gray-100 pl-0 md:pl-4 flex flex-col justify-between'>
                      <div>
                        <div className='flex items-center justify-between mb-2'>
                          <p className='text-sm font-medium text-gray-500 uppercase'>{item.productId}</p>
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

                      <div className='mt-4 flex justify-end'>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => {
                                setStatus(item?.value === 1);
                                setComment(item?.comment ? item?.comment : '');
                              }}
                              className='text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 gap-2 transition-colors'
                            >
                              <Edit className='w-4 h-4' /> Chỉnh sửa
                            </Button>
                          </DialogTrigger>
                          <DialogContent className='min-w-[500px]'>
                            <DialogHeader>
                              <DialogTitle>Chỉnh sửa</DialogTitle>
                              <DialogDescription>Chỉnh sửa thông tin đánh giá</DialogDescription>
                            </DialogHeader>
                            <div className='flex flex-col gap-3 w-full mx-1'>
                              <div className=' p-1 rounded-lg grid grid-cols-2 gap-1'>
                                <button
                                  onClick={() => setStatus(true)}
                                  className={`flex items-center justify-center gap-2 border py-2 rounded-md text-sm font-medium transition-all ${
                                    status
                                      ? 'bg-green-50 text-green-600 shadow-sm border-green-700'
                                      : 'text-gray-500 hover:text-gray-700 border-gray-200 '
                                  }`}
                                >
                                  <ThumbsUp className='w-4 h-4' /> Hài lòng
                                </button>
                                <button
                                  onClick={() => setStatus(false)}
                                  className={`flex items-center justify-center border gap-2 py-2 rounded-md text-sm font-medium transition-all ${
                                    !status
                                      ? 'bg-red-50 text-red-600 shadow-sm border-red-700'
                                      : 'text-gray-500 hover:text-gray-700 border-gray-200 '
                                  }`}
                                >
                                  <ThumbsDown className='w-4 h-4' /> Không hài lòng
                                </button>
                              </div>
                              <textarea
                                className='w-full border border-gray-300 outline-0 px-2 py-2 h-[100px] focus:border-gray-600 rounded-md'
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                              />
                            </div>
                            <DialogFooter>
                              <DialogClose>
                                <div className='flex items-center gap-2'>
                                  <Button variant={'outline'}>Hủy</Button>
                                  <Button
                                    variant={'outline'}
                                    onClick={() => handleUpdateRating(item.id, status, comment)}
                                    className='bg-teal-700 text-white'
                                  >
                                    Chỉnh sửa
                                  </Button>
                                </div>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Profile;
