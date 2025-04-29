
import { Sparkles } from "lucide-react";

const Header = () => {
  return (
    <header className="mb-8 text-center">
      <div className="inline-flex items-center gap-2 mb-2">
        <Sparkles className="h-6 w-6 text-diva-gold floating" />
        <h1 className="text-4xl md:text-5xl font-serif font-bold magic-text">
          Diva StoryForge
        </h1>
        <Sparkles className="h-6 w-6 text-diva-gold floating" />
      </div>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Enter a theme and select a genre, and Diva will craft a unique short story for you,
        complete with an unexpected twist ending. Continue stories to expand the narrative.
      </p>
    </header>
  );
};

export default Header;
