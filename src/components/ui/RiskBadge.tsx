import { RiskLevel } from '../../types';
import { getRiskLevelText, getRiskLevelColor } from '../../utils';

interface RiskBadgeProps {
  level: RiskLevel;
  pulse?: boolean;
  size?: 'sm' | 'md';
}

const RiskBadge = ({ level, pulse = false, size = 'md' }: RiskBadgeProps) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${getRiskLevelColor(level)} ${sizeClasses}`}>
      <span className={`relative w-2 h-2 rounded-full ${level === 'high' ? 'bg-risk-high' : level === 'medium' ? 'bg-risk-medium' : 'bg-risk-low'}`}>
        {pulse && level === 'high' && (
          <span className="absolute inset-0 rounded-full bg-risk-high animate-ping opacity-75"></span>
        )}
      </span>
      {getRiskLevelText(level)}
    </span>
  );
};

export default RiskBadge;
