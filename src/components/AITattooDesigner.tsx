import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Download, Copy, Image, Settings2, Wand2 } from "lucide-react";
// === AI Tattoo Designer Config ===
const PROXY_URL =
  "https://script.google.com/macros/s/AKfycbyn1Sy5X5ZkaLajUvY07IxaBslzyIy1Mn4Vr4IK8GFBastuzEzsLcwFau8CPlOVHtLh/exec";

const [prompt, setPrompt] = useState("");
const [aspect, setAspect] = useState("1:1");
const [count, setCount] = useState("1");
const [negative, setNegative] = useState("");
const [images, setImages] = useState<GeneratedImage[]>([]);
const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast({
        title: "Απαιτείται περιγραφή",
        description: "Παρακαλώ γράψε τι σχέδιο θέλεις να δημιουργήσεις",
        variant: "destructive",
      });
      return;
    }

    setImages([]);
    setIsGenerating(true);
    
    toast({
      title: "Δημιουργία σε εξέλιξη",
      description: "Το AI δημιουργεί το σχέδιο σου...",
    });

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
        toast({
          title: "Αποτυχία δημιουργίας",
          description: "Δεν επέστρεψε εικόνα. Δοκίμασε άλλο prompt.",
          variant: "destructive",
        });
        console.log('RAW response:', data);
        setIsGenerating(false);
        return;
      }

      toast({
        title: "Επιτυχής δημιουργία!",
        description: `Δημιουργήθηκαν ${b64s.length} σχέδιο/α`,
      });
      setImages(b64s.map((base64, index) => ({ base64, index })));
    } catch (e) {
      console.error(e);
      toast({
        title: "Σφάλμα",
        description: "Σφάλμα σύνδεσης. Δοκίμασε ξανά.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyImage = async (base64: string, index: number) => {
    const src = `data:image/png;base64,${base64}`;
    try {
      const blob = await (await fetch(src)).blob();
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      toast({
        title: "Αντιγράφηκε!",
        description: "Η εικόνα αντιγράφηκε στο clipboard",
      });
    } catch {
      window.open(src, '_blank');
    }
  };

  return (
    <section className="snap-item min-h-screen bg-gradient-dark py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">AI Tattoo Designer</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Δημιούργησε το σχέδιο σου με AI
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Χρησιμοποίησε την τεχνητή νοημοσύνη για να οπτικοποιήσεις την ιδέα σου. 
            Ιδανικό για <strong className="text-foreground">realistic black & grey</strong> σχέδια.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          {/* Main Form */}
          <Card className="p-6 bg-card border-border">
            <form onSubmit={handleGenerate} className="space-y-6">
              {/* Prompt Input */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-foreground">
                  <Wand2 className="w-4 h-4 text-primary" />
                  Περιγραφή σχεδίου
                </label>
                <textarea
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                  placeholder="Π.χ. Ρεαλιστικό black & grey λιοντάρι με ρολόι τσέπης, υψηλό κοντράστ, καθαρές γραμμές, χωρίς background"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Περίγραψε λεπτομερώς το σχέδιο που φαντάζεσαι
                </p>
              </div>

              {/* Settings */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-foreground">
                    <Image className="w-4 h-4 text-primary" />
                    Αναλογία
                  </label>
                  <select 
                    value={aspectRatio} 
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                  >
                    <option value="1:1">1:1 - Τετράγωνο</option>
                    <option value="3:4">3:4 - Κάθετο</option>
                    <option value="4:3">4:3 - Οριζόντιο</option>
                    <option value="16:9">16:9 - Wide</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-foreground">
                    <Settings2 className="w-4 h-4 text-primary" />
                    Αριθμός εικόνων
                  </label>
                  <select 
                    value={imageCount} 
                    onChange={(e) => setImageCount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                  >
                    <option value="1">1 εικόνα</option>
                    <option value="2">2 εικόνες</option>
                    <option value="3">3 εικόνες</option>
                    <option value="4">4 εικόνες</option>
                  </select>
                </div>
              </div>

              {/* Negative Prompt */}
              <div>
                <label className="text-sm font-semibold mb-2 text-foreground block">
                  Negative Prompt (προαιρετικό)
                </label>
                <input
                  type="text"
                  value={negative}
                  onChange={(e) => setNegative(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                  placeholder="blurry, watermark, extra fingers, low quality"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Στοιχεία που θέλεις να αποφύγεις στο σχέδιο
                </p>
              </div>

              {/* Generate Button */}
              <Button 
                type="submit" 
                disabled={isGenerating}
                className="w-full py-6 text-lg font-bold transition-smooth"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                    Δημιουργία...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Δημιούργησε Σχέδιο
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Info Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 bg-card border-primary/20">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-primary rounded-full glow-effect"></div>
                <h3 className="font-bold text-foreground">Πώς λειτουργεί;</h3>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <span>Περίγραψε το σχέδιο που θέλεις (όσο πιο αναλυτικά τόσο καλύτερα)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <span>Επίλεξε την αναλογία και τον αριθμό εικόνων</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">3.</span>
                  <span>Πάτα "Δημιούργησε" και περίμενε λίγα δευτερόλεπτα</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">4.</span>
                  <span>Κατέβασε ή αντίγραψε το αποτέλεσμα</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 bg-gradient-primary text-primary-foreground">
              <h3 className="font-bold mb-3">💡 Tips για καλύτερα αποτελέσματα</h3>
              <ul className="space-y-2 text-sm opacity-95">
                <li>• Χρησιμοποίησε "realistic black & grey" στην περιγραφή</li>
                <li>• Ανάφερε "high contrast, clean lines"</li>
                <li>• Πρόσθεσε "no background" για καθαρό σχέδιο</li>
                <li>• Πες στο AI να αποφύγει χρώματα αν θέλεις μόνο ασπρόμαυρο</li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Results Grid */}
        {images.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6 text-center text-foreground">
              Τα σχέδιά σου
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((img) => {
                const src = `data:image/png;base64,${img.base64}`;
                return (
                  <Card 
                    key={img.index} 
                    className="overflow-hidden bg-card border-border hover:border-primary/50 transition-smooth"
                  >
                    <div className="aspect-square relative group">
                      <img 
                        src={src} 
                        alt={`AI tattoo design ${img.index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-smooth flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-2">
                          <a
                            href={src}
                            download={`roni_tattoo_ai_${Date.now()}_${img.index + 1}.png`}
                            className="bg-primary text-primary-foreground p-3 rounded-full hover:scale-110 transition-smooth"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Download className="w-5 h-5" />
                          </a>
                          <button
                            onClick={() => handleCopyImage(img.base64, img.index)}
                            className="bg-secondary text-secondary-foreground p-3 rounded-full hover:scale-110 transition-smooth"
                          >
                            <Copy className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex gap-2">
                        <a
                          href={src}
                          download={`roni_tattoo_ai_${Date.now()}_${img.index + 1}.png`}
                          className="flex-1"
                        >
                          <Button className="w-full gap-2" size="sm">
                            <Download className="w-4 h-4" />
                            Download
                          </Button>
                        </a>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyImage(img.base64, img.index)}
                          className="gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AITattooDesigner;
