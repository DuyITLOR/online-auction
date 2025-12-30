import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { ChevronDown, Check, ArrowDownWideNarrow, ArrowUpNarrowWide, Clock, Flame, LayoutGrid } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const sortOptions = [
  {
    label: 'Liên quan nhất',
    value: 'all',
    icon: LayoutGrid,
  },
  {
    label: 'Sắp kết thúc',
    value: 'ending_soon',
    icon: Clock,
  },
  {
    label: 'Giá: Thấp đến Cao',
    value: 'price_asc',
    icon: ArrowUpNarrowWide,
  },
  {
    label: 'Giá: Cao đến Thấp',
    value: 'price_desc',
    icon: ArrowDownWideNarrow,
  },
  {
    label: 'Nhiều lượt đấu giá',
    value: 'countBids_desc',
    icon: Flame,
  },
];

const SortBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const currentSortValue = searchParams.get('sort') || 'relevance';

  const currentSelectedItem = useMemo(() => {
    return sortOptions.find((item) => item.value === currentSortValue) || sortOptions[0];
  }, [currentSortValue]);

  const handleSortChange = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === 'relevance') {
      next.delete('sort');
    } else {
      next.set('sort', value);
    }
    setSearchParams(next);
    setIsOpen(false);
  };

  return (
    <div className='flex items-center justify-end'>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={isOpen}
            className='w-[200px] justify-between bg-white hover:bg-gray-50 text-gray-700 font-normal border-gray-200 shadow-sm transition-all duration-200 hover:border-teal-500 hover:text-teal-600'
          >
            <div className='flex items-center gap-2 truncate'>
              <currentSelectedItem.icon className='h-4 w-4 opacity-70' />
              <span>{currentSelectedItem.label}</span>
            </div>
            <ChevronDown
              className={`ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent className='w-[220px] p-1 bg-white border-gray-100 shadow-xl rounded-xl' align='end'>
          <div className='flex flex-col gap-1'>
            {sortOptions.map((option) => {
              const isSelected =
                currentSortValue === option.value || (currentSortValue === null && option.value === 'relevance');

              return (
                <div
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`
                    relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors
                    ${
                      isSelected
                        ? 'bg-teal-50 text-teal-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <option.icon className={`h-4 w-4 ${isSelected ? 'text-teal-600' : 'text-gray-400'}`} />

                  <span className='flex-1'>{option.label}</span>
                  {isSelected && <Check className='h-4 w-4 text-teal-600 animate-in zoom-in duration-200' />}
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SortBar;
