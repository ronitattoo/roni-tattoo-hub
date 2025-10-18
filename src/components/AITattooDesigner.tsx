import { useEffect } from "react";

const AITattooDesigner = () => {
  useEffect(() => {
    const resizeAIFrame = () => {
      const iframe = document.querySelector('.ai-tool iframe') as HTMLIFrameElement;
      if (!iframe) return;
      const height = Math.max(700, window.innerHeight * 0.9);
      iframe.style.height = `${height}px`;
    };

    resizeAIFrame();
    window.addEventListener('resize', resizeAIFrame);
    return () => window.removeEventListener('resize', resizeAIFrame);
  }, []);

  return (
    <section className="ai-tool max-w-[1100px] mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-4 text-foreground">
        Δημιούργησε σχέδιο τατουάζ με AI
      </h2>

      <iframe
        src="https://ai.studio/apps/drive/1Q0fe8ByoU8HpqwT8EehLnC7X8o5MDIAy"
        className="w-full h-[900px] border-0 rounded-xl overflow-hidden"
        allow="clipboard-read; clipboard-write; microphone; camera"
        title="AI Tattoo Designer"
      />

      <p className="text-sm opacity-80 mt-2 text-muted-foreground">
        Αν δεν φορτώνει μέσα στη σελίδα,{" "}
        <a
          href="https://ai.studio/apps/drive/1Q0fe8ByoU8HpqwT8EehLnC7X8o5MDIAy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-100"
        >
          άνοιξέ το εδώ σε νέα καρτέλα
        </a>
        .
      </p>
    </section>
  );
};

export default AITattooDesigner;
