import { motion } from "framer-motion";

interface PortfolioCardProps {
  embedLink: string;
  shareUrl: string;
  title: string;
  description: string;
}

const PortfolioCard = ({
  embedLink,
  shareUrl,
  title,
  description,
}: PortfolioCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="snap-item h-screen flex items-center justify-center p-4"
    >
      <article className="relative max-w-md w-full h-[85vh] rounded-2xl overflow-hidden bg-card border border-border glow-effect flex flex-col">
        <div className="relative flex-1 bg-black">
          <iframe
            src={embedLink}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 w-full h-full"
          />
        </div>
        <div className="p-4 bg-card/95 backdrop-blur border-t border-border">
          <h2 className="text-lg font-bold mb-1 line-clamp-2">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {description}
            </p>
          )}
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline"
          >
            View on TikTok →
          </a>
        </div>
      </article>
    </motion.div>
  );
};

export default PortfolioCard;
