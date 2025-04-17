import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

/**
 * Summarizes an article using AI
 */
export async function summarizeArticle(content: string): Promise<string> {
  try {
    // Truncate content if it's too long to avoid token limits
    const truncatedContent = content.slice(0, 10000)

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are an expert content summarizer for a newsletter. 
      Summarize the provided article content in a concise, informative manner.
      Focus on the key points, main arguments, and important details.
      The summary must be under 200 words.
      Write in a professional, journalistic style.`,
      prompt: `Summarize the following article in under 200 words:
      
      ${truncatedContent}
      
      Summary (max 200 words):`,
      temperature: 0.3,
      maxTokens: 500,
    })

    return text.trim()
  } catch (error) {
    console.error("Error summarizing article:", error)
    return "Error generating summary."
  }
}

/**
 * Generates tags for an article using AI
 */
export async function generateTags(title: string, content: string, category: string = ""): Promise<string[]> {
  try {
    // Truncate content if it's too long to avoid token limits
    const truncatedContent = content.slice(0, 5000)

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are an expert content tagger for a newsletter.
      Generate 3-5 relevant tags for the provided article.
      Tags should be concise (1-2 words each) and relevant to the content.
      Focus on topic, industry, technology, or key themes.
      ${category ? `Consider the article's category (${category}) when generating tags.` : ''}
      Return only the tags as a comma-separated list.`,
      prompt: `Generate 3-5 relevant tags for the following article:
      
      Title: ${title}
      ${category ? `Category: ${category}` : ''}
      
      Content: ${truncatedContent}
      
      Tags (comma-separated):`,
      temperature: 0.3,
      maxTokens: 100,
    })

    // Parse the tags from the response
    const tags = text
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    return tags
  } catch (error) {
    console.error("Error generating tags:", error)
    return ["Error"]
  }
}