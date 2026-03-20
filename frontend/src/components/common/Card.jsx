import React from "react";

const Card = ({
  title,
  icon: Icon,
  children,
  className = "",
  noPadding = false,
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300 ${className}`}
    >
      {title && (
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-700 flex items-center gap-2">
            {Icon && <Icon className="text-indigo-500" size={18} />}
            {title}
          </h3>
        </div>
      )}
      <div className={`${noPadding ? "p-0" : "p-6"}`}>{children}</div>
    </div>
  );
};

export default Card;
