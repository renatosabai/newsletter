import { load } from "cheerio"
import { fetchNewsSources } from "./airtable"

export type Article = {
  title: string
  url: string
  source: string
  category: string
  publishDate: string
  content: string
}

/**
 * Fetches articles from configured sources
 */
export async function fetchArticlesFromSources(): Promise<Article[]> {
  const allArticles: Article[] = []

  // Fetch sources from Airtable
  const sources = await fetchNewsSources()

  if (sources.length === 0) {
    console.error("No sources found. Check your Airtable configuration.")
    return []
  }

  for (const source of sources) {
    try {
      console.log(`Fetching articles from ${source.name} (${source.category})...`)
      const articles = await fetchArticlesFromSource(source)
      allArticles.push(...articles)
    } catch (error) {
      console.error(`Error fetching from ${source.name}:`, error)
    }
  }

  return allArticles
}

/**
 * Fetches articles from a single source
 */
async function fetchArticlesFromSource(source): Promise<Article[]> {
  const response = await fetch(source.url)
  const html = await response.text()
  const $ = load(html)

  const articles: Article[] = []

  $(source.selectors.articleSelector).each((_, element) => {
    try {
      const titleElement = $(element).find(source.selectors.titleSelector)
      const title = titleElement.text().trim()

      const linkElement = titleElement.find(source.selectors.linkSelector).length
        ? titleElement.find(source.selectors.linkSelector)
        : $(element).find(source.selectors.linkSelector).first()

      let url = linkElement.attr("href")
      if (url && !url.startsWith("http")) {
        url = new URL(url, source.url).toString()
      }

      const dateElement = $(element).find(source.selectors.dateSelector)
      const publishDate = dateElement.attr("datetime") || dateElement.text().trim()

      if (title && url) {
        articles.push({
          title,
          url,
          source: source.name,
          category: source.category,
          publishDate,
          content: "", // Content will be fetched separately
        })
      }
    } catch (error) {
      console.error(`Error parsing article from ${source.name}:`, error)
    }
  })

  // Limit to 5 most recent articles per source to avoid overloading
  const limitedArticles = articles.slice(0, 5)

  // Fetch full content for each article
  for (const article of limitedArticles) {
    try {
      article.content = await fetchArticleContent(article.url, source.selectors.contentSelector)
    } catch (error) {
      console.error(`Error fetching content for ${article.url}:`, error)
      article.content = "" // Set empty content if fetch fails
    }

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  return limitedArticles
}

/**
 * Fetches the full content of an article
 */
async function fetchArticleContent(url: string, contentSelector: string): Promise<string> {
  try {
    const response = await fetch(url)
    const html = await response.text()
    const $ = load(html)

    const content = $(contentSelector).text().trim()
    return content
  } catch (error) {
    console.error(`Error fetching article content from ${url}:`, error)
    throw error
  }
}