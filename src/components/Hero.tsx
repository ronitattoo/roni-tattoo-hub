import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import roniLogo from "@/assets/roni-logo.png";
import roniProfile from "@/assets/roni-profile.png";

const Hero = () => {
  const scrollToPortfolio = () => {
    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <section className="snap-item h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      
      <div className="relative z-10 flex flex-col items-center justify-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <img 
            src={roniLogo} 
            alt="Roni Tattoo Artist Logo - Professional Tattoo Studio Erjon Lami" 
            className="w-64 md:w-96 h-auto filter brightness-0 invert opacity-90"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8"
        >
          <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-primary glow-effect">
            <img 
              src={roniProfile} 
              alt="Erjon Lami Roni Tattoo Artist - Award-winning international tattoo artist" 
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            ERJON LAMI
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-2 font-semibold">
            Roni Tattoo Artist | Award-Winning Professional
          </p>
          <p className="text-base md:text-lg text-muted-foreground/90 mb-2">
            Realistic Black & Grey Tattoos • Neo-Traditional Designs
          </p>
          <p className="text-sm md:text-base text-muted-foreground/80">
            International Tattoo Studio | Piraeus, Greece
          </p>
        </motion.header>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          onClick={scrollToPortfolio}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
          aria-label="Scroll down to view tattoo portfolio"
        >
          <ChevronDown className="w-8 h-8 text-primary" />
        </motion.button>
      </div>
    </section>
  );
};

export default Hero;
