import { useEffect, useRef, useState } from 'react';
import {
  LogOut,
  Menu,
  Plane,
  Plus,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BlueprintNavigator } from './BlueprintNavigator';

export function Header({ currentView, onNavigate }) {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Exact navigation structure from reference
  const mainNavItems = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Explore' },
    { id: 'trips', label: 'My Trips' },
    { id: 'builder', label: 'Builder' },
    { id: 'budget', label: 'Budget' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'community', label: 'Community' },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (viewId) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  const displayName = user?.name ? user.name.split(' ')[0] : 'Rishabh';
  const displayInitials = user?.name
    ? user.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
    : 'RP';

  return (
    <header className="sticky top-0 z-40 pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all w-full">
      <nav className="glass-nav-pill rounded-full px-5 py-3 flex items-center justify-between shadow-2xl">
        {/* Left: Brand Logo */}
        <div
          className="flex items-center space-x-2.5 cursor-pointer group shrink-0"
          onClick={() => handleNavClick('home')}
        >
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Plane className="w-4 h-4 transform -rotate-45 text-white stroke-[2.5]" />
          </div>
          <span className="font-display text-2xl sm:text-3xl font-bold tracking-wider text-white uppercase select-none">
            GLOBETROTTER
          </span>
        </div>

        {/* Center: Navigation Menu */}
        <div className="hidden lg:flex items-center space-x-6 text-sm font-semibold">
          {mainNavItems.map((item) => {
            const isActive = currentView === item.id || (item.id === 'budget' && currentView === 'itinerary');
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id === 'budget' ? 'itinerary' : item.id)}
                className={`transition-colors relative py-1 text-xs font-bold tracking-wide ${
                  isActive ? 'text-emerald-400' : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2.5 shrink-0">
          {/* Screens (1-12) Blueprint Demo Navigator */}
          <BlueprintNavigator currentView={currentView} onNavigate={handleNavClick} />

          {/* User Profile Pill */}
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 transition-all text-xs font-bold text-white shadow-xs"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {displayInitials}
                </span>
                <span>{displayName}</span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-[#0e191f] rounded-2xl shadow-2xl border border-white/15 p-2 z-50 text-xs text-white animation-fade">
                  <div className="p-2 border-b border-white/10 mb-1">
                    <p className="font-bold text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                  </div>

                  <button
                    onClick={() => handleNavClick('profile')}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 flex items-center space-x-2 text-slate-200 font-semibold"
                  >
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Profile & Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-500/20 text-red-400 font-semibold flex items-center space-x-2"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 transition-all text-xs font-bold text-white"
            >
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                RP
              </span>
              <span>Sign In</span>
            </button>
          )}

          {/* + Plan Trip Button */}
          <button
            onClick={() => handleNavClick('create')}
            className="px-4 py-2 rounded-full btn-solid-white font-bold text-xs flex items-center space-x-1.5 shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Plan Trip</span>
          </button>

          {/* Mobile Drawer Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 bg-[#0e191f]/95 backdrop-blur-xl border border-white/15 rounded-3xl p-4 space-y-3 animation-fade text-white shadow-2xl">
          <div className="grid grid-cols-2 gap-2">
            {mainNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id === 'budget' ? 'itinerary' : item.id)}
                className={`text-left px-4 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                  currentView === item.id || (item.id === 'budget' && currentView === 'itinerary')
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white/5 text-slate-200 hover:bg-white/10 border border-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => handleNavClick('profile')}
              className="px-4 py-2 rounded-full border border-white/20 text-xs font-bold text-white bg-white/10"
            >
              Profile Settings
            </button>

            {isAuthenticated ? (
              <button
                onClick={logout}
                className="px-4 py-2 rounded-full bg-red-500/20 text-red-300 text-xs font-bold"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => {
                  openAuthModal('login');
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2 rounded-full bg-emerald-700 text-white text-xs font-bold"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
