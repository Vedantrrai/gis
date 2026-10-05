import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Satellite, 
  LayoutDashboard, 
  Layers, 
  Map as MapIcon, 
  History, 
  FileText, 
  Settings,
  ChevronLeft, 
  ChevronRight,
  User,
  ShieldCheck,
  Server,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isBackendOnline: boolean;
  demoMode: boolean;
  setDemoMode: (demo: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  isBackendOnline,
  demoMode,
  setDemoMode,
}) => {
  const navItems = [
    { name: 'Overview', path: '/', icon: LayoutDashboard },
    { name: 'Change Detection', path: '/change-detection', icon: Layers },
    { name: 'Interactive Map', path: '/interactive-map', icon: MapIcon },
    { name: 'Historical Analysis', path: '/historical', icon: History },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Settings', path: '/reports#settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out border-r border-[#E9EBEF] bg-white flex flex-col justify-between ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Top Header & Branding */}
      <div>
        <div className="h-15 flex items-center justify-between px-4 border-b border-[#E9EBEF]">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-[#EAF8F0] border border-[#16A765]/20 flex items-center justify-center text-[#16A765] flex-shrink-0">
              <Satellite className="w-4 h-4" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-semibold tracking-tight text-[#17191D] text-sm truncate flex items-center gap-1.5">
                  GeoVision <span className="text-[10px] font-mono text-[#087D4A] bg-[#EAF8F0] px-1.5 py-0.2 rounded font-medium">AI</span>
                </span>
                <span className="text-[10px] text-[#777D87] tracking-normal font-sans truncate">
                  Satellite Intelligence
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-md text-[#777D87] hover:text-[#17191D] hover:bg-[#F3F4F6] transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            id="toggle-sidebar-button"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          <div className="text-[10px] font-medium uppercase tracking-wider text-[#A0A5AE] px-2.5 py-1 mb-1">
            {!collapsed ? 'Workspace' : '•••'}
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all group relative ${
                  isActive
                    ? 'bg-[#EAF8F0] text-[#17191D] font-semibold'
                    : 'text-[#777D87] hover:text-[#17191D] hover:bg-[#F7F8FA]'
                } ${collapsed ? 'justify-center' : 'space-x-2.5'}`
              }
              title={collapsed ? item.name : undefined}
            >
              {({ isActive }) => (
                <>
                  {isActive && !collapsed && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-md bg-[#16A765]" />
                  )}
                  <item.icon
                    className={`w-4 h-4 flex-shrink-0 transition-colors ${
                      isActive ? 'text-[#16A765]' : 'text-[#777D87] group-hover:text-[#17191D]'
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Status & Researcher Profile */}
      <div className="p-3 border-t border-[#E9EBEF] space-y-2.5">
        {/* Project Status Indicator */}
        {!collapsed ? (
          <div className="bg-[#F7F8FA] border border-[#E9EBEF] rounded-xl p-2.5 text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#17191D] font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#16A765]" />
                System Ready
              </span>
              <span className="text-[10px] font-mono text-[#777D87]">
                MAE v2.4
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[#E9EBEF]">
              <span className="text-[#777D87] flex items-center gap-1">
                <Server className="w-3 h-3 text-[#A0A5AE]" />
                API Server
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                isBackendOnline 
                  ? 'bg-[#EAF8F0] text-[#087D4A]' 
                  : 'bg-[#F3F4F6] text-[#777D87]'
              }`}>
                {isBackendOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Mode switch helper */}
            <div className="pt-1 flex items-center justify-between">
              <label className="text-[10px] text-[#777D87] cursor-pointer">
                Demo Mode
              </label>
              <button
                type="button"
                onClick={() => setDemoMode(!demoMode)}
                className={`w-7 h-4 rounded-full transition-colors relative ${demoMode ? 'bg-[#16A765]' : 'bg-[#D8DCE3]'}`}
                title="Toggle Demo Data Mode"
              >
                <span className={`block w-3 h-3 rounded-full bg-white shadow-xs transition-transform ${demoMode ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-1">
            <div 
              className={`w-2.5 h-2.5 rounded-full ${isBackendOnline ? 'bg-[#16A765]' : 'bg-[#F2994A]'}`}
              title={isBackendOnline ? 'System Ready • Backend Online' : 'System Ready • Demo Mode'} 
            />
          </div>
        )}

        {/* Project & Researcher Profile */}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-2.5'} px-1 py-1`}>
          <div className="w-7 h-7 rounded-full bg-[#EAF8F0] text-[#16A765] flex items-center justify-center font-semibold text-xs border border-[#16A765]/20 flex-shrink-0">
            GV
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-[#17191D] truncate">GeoVision AI Lab</span>
              <span className="text-[10px] text-[#777D87] truncate">
                Research Project
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
