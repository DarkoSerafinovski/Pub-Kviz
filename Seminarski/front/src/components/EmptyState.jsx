const EmptyState = ({ message, sign = "" }) => (
  <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-100 italic text-gray-400 font-bold">
    {sign && (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white font-bold">
        {sign}
      </span>
    )}
    {message}
  </div>
);

export default EmptyState;
