import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Download, Save, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface SavedDesign {
  id: string;
  prompt: string;
  image_data: string;
  created_at: string;
}

const AITattooCreator = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);
  const [isLoadingDesigns, setIsLoadingDesigns] = useState(false);

  useEffect(() => {
    // Check auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadSavedDesigns();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadSavedDesigns();
      } else {
        setSavedDesigns([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadSavedDesigns = async () => {
    setIsLoadingDesigns(true);
    try {
      const { data, error } = await supabase
        .from('tattoo_designs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedDesigns(data || []);
    } catch (error) {
      console.error('Error loading designs:', error);
      toast({
        title: "Σφάλμα",
        description: "Δεν ήταν δυνατή η φόρτωση των σχεδίων σας",
        variant: "destructive",
      });
    } finally {
      setIsLoadingDesigns(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Απαιτείται περιγραφή",
        description: "Παρακαλώ γράψε τι σχέδιο θέλεις να δημιουργήσεις",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    toast({
      title: "Δημιουργία σε εξέλιξη",
      description: "Το AI δημιουργεί το σχέδιο σου...",
    });

    try {
      const { data, error } = await supabase.functions.invoke('generate-tattoo', {
        body: { prompt }
      });

      if (error) {
        if (error.message.includes('429')) {
          throw new Error('Υπέρβαση ορίου χρήσης. Δοκίμασε ξανά αργότερα.');
        }
        if (error.message.includes('402')) {
          throw new Error('Χρειάζονται περισσότερα credits. Επισκέψου τις ρυθμίσεις.');
        }
        throw error;
      }

      if (!data?.imageUrl) {
        throw new Error('Δεν δημιουργήθηκε εικόνα');
      }

      setGeneratedImage(data.imageUrl);
      toast({
        title: "Επιτυχής δημιουργία!",
        description: "Το σχέδιο σου είναι έτοιμο",
      });
    } catch (error) {
      console.error('Error generating tattoo:', error);
      toast({
        title: "Σφάλμα",
        description: error instanceof Error ? error.message : "Σφάλμα δημιουργίας. Δοκίμασε ξανά.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Απαιτείται σύνδεση",
        description: "Πρέπει να συνδεθείς για να αποθηκεύσεις σχέδια",
        variant: "destructive",
      });
      return;
    }

    if (!generatedImage) return;

    try {
      const { error } = await supabase
        .from('tattoo_designs')
        .insert({
          user_id: user.id,
          prompt,
          image_data: generatedImage,
          style: 'realistic-black-grey'
        });

      if (error) throw error;

      toast({
        title: "Αποθηκεύτηκε!",
        description: "Το σχέδιο αποθηκεύτηκε επιτυχώς",
      });

      loadSavedDesigns();
    } catch (error) {
      console.error('Error saving design:', error);
      toast({
        title: "Σφάλμα",
        description: "Δεν ήταν δυνατή η αποθήκευση του σχεδίου",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tattoo_designs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Διαγράφηκε",
        description: "Το σχέδιο διαγράφηκε επιτυχώς",
      });

      loadSavedDesigns();
    } catch (error) {
      console.error('Error deleting design:', error);
      toast({
        title: "Σφάλμα",
        description: "Δεν ήταν δυνατή η διαγραφή του σχεδίου",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="snap-item min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">AI Tattoo Creator</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Δημιούργησε το σχέδιο σου με AI
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Χρησιμοποίησε την τεχνητή νοημοσύνη για να οπτικοποιήσεις την ιδέα σου. 
            Ιδανικό για <strong className="text-foreground">realistic black & grey</strong> σχέδια.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Generator Card */}
          <Card className="p-6 bg-card border-border">
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-foreground">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  Περιγραφή σχεδίου
                </label>
                <Textarea
                  rows={5}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full resize-none"
                  placeholder="π.χ. Ρεαλιστικό λιοντάρι με ρολόι τσέπης, υψηλό κοντράστ, καθαρές γραμμές"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Περίγραψε λεπτομερώς το σχέδιο που φαντάζεσαι
                </p>
              </div>

              <Button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full py-6 text-lg font-bold"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Δημιουργία...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Δημιούργησε Σχέδιο
                  </>
                )}
              </Button>

              {generatedImage && (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden border border-border">
                    <img 
                      src={generatedImage} 
                      alt="Generated tattoo design"
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={generatedImage}
                      download={`tattoo_${Date.now()}.png`}
                      className="flex-1"
                    >
                      <Button className="w-full gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </a>
                    {user && (
                      <Button
                        onClick={handleSave}
                        variant="secondary"
                        className="gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Αποθήκευση
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Info & Tips Card */}
          <div className="space-y-6">
            <Card className="p-6 bg-card border-primary/20">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <h3 className="font-bold text-foreground">Πώς λειτουργεί;</h3>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <span>Περίγραψε το σχέδιο που θέλεις (όσο πιο αναλυτικά τόσο καλύτερα)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <span>Πάτα "Δημιούργησε" και περίμενε λίγα δευτερόλεπτα</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">3.</span>
                  <span>Κατέβασε ή αποθήκευσε το αποτέλεσμα</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">4.</span>
                  <span>Δες τα αποθηκευμένα σχέδια σου παρακάτω</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-primary to-primary-foreground text-primary-foreground">
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

        {/* Saved Designs */}
        {user && (
          <div>
            <h3 className="text-2xl font-bold mb-6 text-center text-foreground">
              Τα αποθηκευμένα σχέδια σου
            </h3>
            {isLoadingDesigns ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : savedDesigns.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>Δεν έχεις αποθηκευμένα σχέδια ακόμα</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedDesigns.map((design) => (
                  <Card 
                    key={design.id}
                    className="overflow-hidden bg-card border-border hover:border-primary/50 transition-all"
                  >
                    <div className="aspect-square relative group">
                      <img 
                        src={design.image_data}
                        alt={design.prompt}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4 space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {design.prompt}
                      </p>
                      <div className="flex gap-2">
                        <a
                          href={design.image_data}
                          download={`tattoo_${design.id}.png`}
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
                          onClick={() => handleDelete(design.id)}
                          className="gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default AITattooCreator;