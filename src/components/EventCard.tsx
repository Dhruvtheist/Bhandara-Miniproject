import { MapPin, Clock, Users, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface FoodEvent {
  id: string;
  title: string;
  organizer: string;
  type: "bhandara" | "ngo" | "community";
  location: string;
  time: string;
  date: string;
  servingsLeft: number;
  isLive: boolean;
}

const typeColors: Record<FoodEvent["type"], string> = {
  bhandara: "bg-primary text-primary-foreground",
  ngo: "bg-secondary text-secondary-foreground",
  community: "bg-accent text-accent-foreground",
};

const typeLabels: Record<FoodEvent["type"], string> = {
  bhandara: "Bhandara",
  ngo: "NGO Drive",
  community: "Community Kitchen",
};

const EventCard = ({ event }: { event: FoodEvent }) => {
  return (
    <div className="group relative rounded-2xl bg-card border border-border p-5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      {event.isLive && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-semibold text-secondary">
          <span className="h-2 w-2 rounded-full bg-secondary animate-pulse-gentle" />
          LIVE
        </div>
      )}

      <Badge className={`${typeColors[event.type]} text-xs font-medium mb-3`}>
        {typeLabels[event.type]}
      </Badge>

      <h3 className="text-lg font-semibold font-display mb-1 group-hover:text-primary transition-colors">
        {event.title}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">by {event.organizer}</p>

      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          {event.location}
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          {event.date} · {event.time}
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          ~{event.servingsLeft} servings available
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Get directions</span>
        <ChevronRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

export default EventCard;
