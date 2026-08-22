import { useEffect, useRef, useState } from 'react';
import {
  Activity as ActivityIcon,
  ArrowRight,
  BarChart3,
  Calendar as CalendarIcon,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Compass,
  Copy,
  DollarSign,
  Eye,
  Globe,
  Heart,
  Layers,
  LayoutGrid,
  Lock,
  LogOut,
  MapPin,
  Pause,
  PieChart,
  Plane,
  Play,
  Plus,
  PlusCircle,
  Search,
  Share,
  Trash2,
  User as UserIcon,
  UserCheck,
  UserCog,
  Users,
  X,
} from 'lucide-react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/navigation/Header';
import { AuthModal } from './components/modals/AuthModal';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { CreateTrip } from './pages/CreateTrip';
import { Itinerary } from './pages/Itinerary';
import { ItineraryView } from './pages/ItineraryView';
import { MyTrips } from './pages/MyTrips';
import { Profile } from './pages/Profile';
import { Community } from './pages/Community';
import { Calendar } from './pages/Calendar';
import { Budget } from './pages/Budget';
import { Analytics } from './pages/Analytics';
import { tripsApi } from './services/tripsApi';
import { cityApi } from './services/cityApi';
import { itineraryApi } from './services/itineraryApi';
import { profileApi } from './services/profileApi';
import { analyticsApi } from './services/analyticsApi';

function VideoBackground({ isPlaying, onToggle, videoSrc }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    if (isPlaying) {
      try {
        const p = v.play?.();
        if (p && typeof p.catch === 'function') {
          p.catch(() => {});
        }
      } catch {}
    } else {
      try {
        v.pause?.();
      } catch {}
    }
  }, [isPlaying]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const handleFirstInteraction = () => {
      if (v && v.paused && isPlaying) {
        v.muted = true;
        try {
          const p = v.play?.();
          if (p && typeof p.catch === 'function') {
            p.catch(() => {});
          }
        } catch {}
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('scroll', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [isPlaying]);

  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none bg-[#060d11]">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=2400&auto=format&fit=crop&q=90')",
          filter: 'brightness(0.92) contrast(1.05)',
        }}
      />
      <video
        id="fullBgVideo"
        ref={videoRef}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover filter brightness-[0.92] contrast-[1.05]"
        onError={() => {
          if (videoSrc === '/219300.mp4') {
            // Fallback handled by parent
          }
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-[#060d11]/85 pointer-events-none" />
      <div className="absolute inset-0 bg-black/15 pointer-events-none" />
    </div>
  );
}

function AppRoutes({ isPlayingVideo, onToggleVideo, videoSrc, setVideoSrc }) {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [trips, setTrips] = useState([]);
  const [cities, setCities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const fetchTrips = async () => {
    if (!isAuthenticated) return;
    setLoadingTrips(true);
    try {
      const res = await tripsApi.list();
      if (res.data) {
        setTrips(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch trips:', err);
    } finally {
      setLoadingTrips(false);
    }
  };

  const fetchCities = async () => {
    setLoadingCities(true);
    try {
      const res = await cityApi.list({ limit: 50 });
      if (res.data) {
        setCities(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch cities:', err);
    } finally {
      setLoadingCities(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await cityApi.activities({ limit: 50 });
      if (res.data) {
        setActivities(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch activities:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTrips();
    } else {
      setTrips([]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCities();
    fetchActivities();
  }, []);

  const onNavigate = (view) => {
    const routes = {
      home: '/',
      explore: '/explore',
      createTrip: '/create',
      itinerary: '/itinerary',
      myTrips: '/trips',
      community: '/community',
      calendar: '/calendar',
      budget: '/budget',
      profile: '/profile',
      analytics: '/analytics',
    };
    if (routes[view]) navigate(routes[view]);
  };

  const onPlanCity = (city) => {
    navigate('/create', { state: { destination: `${city.name}, ${city.country}`, budget: city.avg_daily_cost * 7 } });
  };

  const handleTripCreated = async (trip) => {
    showToast(`Trip "${trip.title}" created!`, 'success');
    await fetchTrips();
    setCurrentTrip(trip);
    navigate('/itinerary');
  };

  const handleTripSelected = async (trip) => {
    try {
      const res = await tripsApi.getById(trip.id);
      if (res.data) {
        setCurrentTrip(res.data);
        navigate('/itinerary');
      }
    } catch (err) {
      showToast(err.message || 'Failed to load trip', 'error');
    }
  };

  const handleTripView = async (trip) => {
    try {
      const res = await tripsApi.getById(trip.id);
      if (res.data) {
        setCurrentTrip(res.data);
        navigate('/itinerary/view');
      }
    } catch (err) {
      showToast(err.message || 'Failed to load trip', 'error');
    }
  };

  const handleTripDelete = async (tripId) => {
    try {
      await tripsApi.remove(tripId);
      showToast('Trip deleted', 'info');
      await fetchTrips();
    } catch (err) {
      showToast(err.message || 'Failed to delete trip', 'error');
    }
  };

  const handleTripCopied = async (newTrip) => {
    showToast(`Trip "${newTrip.title}" copied to your account!`, 'success');
    await fetchTrips();
  };

  const handleRefreshTrip = async () => {
    if (!currentTrip) return;
    try {
      const res = await tripsApi.getById(currentTrip.id);
      if (res.data) {
        setCurrentTrip(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to refresh trip', 'error');
    }
  };

  const handlePublishItinerary = (trip) => {
    showToast('Itinerary Published!', 'success');
    navigate('/itinerary/view');
  };

  const renderPage = (Component, props = {}) => (
    <Component
      {...props}
      trips={trips}
      cities={cities}
      activities={activities}
      currentTrip={currentTrip}
      loadingTrips={loadingTrips}
      loadingCities={loadingCities}
      isPlayingVideo={isPlayingVideo}
      onToggleVideo={onToggleVideo}
      videoSrc={videoSrc}
      setVideoSrc={setVideoSrc}
      onNavigate={onNavigate}
      onPlanCity={onPlanCity}
      onTripCreated={handleTripCreated}
      onTripSelected={handleTripSelected}
      onTripView={handleTripView}
      onTripDelete={handleTripDelete}
      onTripCopied={handleTripCopied}
      onRefreshTrip={handleRefreshTrip}
      onPublishItinerary={handlePublishItinerary}
    />
  );

  return (
    <Routes>
      <Route path="/" element={renderPage(Home, { user })} />
      <Route path="/explore" element={renderPage(Explore, { onPlanCity, onNavigate })} />
      <Route path="/create" element={renderPage(CreateTrip, { onTripCreated: handleTripCreated, onNavigate })} />
      <Route path="/itinerary" element={renderPage(Itinerary, { trip: currentTrip, cities, catalogActivities: activities, onRefreshTrip: handleRefreshTrip, onPublishItinerary: handlePublishItinerary, onNavigate })} />
      <Route path="/itinerary/view" element={renderPage(ItineraryView, { trip: currentTrip, onEditInBuilder: (trip) => { setCurrentTrip(trip); navigate('/itinerary'); }, onBack: () => navigate('/itinerary') })} />
      <Route path="/trips" element={renderPage(MyTrips, { trips, loading: loadingTrips, onOpenTrip: handleTripSelected, onViewTrip: handleTripView, onDeleteTrip: handleTripDelete, onNavigate })} />
      <Route path="/profile" element={renderPage(Profile, { onPlanCity })} />
      <Route path="/community" element={renderPage(Community, { onTripCopied: handleTripCopied })} />
      <Route path="/calendar" element={renderPage(Calendar, { trips })} />
      <Route path="/budget" element={renderPage(Budget, { trips })} />
      <Route path="/analytics" element={renderPage(Analytics, { userTrips: trips })} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function GlobeTrotterApp() {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isPlayingVideo, setIsPlayingVideo] = useState(true);
  const [videoSrc, setVideoSrc] = useState('/219300.mp4');

  const toggleVideoPlayback = () => {
    setIsPlayingVideo((prev) => !prev);
  };

  const onNavigate = (view) => {
    const routes = {
      home: '/',
      explore: '/explore',
      createTrip: '/create',
      itinerary: '/itinerary',
      myTrips: '/trips',
      community: '/community',
      calendar: '/calendar',
      budget: '/budget',
      profile: '/profile',
      analytics: '/analytics',
      create: '/create',
    };
    if (routes[view]) navigate(routes[view]);
  };

  const getCurrentView = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path.startsWith('/explore')) return 'explore';
    if (path.startsWith('/create')) return 'create';
    if (path.startsWith('/itinerary')) return 'itinerary';
    if (path.startsWith('/trips')) return 'myTrips';
    if (path.startsWith('/community')) return 'community';
    if (path.startsWith('/calendar')) return 'calendar';
    if (path.startsWith('/budget')) return 'budget';
    if (path.startsWith('/profile')) return 'profile';
    if (path.startsWith('/analytics')) return 'analytics';
    return 'home';
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060d11]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-sm">Loading GlobeTrotter...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100 antialiased selection:bg-emerald-600 selection:text-white relative overflow-x-hidden">
      <VideoBackground 
        isPlaying={isPlayingVideo} 
        onToggle={toggleVideoPlayback}
        videoSrc={videoSrc}
      />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header currentView={getCurrentView()} onNavigate={onNavigate} />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <AppRoutes 
            isPlayingVideo={isPlayingVideo}
            onToggleVideo={toggleVideoPlayback}
            videoSrc={videoSrc}
            setVideoSrc={setVideoSrc}
          />
        </main>
      </div>
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <GlobeTrotterApp />
          </ErrorBoundary>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}