import { useState, useEffect } from "react";
import EventCard, { FoodEvent } from "./EventCard";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { format, isToday, isTomorrow } from "date-fns";

const filters = [
  { label: "All Events", value: "all" },
  { label: "Bhandara", value: "bhandara" },
  { label: "NGO Drive", value: "ngo" },
  { label: "Community Kitchen", value: "community" },
];

const formatDateLabel = (dateStr: string) => {
  const d = new Date(dateStr + "T00:00:00");
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  return format(d, "EEEE, MMM d");
};

const formatTime = (t: string) => {
  const [h, m] = t.split(":");
  const date = new Date();
  date.setHours(parseInt(h), parseInt(m));
  return format(date, "h:mm a");
};

const EventsSection = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [events, setEvents] = useState<FoodEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("food_events")
        .select("*")
        .gte("event_date", new Date().toISOString().split("T")[0])
        .order("event_date", { ascending: true });

      if (!error && data) {
        setEvents(
          data.map((e: any) => ({
            id: e.id,
            title: e.title,
            organizer: e.organizer,
            type: e.type as FoodEvent["type"],
            location: e.location,
            time: `${formatTime(e.start_time)} – ${formatTime(e.end_time)}`,
            date: formatDateLabel(e.event_date),
            servingsLeft: e.servings_available,
            isLive: e.is_live,
          }))
        );
      }
      setLoading(false);
    };
    fetchEvents();
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

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
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

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium mb-2">No events yet</p>
            <p className="text-sm">Be the first to add a food event!</p>
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
