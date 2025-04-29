
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { generateStory } from "@/services/cohereService";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";

export interface StoryData {
  id: string;
  theme: string;
  genre: string;
  content: string;
  endings?: string[];
  selectedEnding?: string;
  createdAt: Date;
}

interface StoryProps {
  story: StoryData;
  onContinue: (story: StoryData) => void;
}

const Story = ({ story, onContinue }: StoryProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEnding, setSelectedEnding] = useState<string | undefined>(story.selectedEnding);

  const handleSelectEnding = (ending: string) => {
    setSelectedEnding(ending);
    const updatedStory = {
      ...story,
      content: story.content + "\n\n" + ending,
      selectedEnding: ending,
      endings: undefined // Remove endings after selection
    };
    onContinue(updatedStory);
    toast.success("Ending selected!");
  };

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      const continued = await generateStory({
        theme: story.theme,
        genre: story.genre,
        continuation: story.content,
        includeEnding: false
      });
      
      if (continued) {
        const continuedStory: StoryData = {
          ...story,
          id: crypto.randomUUID(),
          content: continued as string,
          createdAt: new Date()
        };
        onContinue(continuedStory);
        toast.success("Story continued!");
      }
    } catch (error) {
      toast.error("Failed to continue story");
    } finally {
      setIsLoading(false);
    }
  };

  // Format date to be more readable
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(story.createdAt);

  return (
    <Card className="border border-diva-purple/20 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-diva-purple/10 to-diva-teal/10 p-4 border-b border-diva-purple/20">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-serif text-lg font-semibold">{story.theme}</h3>
            <p className="text-sm text-muted-foreground">{story.genre} • {formattedDate}</p>
          </div>
          {!story.endings && (
            <Button
              variant="outline"
              className="hover:bg-diva-purple hover:text-white transition-all"
              onClick={handleContinue}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></span>
                  Continuing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Continue <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          )}
        </div>
      </div>
      <div className="p-5">
        <div className="story-text whitespace-pre-line">
          {story.content}
        </div>
        
        {story.endings && story.endings.length > 0 && !selectedEnding && (
          <div className="mt-6 space-y-4 border-t border-diva-purple/10 pt-4">
            <h4 className="text-lg font-serif font-semibold text-center">Choose an Ending</h4>
            <RadioGroup
              value={selectedEnding}
              className="space-y-3"
            >
              {story.endings.map((ending, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border border-diva-purple/10 hover:bg-diva-purple/5 transition-colors">
                  <RadioGroupItem
                    value={ending}
                    id={`ending-${index}`}
                    onClick={() => handleSelectEnding(ending)}
                  />
                  <Label
                    htmlFor={`ending-${index}`}
                    className="leading-relaxed cursor-pointer"
                  >
                    {ending}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}
      </div>
      <div className="bg-gradient-to-r from-diva-purple/5 to-diva-teal/5 p-3 flex justify-center">
        <div className="flex items-center text-xs text-muted-foreground gap-1">
          <Sparkles className="h-3 w-3 text-diva-gold" /> Created by Diva StoryForge
        </div>
      </div>
    </Card>
  );
};

export default Story;
