import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ProductContext } from '../libs/contexts/product.context';

const formatTimeLeft = (date: string) => {
  const now = new Date();
  const end = new Date(date);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return 'Hết hạn';

  const diffDays = diff / (1000 * 60 * 60 * 24);
  const diffHours = diff / (1000 * 60 * 60);
  const diffMinutes = diff / (1000 * 60);

  if (diffDays > 3) {
    return `Kết thúc: ${end.getDate()}/${end.getMonth() + 1}/${end.getFullYear()}`;
  } else if (diffDays >= 1) {
    return `${Math.ceil(diffDays)} ngày`;
  } else if (diffHours >= 1) {
    return `${Math.ceil(diffHours)} giờ`;
  } else {
    return `${Math.ceil(diffMinutes)} phút`;
  }
};

const DisplayProduct = () => {
  const { endingSoonProducts, highestPriceProducts, loading } = useContext(ProductContext);
  return (
    <>
      {loading && (
        <div className='flex items-center justify-center py-20 min-w-full'>
          <div className='animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent'></div>
        </div>
      )}

      {!loading && (
        <div className='flex flex-col mx-10 mb-5 gap-10'>
          <p className='font-bold text-2xl'>Sắp kết thúc</p>
          <div className='flex flex-1 items-center gap-3 overflow-x-auto scroll-container h-[400px] pb-5'>
            {endingSoonProducts.map((item) => (
              <Link to={`/product/${item.id}`} key={item.id} className='flex flex-col gap-2 min-w-[250px] relative'>
                <img src={item?.images?.[0].url} className='rounded-md w-[250px] h-[250px] object-cover' />
                <p className='line-clamp-2'>{item.title}</p>
                <span className='font-semibold text-xl'>{Number(item.currentPrice).toLocaleString()} VND</span>
                <div
                  className={`font-semibold h-8 absolute text-sm right-1 top-1 bg-white hover:bg-gray-100 p-2 rounded-full`}
                >
                  {formatTimeLeft(item.endAt)}
                </div>
              </Link>
            ))}
          </div>

          <p className='font-bold text-2xl'> Nhiều lượt ra giá nhất</p>
          <div className='flex flex-1 items-center gap-3 overflow-x-auto scroll-container h-[400px] pb-5'>
            {highestPriceProducts.map((item) => (
              <Link to={`/product/${item.id}`} key={item.id} className='flex flex-col gap-2 min-w-[250px] relative'>
                <img src={item?.images?.[0].url} className='rounded-md w-[250px] h-[250px] object-cover' />
                <p className='line-clamp-2'>{item.title}</p>
                <span className='font-semibold text-xl'>{Number(item.currentPrice).toLocaleString()} VND</span>
                <div
                  className={`font-semibold h-10 absolute right-1 top-1  bg-white hover:bg-gray-100 p-2 rounded-full`}
                >
                  {formatTimeLeft(item.endAt)}
                </div>
              </Link>
            ))}
          </div>

          <p className='font-bold text-2xl'>Giá cao nhất</p>
          <div className='flex flex-1 items-center gap-3 overflow-x-auto scroll-container h-[400px] pb-5'>
            {highestPriceProducts.map((item) => (
              <Link to={`/product/${item.id}`} key={item.id} className='flex flex-col gap-2 min-w-[250px] relative'>
                <img src={item?.images?.[0].url} className='rounded-md w-[250px] h-[250px] object-cover' />
                <p className='line-clamp-2'>{item.title}</p>
                <span className='font-semibold text-xl'>{Number(item.currentPrice).toLocaleString()} VND</span>
                <div
                  className={`font-semibold h-10 absolute right-1 top-1  bg-white hover:bg-gray-100 p-2 rounded-full`}
                >
                  {formatTimeLeft(item.endAt)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default DisplayProduct;
