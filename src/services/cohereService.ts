
import { toast } from "@/components/ui/sonner";

// Using a temporary API key approach - should be moved to environment variables
// or a more secure approach in production
const API_KEY = "PpywVA40FfV1vz4VaSFP6Wqk7uFp0dmutCh8AQ2p";

interface GenerateStoryParams {
  theme: string;
  genre: string;
  continuation?: string;
  includeEnding?: boolean;
}

interface GenerateEndingsResponse {
  mainStory: string;
  endings: string[];
}

export const generateStory = async ({ theme, genre, continuation, includeEnding = true }: GenerateStoryParams): Promise<string | GenerateEndingsResponse | null> => {
  try {
    let prompt = '';
    
    if (continuation) {
      prompt = `Continue this story in the ${genre} genre. Make it captivating and interesting:
      
${continuation}

[Continue the story from here, picking up naturally where it left off. Write approximately 300 more words. DO NOT repeat any of the original story text.]`;
    } else {
      // For new stories, generate the main story without ending
      prompt = `Write a captivating short story (200-300 words) in the ${genre} genre about ${theme}. Stop right before the ending - at the peak of suspense.`;
      
      const mainResponse = await fetch("https://api.cohere.ai/v1/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "command-light",
          prompt,
          max_tokens: 400,
          temperature: 0.8,
          k: 0,
          p: 0.75,
          stop_sequences: [],
          return_likelihoods: "NONE"
        }),
      });

      if (!mainResponse.ok) {
        throw new Error("Failed to generate main story");
      }

      const mainData = await mainResponse.json();
      const mainStory = mainData.generations[0].text.trim();

      // Generate three different endings
      const endingPrompt = `Given this story: "${mainStory}"

Generate a unique and unexpected twist ending (2-3 sentences). Make it surprising but logical within the story's context.`;

      const endings: string[] = [];
      for (let i = 0; i < 3; i++) {
        const endingResponse = await fetch("https://api.cohere.ai/v1/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model: "command-light",
            prompt: endingPrompt,
            max_tokens: 100,
            temperature: 0.9, // Higher temperature for more variety
            k: 0,
            p: 0.75,
            stop_sequences: [],
            return_likelihoods: "NONE"
          }),
        });

        if (endingResponse.ok) {
          const endingData = await endingResponse.json();
          endings.push(endingData.generations[0].text.trim());
        }
      }

      return {
        mainStory,
        endings
      };
    }

    // Return just the generated text for continuations
    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "command-light",
        prompt,
        max_tokens: 500,
        temperature: 0.8,
        k: 0,
        p: 0.75,
        stop_sequences: [],
        return_likelihoods: "NONE"
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to generate story");
    }

    const data = await response.json();
    return data.generations[0].text.trim();
  } catch (error) {
    console.error("Error generating story:", error);
    toast.error("Failed to generate story. Please try again.");
    return null;
  }
};

export const genres = [
  "Fantasy",
  "Science Fiction",
  "Mystery",
  "Romance",
  "Horror",
  "Adventure",
  "Historical Fiction",
  "Thriller",
  "Comedy",
  "Fairy Tale",
];
