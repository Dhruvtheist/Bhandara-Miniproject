import heroBg from "@/assets/hero-bg.jpg";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";

import { useSearchParams } from "react-router-dom";

const HeroSection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") || "");

  const handleSearch = (text: string) => {
    const query = text.trim();
    if (query) {
      setSearchParams({ q: query });
    } else {
      setSearchParams({});
    }
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((text: string) => {
        handleSearch(text);
      }, 1000),
    [setSearchParams],
  );
  const [stats, setStats] = useState({ totalMeals: 0, activeEvents: 0, cities: 0 });

  useEffect(() => {
    fetch("http://localhost:5000/api/impact/stats")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

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
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSearch(value); }}
                className="flex flex-col sm:flex-row gap-3 pt-2"
              >
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search city, area or event..."
                    value={value}
                    onChange={(e) => {
                      const val = e.target.value;
                      setValue(val);
                      debouncedSearch(val);
                    }}
                  />
                </div>
                <Button 
                  type="submit"
                  className="rounded-xl px-8 py-3.5 h-auto text-base font-semibold gap-2"
                >
                  <Search className="h-5 w-5" />
                  Search
                </Button>
              </form>
            </div>
            <div className="flex items-center gap-6 pt-4 text-primary-foreground/70 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-accent">{stats.activeEvents || 0}+</span>
                <span>Active Events</span>
              </div>
              <div className="hidden sm:block h-6 w-px bg-primary-foreground/20" />
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-accent">{stats.cities || 0}+</span>
                <span>Cities</span>
              </div>
              <div className="hidden sm:block h-6 w-px bg-primary-foreground/20" />
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-accent">{( (stats.totalMeals || 0) / 1000).toFixed(1)}K+</span>
                <span>Meals Shared</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default HeroSection;
