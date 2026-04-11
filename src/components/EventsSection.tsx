import { useState, useEffect } from "react";
import EventCard, { FoodEvent } from "./EventCard";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Map as MapIcon, Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { format, isToday, isTomorrow } from "date-fns";
import { io } from "socket.io-client";
import { toast as sonnerToast } from "sonner";
import EventMap from "./EventMap";

const filters = [
  { label: "All Events", value: "all" },
  { label: "Bhandara", value: "bhandara" },
  { label: "NGO Drive", value: "ngo" },
  { label: "Community Kitchen", value: "community" },
];

const formatDateLabel = (dateStr: string) => {
  const d = new Date(dateStr);
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  return format(d, "EEEE, MMM d");
};

const formatTime = (d: Date) => {
  return format(d, "h:mm a");
};

const EventsSection = ({ searchQuery }: { searchQuery: string }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [isMapView, setIsMapView] = useState(false);
  const [events, setEvents] = useState<FoodEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/events?q=${searchQuery}&type=${activeFilter}`);
        if (res.ok) {
          const data = await res.json();
          setEvents(
            data.map((e: any) => ({
              id: e._id,
              title: e.title,
              city: e.city,
              organizer: e.organizerId?.fullName || "Anonymous Host",
              type: e.type || "community",
              location: e.location,
              time: formatTime(new Date(e.dateTime)),
              date: formatDateLabel(e.dateTime),
              servingsLeft: e.availableServings,
              imageUrl: e.imageUrl,
              isLive: e.status === "active",
              organizerId: e.organizerId?._id || e.organizerId,
              volunteerCount: e.volunteers?.length || 0,
              isOrganizerVerified: e.organizerId?.isVerified || false,
              lat: e.coordinates?.lat || 28.6139,
              lng: e.coordinates?.lng || 77.2090
            }))
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [searchQuery, activeFilter]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL);
    socket.on("eventCreated", (e: any) => {
      sonnerToast.success("New food event nearby!", {
        description: `${e.title} was just posted.`,
      });
      setEvents((prev) => [{
        id: e._id,
        title: e.title,
        city: e.city,
        organizer: e.organizerId?.fullName || "A Host",
        type: e.type || "community",
        location: e.location,
        time: formatTime(new Date(e.dateTime)),
        date: formatDateLabel(e.dateTime),
        servingsLeft: e.availableServings,
        imageUrl: e.imageUrl,
        isLive: e.status === "active",
        organizerId: e.organizerId?._id || e.organizerId,
        volunteerCount: e.volunteers?.length || 0,
        isOrganizerVerified: e.organizerId?.isVerified || false,
        lat: e.coordinates?.lat || 28.6139,
        lng: e.coordinates?.lng || 77.2090
      }, ...prev]);
    });

    socket.on("eventUpdated", (e: any) => {
      setEvents((prev) => prev.map((event) => event.id === e._id ? {
        ...event,
        servingsLeft: e.availableServings,
        isLive: e.status === "active",
        imageUrl: e.imageUrl,
        volunteerCount: e.volunteers?.length || 0,
        isOrganizerVerified: e.organizerId?.isVerified || false
      } : event));
    });

    socket.on("eventDeleted", (id: string) => {
      setEvents((prev) => prev.filter((event) => event.id !== id));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const filtered = activeFilter === "all"
    ? events
    : events.filter((e) => e.type === activeFilter);

  return (
    <section className="py-20 bg-background" id="events">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-display">
              Upcoming <span className="text-gradient">Food Events</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-md">
              Browse verified free food distribution events happening near you right now.
            </p>
          </div>
          <Button className="gap-2 rounded-xl self-start md:self-auto" onClick={() => navigate(user ? "/add-event" : "/auth")}>
            <Plus className="h-4 w-4" />
            Add Your Event
          </Button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeFilter === f.value
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex bg-muted p-1 rounded-xl self-start">
            <button 
              onClick={() => setIsMapView(false)}
              className={`p-2 rounded-lg flex items-center gap-2 text-xs font-semibold transition-all ${!isMapView ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid className="h-4 w-4" />
              Grid
            </button>
            <button 
              onClick={() => setIsMapView(true)}
              className={`p-2 rounded-lg flex items-center gap-2 text-xs font-semibold transition-all ${isMapView ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <MapIcon className="h-4 w-4" />
              Map
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium mb-2">No events yet</p>
            <p className="text-sm">Be the first to add a food event!</p>
          </div>
        ) : isMapView ? (
          <div className="animate-fade-in">
            <EventMap events={filtered} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event, i) => (
              <div
                key={event.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;
