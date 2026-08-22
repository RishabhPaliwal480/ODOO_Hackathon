import { useState } from 'react';
import { Lock, ShieldCheck, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function AuthModal() {
  const { authModalOpen, authModalMode, closeAuthModal, login, register } = useAuth();
  const { showToast } = useToast();
  const [mode, setMode] = useState(authModalMode || 'login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: 'Rishabh Paliwal',
    email: 'alex@globetrotter.io',
    password: 'password123',
    phone: '+919876543210',
  });

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        const loggedInUser = await login({ email: form.email, password: form.password });
        showToast(`Signed in successfully. Welcome, ${loggedInUser.name}!`, 'success');
      } else {
        const newUser = await register(form);
        showToast(`Account registered! Welcome, ${newUser.name}!`, 'success');
      }
      closeAuthModal();
    } catch (err) {
      setError(err.message || 'Authentication failed');
      showToast(err.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-modal" className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="glass-card-dark rounded-3xl max-w-md w-full p-8 border border-white/20 shadow-2xl relative space-y-5 text-white">
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mode Tabs */}
        <div className="flex space-x-2 border-b border-white/10 pb-3">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`font-display text-2xl sm:text-3xl font-bold transition-colors ${
              mode === 'login' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Sign In
          </button>
          <span className="font-display text-2xl text-slate-600">/</span>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`font-display text-2xl sm:text-3xl font-bold transition-colors ${
              mode === 'register' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-xs font-bold text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'register' && (
            <div>
              <label className="block text-slate-300 font-bold mb-1">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-sm font-semibold text-white focus:outline-none"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-bold mb-1">Email Address</label>
            <input
              type="text"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-sm font-semibold text-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-sm font-semibold text-white focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full btn-solid-white font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-transform"
          >
            {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <span>Demo: alex@globetrotter.io / password123</span>
          <span className="flex items-center space-x-1 text-emerald-400 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure</span>
          </span>
        </div>
      </div>
    </div>
  );
}
