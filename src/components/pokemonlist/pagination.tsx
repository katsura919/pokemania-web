'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/pokemonlist?${params.toString()}`);
  };

  // Only show limited page numbers
  const visiblePages = () => {
    const pages = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex justify-center mt-8 gap-1">
      <button
        onClick={() => handlePageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="p-2 rounded-md border border-gray-200 disabled:opacity-50 hover:bg-gray-100"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      
      {visiblePages().map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => handlePageChange(pageNum)}
          className={`w-10 h-10 rounded-md ${
            page === pageNum
              ? 'bg-blue-500 text-white'
              : 'border border-gray-200 hover:bg-gray-100'
          }`}
        >
          {pageNum}
        </button>
      ))}
      
      <button
        onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="p-2 rounded-md border border-gray-200 disabled:opacity-50 hover:bg-gray-100"
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}