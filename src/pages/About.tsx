import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import SocialLinks from "@/components/SocialLinks";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SocialLinks />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="mb-12 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-primary bg-clip-text text-transparent">
              Erjon Lami
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground/80 mb-6">
              Roni Tattoo
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>

          <div className="space-y-8 animate-fade-in">
            <section className="bg-card rounded-xl p-8 border border-border">
              <h3 className="text-2xl font-bold mb-4 text-primary">Βιογραφικό</h3>
              <div className="space-y-4 text-foreground/90 leading-relaxed">
                <p>
                  Είμαι ο Erjon Lami, γνωστός ως Roni Tattoo, και η τέχνη του τατουάζ είναι 
                  το πάθος και ο τρόπος έκφρασής μου. Με χρόνια εμπειρίας στον κλάδο, έχω 
                  αναπτύξει ένα μοναδικό στυλ που συνδυάζει την παραδοσιακή τεχνική με 
                  σύγχρονες προσεγγίσεις.
                </p>
                
                <p>
                  Η φιλοσοφία μου βασίζεται στην ιδέα ότι κάθε τατουάζ είναι ένα μοναδικό 
                  έργο τέχνης που αφηγείται μια προσωπική ιστορία. Εργάζομαι στενά με κάθε 
                  πελάτη για να δημιουργήσω designs που αντανακλούν την προσωπικότητα και 
                  τις επιθυμίες τους.
                </p>
              </div>
            </section>

            <section className="bg-card rounded-xl p-8 border border-border">
              <h3 className="text-2xl font-bold mb-4 text-primary">Εξειδίκευση</h3>
              <ul className="space-y-3 text-foreground/90">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Realistic Black & Grey Tattoos
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Neo-Traditional Designs
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Geometric & Mandala Art
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Custom Designs
                </li>
              </ul>
            </section>

            <section className="bg-card rounded-xl p-8 border border-border">
              <h3 className="text-2xl font-bold mb-4 text-primary">Επικοινωνία</h3>
              <p className="text-foreground/90 mb-4">
                Για ραντεβού και περισσότερες πληροφορίες, μπορείτε να με βρείτε στα social media:
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://www.tiktok.com/@ronitattoo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-smooth glow-effect"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                  TikTok
                </a>
                <a
                  href="https://www.instagram.com/ronitattoo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-smooth glow-effect"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Instagram
                </a>
              </div>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default About;
