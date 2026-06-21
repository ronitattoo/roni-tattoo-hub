import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import SocialLinks from "@/components/SocialLinks";
import PortfolioCard from "@/components/PortfolioCard";
import Hero from "@/components/Hero";
import { supabase } from "@/integrations/supabase/client";

interface TikTokVideo {
  id: string;
  title?: string;
  video_description?: string;
  embed_link?: string;
  share_url?: string;
}

const Index = () => {
  const [videos, setVideos] = useState<TikTokVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke(
          "list-tiktok-videos",
        );
        if (error) throw error;
        if (active) setVideos((data?.videos as TikTokVideo[]) ?? []);
      } catch (e) {
        console.error("Failed to load TikTok videos", e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SocialLinks />

      <main
        className="snap-container h-screen overflow-y-scroll"
        role="main"
        aria-label="Roni Tattoo Artist Portfolio"
      >
        <Hero />
        <section aria-label="Tattoo Portfolio Gallery - Latest TikTok videos">
          {loading && (
            <div className="snap-item h-screen flex items-center justify-center text-muted-foreground">
              Loading latest TikTok videos…
            </div>
          )}
          {!loading && videos.length === 0 && (
            <div className="snap-item h-screen flex items-center justify-center text-muted-foreground px-6 text-center">
              Couldn't load TikTok videos right now. Visit{" "}
              <a
                href="https://www.tiktok.com/@ronitattoo_artist"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline ml-1"
              >
                @ronitattoo_artist
              </a>
              .
            </div>
          )}
          {videos.map((video) => (
            <PortfolioCard
              key={video.id}
              embedLink={
                video.embed_link ??
                `https://www.tiktok.com/player/v1/${video.id}?autoplay=0&loop=1`
              }
              shareUrl={
                video.share_url ??
                `https://www.tiktok.com/@ronitattoo_artist/video/${video.id}`
              }
              title={video.title || "Roni Tattoo Artist"}
              description={video.video_description || ""}
            />
          ))}
        </section>
      </main>
    </div>
  );
};

export default Index;
