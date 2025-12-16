import { Avatar } from '@radix-ui/react-avatar';
import { AvatarFallback, AvatarImage } from '../ui/avatar';
import { Calendar, ChevronLeft, ChevronRight, Loader2, Send, Store, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { type Comments, type User } from '../../libs/types/types';
import { getCommentsByProduct, postAnswer, postQuestion } from '../../api/comment';

interface UserProps {
  seller: User | undefined;
  productId: string;
  user: User;
  token: string | undefined;
}

function formatDate(isoString: string | undefined, options = { time: false }) {
  if (!isoString) return '';
  const d = new Date(isoString);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  if (!options.time) {
    return `${year}-${month}-${day}`;
  }

  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const ITEM_PER_PAGE = 10;

const ProductQA = ({ seller, productId, user, token }: UserProps) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [comments, setComments] = useState<Comments[]>([]);
  const [page, setCurPage] = useState(1);

  const [totalPage, setTotalPage] = useState(1);
  const [curComment, setCurComment] = useState<Comments[]>([]);
  const [hiddenAns, setHiddenAns] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchComment = async () => {
    const data = await getCommentsByProduct({ id: productId });
    setComments(data.comments);
  };

  const updatePage = () => {
    setTotalPage(Math.ceil(comments.length / ITEM_PER_PAGE) > 0 ? Math.ceil(comments.length / ITEM_PER_PAGE) : 1);
    setCurComment(comments.slice(page - 1, page - 1 + ITEM_PER_PAGE));
  };

  useEffect(() => {
    fetchComment();
  }, []);

  useEffect(() => {
    updatePage();
  }, [comments, page]);

  const handlePostQuestion = async (questionValue: string) => {
    if (!token) return;
    if (!questionValue.trim()) return;
    try {
      setQuestion('');
      await postQuestion({ id: productId, token: token, content: questionValue });
      fetchComment();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostAnswer = async (questId: string, answerValue: string) => {
    if (!token) return;
    if (!answerValue.trim()) return;
    setIsSubmitting(true);
    try {
      setQuestion('');
      await postAnswer({ questionId: questId, productId: productId, token: token, content: answerValue });
      setHiddenAns('');
      fetchComment();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = async (page: number) => {
    if (page >= 1 && page <= totalPage) {
      setCurPage(page);
    }
  };

  if (!seller) return <div className='loader' />;

  return (
    <div className='bg-gray-50 rounded-xl w-full px-6 py-8 flex gap-8 shadow-sm'>
      <div className='flex flex-col w-[350px] shrink-0'>
        <p className='text-xl font-bold mb-4 text-gray-800 uppercase border-b pb-2'>Thông tin Shop</p>

        <div className='bg-white p-4 rounded-lg border border-gray-200 shadow-sm'>
          <div className='flex items-center gap-4 mb-4'>
            <Avatar className='w-16 h-16'>
              <AvatarImage
                src={seller.avtUrl}
                alt='User Avatar'
                className='w-16 h-16 rounded-full object-cover border-2 border-teal-500'
              />
              <AvatarFallback className='w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold'>
                {seller.fullname?.charAt(0)?.toUpperCase() || 'S'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className='text-lg font-bold text-gray-900 line-clamp-1'>{seller.fullname}</p>
              <div className='flex flex-col text-sm text-gray-500'>
                <span>
                  Đánh giá: <b className='text-teal-600'>4.9/5</b>
                </span>
                <span>
                  Đã bán: <b>1.2k</b>
                </span>
              </div>
            </div>
          </div>

          <div className='space-y-2 text-sm text-gray-600 mb-4'>
            <div className='flex items-center gap-2'>
              <Calendar className='w-4 h-4 text-teal-500' />
              <span>Tham gia: {formatDate(seller.createdAt)}</span>
            </div>
            <div className='flex items-center gap-2'>
              <Store className='w-4 h-4 text-teal-500' />
              <span>Sản phẩm: 156</span>
            </div>
          </div>

          <div className='flex gap-2'>
            <button className='flex-1 bg-teal-50 text-teal-600 border border-teal-200 text-sm font-semibold h-9 rounded-lg hover:bg-teal-100 transition'>
              Chat ngay
            </button>
            <button className='flex-1 bg-teal-500 text-white text-sm font-semibold h-9 rounded-lg hover:bg-teal-600 transition shadow-sm'>
              Xem Shop
            </button>
          </div>
        </div>
      </div>

      <div className='flex flex-col flex-1 border-l border-gray-200 pl-8'>
        <div className='flex items-center justify-between mb-6'>
          <p className='text-2xl font-bold text-gray-800 flex items-center gap-2'>
            Hỏi đáp về sản phẩm
            <span className='text-sm font-normal text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full'>
              {comments.length}
            </span>
          </p>
        </div>

        {token && seller.id !== user.id && (
          <div className='flex gap-3 mb-8 items-start'>
            <div className='bg-gray-200 rounded-full p-2 mt-1'>
              <Avatar className='w-8 h-8 mt-1'>
                <AvatarImage src={user.avtUrl} className='w-8 h-8 rounded-full' />
                <AvatarFallback className='w-8 h-8 rounded-full bg-teal-200 text-teal-800 text-xs flex items-center justify-center font-bold'>
                  {user.fullname}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className='flex-1 relative'>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder='Bạn có thắc mắc về sản phẩm? Hãy đặt câu hỏi cho người bán...'
                className='w-full border border-gray-300 rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent min-h-20 resize-none text-sm'
              />
              <button
                onClick={() => handlePostQuestion(question)}
                className='absolute bottom-3 right-3 text-teal-500 hover:text-teal-700 disabled:text-gray-300'
                disabled={!question.trim()}
              >
                <Send className='w-5 h-5' />
              </button>
            </div>
          </div>
        )}

        <div className='flex flex-col gap-6 w-full min-h-[400px]'>
          {curComment.map((item) => (
            <div key={item.id} className='flex flex-col gap-3 border-b border-gray-100 last:border-0 pb-6 last:pb-0'>
              {/* Câu hỏi */}
              <div className='flex gap-3'>
                <div className='bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center shrink-0'>
                  <Avatar className='w-8 h-8 mt-1'>
                    <AvatarImage src={item.sender.avtUrl} className='w-8 h-8 rounded-full' />
                    <AvatarFallback className='w-8 h-8 rounded-full bg-teal-200 text-teal-800 text-xs flex items-center justify-center font-bold'>
                      Shop
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='font-semibold text-gray-900'>{item.sender.fullname}</span>
                    <span className='text-xs text-gray-400'>{formatDate(item.sendAt, { time: true })}</span>
                  </div>
                  <p className='text-gray-700'>{item.content}</p>
                </div>
              </div>

              {item.replies.length > 0 && (
                <div className='flex gap-3 ml-11 bg-teal-50/50 p-4 rounded-lg border border-teal-100 relative'>
                  <div className='absolute -top-2 left-4 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-teal-100'></div>

                  <Avatar className='w-8 h-8 mt-1'>
                    <AvatarImage src={item.replies[0].sender.avtUrl} className='w-8 h-8 rounded-full' />
                    <AvatarFallback className='w-8 h-8 rounded-full bg-teal-200 text-teal-800 text-xs flex items-center justify-center font-bold'>
                      Shop
                    </AvatarFallback>
                  </Avatar>

                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                      <span className='font-bold text-teal-700 flex items-center gap-1'>
                        {item.replies[0].sender.fullname}
                        <span className='bg-teal-600 text-white text-[10px] px-1.5 rounded-sm uppercase'>
                          Người bán
                        </span>
                      </span>
                      <span className='text-xs text-gray-400'>
                        {formatDate(item.replies[0].sendAt, { time: true })}
                      </span>
                    </div>
                    <p className='text-gray-700 text-sm'>{item.replies[0].content}</p>
                  </div>
                </div>
              )}

              {item.replies.length === 0 && user.id === seller.id && (
                <div className='ml-11'>
                  <button
                    onClick={() => setHiddenAns(item.id)}
                    className={`text-sm text-gray-400 hover:text-teal-600 font-medium underline decoration-dashed ${
                      hiddenAns === item.id ? 'hidden' : ''
                    }`}
                  >
                    Trả lời người mua
                  </button>

                  <div className={`flex gap-3 mb-2 items-start ${hiddenAns === item.id ? '' : 'hidden'}`}>
                    <div className='bg-gray-200 rounded-full mt-1'>
                      <Avatar className='w-8 h-8 mt-1'>
                        <AvatarImage src={user.avtUrl} className='w-8 h-8 rounded-full' />
                        <AvatarFallback className='w-8 h-8 rounded-full bg-teal-200 text-teal-800 text-xs flex items-center justify-center font-bold'>
                          {user.fullname}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className='flex-1 relative'>
                      <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder='Trả lời người mua'
                        className='w-full border border-gray-300 rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent min-h-20 resize-none text-sm'
                      />
                      <button
                        onClick={() => {
                          handlePostAnswer(item.id, answer);
                        }}
                        className='absolute bottom-3 right-3 text-teal-500 hover:text-teal-700 disabled:text-gray-300'
                        disabled={!answer.trim() || isSubmitting}
                      >
                        {isSubmitting ? <Loader2 className='w-5 h-5 animate-spin' /> : <Send className='w-5 h-5' />}
                      </button>

                      <button
                        disabled={isSubmitting}
                        onClick={() => {
                          setHiddenAns('');
                        }}
                        className='absolute top-3 right-3 text-red-300 hover:text-red-500 disabled:text-gray-300'
                      >
                        <X className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className='flex items-center justify-center gap-4 mt-auto pt-6 border-t border-gray-200'>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className='p-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <ChevronLeft className='w-4 h-4' />
          </button>

          <span className='text-sm font-medium text-gray-600'>
            Trang {page} / {totalPage}
          </span>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPage}
            className='p-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <ChevronRight className='w-4 h-4' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductQA;
