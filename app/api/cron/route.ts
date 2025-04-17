import { NextResponse } from "next/server"
import { summarizeArticle, generateTags } from "@/lib/ai-processing"
import { addArticlesToAirtable } from "@/lib/airtable"
import { fetchArticlesFromSources } from "@/lib/scraper"

export const dynamic = "force-dynamic"
export const maxDuration = 300 // 5 minutes max execution time

export async function GET() {
  try {
    console.log("Starting newsletter curation process...")

    // 1. Fetch articles from configured sources
    const articles = await fetchArticlesFromSources()
    console.log(`Fetched ${articles.length} articles from sources`)

    // 2. Process each article (summarize and tag)
    const processedArticles = []
    for (const article of articles) {
      // Generate summary using AI
      const summary = await summarizeArticle(article.content)

      // Generate tags using AI
      const tags = await generateTags(article.title, article.content, article.category)

      processedArticles.push({
        ...article,
        summary,
        tags,
      })

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    // 3. Add processed articles to Airtable
    await addArticlesToAirtable(processedArticles)

    console.log("Newsletter curation process completed successfully")

    return NextResponse.json({
      success: true,
      message: `Processed ${processedArticles.length} articles`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in newsletter curation process:", error)
    return NextResponse.json(
      { error: "Failed to process articles", message: error.message },
      { status: 500 }
    )
  }
}