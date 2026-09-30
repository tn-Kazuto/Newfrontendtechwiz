'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocationEvent } from '../data/locationEventsData';
import { LocateFixed, Maximize2, Compass, Layers, Sparkles } from 'lucide-react';

// Fix default leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export interface EventLeafletMapProps {
  userLocation: {
    lat: number;
    lng: number;
    name?: string;
    isGpsActive?: boolean;
  };
  events: LocationEvent[];
  selectedEventId: string;
  onSelectEvent: (eventId: string) => void;
  className?: string;
  height?: string;
}

type TileTheme = 'osm' | 'dark' | 'voyager';

const TILE_CONFIG: Record<TileTheme, { name: string; url: string; attribution: string; subdomains: string[] }> = {
  osm: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
    subdomains: ['a', 'b', 'c'],
  },
  dark: {
    name: 'Satellite / Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: ['a', 'b', 'c', 'd'],
  },
  voyager: {
    name: 'Voyager Light',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: ['a', 'b', 'c', 'd'],
  },
};

const getEventMarkerConfig = (type: LocationEvent['type']) => {
  switch (type) {
    case 'stadium_concert':
      return { bg: '#f59e0b', text: '#000000', icon: '🎟️', label: 'Concert' };
    case 'cup_sleeve_cafe':
      return { bg: '#ff2e93', text: '#ffffff', icon: '☕', label: 'Cafe' };
    case 'photocard_trade':
      return { bg: '#8b5cf6', text: '#ffffff', icon: '✨', label: 'Trade' };
    case 'anime_expo':
      return { bg: '#f43f5e', text: '#ffffff', icon: '🎭', label: 'Cosplay' };
    case 'gaming_arena':
      return { bg: '#10b981', text: '#000000', icon: '🎮', label: 'Gaming' };
    default:
      return { bg: '#0284c7', text: '#ffffff', icon: '📍', label: 'Event' };
  }
};

export const EventLeafletMap: React.FC<EventLeafletMapProps> = ({
  userLocation,
  events,
  selectedEventId,
  onSelectEvent,
  className = '',
  height = '520px',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userCircleRef = useRef<L.Circle | null>(null);

  const [activeTheme, setActiveTheme] = useState<TileTheme>('osm');
  const [mapReady, setMapReady] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const initialLat = userLocation?.lat || 21.0285;
    const initialLng = userLocation?.lng || 105.8542;

    const map = L.map(containerRef.current, {
      center: [initialLat, initialLng],
      zoom: 13,
      zoomControl: false, // We place custom zoom controls or top-right
      attributionControl: false, // We render clean attribution overlay
    });

    // Custom positioned Zoom Control in bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initial OpenStreetMap Tile Layer
    const tileConfig = TILE_CONFIG[activeTheme];
    const tileLayer = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      subdomains: tileConfig.subdomains,
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Layer group for event markers
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    mapRef.current = map;
    setMapReady(true);

    // Invalidate size to guarantee no partial grey render
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      map.remove();
      mapRef.current = null;
      tileLayerRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  // Update tile layer when activeTheme changes
  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return;
    const map = mapRef.current;
    map.removeLayer(tileLayerRef.current);

    const tileConfig = TILE_CONFIG[activeTheme];
    const newTileLayer = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      subdomains: tileConfig.subdomains,
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  }, [activeTheme]);

  // Update User Location Marker & Accuracy Ripple
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;
    const map = mapRef.current;

    // Remove old user marker and circle
    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }
    if (userCircleRef.current) {
      map.removeLayer(userCircleRef.current);
      userCircleRef.current = null;
    }

    const userPos: [number, number] = [userLocation.lat, userLocation.lng];

    // Pulsing GPS radar circle radius (approx 1.5km or visual pulse)
    const circle = L.circle(userPos, {
      radius: 1200,
      color: '#3b82f6',
      fillColor: '#3b82f6',
      fillOpacity: 0.12,
      weight: 1.5,
      dashArray: '4, 4',
    }).addTo(map);
    userCircleRef.current = circle;

    // Custom Neo-Brutalist HTML User Marker
    const userIcon = L.divIcon({
      className: 'leaflet-user-div-icon',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%); pointer-events: auto;">
          <span style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: rgba(59, 130, 246, 0.45); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
          <div style="width: 20px; height: 20px; border-radius: 50%; background: #2563eb; border: 2.5px solid #ffffff; box-shadow: 0 0 12px rgba(37,99,235,0.9); display: flex; align-items: center; justify-content: center; z-index: 2;">
            <div style="width: 6px; height: 6px; border-radius: 50%; background: #ffffff;"></div>
          </div>
          <div style="margin-top: 3px; padding: 2px 6px; background: #000000; color: #ffffff; font-family: monospace; font-size: 9px; font-weight: 900; letter-spacing: 0.08em; border: 1.5px solid #60a5fa; border-radius: 0px; white-space: nowrap; box-shadow: 2px 2px 0px #000000; z-index: 3;">
            YOU ARE HERE
          </div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const userMarker = L.marker(userPos, { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
    userMarker.bindPopup(`
      <div style="font-family: monospace; font-size: 11px; padding: 4px;">
        <div style="font-weight: 800; color: #2563eb; margin-bottom: 2px;">📍 CURRENT USER POSITION</div>
        <div style="font-size: 10px; color: #334155;">${userLocation.name || 'Hanoi, Vietnam'}</div>
        <div style="font-size: 9px; color: #64748b; margin-top: 2px;">${userLocation.lat.toFixed(4)}°N, ${userLocation.lng.toFixed(4)}°E</div>
      </div>
    `);

    userMarkerRef.current = userMarker;
  }, [userLocation, mapReady]);

  // Update Event Markers on map
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;
    const markersLayer = markersLayerRef.current;
    markersLayer.clearLayers();

    events.forEach(ev => {
      const isSelected = ev.id === selectedEventId;
      const config = getEventMarkerConfig(ev.type);
      const distanceBadge = ev.distanceKm != null ? `${ev.distanceKm} km` : '';

      const borderStyle = isSelected
        ? 'border: 2px solid #ffffff; outline: 3px solid #ff2e93; box-shadow: 0 0 16px rgba(255, 46, 147, 0.9), 3px 3px 0px #000000;'
        : 'border: 2px solid #000000; box-shadow: 2.5px 2.5px 0px #000000;';

      const iconHtml = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); cursor: pointer;">
          ${isSelected ? `<span style="position: absolute; top: -6px; width: 44px; height: 44px; border-radius: 50%; background: rgba(255, 46, 147, 0.4); animation: ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>` : ''}
          
          <div style="display: flex; align-items: center; gap: 4px; padding: 4px 7px; background: ${config.bg}; color: ${config.text}; border-radius: 0px; ${borderStyle} white-space: nowrap; font-family: monospace; font-size: 10px; font-weight: 800; z-index: ${isSelected ? 50 : 20};">
            <span>${config.icon}</span>
            ${distanceBadge ? `<span>${distanceBadge}</span>` : ''}
          </div>

          <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 6px solid ${isSelected ? '#ff2e93' : config.bg}; margin-top: -1px; filter: drop-shadow(0 1px 1px rgba(0,0,0,0.5));"></div>

          <div style="margin-top: 2px; padding: 1px 5px; background: rgba(0, 0, 0, 0.9); color: #ffffff; font-size: 9px; font-family: sans-serif; font-weight: 700; border-radius: 0px; border: 1px solid rgba(255,255,255,0.3); max-width: 130px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; box-shadow: 1px 1px 0px #000000;">
            ${ev.title}
          </div>
        </div>
      `;

      const markerIcon = L.divIcon({
        className: `custom-event-marker marker-${ev.id}`,
        html: iconHtml,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([ev.lat, ev.lng], {
        icon: markerIcon,
        zIndexOffset: isSelected ? 500 : 100,
      });

      // Rich popup content
      const popupHtml = `
        <div style="font-family: sans-serif; width: 220px; padding: 2px;">
          <div style="position: relative; width: 100%; height: 95px; border-radius: 0px; overflow: hidden; margin-bottom: 6px; border: 1.5px solid #000000;">
            <img src="${ev.coverImage}" alt="${ev.title}" style="width: 100%; height: 100%; object-fit: cover;" />
            <span style="position: absolute; top: 4px; right: 4px; background: #000000; color: #ffffff; font-family: monospace; font-size: 9px; font-weight: 800; padding: 2px 6px; border: 1px solid #ffd60a;">
              ${distanceBadge}
            </span>
          </div>
          <div style="font-family: monospace; font-size: 9px; font-weight: 800; color: #ff2e93; text-transform: uppercase;">
            ${ev.artistOrHost}
          </div>
          <div style="font-size: 13px; font-weight: 900; color: #000000; line-height: 1.2; margin: 2px 0 4px 0;">
            ${ev.title}
          </div>
          <div style="font-size: 11px; color: #475569; display: flex; align-items: center; gap: 3px; margin-bottom: 6px;">
            📍 <strong>${ev.venue}</strong>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; padding-top: 6px; border-top: 1px solid #e2e8f0;">
            <span style="font-weight: 800; color: #059669; font-family: monospace;">
              ${ev.freeEntry ? 'FREE RSVP' : `$${ev.priceUSD}`}
            </span>
            <button 
              id="leaflet-popup-btn-${ev.id}" 
              data-event-id="${ev.id}"
              style="background: #000000; color: #ffffff; border: 1.5px solid #000000; padding: 3px 8px; font-size: 10px; font-weight: 800; font-family: monospace; cursor: pointer; text-transform: uppercase; border-radius: 0px;"
            >
              SELECT →
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        className: 'custom-leaflet-popup',
        maxWidth: 240,
      });

      marker.on('click', () => {
        onSelectEvent(ev.id);
      });

      marker.on('popupopen', () => {
        setTimeout(() => {
          const btn = document.getElementById(`leaflet-popup-btn-${ev.id}`);
          if (btn) {
            btn.onclick = (e) => {
              e.stopPropagation();
              onSelectEvent(ev.id);
              marker.closePopup();
            };
          }
        }, 50);
      });

      markersLayer.addLayer(marker);
    });
  }, [events, selectedEventId, mapReady]);

  // Smooth flyTo active selected event when selectedEventId changes
  useEffect(() => {
    if (!mapRef.current || !selectedEventId) return;
    const target = events.find(e => e.id === selectedEventId);
    if (target) {
      mapRef.current.flyTo([target.lat, target.lng], Math.max(mapRef.current.getZoom(), 13), {
        duration: 0.9,
      });
    }
  }, [selectedEventId]);

  // Handlers for HUD controls
  const handleRecenterMe = () => {
    if (!mapRef.current || !userLocation) return;
    mapRef.current.flyTo([userLocation.lat, userLocation.lng], 13, { duration: 1.0 });
  };

  const handleFitAllEvents = () => {
    if (!mapRef.current || events.length === 0) return;
    const points: [number, number][] = events.map(e => [e.lat, e.lng]);
    if (userLocation) {
      points.push([userLocation.lat, userLocation.lng]);
    }
    const bounds = L.latLngBounds(points);
    mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, duration: 1.0 });
  };

  return (
    <div 
      className={`relative w-full overflow-hidden border-2 border-black bg-slate-900 ${className}`} 
      style={{ height, isolation: 'isolate', zIndex: 10 }}
    >
      {/* Map DOM Container */}
      <div ref={containerRef} className="w-full h-full relative z-0" tabIndex={0} />

      {/* Top HUD Bar Overlay: GPS Status & Coordinates & Map Actions */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex items-center justify-between gap-2 pointer-events-none flex-wrap">
        {/* Left: GPS Satellite Radar badge */}
        <div className="pointer-events-auto px-3 py-1.5 bg-black/90 backdrop-blur-md border-2 border-black text-white flex items-center gap-2 shadow-[2px_2px_0px_#000000]">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-emerald-400">
            OpenStreetMap GPS: {events.length} Venues
          </span>
        </div>

        {/* Right HUD Controls: Quick Actions & Tile Switcher */}
        <div className="pointer-events-auto flex items-center gap-2 flex-wrap">
          {/* Coordinates indicator */}
          <span className="hidden sm:inline-flex px-2.5 py-1 bg-white/95 text-black border-2 border-black text-[10px] font-mono font-bold shadow-[2px_2px_0px_#000000]">
            {userLocation.lat.toFixed(2)}°N, {userLocation.lng.toFixed(2)}°E
          </span>

          {/* Tile Layer Switcher */}
          <div className="flex items-center bg-white border-2 border-black shadow-[2px_2px_0px_#000000] p-0.5">
            <button
              type="button"
              onClick={() => setActiveTheme('osm')}
              title="OpenStreetMap Standard"
              className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer ${
                activeTheme === 'osm'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-slate-100'
              }`}
            >
              OSM
            </button>
            <button
              type="button"
              onClick={() => setActiveTheme('dark')}
              title="High-Tech Dark Radar"
              className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer ${
                activeTheme === 'dark'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-slate-100'
              }`}
            >
              Radar Dark
            </button>
            <button
              type="button"
              onClick={() => setActiveTheme('voyager')}
              title="Clean Voyager Style"
              className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer ${
                activeTheme === 'voyager'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-slate-100'
              }`}
            >
              Clean
            </button>
          </div>

          {/* Recenter on User GPS */}
          <button
            type="button"
            onClick={handleRecenterMe}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#ffd60a] hover:bg-yellow-300 text-black border-2 border-black text-[11px] font-mono font-bold uppercase transition-all shadow-[2px_2px_0px_#000000] cursor-pointer"
            title="Recenter to my location"
          >
            <LocateFixed size={12} className="shrink-0" />
            <span className="hidden sm:inline">Me</span>
          </button>

          {/* Fit all pins on screen */}
          <button
            type="button"
            onClick={handleFitAllEvents}
            className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 text-black border-2 border-black text-[11px] font-mono font-bold uppercase transition-all shadow-[2px_2px_0px_#000000] cursor-pointer"
            title="Fit all event markers"
          >
            <Maximize2 size={12} className="shrink-0" />
            <span className="hidden sm:inline">Fit All</span>
          </button>
        </div>
      </div>

      {/* Attribution stamp at bottom right */}
      <div className="absolute bottom-1 left-2 z-[400] text-[9px] font-mono text-slate-700 bg-white/80 px-1.5 py-0.5 border border-black/20 pointer-events-none">
        OpenStreetMap &amp; Leaflet Engine
      </div>
    </div>
  );
};

export default EventLeafletMap;
