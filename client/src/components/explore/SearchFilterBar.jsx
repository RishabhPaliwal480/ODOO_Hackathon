import { Filter, Search } from 'lucide-react';
import { Button } from '../ui';

export function SearchFilterBar({
  search,
  region,
  costIndex,
  onSearchChange,
  onRegionChange,
  onCostIndexChange,
  onSubmit,
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
    >
      {/* Search Input */}
      <div className="sm:col-span-5 relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search cities, landmarks, activities (e.g. Paris, Eiffel, Ramen)..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-slate-900 focus:bg-white focus:border-slate-900 outline-none transition-colors"
        />
      </div>

      {/* Region Dropdown */}
      <div className="sm:col-span-3">
        <select
          value={region}
          onChange={(e) => onRegionChange(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-slate-700 outline-none cursor-pointer"
        >
          <option value="">All Regions</option>
          <option value="Europe">Europe</option>
          <option value="Asia">Asia</option>
          <option value="Southeast Asia">Southeast Asia</option>
          <option value="North America">North America</option>
          <option value="South Asia">South Asia</option>
        </select>
      </div>

      {/* Cost Index Dropdown */}
      <div className="sm:col-span-2">
        <select
          value={costIndex}
          onChange={(e) => onCostIndexChange(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-slate-700 outline-none cursor-pointer"
        >
          <option value="">Any Cost</option>
          <option value="Budget">Budget</option>
          <option value="Moderate">Moderate</option>
          <option value="Luxury">Luxury</option>
        </select>
      </div>

      {/* Search Button */}
      <div className="sm:col-span-2">
        <Button type="submit" variant="dark" size="sm" icon={Filter} className="w-full">
          Filter
        </Button>
      </div>
    </form>
  );
}
