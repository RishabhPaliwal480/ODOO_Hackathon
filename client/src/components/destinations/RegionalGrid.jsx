import { useState } from 'react';
import { DestinationCard } from './DestinationCard';

export function RegionalGrid({ cities = [], onPlan, onSave, savedCityIds = [] }) {
  const [selectedRegion, setSelectedRegion] = useState('all');

  const regions = [
    { id: 'all', label: 'All Regions' },
    { id: 'europe', label: 'Europe' },
    { id: 'asia', label: 'Asia' },
    { id: 'tropical', label: 'Tropical' },
  ];

  const curatedFallback = [
    {
      id: 'c1111111-1111-4111-8111-111111111111',
      name: 'Parisian Art & Romance',
      country: 'France',
      region: 'Europe',
      description: 'Eiffel summit access, private Louvre pass, and Seine River champagne cruise.',
      avg_daily_cost: 180,
      days: 7,
      total_cost: 1450,
      image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'c2222222-2222-4222-8222-222222222222',
      name: 'Tokyo Cyber & Shrines',
      country: 'Japan',
      region: 'Asia',
      description: 'Shibuya crossing, Asakusa Senso-ji temple, and Michelin ramen tours.',
      avg_daily_cost: 140,
      days: 6,
      total_cost: 1890,
      image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'c3333333-3333-4333-8333-333333333333',
      name: 'Amalfi Coastline Dream',
      country: 'Italy',
      region: 'Europe',
      description: 'Cliffside villas, lemon grove walks, and Mediterranean catamaran sailing.',
      avg_daily_cost: 130,
      days: 5,
      total_cost: 1680,
      image_url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'c4444444-4444-4444-8444-444444444444',
      name: 'Bali Tropical Haven',
      country: 'Indonesia',
      region: 'Tropical',
      description: 'Ubud rainforest terraces, waterfall hikes, coastal surfing, and sunset yoga.',
      avg_daily_cost: 50,
      days: 8,
      total_cost: 980,
      image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const displayItems = cities.length > 0
    ? cities.map((c) => ({
        ...c,
        days: 7,
        total_cost: Math.round((c.avg_daily_cost || 120) * 7),
      }))
    : curatedFallback;

  const filteredItems = displayItems.filter((item) => {
    if (selectedRegion === 'all') return true;
    const reg = (item.region || '').toLowerCase();
    if (selectedRegion === 'tropical') {
      return reg.includes('tropical') || reg.includes('southeast asia') || reg.includes('indonesia');
    }
    return reg.includes(selectedRegion.toLowerCase());
  });

  return (
    <section className="space-y-6 pt-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/15 pb-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-emerald-400">Curated Destinations</div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-1">Top Regional Selections</h2>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {regions.map((reg) => {
            const isSelected = selectedRegion === reg.id;
            return (
              <button
                key={reg.id}
                onClick={() => setSelectedRegion(reg.id)}
                className={`region-filter-btn px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-white text-[#0b1317] shadow-sm'
                    : 'bg-white/10 border border-white/15 text-white hover:bg-white/20'
                }`}
              >
                {reg.label}
              </button>
            );
          })}
        </div>
      </div>

      <div id="top-regions-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.slice(0, 8).map((dest) => (
          <DestinationCard
            key={dest.id || dest.name}
            destination={dest}
            onPlan={onPlan}
            onSave={onSave}
            isSaved={savedCityIds.includes(dest.id)}
          />
        ))}
      </div>
    </section>
  );
}
