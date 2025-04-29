import { useState, useEffect } from "react";
import { generateStory } from "@/services/cohereService";
import Header from "@/components/Header";
import StoryForm from "@/components/StoryForm";
import Story, { StoryData } from "@/components/Story";
import MagicBackground from "@/components/MagicBackground";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MAX_STORIES = 10;
const STORAGE_KEY = "diva_stories";

const Index = () => {
  const [stories, setStories] = useState<StoryData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("create");
  
  useEffect(() => {
    const savedStories = localStorage.getItem(STORAGE_KEY);
    if (savedStories) {
      try {
        const parsedStories = JSON.parse(savedStories).map((story: any) => ({
          ...story,
          createdAt: new Date(story.createdAt)
        }));
        setStories(parsedStories);
      } catch (error) {
        console.error("Failed to parse saved stories", error);
      }
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
  }, [stories]);

  const handleCreateStory = async (theme: string, genre: string) => {
    setIsLoading(true);
    try {
      const result = await generateStory({ theme, genre });
      
      if (result && typeof result !== 'string') {
        const { mainStory, endings } = result;
        const newStory: StoryData = {
          id: crypto.randomUUID(),
          theme,
          genre,
          content: mainStory,
          endings,
          createdAt: new Date()
        };
        
        setStories(prevStories => {
          const updatedStories = [newStory, ...prevStories].slice(0, MAX_STORIES);
          return updatedStories;
        });
        
        toast.success("Story created! Choose an ending.");
        setActiveTab("history");
      }
    } catch (error) {
      toast.error("Failed to create story");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleContinueStory = (continuedStory: StoryData) => {
    setStories(prevStories => {
      const storyIndex = prevStories.findIndex(s => s.id === continuedStory.id);
      
      if (storyIndex !== -1) {
        const updatedStories = [...prevStories];
        updatedStories[storyIndex] = continuedStory;
        return updatedStories;
      } else {
        return [continuedStory, ...prevStories].slice(0, MAX_STORIES);
      }
    });
  };

  return (
    <div className="min-h-screen">
      <MagicBackground />
      <div className="container max-w-5xl py-10 px-4 relative z-10">
        <Header />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="create">Create Story</TabsTrigger>
            <TabsTrigger value="history">
              Story History
              {stories.length > 0 && <span className="ml-2 bg-diva-purple/20 px-2 py-0.5 text-xs rounded-full">{stories.length}</span>}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="max-w-md mx-auto">
            <StoryForm onSubmit={handleCreateStory} isLoading={isLoading} />
          </TabsContent>
          
          <TabsContent value="history">
            {stories.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <p>No stories created yet. Go to Create Story to craft your first tale!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {stories.map((story) => (
                  <Story 
                    key={story.id} 
                    story={story}
                    onContinue={handleContinueStory}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
