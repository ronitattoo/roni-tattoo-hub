import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PortfolioCardProps {
  embedLink: string;
  shareUrl: string;
  title: string;
  description: string;
  coverImageUrl?: string;
}

function makePlayerUrl(embedLink: string) {
  try {
    const url = new URL(embedLink);
    url.searchParams.set("autoplay", "1");
    url.searchParams.set("mute", "0");
    return url.toString();
  } catch {
    return embedLink;
  }
}

const PortfolioCard = ({
  embedLink,
  shareUrl,
  title,
  description,
  coverImageUrl,
}: PortfolioCardProps) => {
  const [open, setOpen] = useState(false);
  const playerUrl = useMemo(() => makePlayerUrl(embedLink), [embedLink]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.article
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="relative aspect-square w-full overflow-hidden bg-muted cursor-pointer group border border-border"
        >
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt={title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 gradient-primary opacity-60" />
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
            <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center shadow-lg backdrop-blur-sm">
              <Play className="w-5 h-5 text-primary-foreground fill-current ml-0.5" />
            </div>
          </div>
        </motion.article>
      </DialogTrigger>
      <DialogContent variant="full">
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="relative w-full h-full bg-black">
          <iframe
            src={playerUrl}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PortfolioCard;

