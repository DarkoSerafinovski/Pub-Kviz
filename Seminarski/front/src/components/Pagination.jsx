import React from "react";

const Pagination = ({ meta, onPageChange }) => {
  if (!meta || meta.last_page <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-6 mt-12">
      <button
        disabled={meta.current_page === 1}
        onClick={() => onPageChange(meta.current_page - 1)}
        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-gray-100 shadow-sm text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-indigo-50 transition-all active:scale-95"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-2">
        <span className="text-lg font-black text-gray-900 tabular-nums">
          {meta.current_page}
        </span>
        <span className="text-gray-300 font-bold">/</span>
        <span className="text-sm font-black text-gray-400 uppercase tracking-widest">
          {meta.last_page}
        </span>
      </div>

      <button
        disabled={meta.current_page === meta.last_page}
        onClick={() => onPageChange(meta.current_page + 1)}
        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-gray-100 shadow-sm text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-indigo-50 transition-all active:scale-95"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
