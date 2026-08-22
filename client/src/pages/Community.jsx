import { useEffect, useState } from 'react';
import { Copy, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { tripsApi } from '../services';

export function Community({ onTripCopied }) {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copyingId, setCopyingId] = useState(null);

  const fallbackFeed = [
    {
      id: 'e1111111-1111-4111-8111-111111111111',
      title: 'Parisian 7-Day Romance Route',
      description: 'Shared by Rishabh Paliwal • Book Eiffel summit 3 weeks in advance! Includes Seine dinner cruise and Louvre private pass.',
      organizer_name: 'Rishabh Paliwal',
      likes: 142,
    },
    {
      id: 'e2222222-2222-4222-8222-222222222222',
      title: 'Tokyo Cyberpunk & Historic Shrines',
      description: 'Shared by Alex Mercer • Golden Gai nightlife, Shibuya Sky sunset passes, and Tsukiji morning food stalls.',
      organizer_name: 'Alex Mercer',
      likes: 89,
    },
  ];

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const res = await tripsApi.publicFeed();
      setFeed(res.data?.length ? res.data : fallbackFeed);
    } catch {
      setFeed(fallbackFeed);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleCopyTrip = async (trip) => {
    if (!isAuthenticated) {
      openAuthModal('login');
      showToast('Please sign in to clone this itinerary to your account.', 'info');
      return;
    }

    setCopyingId(trip.id);
    try {
      const res = await tripsApi.copy(trip.id);
      showToast(`Trip "${trip.title}" copied to your account!`, 'success');
      if (onTripCopied) onTripCopied(res.data);
    } catch (err) {
      showToast(err.message || 'Failed to copy trip', 'error');
    } finally {
      setCopyingId(null);
    }
  };

  return (
    <div id="view-community" className="app-view space-y-6">
      <div className="border-b border-white/15 pb-4">
        <div className="text-xs font-bold uppercase tracking-widest text-emerald-400">Screen 10 • Community</div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-0.5">Community Travel Feed</h2>
      </div>

      <div className="space-y-4">
        {feed.map((item) => (
          <div key={item.id} className="glass-card-dark rounded-2xl p-6 space-y-3">
            <h4 className="font-bold text-base text-white">{item.title}</h4>
            <p className="text-xs text-slate-300">{item.description}</p>
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={(e) => {
                  e.currentTarget.classList.toggle('text-rose-400');
                  showToast('Liked community itinerary', 'info');
                }}
                className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 font-bold text-xs text-white flex items-center space-x-1.5 transition-colors"
              >
                <span>❤️</span>
                <span>{item.likes || 142} Likes</span>
              </button>

              <button
                onClick={() => handleCopyTrip(item)}
                disabled={copyingId === item.id}
                className="px-4 py-1.5 rounded-full btn-solid-white font-bold text-xs flex items-center space-x-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copyingId === item.id ? 'Copying...' : 'Copy Trip'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
