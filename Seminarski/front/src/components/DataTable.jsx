import React from "react";

const DataTable = ({ headers, children, variant = "indigo" }) => {
  const headerColor = variant === "indigo" ? "bg-indigo-600" : "bg-gray-900";

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className={`${headerColor} text-white`}>
            {headers.map((header, index) => (
              <th
                key={index}
                className={`p-6 text-[10px] font-black uppercase tracking-widest ${
                  index === headers.length - 1 ? "text-right" : ""
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export default DataTable;
