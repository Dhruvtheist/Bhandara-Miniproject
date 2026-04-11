import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FoodEvent } from './EventCard';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Custom Marker Icons
const createCustomIcon = (color: string) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const icons: Record<string, L.Icon> = {
  bhandara: createCustomIcon('orange'),
  ngo: createCustomIcon('green'),
  community: createCustomIcon('yellow'),
  user: createCustomIcon('blue')
};

const API_URL = "http://localhost:5000/api";

const EventMap = ({ events }: { events: FoodEvent[] }) => {
  const { user } = useAuth();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerLayer = useRef<L.LayerGroup | null>(null);
  const [userLoc, setUserLoc] = useState<[number, number] | null>(null);

  // Define global handlers for Leaflet Popup Buttons
  useEffect(() => {
    (window as any).handleVolunteerMap = async (id: string) => {
      if (!user) {
        toast.error("Please sign in to volunteer");
        return;
      }
      try {
        const res = await fetch(`${API_URL}/events/${id}/volunteer`, {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.ok) toast.success("Successfully joined!");
        else toast.error("Already joined or error!");
      } catch {
        toast.error("Volunteer failed");
      }
    };

    (window as any).handleDirectionsMap = (lat: number, lng: number) => {
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
    };
  }, [user]);

  // Geolocation
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (p) => setUserLoc([p.coords.latitude, p.coords.longitude]),
        () => console.log("Location Denied")
      );
    }
  }, []);

  // Initialize Map
  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      const initialCenter = userLoc || (events[0]?.lat ? [events[0].lat, events[0].lng || 77.2090] : [28.6139, 77.2090]);
      
      mapInstance.current = L.map(mapRef.current).setView(initialCenter as L.LatLngExpression, 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(mapInstance.current);

      markerLayer.current = L.layerGroup().addTo(mapInstance.current);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Sync Markers
  useEffect(() => {
    if (mapInstance.current && markerLayer.current) {
      markerLayer.current.clearLayers();

      // Add User Location Marker
      if (userLoc) {
        L.marker(userLoc, { icon: icons.user })
          .addTo(markerLayer.current)
          .bindPopup("<b>You are here</b>");
      }

      // Add Event Markers
      events.forEach((event) => {
        if (event.lat && event.lng) {
          const typeLabel = event.type === 'ngo' ? 'NGO Drive' : event.type === 'bhandara' ? 'Bhandara' : 'Community Kitchen';
          
          const popupContent = `
            <div style="min-width: 200px; padding: 5px; font-family: sans-serif;">
              <h3 style="margin: 0 0 5px 0; color: #f97316;">${event.title}</h3>
              <p style="margin: 0 0 10px 0; font-size: 12px; color: #666;">${event.location}</p>
              <div style="margin-bottom: 12px; font-size: 11px;">
                <strong>${event.servingsLeft} servings left</strong> | ${typeLabel}
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <button onclick="handleDirectionsMap(${event.lat}, ${event.lng})" 
                  style="padding: 6px; border: 1px solid #ccc; background: #fff; cursor: pointer; border-radius: 4px; font-size: 10px; font-weight: bold;">
                  Directions
                </button>
                <button onclick="handleVolunteerMap('${event.id}')" 
                  style="padding: 6px; border: none; background: #f97316; color: #fff; cursor: pointer; border-radius: 4px; font-size: 10px; font-weight: bold;">
                  Volunteer
                </button>
              </div>
            </div>
          `;

          L.marker([event.lat, event.lng], { icon: icons[event.type] || icons.community })
            .addTo(markerLayer.current!)
            .bindPopup(popupContent);
        }
      });

      // Adjust view if markers exist
      if (events.length > 0 && !userLoc) {
        const group = L.featureGroup(markerLayer.current.getLayers() as L.Marker[]);
        mapInstance.current.fitBounds(group.getBounds(), { padding: [50, 50] });
      }
    }
  }, [events, userLoc]);

  return (
    <div className="relative w-full h-[600px] rounded-3xl overflow-hidden border-2 border-border shadow-2xl z-0">
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default EventMap;
