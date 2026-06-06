import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Pagination = React.memo(({
  currentPage,
  totalPages,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 dark:border-slate-800 transition text-xs font-bold uppercase tracking-wider cursor-pointer"
      >
        <ChevronLeft size={14} /> Prev
      </button>

      {/* First page + ellipsis */}
      {pageNumbers[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-850 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 transition text-xs font-bold cursor-pointer"
          >
            1
          </button>
          {pageNumbers[0] > 2 && (
            <span className="text-slate-400 dark:text-slate-500 px-1 font-bold">…</span>
          )}
        </>
      )}

      {/* Page numbers */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${page === currentPage
            ? "bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white border-transparent"
            : "bg-white dark:bg-slate-900 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-850 border-slate-200 dark:border-slate-800"
            }`}
        >
          {page}
        </button>
      ))}

      {/* Last page + ellipsis */}
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="text-slate-400 dark:text-slate-500 px-1 font-bold">…</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-850 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 transition text-xs font-bold cursor-pointer"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 dark:border-slate-800 transition text-xs font-bold uppercase tracking-wider cursor-pointer"
      >
        Next <ChevronRight size={14} />
      </button>
    </div>
  );
});

Pagination.displayName = "Pagination";
