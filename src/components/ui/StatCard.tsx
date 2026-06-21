import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  color?: 'blue' | 'red' | 'orange' | 'green';
  delay?: number;
}

const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = 'blue', delay = 0 }: StatCardProps) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    red: 'from-risk-high to-red-500',
    orange: 'from-risk-medium to-orange-500',
    green: 'from-risk-low to-green-500',
  };
  
  const iconBgColors = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-risk-highLight text-risk-high',
    orange: 'bg-risk-mediumLight text-risk-medium',
    green: 'bg-risk-lowLight text-risk-low',
  };

  return (
    <div 
      className="bg-white rounded-xl p-5 shadow-card border border-slate-100 hover:shadow-card-hover transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-800 font-mono-nums tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
          )}
          {trend && (
            <div className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${
              trend.isPositive ? 'text-risk-low' : 'text-risk-high'
            }`}>
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${iconBgColors[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      <div className={`mt-4 h-1 rounded-full bg-gradient-to-r ${colorClasses[color]} opacity-60`}></div>
    </div>
  );
};

export default StatCard;
