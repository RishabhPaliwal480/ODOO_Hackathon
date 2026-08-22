import { useState } from 'react';
import { Button, Input, Modal, Select, Textarea } from '../ui';

export function AddStopModal({
  isOpen,
  onClose,
  onAddStop,
  cities = [],
  trip,
}) {
  const defaultCityId = cities[0]?.id || '';
  const [cityId, setCityId] = useState(defaultCityId);
  const [arrivalDate, setArrivalDate] = useState(trip?.start_date?.split('T')[0] || '2026-09-15');
  const [departureDate, setDepartureDate] = useState(trip?.end_date?.split('T')[0] || '2026-09-18');
  const [lodgingCost, setLodgingCost] = useState('350');
  const [transportCost, setTransportCost] = useState('120');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onAddStop({
        trip_id: trip.id,
        city_id: cityId || cities[0]?.id,
        arrival_date: arrivalDate,
        departure_date: departureDate,
        lodging_cost: Number(lodgingCost) || 0,
        transport_cost: Number(transportCost) || 0,
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
      title="Add Destination Stop"
      subtitle="Itinerary Builder"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Select City / Destination"
          value={cityId}
          onChange={(e) => setCityId(e.target.value)}
          required
        >
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}, {city.country} (${city.avg_daily_cost}/day)
            </option>
          ))}
        </Select>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Arrival Date"
            type="date"
            value={arrivalDate}
            onChange={(e) => setArrivalDate(e.target.value)}
            required
          />
          <Input
            label="Departure Date"
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Lodging Cost ($ USD)"
            type="number"
            min="0"
            value={lodgingCost}
            onChange={(e) => setLodgingCost(e.target.value)}
          />
          <Input
            label="Transport Cost ($ USD)"
            type="number"
            min="0"
            value={transportCost}
            onChange={(e) => setTransportCost(e.target.value)}
          />
        </div>

        <Textarea
          label="Accommodation & Travel Notes"
          placeholder="Hotel name, booking references, neighborhood tips..."
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="pt-2 flex justify-end space-x-3">
          <Button variant="outline" size="md" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="dark" size="md" type="submit" loading={loading}>
            Add Stop to Itinerary
          </Button>
        </div>
      </form>
    </Modal>
  );
}
