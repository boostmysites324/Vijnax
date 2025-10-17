
import { useState, ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

interface SidebarItemProps {
  icon: string;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  badge?: string;
}

function SidebarItem({ icon, label, isActive, onClick, badge }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap group ${
        isActive
          ? 'bg-blue-100 text-blue-700 shadow-sm'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <i className={`${icon} w-5 h-5 flex items-center justify-center mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}></i>
      <span className="font-medium">{label}</span>
      {badge && (
        <span className="ml-auto bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-semibold">
          {badge}
        </span>
      )}
    </button>
  );
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const sidebarItems = [
    { id: 'dashboard', icon: 'ri-dashboard-3-line', label: 'Dashboard', badge: '' },
    { id: 'questions', icon: 'ri-question-line', label: 'Question Manager', badge: '156' },
    { id: 'payments', icon: 'ri-money-dollar-circle-line', label: 'Payments', badge: '' },
    { id: 'reports', icon: 'ri-file-text-line', label: 'Report Templates', badge: '' },
    { id: 'tags', icon: 'ri-price-tag-3-line', label: 'Tag & Scoring', badge: '' },
    { id: 'settings', icon: 'ri-settings-3-line', label: 'Settings', badge: '' },
  ];

  const handlePageChange = (pageId: string) => {
    setCurrentPage(pageId);
    window.REACT_APP_NAVIGATE(`/admin/${pageId}`);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-white shadow-xl border-r border-gray-100 transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <i className="ri-admin-line w-6 h-6 flex items-center justify-center text-white"></i>
            </div>
            {!sidebarCollapsed && (
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900" style={{fontFamily: "Pacifico, serif"}}>
                  Career Compass
                </h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={sidebarCollapsed ? '' : item.label}
              isActive={currentPage === item.id}
              onClick={() => handlePageChange(item.id)}
              badge={!sidebarCollapsed ? item.badge : undefined}
            />
          ))}
        </nav>

        {/* Collapse Toggle */}
        <div className="absolute bottom-6 left-6">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
          >
            <i className={`ri-${sidebarCollapsed ? 'arrow-right' : 'arrow-left'}-s-line w-5 h-5 flex items-center justify-center text-gray-600`}></i>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-500 text-sm mt-1">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <i className="ri-search-line w-5 h-5 flex items-center justify-center absolute left-3 top-3 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all w-64"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <i className="ri-notification-3-line w-6 h-6 flex items-center justify-center"></i>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <img
                    src="https://readdy.ai/api/search-image?query=Professional%20business%20person%20avatar%2C%20clean%20corporate%20headshot%20with%20professional%20attire%2C%20neutral%20background%20suitable%20for%20admin%20profile%20picture&width=40&height=40&seq=admin-avatar-1&orientation=squarish"
                    alt="Admin"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 text-sm">Admin User</p>
                    <p className="text-gray-500 text-xs">Super Admin</p>
                  </div>
                  <i className="ri-arrow-down-s-line w-4 h-4 flex items-center justify-center text-gray-400"></i>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 cursor-pointer whitespace-nowrap">
                      <i className="ri-user-line w-4 h-4 flex items-center justify-center mr-2 inline-block"></i>
                      Profile
                    </button>
                    <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 cursor-pointer whitespace-nowrap">
                      <i className="ri-settings-3-line w-4 h-4 flex items-center justify-center mr-2 inline-block"></i>
                      Settings
                    </button>
                    <hr className="my-2 border-gray-100" />
                    <button 
                      onClick={() => window.REACT_APP_NAVIGATE('/admin/login')}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-logout-box-line w-4 h-4 flex items-center justify-center mr-2 inline-block"></i>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
