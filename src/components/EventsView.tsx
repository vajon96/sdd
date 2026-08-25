import React, { useState } from 'react';
import {
  Calendar,
  Award,
  MapPin,
  Clock,
  Users,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  X
} from 'lucide-react';
import { BNCCEvent, Cadet } from '../types';

interface EventsViewProps {
  events: BNCCEvent[];
  cadets: Cadet[];
  onSaveEvent: (event: BNCCEvent) => void;
  onDeleteEvent: (id: string) => void;
  isAdmin: boolean;
  onRequireAdmin: () => void;
}

export const EventsView: React.FC<EventsViewProps> = ({
  events,
  cadets,
  onSaveEvent,
  onDeleteEvent,
  isAdmin,
  onRequireAdmin
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('All');

  // New Event Form State
  const [formData, setFormData] = useState({
    title: '',
    type: 'Camp' as BNCCEvent['type'],
    date: new Date().toISOString().split('T')[0],
    location: "Cox's Bazar Platoon Grounds",
    description: '',
    batch: '2024',
    participatingCadetIds: [] as string[]
  });

  const filteredEvents = events.filter((e) => {
    if (eventTypeFilter !== 'All' && e.type !== eventTypeFilter) return false;
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newEvent: BNCCEvent = {
      id: 'event-' + Date.now(),
      title: formData.title,
      type: formData.type,
      date: formData.date,
      location: formData.location,
      description: formData.description,
      participatingCadetIds:
        formData.participatingCadetIds.length > 0
          ? formData.participatingCadetIds
          : cadets.slice(0, 10).map((c) => c.id),
      status: 'Upcoming',
      organizedBy: "Cox's Bazar City College BNCC Platoon",
      createdAt: new Date().toISOString()
    };

    onSaveEvent(newEvent);
    setIsCreateOpen(false);
    setFormData({
      title: '',
      type: 'Camp',
      date: new Date().toISOString().split('T')[0],
      location: "Cox's Bazar Platoon Grounds",
      description: '',
      batch: '2024',
      participatingCadetIds: []
    });
  };

  return (
    <div id="events-view" className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Camps, Parades & Certifications</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">BNCC Operations & Events</h1>
          <p className="text-xs text-white/50 mt-1">
            Track Battalion Camps, Victory Day Parades, Independence Day Gaurds, and Blood Drives.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (isAdmin) {
                setIsCreateOpen(true);
              } else {
                onRequireAdmin();
              }
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-400/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Schedule New Event</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
        {['All', 'Camp', 'Parade', 'Training', 'Social Work', 'Competition'].map((type) => (
          <button
            key={type}
            onClick={() => setEventTypeFilter(type)}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-colors ${
              eventTypeFilter === type
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/5'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map((evt) => {
          const participantCount = evt.participatingCadetIds.length;
          return (
            <div
              key={evt.id}
              className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 flex flex-col justify-between space-y-4 hover:border-amber-400/30 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/30">
                    {evt.type}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-white/50">{evt.date}</span>
                    {isAdmin && (
                      <button
                        onClick={() => onDeleteEvent(evt.id)}
                        className="p-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                        title="Delete Event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight">{evt.title}</h3>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">{evt.description}</p>

                <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5 text-xs text-white/60">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{evt.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    <span>{participantCount} Cadets Participated</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 text-[11px] text-white/40 font-mono">
                <span>Cox's Bazar City College Platoon</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Archived in Registry</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Event Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-lg w-full p-6 rounded-2xl bg-slate-900 border border-white/15 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">Schedule New BNCC Event</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-lg bg-white/5 text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-white/70 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Annual Battalion Camp (ABC) 2025"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1">Event Category</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Camp">Camp (BMTC/NIC/ABC)</option>
                    <option value="Parade">Parade / Drill</option>
                    <option value="Training">Field Training</option>
                    <option value="Social Work">Social & Volunteer Work</option>
                    <option value="Competition">Competition & Firing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 mb-1">Venue / Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. BNCC Academy, Baipail / Platoon Ground"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1">Operational Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Details regarding uniform order, briefing, and schedule..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
