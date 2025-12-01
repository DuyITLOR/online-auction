import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  page,
  totalPage,
  onPageChange,
}: {
  page: number;
  totalPage: number;
  onPageChange: (page: string) => void;
}) => {
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
      end = Math.min(
        totalPage - 1,
        end + (pagesAroundCurrent - (page - start))
      );
    }
    if (end - page < pagesAroundCurrent) {
      start = Math.max(2, start - (pagesAroundCurrent - (end - page)));
    }
    if (start > 2) {
      pageNumbers.push("...");
    }
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }
    if (end < totalPage - 1) {
      pageNumbers.push("...");
    }

    if (totalPage !== 1) {
      if (pageNumbers[pageNumbers.length - 1] !== totalPage) {
        pageNumbers.push(totalPage);
      }
    }
  }

  const finalPageNumbers = pageNumbers.filter((p, index, self) => {
    return !(p === "..." && (index === 0 || self[index - 1] === "..."));
  });

  if (
    finalPageNumbers[finalPageNumbers.length - 1] !== totalPage &&
    totalPage > 1
  ) {
    finalPageNumbers.pop();
    finalPageNumbers.push(totalPage);
  }
  if (finalPageNumbers[0] === "..." && totalPage > 1) {
    finalPageNumbers.shift();
    finalPageNumbers.unshift(1);
  }
  const uniqueFinalPageNumbers = Array.from(new Set(finalPageNumbers));
  const handlePageClick = (item: number | string) => {
    if (typeof item === "number") {
      onPageChange(item.toString());
    }
  };

  return (
    <div className="flex items-center gap-3 mt-5 justify-center">
      {page > 1 && (
        <div
          className="w-10 h-10 text-center p-2 bg-slate-200 border border-gray-300 font-bold rounded-full cursor-pointer"
          onClick={() => onPageChange((page - 1).toString())}
        >
          <ChevronLeft className="w-5 stroke-3! h-5" />
        </div>
      )}

      {uniqueFinalPageNumbers.map((item, index) => (
        <div
          key={index}
          className={
            item === "..."
              ? "w-10 h-10 text-center p-2 font-bold"
              : page === item
              ? "w-10 h-10 text-center p-2 bg-teal-500 font-bold text-white rounded-full cursor-pointer"
              : "w-10 h-10 text-center p-2 bg-slate-200 border border-gray-300 font-bold rounded-full cursor-pointer"
          }
          onClick={() => handlePageClick(item)}
        >
          {item}
        </div>
      ))}

      {page < totalPage && (
        <div
          className="w-10 h-10 text-center p-2 bg-slate-200 border border-gray-300 font-bold rounded-full cursor-pointer"
          onClick={() => onPageChange((page + 1).toString())}
        >
          <ChevronRight className="w-5 stroke-3! h-5" />
        </div>
      )}
    </div>
  );
};

export default Pagination;
