const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/tiktok";

interface TikTokVideo {
  id: string;
  title?: string;
  video_description?: string;
  cover_image_url?: string;
  embed_link?: string;
  share_url?: string;
  create_time?: number;
  duration?: number;
}

// Simple in-memory cache (per edge instance) – refresh hourly.
let cache: { at: number; data: unknown } | null = null;
const CACHE_MS = 60 * 60 * 1000;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (cache && Date.now() - cache.at < CACHE_MS) {
      return new Response(JSON.stringify(cache.data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const TIKTOK_API_KEY = Deno.env.get("TIKTOK_API_KEY");
    if (!LOVABLE_API_KEY || !TIKTOK_API_KEY) {
      throw new Error("Missing TikTok connector credentials");
    }

    const fields =
      "id,title,cover_image_url,embed_link,share_url,video_description,create_time,duration";

    const res = await fetch(
      `${GATEWAY_URL}/video/list/?fields=${fields}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": TIKTOK_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ max_count: 20 }),
      },
    );

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`TikTok gateway error ${res.status}: ${body}`);
    }

    const json = await res.json();
    const videos: TikTokVideo[] = json?.data?.videos ?? [];
    const payload = { videos };
    cache = { at: Date.now(), data: payload };

    return new Response(JSON.stringify(payload), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("list-tiktok-videos error", err);
    return new Response(
      JSON.stringify({ videos: [], error: (err as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});