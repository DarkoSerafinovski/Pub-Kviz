const FormInput = ({
  label,
  name,
  type = "text",
  value,
  checked,
  onChange,
  placeholder,
  required = false,
  className = "",
  classNameLabel = "font-black text-gray-700 uppercase ml-1",
  icon,
  ...props
}) => {
  if (type === "toggle") {
    return (
      <label
        className={`flex items-center gap-3 cursor-pointer group ${className}`}
      >
        <div className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name={name}
            className="sr-only peer"
            checked={checked}
            onChange={onChange}
            required={required}
            {...props}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
        </div>
        {label && (
          <span className="text-gray-700 font-medium group-hover:text-indigo-700 transition-colors">
            {label} {required && <span className="text-red-500">*</span>}
          </span>
        )}
      </label>
    );
  }
  const isCheckOrRadio = type === "checkbox" || type === "radio";

  if (isCheckOrRadio) {
    return (
      <label
        className={`flex items-center gap-3 cursor-pointer p-1 transition-all ${className}`}
      >
        <input
          type={type}
          name={name}
          checked={checked}
          onChange={onChange}
          required={required}
          className="w-5 h-5 accent-indigo-600 cursor-pointer"
          {...props}
        />
        {label && (
          <span className="text-gray-600 group-hover:text-indigo-700 transition-colors">
            {label} {required && <span className="text-red-500">*</span>}
          </span>
        )}
      </label>
    );
  }
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className={`text-sm ${classNameLabel}`}>
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
          className={`w-full p-4 ${
            icon ? "pl-12" : "pl-4"
          } bg-gray-50 border border-gray-500 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium placeholder:text-gray-400 shadow-sm`}
        />
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none">
            {icon}
          </span>
        )}
      </div>
    </div>
  );
};

export default FormInput;
