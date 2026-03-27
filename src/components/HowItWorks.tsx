import { MapPin, Bell, Heart } from "lucide-react";

const steps = [
  {
    icon: MapPin,
    title: "Find Events Near You",
    description: "Search by location to discover active bhandaras, NGO drives, and community kitchens nearby.",
  },
  {
    icon: Bell,
    title: "Get Real-Time Updates",
    description: "See live status, available servings, and timing so you never miss a meal distribution.",
  },
  {
    icon: Heart,
    title: "Organize & Share",
    description: "Running a food event? List it here to reach thousands of people who need it most.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-muted/50" id="how-it-works">
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold font-display">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            Simple, transparent, and built for the community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="relative text-center p-8 rounded-2xl bg-card border border-border hover:shadow-lg transition-all group"
            >
              <div className="mx-auto mb-5 h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <step.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                {i + 1}
              </div>
              <h3 className="text-xl font-semibold font-display mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
