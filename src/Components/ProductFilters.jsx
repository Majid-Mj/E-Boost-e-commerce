import React from "react";
import { Search } from "lucide-react";

export const ProductFilters = React.memo(({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  priceFilter,
  onPriceChange,
  categories,
  onClear
}) => {
  const formatCategoryLabel = (cat) => {
    if (!cat) return cat;
    const label = cat.replace(/[_-]/g, " ");
    return label.charAt(0).toUpperCase() + label.slice(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 mb-12">
      <div className="flex flex-col lg:flex-row items-center gap-4">
        {/* Search Box */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search for products..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-xl pl-12 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#ff512f]/40 border border-slate-200 dark:border-slate-800 transition-all font-medium text-sm"
          />
        </div>

        {/* Filter Group */}
        <div className="flex flex-wrap md:flex-nowrap items-center gap-4 w-full lg:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#ff512f]/40 w-full md:w-[200px] border border-slate-200 dark:border-slate-800 cursor-pointer font-semibold text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {formatCategoryLabel(cat)}
              </option>
            ))}
          </select>

          <select
            value={priceFilter}
            onChange={(e) => onPriceChange(e.target.value)}
            className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#ff512f]/40 w-full md:w-[200px] border border-slate-200 dark:border-slate-800 cursor-pointer font-semibold text-sm"
          >
            <option value="">Price Range</option>
            <option value="500-1000">₹500 - ₹1000</option>
            <option value="1000-2000">₹1000 - ₹2000</option>
            <option value="2000-5000">₹2000 - ₹5000</option>
            <option value="5000-10000">₹5000 - ₹10000</option>
          </select>

          <button
            onClick={onClear}
            className="px-6 py-2.5 bg-slate-200 dark:bg-slate-850 hover:bg-slate-300 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-750 text-slate-700 dark:text-slate-300 rounded-xl transition-all text-sm font-bold uppercase tracking-wider active:scale-95 whitespace-nowrap w-full md:w-auto"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
});

ProductFilters.displayName = "ProductFilters";
