import { ReactNode } from 'react';

interface TabItem {
  key: string;
  label: string;
  count?: number;
}

interface TabsProps {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  children?: ReactNode;
}

const Tabs = ({ items, activeKey, onChange }: TabsProps) => {
  return (
    <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
      {items.map((item) => {
        const isActive = activeKey === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              isActive
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            {item.label}
            {item.count !== undefined && (
              <span className={`px-2 py-0.5 text-xs rounded-full font-mono-nums ${
                isActive ? 'bg-primary-100 text-primary-700' : 'bg-slate-200 text-slate-600'
              }`}>
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
