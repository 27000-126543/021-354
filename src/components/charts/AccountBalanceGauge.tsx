interface AccountBalanceGaugeProps {
  balance: number;
  monthlyAverage: number;
  monthsAvailable: number;
}

const AccountBalanceGauge = ({ balance, monthlyAverage, monthsAvailable }: AccountBalanceGaugeProps) => {
  const percentage = Math.min((monthsAvailable / 6) * 100, 100);
  const getColor = () => {
    if (monthsAvailable < 1.5) return '#e74c3c';
    if (monthsAvailable < 3) return '#f39c12';
    return '#27ae60';
  };
  
  const color = getColor();
  const circumference = 2 * Math.PI * 60;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-20 overflow-hidden">
        <svg viewBox="0 0 140 70" className="w-full h-full">
          <path
            d="M 10 65 A 60 60 0 0 1 130 65"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 10 65 A 60 60 0 0 1 130 65"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${(percentage / 100) * Math.PI * 60} ${Math.PI * 60}`}
            style={{
              transition: 'stroke-dasharray 1s ease-out',
            }}
          />
        </svg>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
          <p className="text-2xl font-bold text-slate-800 font-mono-nums">
            {monthsAvailable.toFixed(1)}
          </p>
          <p className="text-xs text-slate-500">可发月数</p>
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-slate-500">专户余额</p>
        <p className="text-xl font-bold text-slate-800 font-mono-nums">
          {(balance / 10000).toFixed(1)}万
        </p>
        <p className="text-xs text-slate-400 mt-1">
          月均工资 {(monthlyAverage / 10000).toFixed(1)}万
        </p>
      </div>
    </div>
  );
};

export default AccountBalanceGauge;
