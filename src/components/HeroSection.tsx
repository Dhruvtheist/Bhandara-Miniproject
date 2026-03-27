import heroBg from "@/assets/hero-bg.jpg";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";

const HeroSection = () => {
  const [value, setValue] = useState("");
  const [locations, setLocations] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (text: string) => {
        const value = text.trim();

        if (value.length === 0) {
          setValue(value);
          setLocations([]);
          return;
        }
        if (value.length < 3) return;
        console.log("🚀 ~ HeroSection ~ text:", text);
        const resp = await fetch("/api/locations/getLocation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: value.trim(),
          }),
        }).then((res) => res.json());

        console.log(resp);
        console.log("🚀 ~ HeroSection ~ resp:", resp);
        if (!resp || resp.length === 0) {
          setShowPopup(true);
          setValue("");
          setLocations([]);
          return;
        }
        setLocations(resp);
      }, 2000),
    [],
  );

  useEffect(() => {
    if (showPopup) {
      console.log("🚀 ~ HeroSection ~ showPopup inside UseEffect:", showPopup);
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  return (
    <>
      <section className="relative min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="Community food distribution"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/30" />
        </div>

        <div className="container relative z-10 py-20">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 border border-primary/30 px-4 py-1.5 text-primary-foreground/90 text-sm font-medium backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-secondary animate-pulse-gentle" />
              Live events near you
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-primary-foreground">
              Find Free Food, <span className="text-accent">Near You</span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-lg font-body">
              Discover bhandaras, NGO drives, and community kitchens happening
              around you — updated in real time.
            </p>

            <div className="relative">
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={value}
                    onChange={(e) => {
                      const value = e.target.value;
                      setValue(value);
                      debouncedSearch(value);
                    }}
                  />
                </div>
                <Button className="rounded-xl px-8 py-3.5 h-auto text-base font-semibold gap-2">
                  <Search className="h-5 w-5" />
                  Search
                </Button>
              </div>
              {locations.length > 0 && (
                <div className="absolute top-full mt-2 left-0 right-0 flex flex-col z-50 p-4 bg-white rounded-lg max-h-[50vh] overflow-y-auto shadow-lg">
                  {locations.map((location: any) => (
                    <div key={location.name} className="p-4">
                      <h3 className="text-lg font-semibold">
                        {location.phoneNumber}
                      </h3>
                      <p className="text-black">{location.address}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-6 pt-4 text-primary-foreground/70 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-accent">150+</span>
                <span>Active Events</span>
              </div>
              <div className="h-6 w-px bg-primary-foreground/20" />
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-accent">50+</span>
                <span>Cities</span>
              </div>
              <div className="h-6 w-px bg-primary-foreground/20" />
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-accent">10K+</span>
                <span>Meals Shared</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {showPopup && (
        <div className="absolute right-2 text-xl text-red-500 top-2 bg-white rounded-sm p-2 z-50 border border-red-500 border-2">
          <div>No Locations Found!</div>
        </div>
      )}
    </>
  );
};

export default HeroSection;
