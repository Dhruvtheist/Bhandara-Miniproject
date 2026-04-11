import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HandHeart, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = "http://localhost:5000/api";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, setAuthInfo } = useAuth();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          password, 
          fullName, 
          role: isOrganizer ? "Organizer" : "User" 
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setAuthInfo(data.token, data.user);
      toast({ title: "Account created successfully!" });
      navigate("/");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <a href="/" className="flex items-center justify-center gap-2 font-display text-2xl font-bold text-primary mb-8">
          <HandHeart className="h-8 w-8" />
          Food Connect
        </a>

        <div className="bg-card border border-border rounded-2xl p-8">
          <h1 className="text-2xl font-bold font-display mb-2">Create account</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Join Food Connect to share food with your community
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <div className="flex items-center space-x-2 pt-1 border-t border-border mt-4">
              <input
                type="checkbox"
                id="isOrganizer"
                checked={isOrganizer}
                onChange={(e) => setIsOrganizer(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer"
              />
              <Label htmlFor="isOrganizer" className="text-sm font-medium leading-none cursor-pointer">
                I want to host and manage food events
              </Label>
            </div>
            <Button type="submit" className="w-full rounded-xl" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Sign Up
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-6">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/auth")}
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
