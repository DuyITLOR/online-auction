import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const sortValue = [
  {
    item: 'All',
    value: 'all',
  },
  {
    item: 'Mới nhất',
    value: 'lastest',
  },
  {
    item: 'Giá: Thấp đến cao',
    value: 'price',
  },
  {
    item: 'Giá: Cao đến thấp',
    value: 'price_desc',
  },
  {
    item: 'Nhiều lượt ra giá',
    value: 'bids',
  },
];

const SortBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentSortValue, setCurrentSortValue] = useState(sortValue[0].value);
  const [isPopover, setPopover] = useState(false);

  const currentSelectedItem = useMemo(() => {
    return sortValue.find((item) => item.value === currentSortValue);
  }, [currentSortValue]);

  const handleSortChange = (value: string) => {
    setCurrentSortValue(value);

    searchParams.set('sort', value);
    setSearchParams(searchParams);

    setPopover(false);
  };
  return (
    <div className='flex items-center justify-between '>
      <p className='font-semibold text-2xl'>Danh sách sản phẩm</p>
      <Popover open={isPopover} onOpenChange={setPopover}>
        <PopoverTrigger asChild>
          <Button
            className='w-45 border border-gray-300 items-center justify-between cursor-pointer'
            variant={'outline'}
          >
            <span className='text-gray-700 font-medium flex'>{currentSelectedItem?.item}</span>
            <ChevronDown className='w-5 h-5' />
          </Button>
        </PopoverTrigger>

        <PopoverContent className='w-45 border-gray-300 bg-white'>
          <div className='w-full'>
            <ul className='space-y-0.5'>
              {sortValue.map((item) => (
                <li
                  onClick={() => handleSortChange(item.value)}
                  key={item.value}
                  className='px-3 py-1 text-sm hover:bg-gray-200 cursor-pointers!'
                >
                  {item.item}
                </li>
              ))}
            </ul>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SortBar;
