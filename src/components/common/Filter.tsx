import { Checkbox, Label, Badge } from "flowbite-react";
import { AUCTION_STATUS } from "@/lib/data";
import { Category } from "@/types/main";
import { AuctionFilterFields } from "@/types/filters";

interface Props {
  categories: Category[];
  filters: AuctionFilterFields;
  setFilters: React.Dispatch<React.SetStateAction<AuctionFilterFields>>;
}

export default function FilterSidebar({ categories, filters, setFilters }: Props) {
  const handleCheckboxChange = (type: 'category' | 'status', value: string) => {
    setFilters((prev) => {
      const current = prev[type];
      const next = current.includes(value)
        ? current.filter((i) => i !== value)
        : [...current, value];
      return { ...prev, [type]: next };
    });
  };

  return (
    <div className="space-y-8">
      {/* Active Badges Summary */}
      {(filters.category.length > 0 || filters.status.length > 0) && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Active Filters</h4>
          <div className="flex flex-wrap gap-2">
            {filters.category.map(c => <Badge key={c} color="info">{c}</Badge>)}
            {filters.status.map(s => <Badge key={s} color="purple">{s}</Badge>)}
          </div>
        </div>
      )}

      {/* Status Group */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-4">Auction Status</h4>
        <div className="space-y-3">
          {AUCTION_STATUS.map((stat) => (
            <div className="flex items-center gap-3" key={stat}>
              <Checkbox
                id={`status-${stat}`}
                checked={filters.status.includes(stat)}
                onChange={() => handleCheckboxChange('status', stat)}
              />
              <Label htmlFor={`status-${stat}`} className="cursor-pointer font-normal text-gray-700">
                {stat}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Category Group */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-4">Categories</h4>
        <div className="space-y-3">
          {categories.map((cate) => (
            <div className="flex items-center gap-3" key={cate.id}>
              <Checkbox
                id={`cat-${cate.id}`}
                checked={filters.category.includes(cate.slug)}
                onChange={() => handleCheckboxChange('category', cate.slug)}
              />
              <Label htmlFor={`cat-${cate.id}`} className="cursor-pointer font-normal text-gray-700">
                {cate.title}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}