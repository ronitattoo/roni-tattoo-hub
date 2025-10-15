import { motion } from "framer-motion";

interface PortfolioCardProps {
  image: string;
  title: string;
  description: string;
}

const PortfolioCard = ({ image, title, description }: PortfolioCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="snap-item h-screen flex items-center justify-center p-4"
    >
      <article className="relative max-w-md w-full h-[85vh] rounded-2xl overflow-hidden bg-card border border-border glow-effect">
        <img
          src={image}
          alt={`${title} - Professional tattoo work by Roni Tattoo Artist Erjon Lami`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent flex flex-col justify-end p-6">
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </article>
    </motion.div>
  );
};

export default PortfolioCard;
