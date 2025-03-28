'use client';

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const visiblePages = () => {
    const pages = [];
    const start = Math.max(1, page - 1);
    const end = Math.min(totalPages, page + 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex justify-center mt-8 gap-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="p-2 rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      
      {visiblePages().map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
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
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="p-2 rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}