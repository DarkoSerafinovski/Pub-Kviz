import React from "react";

const Loader = ({ fullPage = false, message = "Učitavanje..." }) => {
  const containerClasses = fullPage
    ? "fixed inset-0 z-50 flex-col bg-white/80 backdrop-blur-md"
    : "h-64 w-full flex-col";

  return (
    <div className={`flex items-center justify-center ${containerClasses}`}>
      <div className="relative">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-100 animate-ping"></div>

        <div className="h-16 w-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin shadow-lg"></div>
      </div>

      <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default Loader;
