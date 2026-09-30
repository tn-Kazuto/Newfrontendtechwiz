'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation } from 'lucide-react';

// Fix Leaflet's default icon path issues in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create a custom red icon for the active event
const activeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const defaultIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to recenter map when active event changes
function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { animate: true, duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

interface RealGpsMapProps {
  events: any[];
  activeEvent: any | null;
  onEventClick: (event: any) => void;
}

export default function RealGpsMap({ events, activeEvent, onEventClick }: RealGpsMapProps) {
  // Default to Vietnam center if no active event
  const center: [number, number] = activeEvent 
    ? [activeEvent.lat, activeEvent.lng] 
    : (events.length > 0 ? [events[0].lat, events[0].lng] : [14.0583, 108.2772]);

  return (
    <div className="relative w-full h-full min-h-[460px] sm:min-h-[540px] z-0 rounded-2xl overflow-hidden shadow-inner border border-slate-200">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={false}
        className="w-full h-full"
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController center={center} zoom={activeEvent ? 15 : 12} />

        {events.map((ev) => {
          const isActive = activeEvent?.id === ev.id;
          return (
            <Marker 
              key={ev.id} 
              position={[ev.lat, ev.lng]}
              icon={isActive ? activeIcon : defaultIcon}
              eventHandlers={{
                click: () => onEventClick(ev),
              }}
            >
              <Popup className="custom-popup">
                <div className="p-1 min-w-[200px]">
                  <h3 className="font-bold text-sm text-slate-900 mb-1 leading-tight">{ev.title}</h3>
                  <p className="text-xs text-slate-500 mb-2 flex items-start gap-1">
                    <MapPin size={12} className="shrink-0 mt-0.5 text-rose-500" />
                    <span className="line-clamp-2">{ev.address}</span>
                  </p>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                    <span className="text-xs font-semibold text-rose-600">{ev.price}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${ev.lat},${ev.lng}`, '_blank');
                      }}
                      className="flex items-center gap-1 text-[10px] uppercase font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                    >
                      <Navigation size={10} />
                      Directions
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* GPS Overlay Status */}
      <div className="absolute top-4 left-4 z-[400] flex items-center gap-2">
        <div className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200 text-slate-700 flex items-center gap-2 shadow-sm text-xs font-bold uppercase tracking-wider">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          GPS Live Tracking
        </div>
      </div>
    </div>
  );
}