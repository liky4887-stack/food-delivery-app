import { Leaf, Wheat, Milk, Nut, Sprout } from 'lucide-react';
import { DietaryTag } from '@/data/restaurants';

const tagConfig: Record<DietaryTag, { label: string; icon: typeof Leaf; color: string; bg: string }> = {
  vegetarian: { label: 'Veg', icon: Leaf, color: 'text-green-700', bg: 'bg-green-50' },
  vegan: { label: 'Vegan', icon: Sprout, color: 'text-green-700', bg: 'bg-green-50' },
  'gluten-free': { label: 'GF', icon: Wheat, color: 'text-amber-700', bg: 'bg-amber-50' },
  'no-dairy': { label: 'No Dairy', icon: Milk, color: 'text-blue-700', bg: 'bg-blue-50' },
  'no-nuts': { label: 'No Nuts', icon: Nut, color: 'text-orange-700', bg: 'bg-orange-50' },
};

export function DietaryBadges({ tags, size = 'sm' }: { tags: DietaryTag[]; size?: 'sm' | 'xs' }) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => {
        const config = tagConfig[tag];
        const Icon = config.icon;
        return (
          <span
            key={tag}
            className={`${config.bg} ${config.color} ${size === 'xs' ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]'} rounded-full font-semibold flex items-center gap-0.5`}
          >
            <Icon className={size === 'xs' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
            {config.label}
          </span>
        );
      })}
    </div>
  );
}
