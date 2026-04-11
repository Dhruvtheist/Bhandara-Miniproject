import { MapPin, Clock, Users, ChevronRight, Edit, Trash2, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export interface FoodEvent {
  id: string;
  title: string;
  organizer: string;
  city: string;
  type: "bhandara" | "ngo" | "community";
  location: string;
  time: string;
  date: string;
  servingsLeft: number;
  isLive: boolean;
  imageUrl?: string;
  organizerId?: string;
  volunteerCount?: number;
  isOrganizerVerified?: boolean;
  lat?: number;
  lng?: number;
}

const API_URL = "http://localhost:5000/api";

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const isOwner = user && event.organizerId === user.id;

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this event?")) return;
    
    try {
      const res = await fetch(`${API_URL}/events/${event.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        toast.success("Event deleted");
      }
    } catch (err) {
      toast.error("Failed to delete event");
    }
  };

  const handleUpdateServings = async (newCount: number) => {
    if (newCount < 0) return;
    try {
      const res = await fetch(`${API_URL}/events/${event.id}/servings`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify({ availableServings: newCount })
      });
      if (res.ok) {
        toast.success(`Servings updated to ${newCount}`);
      }
    } catch (err) {
      toast.error("Failed to update servings");
    }
  };

  const handleVolunteer = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please sign in to volunteer");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/events/${event.id}/volunteer`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("token")}` 
        }
      });
      if (res.ok) {
        toast.success("You've joined as a volunteer!");
      }
    } catch (err) {
      toast.error("Failed to join as volunteer");
    }
  };

  const handleDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    const { lat, lng, location, city } = event;
    let url = "";
    if (lat && lng) {
      url = `https://www.google.com/maps?q=${lat},${lng}`;
    } else {
      const fullLocation = `${location}, ${city}`;
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullLocation)}`;
    }
    window.open(url, "_blank");
  };

  return (
    <div className="group relative rounded-2xl bg-card border border-border overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={event.imageUrl || `https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop`} 
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />
        
        {event.isLive && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-bold text-white bg-secondary/90 px-2 py-1 rounded-full backdrop-blur-sm shadow-lg">
            <span className="h-2 w-2 rounded-full bg-white animate-pulse-gentle" />
            LIVE
          </div>
        )}
        
        <Badge className={`absolute top-4 left-4 ${typeColors[event.type]} text-[10px] uppercase tracking-wider font-bold border-none shadow-lg`}>
          {typeLabels[event.type]}
        </Badge>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold font-display mb-1 group-hover:text-primary transition-colors">
              {event.title}
            </h3>
            <div className="flex items-center gap-1 mb-4">
              <span className="text-sm text-muted-foreground">by</span>
              <button 
                onClick={(e) => { e.stopPropagation(); navigate(`/profile/${event.organizerId}`); }}
                className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
              >
                {event.organizer}
                {event.isOrganizerVerified && <CheckCircle2 className="h-3.5 w-3.5 fill-primary/10" />}
              </button>
            </div>
          </div>
          {isOwner && (
            <div className="flex gap-2">
              <button className="p-1.5 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-primary">
                <Edit className="h-4 w-4" />
              </button>
              <button 
                onClick={handleDelete}
                className="p-1.5 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="truncate">{event.city}, {event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            {event.date} · {event.time}
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <div className="flex items-center gap-2 w-full justify-between">
              <span>~{event.servingsLeft} servings</span>
              <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{event.volunteerCount || 0} volunteers</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          {!isOwner ? (
            <Button 
              onClick={handleVolunteer}
              size="sm" 
              className="rounded-lg h-8 text-xs font-bold px-4"
            >
              Volunteer
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground italic">Managing Event</span>
          )}
          <button 
            onClick={handleDirections}
            className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline bg-transparent border-none p-0"
          >
            Directions <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
