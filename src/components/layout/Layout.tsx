import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileWarning, ClipboardList, Bell, User, Building2 } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: '风险排行', icon: LayoutDashboard },
    { path: '/rectification', label: '整改跟进', icon: ClipboardList },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname.startsWith('/project');
    }
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-primary-800 text-white h-16 flex items-center justify-between px-6 shadow-lg z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-wide">农民工工资专户数据看板</h1>
            <p className="text-xs text-primary-200">Wage Special Account Dashboard</p>
          </div>
        </div>
        
        <nav className="flex items-center gap-1 h-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 h-10 rounded-md text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-white/15 text-white'
                    : 'text-primary-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-md hover:bg-white/10 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-risk-high rounded-full"></span>
          </button>
          <div className="flex items-center gap-2 pl-4 border-l border-white/20">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="text-sm">
              <p className="font-medium">张经理</p>
              <p className="text-xs text-primary-200">工程管理部</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
      
      <footer className="bg-white border-t border-slate-200 py-3 px-6 text-center text-xs text-slate-400">
        © 2026 集团工程管理部 · 农民工工资专户管理系统 v1.0
      </footer>
    </div>
  );
};

export default Layout;
