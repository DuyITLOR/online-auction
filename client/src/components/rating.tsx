const Rating = (star: number) => {
  const fullStar = Math.floor(star);
  const halfStar = star % 1 !== 0 ? 1 : 0;
  const emptyStar = 5 - fullStar - halfStar;
  return (
    <div className='flex items-center'>
      {[...Array(fullStar)].map((_, index) => (
        <svg
          key={`full-${index}`}
          xmlns='http://www.w3.org/2000/svg'
          width='1em'
          height='1em'
          fill='currentColor'
          stroke='currentColor'
          strokeWidth='0'
          viewBox='0 0 20 20'
          className='h-4 w-4 text-yellow-400'
        >
          <path
            stroke='none'
            d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z'
          ></path>
        </svg>
      ))}

      {[...Array(halfStar)].map((_, index) => (
        <svg
          key={index}
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
          fill='currentColor'
          className='h-4 w-4 text-yellow-400'
        >
          <defs>
            <linearGradient id='half'>
              <stop offset='50%' stopColor='currentColor' />
              <stop offset='50%' stopColor='transparent' stopOpacity='1' />
            </linearGradient>
          </defs>
          <path
            fill='url(#half)'
            d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z'
          />
        </svg>
      ))}

      {[...Array(emptyStar)].map((_, index) => (
        <svg
          key={`empty-${index}`}
          xmlns='http://www.w3.org/2000/svg'
          width='1em'
          height='1em'
          fill='currentColor'
          stroke='currentColor'
          strokeWidth='0'
          viewBox='0 0 20 20'
          className='h-4 w-4 text-gray-300 dark:text-gray-500'
        >
          <path
            stroke='none'
            d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z'
          ></path>
        </svg>
      ))}
    </div>
  );
};

export default Rating;
