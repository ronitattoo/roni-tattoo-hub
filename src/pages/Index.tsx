import Navigation from "@/components/Navigation";
import SocialLinks from "@/components/SocialLinks";
import PortfolioCard from "@/components/PortfolioCard";
import Hero from "@/components/Hero";
import tattoo1 from "@/assets/tattoo1.jpg";
import tattoo2 from "@/assets/tattoo2.jpg";
import tattoo3 from "@/assets/tattoo3.jpg";
import tattoo4 from "@/assets/tattoo4.jpg";

const Index = () => {
  const portfolioItems = [
    {
      image: tattoo1,
      title: "Award-Winning Realistic Tattoo Art",
      description: "Professional black & grey realism by Roni Tattoo Artist - Athens Convention award winner"
    },
    {
      image: tattoo2,
      title: "Custom Neo-Traditional Design",
      description: "Unique tattoo artwork combining traditional and modern techniques by Erjon Lami"
    },
    {
      image: tattoo3,
      title: "International Quality Tattoo Work",
      description: "High-quality realistic tattoo art serving clients from USA, UK, Germany, and worldwide"
    },
    {
      image: tattoo4,
      title: "Professional Tattoo Studio Portfolio",
      description: "Expert custom tattoo designs by award-winning artist Roni Tattoo - Piraeus, Greece"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SocialLinks />
      
      <main className="snap-container h-screen overflow-y-scroll">
        <Hero />
        {portfolioItems.map((item, index) => (
          <PortfolioCard
            key={index}
            image={item.image}
            title={item.title}
            description={item.description}
          />
        ))}
      </main>
    </div>
  );
};

export default Index;
