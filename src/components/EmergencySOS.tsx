import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle, Send, Phone, MapPin, Info } from "lucide-react";
import { toast } from "sonner";

const API_URL = "http://localhost:5000/api";

const EmergencySOS = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    contactNumber: "",
    location: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to request help");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/emergency`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          ...form,
          lat: 28.6139, // Default to Delhi if no geo-api
          lng: 77.2090
        })
      });

      if (res.ok) {
        toast.success("Emergency SOS Sent!", {
          description: "Nearby organizers have been notified.",
        });
        setOpen(false);
        setForm({ fullName: "", contactNumber: "", location: "", message: "" });
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to send SOS");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="destructive" 
          className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-2xl shadow-destructive/40 animate-bounce-gentle z-50 flex flex-col gap-0.5 p-0"
        >
          <AlertCircle className="h-6 w-6" />
          <span className="text-[10px] font-bold">SOS</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-3xl border-destructive/20 border-2">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-6 w-6" />
            Request Emergency Aid
          </DialogTitle>
          <DialogDescription>
            Use this ONLY for urgent food requirements. Your request will be sent to all nearby organizers.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-2"><Info className="h-4 w-4" /> Full Name</Label>
            <Input 
              id="fullName" 
              value={form.fullName} 
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Your name" 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2"><Phone className="h-4 w-4" /> Contact Number</Label>
            <Input 
              id="phone" 
              value={form.contactNumber} 
              onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
              placeholder="+91 XXXXX XXXXX" 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sos-location" className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Current Location</Label>
            <Input 
              id="sos-location" 
              value={form.location} 
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Area, Landmark, Shop Name" 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Brief Detail (People involved, condition)</Label>
            <Textarea 
              id="message" 
              value={form.message} 
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="e.g. 5 people stranded near railway station, need water and food." 
              required 
            />
          </div>

          <Button type="submit" className="w-full h-12 rounded-xl text-md font-bold gap-2" disabled={loading} variant="destructive">
            {loading ? "Sending..." : <><Send className="h-5 w-5" /> Send Emergency Alert</>}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmergencySOS;
