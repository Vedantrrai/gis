import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Menu, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  X
} from 'lucide-react';
import { API_BASE_URL } from '../../services/api';

interface TopbarProps {
  onToggleMobileSidebar: () => void;
  isBackendOnline: boolean;
  onRefreshBackendHealth: () => void;
  demoMode: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleMobileSidebar,
  isBackendOnline,
  onRefreshBackendHealth,
  demoMode,
}) => {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getPageMeta = () => {
    switch (location.pathname) {
      case '/':
        return { title: 'Satellite Change Overview', breadcrumb: 'Overview' };
      case '/change-detection':
        return { title: 'Bi-Temporal Change Detection', breadcrumb: 'Change Detection' };
      case '/interactive-map':
        return { title: 'Interactive GIS Explorer', breadcrumb: 'Interactive Map' };
      case '/historical':
        return { title: 'Historical Analysis', breadcrumb: 'Historical Analysis' };
      case '/reports':
        return { title: 'Reports & Export Center', breadcrumb: 'Reports' };
      default:
        return { title: 'GeoVision Platform', breadcrumb: 'System' };
    }
  };

  const meta = getPageMeta();

  return (
    <header className="sticky top-0 z-30 h-15 bg-white border-b border-[#E9EBEF] px-4 lg:px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle & Breadcrumb / Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-1.5 rounded-lg text-[#777D87] hover:text-[#17191D] hover:bg-[#F3F4F6] border border-[#E9EBEF]"
          id="mobile-menu-button"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="text-[11px] font-medium text-[#777D87] flex items-center gap-1.5">
            <span>GeoVision AI</span>
            <span>/</span>
            <span className="text-[#17191D] font-medium">{meta.breadcrumb}</span>
          </div>
          <h1 className="text-sm font-semibold text-[#17191D] tracking-tight leading-none mt-0.5">
            {meta.title}
          </h1>
        </div>
      </div>

      {/* Center: Global GIS Search */}
      <div className="hidden lg:flex items-center flex-1 max-w-sm mx-6">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A5AE]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search location, coordinates, or layer..."
            className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-[#F7F8FA] border border-[#E9EBEF] text-xs text-[#17191D] placeholder-[#A0A5AE] focus:outline-none focus:border-[#16A765] focus:bg-white transition-all"
            id="global-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#A0A5AE] hover:text-[#17191D]"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Right: Dataset Indicator, Backend Status, Notifications, Avatar */}
      <div className="flex items-center space-x-2 sm:space-x-2.5">
        {/* Dataset Status */}
        <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#F7F8FA] border border-[#E9EBEF] text-xs text-[#777D87]">
          <Database className="w-3.5 h-3.5 text-[#5B9DE8]" />
          <span className="text-[11px] font-medium text-[#17191D]">Sentinel-2 (10m)</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#16A765]" />
        </div>

        {/* Backend health status badge */}
        <div 
          onClick={onRefreshBackendHealth}
          className={`cursor-pointer px-2.5 py-1 rounded-lg border text-xs flex items-center gap-1.5 transition-all ${
            isBackendOnline 
              ? 'bg-[#EAF8F0] border-[#16A765]/30 text-[#087D4A] hover:bg-[#d6f2e2]' 
              : 'bg-[#F7F8FA] border-[#E9EBEF] text-[#777D87] hover:bg-[#F3F4F6]'
          }`}
          title={`Backend: ${API_BASE_URL} (Click to re-ping)`}
          id="backend-status-indicator"
        >
          {isBackendOnline ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-[#16A765]" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-[#F2994A]" />
          )}
          <span className="hidden md:inline text-[11px] font-medium">
            {isBackendOnline ? 'API Connected' : 'API Offline'}
          </span>
          {demoMode && (
            <span className="text-[9px] bg-white text-[#777D87] px-1 py-0.2 rounded border border-[#E9EBEF] font-mono font-medium">
              Demo
            </span>
          )}
          <RefreshCw className="w-2.5 h-2.5 text-[#A0A5AE] hover:text-[#17191D] ml-0.5" />
        </div>

        {/* Notifications Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded-lg text-[#777D87] hover:text-[#17191D] bg-[#F7F8FA] hover:bg-[#F3F4F6] border border-[#E9EBEF] relative transition-colors"
            title="System Notifications"
            id="notifications-button"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#16A765]" />
          </button>

          {/* Notifications Flyout */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-[#E9EBEF] rounded-xl shadow-geo-md p-3 text-xs z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-[#E9EBEF] font-semibold text-[#17191D]">
                <span>System Feed</span>
                <span className="text-[10px] text-[#087D4A] bg-[#EAF8F0] px-1.5 py-0.2 rounded font-medium">2 Updates</span>
              </div>
              <div className="divide-y divide-[#E9EBEF] max-h-60 overflow-y-auto">
                <div className="py-2">
                  <div className="text-[#17191D] font-medium">Vision-MAE Weights Loaded</div>
                  <div className="text-[11px] text-[#777D87] mt-0.5">Pre-trained on Sentinel-2 multispectral baseline.</div>
                  <div className="text-[10px] text-[#A0A5AE] mt-1">10m ago</div>
                </div>
                <div className="py-2">
                  <div className="text-[#17191D] font-medium">CRS Index Verified</div>
                  <div className="text-[11px] text-[#777D87] mt-0.5">EPSG:4326 registered with sub-pixel spatial accuracy.</div>
                  <div className="text-[10px] text-[#A0A5AE] mt-1">32m ago</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="w-7 h-7 rounded-full bg-[#17191D] text-white flex items-center justify-center text-xs font-semibold cursor-pointer shadow-xs">
          S
        </div>
      </div>
    </header>
  );
};
