import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, ExternalLink } from 'lucide-react';
import { NetworkingEvent } from '../types';

export const NetworkingEvents: React.FC = () => {
  const [events, setEvents] = useState<NetworkingEvent[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/networking-events');
        if (Array.isArray(response.data)) {
          setEvents(response.data);
        } else {
          console.error('Expected array of events, got:', response.data);
          setEvents([]);
        }
      } catch (error) {
        console.error('Failed to fetch networking events:', error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="bento-card rounded-[2.5rem] p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-900/20 rounded-2xl border border-indigo-500/20">
          <Calendar className="w-6 h-6 text-indigo-400" />
        </div>
        <h3 className="text-xl font-black text-white tracking-tight">Networking & Opportunities</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.length > 0 ? events.map(event => (
          <div key={event.id} className="p-4 bg-slate-800/50 hover:bg-slate-800 rounded-2xl border border-white/5 transition-all group">
            <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors">{event.title}</h4>
            <p className="text-xs text-slate-400 mt-1">{event.date} • {event.location}</p>
            <a href={event.link} target="_blank" rel="noopener noreferrer" className="text-indigo-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 mt-3">
              View Details <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )) : (
          <p className="text-sm text-slate-500 italic">No upcoming events found.</p>
        )}
      </div>
    </div>
  );
};
