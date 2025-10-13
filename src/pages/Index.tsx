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
      title: "Religious Realism",
      description: "Sacred crucifixion back piece with intricate details"
    },
    {
      image: tattoo2,
      title: "Blue-Eyed Tiger",
      description: "Fierce tiger portrait with striking blue eyes"
    },
    {
      image: tattoo3,
      title: "Vibrant Phoenix",
      description: "Colorful phoenix with dynamic flames and feathers"
    },
    {
      image: tattoo4,
      title: "Guardian Angel Sleeve",
      description: "Black & grey realism with stairs to heaven"
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
