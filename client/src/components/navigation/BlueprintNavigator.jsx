import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LayoutGrid } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function BlueprintNavigator({ currentView, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const { openAuthModal } = useAuth();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const screens = [
    { num: 1, name: 'Login Screen (Modal)', action: () => openAuthModal('login') },
    { num: 2, name: 'Registration Screen (Modal)', action: () => openAuthModal('register') },
    { num: 3, name: 'Auto Landing Page (Hero)', view: 'home' },
    { num: 4, name: 'Create a New Trip Form', view: 'create' },
    { num: 5, name: 'Build Itinerary Screen', view: 'builder' },
    { num: 6, name: 'User Trip Listing', view: 'trips' },
    { num: 7, name: 'User Profile Page & Details', view: 'profile' },
    { num: 8, name: 'Activity / City Search Page', view: 'explore' },
    { num: 9, name: 'Itinerary View with Budget', view: 'itinerary' },
    { num: 10, name: 'Community Tab Screen', view: 'community' },
    { num: 11, name: 'Calendar View Screen', view: 'calendar' },
    { num: 12, name: 'Admin / Analytics Dashboard', view: 'analytics' },
  ];

  const handleSelect = (screen) => {
    setIsOpen(false);
    if (screen.action) {
      screen.action();
    } else if (screen.view) {
      onNavigate(screen.view);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-colors"
        title="Blueprint Wireframe Screen Navigator"
      >
        <LayoutGrid className="w-3.5 h-3.5 text-white" />
        <span>Screens (1-12)</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-[#0e191f] rounded-2xl shadow-2xl border border-white/15 p-2.5 z-50 text-xs text-white animation-fade">
          <div className="px-2 py-1.5 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
            Wireframe Blueprint Navigator
          </div>
          <div className="grid grid-cols-1 gap-1 max-h-96 overflow-y-auto pr-1">
            {screens.map((screen) => (
              <button
                key={screen.num}
                onClick={() => handleSelect(screen)}
                className={`text-left px-2.5 py-1.5 rounded-lg hover:bg-white/10 flex items-center space-x-2.5 font-medium transition-colors ${
                  screen.view === currentView ? 'bg-emerald-800/60 text-white font-bold' : 'text-slate-200'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    screen.view === currentView
                      ? 'bg-emerald-700 text-white'
                      : 'bg-white/10 text-slate-300'
                  }`}
                >
                  {screen.num}
                </span>
                <span className="truncate">{screen.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
