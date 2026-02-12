import React from "react";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
}) => {
  const baseStyles =
    "relative flex items-center justify-center gap-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";

  const variants = {
    primary:
      "bg-gray-900 text-white hover:bg-indigo-600 shadow-xl shadow-gray-200",
    secondary:
      "border-2 border-gray-100 text-gray-400 hover:border-indigo-100 hover:text-indigo-600 bg-white",
    danger:
      "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white shadow-sm",
    success:
      "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-sm",
    outline:
      "border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white",
    empty: "bg-transparent",
  };

  const padding = variant === "secondary" ? "py-4 px-8" : "py-5 px-8";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${padding} ${className}`}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-current"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Obrađujemo...</span>
        </div>
      ) : (
        <>{children}</>
      )}
    </button>
  );
};

export default Button;
