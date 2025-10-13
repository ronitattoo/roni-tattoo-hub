import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const SocialLinks = () => {
  return (
    <div className="fixed bottom-8 right-8 z-40 flex flex-col gap-3">
      <a
        href="https://www.tiktok.com/@ronitattoo"
        target="_blank"
        rel="noopener noreferrer"
        className="transition-smooth"
      >
        <Button
          size="lg"
          className="rounded-full w-14 h-14 gradient-primary glow-effect hover:scale-110 transition-smooth"
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
          </svg>
        </Button>
      </a>
      
      <a
        href="https://www.instagram.com/ronitattoo"
        target="_blank"
        rel="noopener noreferrer"
        className="transition-smooth"
      >
        <Button
          size="lg"
          className="rounded-full w-14 h-14 gradient-primary glow-effect hover:scale-110 transition-smooth"
        >
          <Instagram className="h-6 w-6" />
        </Button>
      </a>
    </div>
  );
};

export default SocialLinks;
