import { useState } from 'react';
import { Send, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export function ContactModal({ isOpen, onClose }) {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    showToast('Message sent! Our travel concierges will reach out shortly.', 'success');
    setTimeout(() => {
      setSent(false);
      setForm({ name: '', email: '', message: '' });
      onClose();
    }, 1200);
  };

  return (
    <div id="contact-modal" className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="glass-card-dark rounded-3xl max-w-md w-full p-8 border border-white/20 shadow-2xl relative space-y-4 text-white">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-display text-3xl font-bold text-white">Contact GlobeTrotter</h3>
        
        <div className="space-y-2 text-xs font-semibold text-slate-300">
          <div><strong>Email:</strong> contact@globetrotter.io</div>
          <div><strong>Phone:</strong> +91 98765 43210</div>
          <div><strong>Hub:</strong> Jaipur, Rajasthan, India</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          <input
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white focus:outline-none"
          />
          <input
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white focus:outline-none"
          />
          <textarea
            rows={3}
            placeholder="How can we assist your journey?"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-xs text-white focus:outline-none"
          />
          <button
            type="submit"
            disabled={sent}
            className="w-full py-2.5 rounded-full btn-solid-white font-bold text-xs flex items-center justify-center space-x-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{sent ? 'Message Sent!' : 'Send Message'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
