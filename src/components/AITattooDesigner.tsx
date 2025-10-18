import { useState } from "react";
import { Button } from "@/components/ui/button";

const PROXY_URL = 'https://script.google.com/macros/s/AKfycbyn1Sy5X5ZkaLajUvY07IxaBslzyIy1Mn4Vr4IK8GFBastuzEzsLcwFau8CPlOVHtLh/exec';

interface GeneratedImage {
  base64: string;
  index: number;
}

const AITattooDesigner = () => {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [imageCount, setImageCount] = useState("1");
  const [negative, setNegative] = useState("");
  const [status, setStatus] = useState("");
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      alert('Γράψε ένα prompt');
      return;
    }

    setStatus('🛠️ Δημιουργία εικόνας…');
    setImages([]);
    setIsGenerating(true);

    try {
      const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt, 
          aspectRatio, 
          count: imageCount, 
          negative 
        })
      });
      const data = await response.json();

      const b64s: string[] = [];
      if (Array.isArray(data.images)) {
        data.images.forEach((img: any) => {
          const b = img.base64 || img.b64Data || img.content?.b64Data || img.image?.base64Data;
          if (b) b64s.push(b);
        });
      }
      if (Array.isArray(data.candidates)) {
        data.candidates.forEach((c: any) => {
          const b = c.base64 || c.image?.base64 || c.image?.base64Data || c.content?.b64Data;
          if (b) b64s.push(b);
        });
      }
      if (data.image?.base64) b64s.push(data.image.base64);
      if (data.base64) b64s.push(data.base64);

      if (!b64s.length) {
        setStatus('Δεν επέστρεψε εικόνα. Δοκίμασε άλλο prompt.');
        console.log('RAW response:', data);
        setIsGenerating(false);
        return;
      }

      setStatus('Έτοιμο ✓');
      setImages(b64s.map((base64, index) => ({ base64, index })));
    } catch (e) {
      console.error(e);
      setStatus('Σφάλμα σύνδεσης. Δοκίμασε ξανά.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyImage = async (base64: string, index: number) => {
    const src = `data:image/png;base64,${base64}`;
    try {
      const blob = await (await fetch(src)).blob();
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      const btn = document.getElementById(`copy-${index}`);
      if (btn) {
        btn.textContent = 'Copied ✓';
        setTimeout(() => btn.textContent = 'Copy', 1200);
      }
    } catch {
      window.open(src, '_blank');
    }
  };

  return (
    <section id="roni-ai-hero" className="py-7 px-4 bg-background text-foreground">
      <div className="max-w-[1180px] mx-auto">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px] basis-[480px]">
            <h1 className="mb-2 text-[clamp(26px,4.5vw,44px)] leading-[1.12] font-bold">
              🎨 Δημιούργησε σχέδιο τατουάζ με <span className="text-primary">AI</span>
            </h1>
            <p className="my-1.5 mb-3 opacity-90 text-[clamp(14px,2.3vw,18px)]">
              Realistic black &amp; grey • High contrast • Tattoo-ready. 
              Γράψε την ιδέα σου και πάτα <strong>Generate</strong>.
            </p>

            <form onSubmit={handleGenerate} className="grid gap-2.5">
              <textarea
                id="prompt"
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-border bg-card text-foreground text-[15px]"
                placeholder="Π.χ. ρεαλιστικό black & grey λιοντάρι με ρολόι τσέπης, υψηλό κοντράστ, καθαρές γραμμές, χωρίς background"
              />

              <div className="grid grid-cols-2 gap-2">
                <select 
                  value={aspectRatio} 
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="px-2.5 py-2.5 rounded-xl border border-border bg-card text-foreground"
                >
                  <option value="1:1">1:1 (τετράγωνο)</option>
                  <option value="3:4">3:4 (κάθετο)</option>
                  <option value="4:3">4:3 (οριζόντιο)</option>
                  <option value="16:9">16:9 (wide)</option>
                </select>
                <select 
                  value={imageCount} 
                  onChange={(e) => setImageCount(e.target.value)}
                  className="px-2.5 py-2.5 rounded-xl border border-border bg-card text-foreground"
                >
                  <option value="1">1 εικόνα</option>
                  <option value="2">2 εικόνες</option>
                  <option value="3">3 εικόνες</option>
                  <option value="4">4 εικόνες</option>
                </select>
              </div>

              <input
                type="text"
                value={negative}
                onChange={(e) => setNegative(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-foreground"
                placeholder="Negative (προαιρετικό): blurry, watermark, extra fingers, low quality"
              />

              <Button 
                type="submit" 
                disabled={isGenerating}
                className="px-4 py-3 rounded-xl bg-primary text-primary-foreground font-extrabold text-base hover:opacity-90 transition-smooth"
              >
                {isGenerating ? 'Δημιουργία...' : 'Generate'}
              </Button>

              <div className="min-h-[20px] text-sm opacity-90">
                {status}
              </div>
            </form>
          </div>

          <div className="flex-1 min-w-[280px] basis-[420px]">
            <div className="bg-gradient-to-b from-card to-background border border-border rounded-2xl p-4">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <strong>Roni Tattoo AI Designer</strong>
              </div>
              <ul className="m-0 pl-4 leading-relaxed opacity-90 text-sm list-disc">
                <li>Ιδανικό για black &amp; grey realism</li>
                <li>Ρυθμίσεις αναλογιών &amp; πολλαπλές λήψεις</li>
                <li>Άμεσο κατέβασμα PNG</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
          {images.map((img) => {
            const src = `data:image/png;base64,${img.base64}`;
            return (
              <div 
                key={img.index} 
                className="bg-card border border-border rounded-xl p-2.5"
              >
                <img 
                  src={src} 
                  alt={`AI tattoo ${img.index + 1}`}
                  className="max-w-full rounded-lg"
                  loading="lazy"
                />
                <div className="flex justify-between gap-2 mt-2">
                  <a
                    href={src}
                    download={`tattoo_ai_${Date.now()}_${img.index + 1}.png`}
                    className="bg-primary text-primary-foreground no-underline px-3 py-2 rounded-lg font-extrabold transition-smooth hover:opacity-90"
                  >
                    Download
                  </a>
                  <button
                    id={`copy-${img.index}`}
                    onClick={() => handleCopyImage(img.base64, img.index)}
                    className="border border-border bg-secondary text-secondary-foreground px-3 py-2 rounded-lg cursor-pointer transition-smooth hover:opacity-90"
                  >
                    Copy
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AITattooDesigner;
