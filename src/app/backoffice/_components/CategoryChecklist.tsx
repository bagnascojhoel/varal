'use client';

export interface Category {
  value: string;
  label: string;
}

const CATEGORIES: Category[] = [
  { value: 'EXTRA_LIGHT', label: 'Extra Leve' },
  { value: 'LIGHT', label: 'Leve' },
  { value: 'MEDIUM', label: 'Médio' },
  { value: 'HEAVY', label: 'Pesado' },
  { value: 'EXTRA_HEAVY', label: 'Extra Pesado' },
];

interface Props {
  selected: Set<string>;
  onChange: (category: string, checked: boolean) => void;
}

export function CategoryChecklist({ selected, onChange }: Props) {
  return (
    <div className="space-y-3">
      {CATEGORIES.map((category) => (
        <label
          key={category.value}
          className="flex items-center gap-3 p-2 cursor-pointer hover:bg-white/5 rounded-lg transition-colors min-h-11"
        >
          <input
            type="checkbox"
            checked={selected.has(category.value)}
            onChange={(e) => onChange(category.value, e.target.checked)}
            className="w-5 h-5 cursor-pointer"
          />
          <span className="text-sm font-medium text-white">
            {category.label}
          </span>
        </label>
      ))}
    </div>
  );
}
