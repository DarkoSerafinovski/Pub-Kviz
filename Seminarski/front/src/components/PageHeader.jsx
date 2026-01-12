const PageHeader = ({ title, highlight, subtitle, children }) => (
  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-16 gap-10">
    <div>
      <h1 className="text-7xl font-black tracking-tighter uppercase italic text-gray-900 leading-none">
        {title} <span className="text-indigo-600">{highlight}</span>
      </h1>
      <p className="text-gray-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-4 ml-1">
        {subtitle}
      </p>
    </div>
    <div className="flex flex-wrap items-center gap-6">{children}</div>
  </div>
);
export default PageHeader;
