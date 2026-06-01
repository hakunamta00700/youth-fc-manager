"use client";

import { cn } from "@/lib/utils";

interface FilterOption {
  label: string;
  value: string;
}

interface Filter {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

interface FilterBarProps {
  filters: Filter[];
  className?: string;
}

function FilterBar({ filters, className }: FilterBarProps) {
  if (filters.length === 0) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3",
        className,
      )}
    >
      {filters.map((filter) => (
        <div key={filter.label} className="flex items-center gap-2">
          <label className="whitespace-nowrap text-sm font-medium text-gray-700">
            {filter.label}
          </label>
          <select
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className={cn(
              "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors",
              "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
            )}
          >
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

export { FilterBar };
export default FilterBar;
