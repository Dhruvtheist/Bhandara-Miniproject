import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, HandHeart, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAddEvent = () => {
    if (user) {
      navigate("/add-event");
    } else {
      navigate("/auth");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container flex items-center justify-between h-16">
        <a href="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
          <HandHeart className="h-7 w-7" />
          Food Connect
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="/#events" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Events</a>
          <a href="/#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          <a href="/#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</a>
          {user ? (
            <div className="flex items-center gap-3">
              <Button className="rounded-xl" onClick={handleAddEvent}>Add Event</Button>
              <Button variant="ghost" size="icon" onClick={signOut} title="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-xl" onClick={() => navigate("/auth")}>Sign In</Button>
              <Button className="rounded-xl" onClick={handleAddEvent}>Add Event</Button>
            </div>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background p-4 space-y-3">
          <a href="/#events" className="block text-sm font-medium text-muted-foreground" onClick={() => setOpen(false)}>Events</a>
          <a href="/#how-it-works" className="block text-sm font-medium text-muted-foreground" onClick={() => setOpen(false)}>How It Works</a>
          <a href="/#about" className="block text-sm font-medium text-muted-foreground" onClick={() => setOpen(false)}>About</a>
          {user ? (
            <>
              <Button className="w-full rounded-xl" onClick={() => { setOpen(false); handleAddEvent(); }}>Add Event</Button>
              <Button variant="outline" className="w-full rounded-xl" onClick={() => { setOpen(false); signOut(); }}>Sign Out</Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="w-full rounded-xl" onClick={() => { setOpen(false); navigate("/auth"); }}>Sign In</Button>
              <Button className="w-full rounded-xl" onClick={() => { setOpen(false); handleAddEvent(); }}>Add Event</Button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
