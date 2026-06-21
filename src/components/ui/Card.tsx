import { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  extra?: ReactNode;
  noPadding?: boolean;
  style?: CSSProperties;
}

const Card = ({ children, className = '', title, extra, noPadding = false, style }: CardProps) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-card border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-card-hover ${className}`}
      style={style}
    >
      {(title || extra) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          {title && (
            <h3 className="text-base font-semibold text-slate-800">{title}</h3>
          )}
          {extra && <div>{extra}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>
        {children}
      </div>
    </div>
  );
};

export default Card;
