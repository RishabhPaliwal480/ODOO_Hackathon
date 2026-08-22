import { useState } from 'react';
import {
  CheckCircle2,
  MapPin,
  PlusCircle,
  Trash2,
} from 'lucide-react';
import {
  AddActivityModal,
  AddStopModal,
} from '../components/itinerary';
import { useToast } from '../context/ToastContext';
import { itineraryApi } from '../services';
import { fmtDate, money } from '../utils/formatters';

export function Itinerary({
  trip,
  cities = [],
  catalogActivities = [],
  onRefreshTrip,
  onPublishItinerary,
  onNavigate,
}) {
  const { showToast } = useToast();
  const [addStopOpen, setAddStopOpen] = useState(false);
  const [addActivityOpen, setAddActivityOpen] = useState(false);
  const [selectedStopForActivity, setSelectedStopForActivity] = useState(null);

  if (!trip) {
    return (
      <div id="view-buildItinerary" className="app-view space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-emerald-400">Screen 5 • Builder</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-0.5">Build Itinerary</h2>
          </div>
        </div>
        <div className="glass-card-dark rounded-3xl p-12 text-center space-y-4">
          <MapPin className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="font-bold text-lg text-white">No active trip selected</h3>
          <p className="text-xs text-slate-300">Create a trip or select one from 'My Trips' to build your itinerary.</p>
          <button
            onClick={() => onNavigate('create')}
            className="px-6 py-2.5 rounded-full btn-solid-white font-bold text-xs"
          >
            + Create New Trip
          </button>
        </div>
      </div>
    );
  }

  const handleAddStop = async (stopPayload) => {
    try {
      await itineraryApi.addStop(stopPayload);
      showToast('City stop added to itinerary!', 'success');
      await onRefreshTrip();
    } catch (err) {
      showToast(err.message || 'Failed to add stop', 'error');
    }
  };

  const handleRemoveStop = async (stopId) => {
    if (!window.confirm('Remove this destination stop?')) return;
    try {
      await itineraryApi.removeStop(stopId);
      showToast('Stop removed from itinerary', 'info');
      await onRefreshTrip();
    } catch (err) {
      showToast(err.message || 'Failed to remove stop', 'error');
    }
  };

  const handleOpenAddActivity = (stop) => {
    setSelectedStopForActivity(stop);
    setAddActivityOpen(true);
  };

  const handleAddActivity = async (actPayload) => {
    try {
      await itineraryApi.addActivity(actPayload);
      showToast('Activity scheduled successfully!', 'success');
      await onRefreshTrip();
    } catch (err) {
      showToast(err.message || 'Failed to schedule activity', 'error');
    }
  };

  const handleRemoveActivity = async (activityId) => {
    try {
      await itineraryApi.removeActivity(activityId);
      showToast('Activity removed', 'info');
      await onRefreshTrip();
    } catch (err) {
      showToast(err.message || 'Failed to remove activity', 'error');
    }
  };

  const handleFinalize = () => {
    showToast('Itinerary Published!', 'success');
    onPublishItinerary(trip);
  };

  const stops = trip.stops || [];

  return (
    <div id="view-buildItinerary" className="app-view space-y-6">
      {/* Header with Title and Publish Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-emerald-400">Screen 5 • Builder</div>
          <h2 id="builder-trip-title" className="font-display text-3xl sm:text-4xl font-bold text-white mt-0.5">
            Build Itinerary: {trip.title}
          </h2>
        </div>
        <button
          onClick={handleFinalize}
          className="px-5 py-2 rounded-full btn-solid-white font-bold text-xs flex items-center space-x-2 shadow-lg"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Publish Itinerary</span>
        </button>
      </div>

      {/* Sections List */}
      <div id="itinerary-sections-list" className="space-y-4">
        {stops.length === 0 ? (
          <div className="glass-card-dark rounded-2xl p-6 text-center space-y-3">
            <p className="text-xs text-slate-300 italic">No daily stops configured yet. Click below to add your first destination section.</p>
          </div>
        ) : (
          stops.map((stop, idx) => {
            const stopCost =
              (Number(stop.lodging_cost) || 0) +
              (Number(stop.transport_cost) || 0) +
              (stop.activities || []).reduce((sum, a) => sum + (Number(a.cost) || 0), 0);

            return (
              <div key={stop.id} className="itinerary-section-card glass-card-dark rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                      {stop.stop_order || idx + 1}
                    </span>
                    <h3 className="font-bold text-base text-white">
                      Section {stop.stop_order || idx + 1}: {stop.city_name}, {stop.country}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                      Day {idx + 1}
                    </span>
                    <button
                      onClick={() => handleRemoveStop(stop.id)}
                      className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Remove Stop"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/15 text-xs text-slate-200 space-y-1">
                  <div className="font-semibold text-slate-300">
                    Dates: {fmtDate(stop.arrival_date)} to {fmtDate(stop.departure_date)} • Stay: {money(stop.lodging_cost)} • Transit: {money(stop.transport_cost)}
                  </div>
                  {stop.notes && <p className="italic text-slate-400">{stop.notes}</p>}
                </div>

                {/* Scheduled Activities */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span>Activities ({(stop.activities || []).length})</span>
                    <button
                      onClick={() => handleOpenAddActivity(stop)}
                      className="text-emerald-400 hover:text-emerald-300 font-bold text-xs"
                    >
                      + Add Activity
                    </button>
                  </div>

                  {(stop.activities || []).map((act) => (
                    <div
                      key={act.id}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-slate-200"
                    >
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{act.title} ({act.time_slot} • Day {act.day_number})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-emerald-400">{money(act.cost)}</span>
                        <button
                          onClick={() => handleRemoveActivity(act.id)}
                          className="p-1 text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-xs font-semibold text-slate-300">
                  Estimated Section Cost: <span className="text-emerald-400 font-bold">{money(stopCost)} USD</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Section Button */}
      <button
        onClick={() => setAddStopOpen(true)}
        className="w-full py-4 rounded-2xl border-2 border-dashed border-white/20 hover:border-white/40 bg-white/5 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-colors"
      >
        <PlusCircle className="w-4 h-4 text-emerald-400" />
        <span>Add Another Section / Day</span>
      </button>

      {/* Modals */}
      <AddStopModal
        isOpen={addStopOpen}
        onClose={() => setAddStopOpen(false)}
        onAddStop={handleAddStop}
        cities={cities}
        trip={trip}
      />

      <AddActivityModal
        isOpen={addActivityOpen}
        onClose={() => setAddActivityOpen(false)}
        onAddActivity={handleAddActivity}
        stop={selectedStopForActivity}
        catalogActivities={catalogActivities}
      />
    </div>
  );
}
