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
    <section id="ai-tattoo" className="max-w-[1100px] mx-auto my-10 px-2.5">
      <h2 className="text-3xl font-bold mb-3 text-center text-foreground">
        🎨 Δημιούργησε σχέδιο τατουάζ με AI
      </h2>

      <div className="relative w-full rounded-xl overflow-hidden">
        <iframe
          src="https://ai.studio/apps/drive/1Q0fe8ByoU8HpqwT8EehLnC7X8o5MDIAy"
          title="Roni Tattoo AI Image Generator"
          className="w-full h-[900px] border-0 rounded-xl overflow-hidden"
          allow="clipboard-read; clipboard-write; microphone; camera"
        />
      </div>

      <p className="text-sm opacity-80 text-center mt-2 text-muted-foreground">
        Αν δεν φορτώνει εδώ,{" "}
        <a
          href="https://ai.studio/apps/drive/1Q0fe8ByoU8HpqwT8EehLnC7X8o5MDIAy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-100"
        >
          άνοιξέ το σε νέα καρτέλα
        </a>
        .
      </p>
    </section>
  );
};

export default AITattooDesigner;
