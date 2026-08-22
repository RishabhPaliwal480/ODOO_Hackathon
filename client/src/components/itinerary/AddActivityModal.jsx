import { useEffect, useState } from 'react';
import { Button, Input, Modal, Select, Textarea } from '../ui';

export function AddActivityModal({
  isOpen,
  onClose,
  onAddActivity,
  stop,
  catalogActivities = [],
}) {
  const [activityId, setActivityId] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [dayNumber, setDayNumber] = useState(1);
  const [timeSlot, setTimeSlot] = useState('Morning');
  const [cost, setCost] = useState('45');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Filter activities matching this stop's city if available
  const cityActivities = catalogActivities.filter(
    (a) => !stop?.city_id || a.city_id === stop.city_id
  );

  useEffect(() => {
    if (activityId) {
      const selected = catalogActivities.find((a) => a.id === activityId);
      if (selected) {
        setCustomTitle(selected.name);
        setCost(String(selected.cost || 0));
      }
    }
  }, [activityId, catalogActivities]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stop?.id) return;
    setLoading(true);
    try {
      await onAddActivity({
        trip_stop_id: stop.id,
        activity_id: activityId || undefined,
        custom_title: customTitle || 'Custom Activity',
        day_number: Number(dayNumber) || 1,
        time_slot: timeSlot,
        cost: Number(cost) || 0,
        notes: notes || undefined,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Schedule Activity in ${stop?.city_name || 'Stop'}`}
      subtitle="Itinerary Scheduler"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Catalog Preset Selector */}
        <Select
          label="Choose from Activity Catalog (or type custom below)"
          value={activityId}
          onChange={(e) => setActivityId(e.target.value)}
        >
          <option value="">-- Custom Activity --</option>
          {cityActivities.map((act) => (
            <option key={act.id} value={act.id}>
              {act.name} (${act.cost} - {act.category})
            </option>
          ))}
        </Select>

        <Input
          label="Activity Name / Title"
          placeholder="e.g. Seine Sunset Champagne Cruise"
          value={customTitle}
          onChange={(e) => setCustomTitle(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Day Number"
            type="number"
            min="1"
            max="30"
            value={dayNumber}
            onChange={(e) => setDayNumber(e.target.value)}
            required
          />

          <Select
            label="Time Slot"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
          >
            <option value="Morning">Morning (09:00 - 12:00)</option>
            <option value="Afternoon">Afternoon (13:00 - 17:00)</option>
            <option value="Evening">Evening (18:00 - 22:00)</option>
            <option value="Night">Late Night (22:00+)</option>
          </Select>

          <Input
            label="Estimated Cost ($ USD)"
            type="number"
            min="0"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
        </div>

        <Textarea
          label="Activity Details / Highlights"
          placeholder="Tickets, meeting point, attire recommendations..."
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="pt-2 flex justify-end space-x-3">
          <Button variant="outline" size="md" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="dark" size="md" type="submit" loading={loading}>
            Confirm & Schedule
          </Button>
        </div>
      </form>
    </Modal>
  );
}
