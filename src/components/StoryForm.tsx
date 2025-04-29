
import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { genres } from "@/services/cohereService";
import { Sparkles } from "lucide-react";

interface StoryFormProps {
  onSubmit: (theme: string, genre: string) => void;
  isLoading: boolean;
}

const StoryForm = ({ onSubmit, isLoading }: StoryFormProps) => {
  const [theme, setTheme] = useState("");
  const [genre, setGenre] = useState("Fantasy");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!theme.trim()) return;
    onSubmit(theme, genre);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="theme" className="block text-sm font-medium">
          Story Theme
        </label>
        <Input
          id="theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="Enter a theme, word, or idea..."
          className="w-full p-3"
          disabled={isLoading}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="genre" className="block text-sm font-medium">
          Genre
        </label>
        <Select 
          value={genre} 
          onValueChange={setGenre}
          disabled={isLoading}
        >
          <SelectTrigger id="genre" className="w-full">
            <SelectValue placeholder="Select genre" />
          </SelectTrigger>
          <SelectContent>
            {genres.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-magic hover:opacity-90 transition-all"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            Crafting Story...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Create Story
          </span>
        )}
      </Button>
    </form>
  );
};

export default StoryForm;
