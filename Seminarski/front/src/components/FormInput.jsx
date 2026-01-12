const FormInput = ({
  label,
  name,
  type = "text",
  value,
  checked,
  onChange,
  placeholder,
  required = false,
}) => {
  if (type === "toggle") {
    return (
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name={name}
            className="sr-only peer"
            checked={checked}
            onChange={onChange}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
        </div>
        {label && (
          <span className="text-gray-700 font-medium group-hover:text-indigo-700 transition-colors">
            {label}
          </span>
        )}
      </label>
    );
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-black text-gray-700 uppercase ml-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="w-full p-4  pl-4 bg-gray-50 border border-gray-500 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium placeholder:text-gray-400 shadow-sm"
        />
      </div>
    </div>
  );
};

export default FormInput;
