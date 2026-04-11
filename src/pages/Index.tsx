import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EventsSection from "@/components/EventsSection";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import EmergencySOS from "@/components/EmergencySOS";
import { useSearchParams } from "react-router-dom";

const Index = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("q") || "";

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />
      <HeroSection />
      <EventsSection searchQuery={search} />
      <HowItWorks />
      <Footer />
      <EmergencySOS />
    </div>
  );
};

export default Index;
