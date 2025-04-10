// "use client";

// import { Button } from "./button";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// interface PaginationProps {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }

// export function Pagination({
//   currentPage,
//   totalPages,
//   onPageChange,
// }: PaginationProps) {
//   const handlePrevious = () => {
//     if (currentPage > 1) {
//       onPageChange(currentPage - 1);
//     }
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) {
//       onPageChange(currentPage + 1);
//     }
//   };

//   return (
//     <div className="flex items-center gap-2">
//       <Button
//         variant="outline"
//         size="sm"
//         onClick={handlePrevious}
//         disabled={currentPage === 1}
//       >
//         <ChevronLeft className="h-4 w-4" />
//       </Button>

//       {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//         <Button
//           key={page}
//           variant={currentPage === page ? "default" : "outline"}
//           size="sm"
//           onClick={() => onPageChange(page)}
//         >
//           {page}
//         </Button>
//       ))}

//       <Button
//         variant="outline"
//         size="sm"
//         onClick={handleNext}
//         disabled={currentPage === totalPages}
//       >
//         <ChevronRight className="h-4 w-4" />
//       </Button>
//     </div>
//   );
// }

"use client";

import { Button } from "./button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  const maxVisiblePages = 5;

  const getPageNumbers = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(currentPage - half, 1);
    const end = Math.min(start + maxVisiblePages - 1, totalPages);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(end - maxVisiblePages + 1, 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="h-9 w-9 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pageNumbers[0] > 1 && (
        <>
          <Button
            variant={currentPage === 1 ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(1)}
            className={`h-9 w-9 p-0 ${currentPage === 1 ? "bg-hairsby-orange hover:bg-hairsby-orange/90" : ""}`}
          >
            1
          </Button>
          {pageNumbers[0] > 2 && (
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0" disabled>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          )}
        </>
      )}

      {pageNumbers.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
          className={`h-9 w-9 p-0 ${currentPage === page ? "bg-hairsby-orange hover:bg-hairsby-orange/90" : ""}`}
        >
          {page}
        </Button>
      ))}

      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0" disabled>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant={currentPage === totalPages ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(totalPages)}
            className={`h-9 w-9 p-0 ${currentPage === totalPages ? "bg-hairsby-orange hover:bg-hairsby-orange/90" : ""}`}
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="h-9 w-9 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
