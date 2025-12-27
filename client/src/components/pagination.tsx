import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPage: number;
  onPageChange: (page: string) => void;
}

const Pagination = ({ page, totalPage, onPageChange }: PaginationProps) => {
  const maxPages = 5;
  const pagesAroundCurrent = 1;
  const pageNumbers = [];

  if (totalPage <= maxPages) {
    for (let i = 1; i <= totalPage; i++) {
      pageNumbers.push(i);
    }
  } else {
    pageNumbers.push(1);
    let start = Math.max(2, page - pagesAroundCurrent);
    let end = Math.min(totalPage - 1, page + pagesAroundCurrent);

    if (page - start < pagesAroundCurrent) {
      end = Math.min(totalPage - 1, end + (pagesAroundCurrent - (page - start)));
    }
    if (end - page < pagesAroundCurrent) {
      start = Math.max(2, start - (pagesAroundCurrent - (end - page)));
    }
    if (start > 2) pageNumbers.push('...');
    for (let i = start; i <= end; i++) pageNumbers.push(i);
    if (end < totalPage - 1) pageNumbers.push('...');
    if (totalPage !== 1 && pageNumbers[pageNumbers.length - 1] !== totalPage) {
      pageNumbers.push(totalPage);
    }
  }

  const finalPageNumbers = pageNumbers.filter((p, index, self) => {
    return !(p === '...' && (index === 0 || self[index - 1] === '...'));
  });
  if (finalPageNumbers[finalPageNumbers.length - 1] !== totalPage && totalPage > 1) {
    finalPageNumbers.pop();
    finalPageNumbers.push(totalPage);
  }
  if (finalPageNumbers[0] === '...' && totalPage > 1) {
    finalPageNumbers.shift();
    finalPageNumbers.unshift(1);
  }
  const uniqueFinalPageNumbers = Array.from(new Set(finalPageNumbers));

  const handlePageClick = (item: number | string) => {
    if (typeof item === 'number') {
      onPageChange(item.toString());
    }
  };

  return (
    <div className='flex mt-8 items-center justify-center gap-2 select-none'>
      <PaginationBtn onClick={() => onPageChange((page - 1).toString())} disabled={page <= 1}>
        <ChevronLeft className='w-4 h-4' />
      </PaginationBtn>

      {uniqueFinalPageNumbers.map((item, index) => {
        if (item === '...') {
          return (
            <div key={`ellipsis-${index}`} className='flex items-end justify-center w-9 h-9 pb-2'>
              <MoreHorizontal className='w-4 h-4 text-gray-400' />
            </div>
          );
        }

        return (
          <PaginationBtn key={item} isActive={page === item} onClick={() => handlePageClick(item)}>
            {item}
          </PaginationBtn>
        );
      })}

      <PaginationBtn onClick={() => onPageChange((page + 1).toString())} disabled={page >= totalPage}>
        <ChevronRight className='w-4 h-4' />
      </PaginationBtn>
    </div>
  );
};

interface PaginationBtnProps {
  children: React.ReactNode;
  isActive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const PaginationBtn = ({ children, isActive, disabled, onClick }: PaginationBtnProps) => {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center min-w-9 h-9 px-3 rounded-lg text-sm font-medium transition-all duration-200
        ${
          isActive
            ? 'bg-teal-600 text-white shadow-md shadow-teal-200 hover:bg-teal-700'
            : 'bg-white text-gray-600 hover:bg-gray-100 border border-transparent hover:border-gray-200'
        }
        ${disabled ? 'opacity-40 cursor-not-allowed hover:bg-transparent' : 'cursor-pointer active:scale-95'}
      `}
    >
      {children}
    </button>
  );
};

export default Pagination;
