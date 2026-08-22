import { useEffect, useState } from 'react';
import { Bookmark, Save, Trash2, User as UserIcon } from 'lucide-react';
import { Avatar } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { profileApi } from '../services';
import { money } from '../utils/formatters';

export function Profile({ onPlanCity }) {
  const { user, updateUser, isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    preferred_currency: user?.preferred_currency || 'USD',
  });
  const [savedCities, setSavedCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        preferred_currency: user.preferred_currency || 'USD',
      });
      fetchSaved();
    }
  }, [user]);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const res = await profileApi.saved();
      setSavedCities(res.data || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await profileApi.update(form);
      updateUser(res.user);
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveSaved = async (cityId) => {
    try {
      await profileApi.removeSavedDestination(cityId);
      setSavedCities((prev) => prev.filter((c) => c.id !== cityId));
      showToast('Destination removed from bookmarks', 'info');
    } catch (err) {
      showToast(err.message || 'Failed to remove bookmark', 'error');
    }
  };

  if (!isAuthenticated) {
    return (
      <div id="view-profile" className="app-view space-y-6">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">User Profile</h2>
        <div className="glass-card-dark rounded-2xl p-8 text-center space-y-4">
          <p className="text-xs text-slate-300">Sign in to view your user profile, saved destinations, and settings.</p>
          <button
            onClick={() => openAuthModal('login')}
            className="px-6 py-2.5 rounded-full btn-solid-white font-bold text-xs"
          >
            Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="view-profile" className="app-view space-y-6">
      <div className="border-b border-white/15 pb-4">
        <div className="text-xs font-bold uppercase tracking-widest text-emerald-400">Screen 7 • Account</div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-0.5">User Profile & Settings</h2>
      </div>

      {/* Header Profile Badge */}
      <div className="glass-card-dark rounded-2xl p-6 flex items-center space-x-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-xl font-bold font-display shrink-0">
          {(user?.name || 'Explorer').split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h3 id="profile-page-name" className="font-bold text-xl text-white">
            {user?.name || 'Rishabh Paliwal'}
          </h3>
          <p className="text-xs text-slate-300">
            {user?.email} • Software Engineer & Explorer • Jaipur, Rajasthan, India
          </p>
        </div>
      </div>

      {/* Profile Form & Saved Destinations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Edit Form */}
        <div className="lg:col-span-6 glass-card-dark rounded-2xl p-6 space-y-4">
          <h4 className="font-bold text-sm text-white uppercase tracking-wider">Edit Traveler Details</h4>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-sm font-semibold text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-sm font-semibold text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Preferred Currency</label>
              <select
                value={form.preferred_currency}
                onChange={(e) => setForm({ ...form, preferred_currency: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0e191f] border border-white/20 text-sm font-semibold text-white focus:border-emerald-400 focus:outline-none"
              >
                <option value="USD">USD ($) — United States Dollar</option>
                <option value="EUR">EUR (€) — Euro</option>
                <option value="INR">INR (₹) — Indian Rupee</option>
                <option value="GBP">GBP (£) — British Pound</option>
                <option value="JPY">JPY (¥) — Japanese Yen</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 rounded-full btn-solid-white font-bold text-xs flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Update Profile'}</span>
            </button>
          </form>
        </div>

        {/* Saved Bookmarks */}
        <div className="lg:col-span-6 glass-card-dark rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Bookmark className="w-4 h-4 text-emerald-400" />
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">
              Saved Destinations ({savedCities.length})
            </h4>
          </div>

          {loading ? (
            <p className="text-xs text-slate-400">Loading saved bookmarks...</p>
          ) : savedCities.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No saved destinations yet. Bookmark cities in the explore tab.</p>
          ) : (
            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {savedCities.map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-white text-xs">{c.name}, {c.country}</h5>
                    <span className="text-[11px] text-slate-400">{c.region} • {money(c.avg_daily_cost)}/day</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {onPlanCity && (
                      <button
                        onClick={() => onPlanCity(c)}
                        className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold"
                      >
                        Plan
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveSaved(c.id)}
                      className="p-1 text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
