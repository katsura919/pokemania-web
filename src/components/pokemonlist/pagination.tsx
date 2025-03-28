// components/pokemonlist/pagination.tsx
'use client';

import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export function Pagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  // Show limited page numbers (current page ±1)
  const getVisiblePages = () => {
    const visiblePages = [];
    const start = Math.max(1, page - 1);
    const end = Math.min(totalPages, page + 1);
    
    for (let i = start; i <= end; i++) {
      visiblePages.push(i);
    }
    return visiblePages;
  };

  return (
    <div className="flex justify-center items-center gap-1 mt-8">
      {/* First Page */}
      {page > 2 && (
        <Link
          href={`/pokemonlist?page=1`}
          className="p-2 rounded-md border border-gray-200 hover:bg-gray-100"
          aria-label="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Link>
      )}

      {/* Previous Page */}
      {page > 1 && (
        <Link
          href={`/pokemonlist?page=${page - 1}`}
          className="p-2 rounded-md border border-gray-200 hover:bg-gray-100"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      )}

      {/* Page Numbers */}
      {getVisiblePages().map((pageNum) => (
        <Link
          key={pageNum}
          href={`/pokemonlist?page=${pageNum}`}
          className={`w-10 h-10 flex items-center justify-center rounded-md ${
            page === pageNum
              ? 'bg-blue-500 text-white'
              : 'border border-gray-200 hover:bg-gray-100'
          }`}
        >
          {pageNum}
        </Link>
      ))}

      {/* Next Page */}
      {page < totalPages && (
        <Link
          href={`/pokemonlist?page=${page + 1}`}
          className="p-2 rounded-md border border-gray-200 hover:bg-gray-100"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}

      {/* Last Page */}
      {page < totalPages - 1 && (
        <Link
          href={`/pokemonlist?page=${totalPages}`}
          className="p-2 rounded-md border border-gray-200 hover:bg-gray-100"
          aria-label="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}