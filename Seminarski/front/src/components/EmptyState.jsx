const EmptyState = ({ message, sign = "" }) => (
  <div className="flex items-center gap-3 py-4 px-2 text-gray-500 font-medium italic">
    {sign && (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-600 text-[10px] text-white font-black not-italic">
        {sign}
      </span>
    )}
    <p>{message}</p>
  </div>
);

export default EmptyState;
