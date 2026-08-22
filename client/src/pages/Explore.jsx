import { useEffect, useState } from 'react';
import { Activity, Compass, MapPin, Plus, Search } from 'lucide-react';
import { cityApi } from '../services';
import { useToast } from '../context/ToastContext';
import { money } from '../utils/formatters';

export function Explore({ onPlanCity, onSaveCity, savedCityIds = [] }) {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [costIndex, setCostIndex] = useState('');
  const [cities, setCities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExploreData = async () => {
    setLoading(true);
    try {
      const [cityRes, actRes] = await Promise.all([
        cityApi.list({ search, region, cost_index: costIndex }),
        cityApi.activities({ search }),
      ]);
      setCities(cityRes.data || []);
      setActivities(actRes.data || []);
    } catch (err) {
      showToast(err.message || 'Failed to search destinations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExploreData();
  }, [region, costIndex]);

  return (
    <div id="view-citySearch" className="app-view space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-emerald-400">Screen 8 • Explore</div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-0.5">Activity & City Search</h2>
        </div>
      </div>

      {/* Search Input Filter Bar */}
      <div className="glass-card-dark rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Eiffel, Tokyo, Ramen, Ubud..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs font-semibold text-white focus:outline-none focus:border-emerald-400"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e191f] border border-white/20 text-xs font-bold text-slate-200 outline-none"
          >
            <option value="">All Regions</option>
            <option value="Europe">Europe</option>
            <option value="Asia">Asia</option>
            <option value="Southeast Asia">Southeast Asia</option>
            <option value="North America">North America</option>
            <option value="South Asia">South Asia</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <button
            onClick={() => fetchExploreData()}
            className="w-full py-2.5 rounded-xl btn-solid-white font-bold text-xs"
          >
            Search Catalog
          </button>
        </div>
      </div>

      {/* Featured Activity Items List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Available Activities & Sightseeing Tours ({activities.length})
        </h3>

        {loading ? (
          <div className="glass-card-dark rounded-2xl p-8 text-center text-xs text-slate-400">Loading catalog items...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.map((act) => (
              <div
                key={act.id}
                className="glass-card-dark rounded-2xl p-5 flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="font-bold text-white text-sm">{act.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {act.duration_hours || 2} hours • {act.category || 'Sightseeing'} • {money(act.cost)}
                  </p>
                </div>
                <button
                  onClick={() => showToast(`Added "${act.name}" to your active trip builder!`, 'success')}
                  className="px-5 py-2 rounded-full btn-solid-white font-bold text-xs shrink-0"
                >
                  + Add
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
