import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import { Badge, Card } from '../ui';
import { fmtDate, money } from '../../utils/formatters';

export function CalendarGrid({ trips = [], selectedTripId, onSelectTrip }) {
  const activeTrip = trips.find((t) => t.id === selectedTripId) || trips[0];

  // Extract all scheduled stops & activities
  const scheduleItems = [];
  if (activeTrip?.stops) {
    activeTrip.stops.forEach((stop) => {
      // Add stop arrival marker
      scheduleItems.push({
        type: 'stop',
        id: `stop-${stop.id}`,
        date: stop.arrival_date,
        endDate: stop.departure_date,
        city: stop.city_name,
        country: stop.country,
        title: `Arrive in ${stop.city_name}`,
        subtitle: `Stay ${money(stop.lodging_cost)} • Transit ${money(stop.transport_cost)}`,
        order: stop.stop_order,
      });

      // Add activities
      (stop.activities || []).forEach((act) => {
        scheduleItems.push({
          type: 'activity',
          id: `act-${act.id}`,
          date: stop.arrival_date, // base date offset by dayNumber
          city: stop.city_name,
          title: act.title,
          timeSlot: act.time_slot || 'Morning',
          cost: act.cost,
          dayNumber: act.day_number || 1,
          category: act.category,
        });
      });
    });
  }

  return (
    <div className="space-y-6">
      {/* Trip Switcher Bar */}
      {trips.length > 1 && (
        <div className="p-3 rounded-2xl bg-white border border-stone-200 flex items-center space-x-3 overflow-x-auto">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-2 shrink-0">
            Select Trip:
          </span>
          <div className="flex items-center space-x-2">
            {trips.map((t) => (
              <button
                key={t.id}
                onClick={() => onSelectTrip(t.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  (activeTrip?.id === t.id)
                    ? 'bg-[#18181b] text-white shadow-xs'
                    : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
                }`}
              >
                {t.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Timeline View */}
      {scheduleItems.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto text-slate-500">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-base text-slate-900">No scheduled items found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {activeTrip
              ? 'Add city stops and activities in the Itinerary Builder to view your calendar schedule.'
              : 'Create a trip to populate your travel calendar.'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scheduleItems.map((item, idx) => (
            <Card key={item.id || idx} className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
                    {fmtDate(item.date)}
                  </span>
                  {item.dayNumber && (
                    <Badge variant="stone">Day {item.dayNumber}</Badge>
                  )}
                </div>
                <Badge variant={item.type === 'stop' ? 'dark' : 'emerald'}>
                  {item.type === 'stop' ? 'City Stop' : item.timeSlot || 'Activity'}
                </Badge>
              </div>

              <div>
                <h4 className="font-bold text-base text-slate-900 line-clamp-1">{item.title}</h4>
                <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-semibold mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.city}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">{item.subtitle || item.category || 'Sightseeing'}</span>
                {item.cost !== undefined && (
                  <span className="font-extrabold text-emerald-800">{money(item.cost)}</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
