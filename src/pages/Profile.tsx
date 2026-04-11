import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle2, Globe, Calendar, Award, Utensils, Edit3, Save, X, Loader2 } from "lucide-react";
import EventCard, { FoodEvent } from "@/components/EventCard";
import { toast } from "sonner";
import { format, isToday, isTomorrow } from "date-fns";

const formatDateLabel = (dateStr: string) => {
  const d = new Date(dateStr);
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  return format(d, "EEEE, MMM d");
};

const formatTime = (d: Date) => {
  return format(d, "h:mm a");
};

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>({ totalServings: 0, totalEvents: 0 });
  const [events, setEvents] = useState<FoodEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ bio: "", website: "" });

  const isOwnProfile = currentUser?.id === id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/profile/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data.user);
          setStats(data.stats);
          setEditForm({ bio: data.user.bio || "", website: data.user.website || "" });
          
          // Fetch events for this specific user
          const eventsRes = await fetch(`${import.meta.env.VITE_API_URL}/events`); // Filtered logic on backend is better, but this works for now
          if (eventsRes.ok) {
            const allEvents = await eventsRes.json();
            const userEvents = allEvents.filter((e: any) => (e.organizerId?._id || e.organizerId) === id);
            setEvents(userEvents.map((e: any) => ({
                id: e._id,
                title: e.title,
                city: e.city,
                organizer: e.organizerId?.fullName || data.user.fullName,
                type: e.type || "community",
                location: e.location,
                time: formatTime(new Date(e.dateTime)),
                date: formatDateLabel(e.dateTime),
                servingsLeft: e.availableServings,
                isLive: e.status === "active",
                organizerId: id,
                volunteerCount: e.volunteers?.length || 0
            })));
          }
        } else {
          toast.error("Profile not found");
          navigate("/");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, navigate]);

  const handleUpdateProfile = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setIsEditing(false);
        toast.success("Profile updated successfully");
      }
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  if (loading || !profile) return (
    <div className="min-h-screen flex items-center justify-center font-display bg-background">
      <Navbar />
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading Profile...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-12">
      <Navbar />
      
      {/* Header Section */}
      <div className="bg-primary pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-foreground/10 via-transparent to-transparent opacity-50" />
        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="h-32 w-32 rounded-3xl bg-secondary flex items-center justify-center text-secondary-foreground text-4xl font-bold shadow-2xl shadow-primary/20 border-4 border-background/20">
              {profile.fullName.charAt(0)}
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground font-display">
                    {profile.fullName}
                  </h1>
                  {profile.isVerified && (
                    <CheckCircle2 className="h-8 w-8 text-accent fill-accent/20" />
                  )}
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-primary-foreground/70 text-sm">
                  <span className="flex items-center gap-1.5"><Award className="h-4 w-4" /> {profile.role}</span>
                  {profile.website && (
                    <a href={profile.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-accent transition-colors">
                      <Globe className="h-4 w-4" /> {profile.website}
                    </a>
                  )}
                  <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {!isEditing ? (
                <p className="text-primary-foreground/90 max-w-2xl text-lg leading-relaxed">
                  {profile.bio || "No bio added yet."}
                </p>
              ) : (
                <div className="space-y-4 max-w-2xl bg-background/10 p-6 rounded-2xl backdrop-blur-md">
                  <Textarea 
                    value={editForm.bio} 
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    placeholder="Tell us about yourself or your NGO..."
                    className="bg-background/80 border-transparent focus:border-accent"
                  />
                  <Input 
                    value={editForm.website} 
                    onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                    placeholder="Website URL"
                    className="bg-background/80 border-transparent focus:border-accent"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleUpdateProfile} className="gap-2"><Save className="h-4 w-4" /> Save</Button>
                    <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-primary-foreground hover:bg-white/10"><X className="h-4 w-4" /> Cancel</Button>
                  </div>
                </div>
              )}

              {isOwnProfile && !isEditing && (
                <Button variant="outline" className="text-primary-foreground border-primary-foreground/20 hover:bg-white/10 gap-2" onClick={() => setIsEditing(true)}>
                  <Edit3 className="h-4 w-4" /> Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container -mt-10 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border p-6 rounded-2xl shadow-xl">
            <Utensils className="h-5 w-5 text-primary mb-2" />
            <div className="text-2xl font-bold">{stats.totalServings}</div>
            <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Meals Shared</div>
          </div>
          <div className="bg-card border border-border p-6 rounded-2xl shadow-xl">
            <Calendar className="h-5 w-5 text-primary mb-2" />
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Events Hosted</div>
          </div>
          <div className="bg-card border border-border p-6 rounded-2xl shadow-xl">
            <Award className="h-5 w-5 text-primary mb-2" />
            <div className="text-2xl font-bold">{profile.isVerified ? "Verified" : "Citizen"}</div>
            <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Trust Score</div>
          </div>
          <div className="bg-card border border-border p-6 rounded-2xl shadow-xl">
            <Edit3 className="h-5 w-5 text-primary mb-2" />
            <div className="text-2xl font-bold">100%</div>
            <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Response Rate</div>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="container py-16">
        <h2 className="text-2xl font-bold mb-8 font-display">Events by {profile.fullName}</h2>
        {events.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-3xl">
            <p>No events shared yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
