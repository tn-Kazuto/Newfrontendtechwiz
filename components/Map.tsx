'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create a custom icon for events
const eventIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Create a custom icon for user location
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapProps {
  userLocation: { lat: number; lng: number } | null;
  events: any[];
  onMarkerClick?: (event: any) => void;
}

const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

export default function Map({ userLocation, events, onMarkerClick }: MapProps) {
  const defaultCenter: [number, number] = [21.0285, 105.8542]; // Hanoi default
  const center: [number, number] = userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter;

  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      style={{ height: '100%', width: '100%', borderRadius: '0.75rem', zIndex: 0 }}
      scrollWheelZoom={true}
    >
      <ChangeView center={center} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>Your Location</Popup>
        </Marker>
      )}

      {events.map((ev, idx) => (
        <Marker 
          key={ev.id || idx} 
          position={[ev.lat, ev.lng]} 
          icon={eventIcon}
          eventHandlers={{
            click: () => onMarkerClick && onMarkerClick(ev),
          }}
        >
          <Popup>
            <div className="text-sm font-bold">{ev.title}</div>
            <div className="text-xs">{ev.venue}</div>
            <div className="text-xs text-blue-600 font-bold mt-1 cursor-pointer" onClick={() => onMarkerClick && onMarkerClick(ev)}>
              View Details
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}