import { HandHeart } from "lucide-react";

const Footer = () => (
  <footer className="bg-card border-t border-border py-12" id="about">
    <div className="container">
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div className="max-w-sm">
          <div className="flex items-center gap-2 font-display text-xl font-bold text-primary mb-3">
            <HandHeart className="h-6 w-6" />
            Food Connect
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A centralized platform connecting free food distribution events with people in need. No one should go hungry when food is being shared nearby.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm">
          <div>
            <h4 className="font-semibold font-display mb-3 text-foreground">Platform</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#events" className="hover:text-primary transition-colors">Browse Events</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Add Event</a></li>
              <li><a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold font-display mb-3 text-foreground">Community</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">For NGOs</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Volunteer</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        © 2026 Food Connect. Built with ❤️ for the community.
      </div>
    </div>
  </footer>
);

export default Footer;
