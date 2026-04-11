import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";

const AddEvent = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    organizer: "",
    city: "",
    type: "community" as "bhandara" | "ngo" | "community",
    location: "",
    imageUrl: "",
    lat: "28.6139",
    lng: "77.2090",
    event_date: "",
    start_time: "",
    end_time: "",
    servings_available: "",
    description: "",
  });

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      const res = await fetch(`${import.meta.env.VITE_API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: form.title,
          city: form.city,
          type: form.type,
          location: form.location,
          imageUrl: form.imageUrl,
          coordinates: {
            lat: parseFloat(form.lat) || 28.6139,
            lng: parseFloat(form.lng) || 77.2090
          },
          dateTime: new Date(`${form.event_date}T${form.start_time}`),
          availableServings: parseInt(form.servings_available) || 0,
          description: form.description || undefined
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create event");
      }

      toast({ title: "Event created!", description: "Your food event has been posted." });
      navigate("/");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="container max-w-2xl">
        <button onClick={() => navigate("/")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </button>

        <h1 className="text-3xl font-bold font-display mb-2">Add Food Event</h1>
        <p className="text-muted-foreground mb-8">Share a free food distribution event with the community.</p>

        <form onSubmit={handleSubmit} className="space-y-5 bg-card border border-border rounded-2xl p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Community Langar" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organizer">Organizer</Label>
              <Input id="organizer" value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} placeholder="Your name or org" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bhandara">Bhandara</SelectItem>
                  <SelectItem value="ngo">NGO Drive</SelectItem>
                  <SelectItem value="community">Community Kitchen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="e.g. Delhi" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Area / Landmark</Label>
              <Input id="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. MG Road, Near Metro" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Photo URL (Optional)</Label>
              <Input id="imageUrl" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://unsplash.com/photos/..." />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="lat">Latitude (Optional)</Label>
              <Input id="lat" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} placeholder="28.6139" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lng">Longitude (Optional)</Label>
              <Input id="lng" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} placeholder="77.2090" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-2">
              <Label htmlFor="event_date">Date</Label>
              <Input id="event_date" type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time</Label>
              <Input id="start_time" type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time">End Time</Label>
              <Input id="end_time" type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="servings">Estimated Servings</Label>
            <Input id="servings" type="number" min="0" value={form.servings_available} onChange={(e) => setForm({ ...form, servings_available: e.target.value })} placeholder="e.g. 200" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Any additional details..." rows={3} />
          </div>

          <Button type="submit" className="w-full rounded-xl" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Post Event
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;
