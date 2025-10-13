import Navigation from "@/components/Navigation";
import SocialLinks from "@/components/SocialLinks";
import PortfolioCard from "@/components/PortfolioCard";
import tattoo1 from "@/assets/tattoo1.jpg";
import tattoo2 from "@/assets/tattoo2.jpg";
import tattoo3 from "@/assets/tattoo3.jpg";
import tattoo4 from "@/assets/tattoo4.jpg";

const Index = () => {
  const portfolioItems = [
    {
      image: tattoo1,
      title: "Black & Grey Realism",
      description: "Fierce lion portrait with intricate details"
    },
    {
      image: tattoo2,
      title: "Neo-Traditional Dragon",
      description: "Vibrant Japanese dragon with bold colors"
    },
    {
      image: tattoo3,
      title: "Geometric Mandala",
      description: "Sacred geometry with precise patterns"
    },
    {
      image: tattoo4,
      title: "Realistic Rose",
      description: "Photorealistic rose with thorns and droplets"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SocialLinks />
      
      <div className="snap-container h-screen overflow-y-scroll">
        {portfolioItems.map((item, index) => (
          <PortfolioCard
            key={index}
            image={item.image}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;
