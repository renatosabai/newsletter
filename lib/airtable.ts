import Airtable from "airtable"

// Airtable configuration
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
const ARTICLES_TABLE_NAME = "Articles"
const SOURCES_TABLE_NAME = "News Sources"

// Initialize Airtable
const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID)
const articlesTable = base(ARTICLES_TABLE_NAME)
const sourcesTable = base(SOURCES_TABLE_NAME)

/**
 * Adds processed articles to Airtable
 */
export async function addArticlesToAirtable(articles: Array<any>) {
  try {
    console.log(`Adding ${articles.length} articles to Airtable...`)

    // Get existing articles to avoid duplicates
    const existingArticles = await getExistingArticles()
    const existingUrls = new Set(existingArticles.map((record) => record.get("URL")))

    // Filter out articles that already exist
    const newArticles = articles.filter((article) => !existingUrls.has(article.url))

    if (newArticles.length === 0) {
      console.log("No new articles to add to Airtable")
      return
    }

    // Prepare records for Airtable
    const records = newArticles.map((article, index) => ({
      fields: {
        "Article #": existingArticles.length + index + 1,
        "Publish Date": article.publishDate || new Date().toISOString().split('T')[0],
        "Title": article.title,
        "Summary": article.summary,
        "Tags": article.tags,
        "Source": article.source,
        "URL": article.url,
      },
    }))

    // Add records in batches (Airtable has a limit of 10 records per request)
    const batchSize = 10
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize)
      await articlesTable.create(batch)
    }

    console.log(`Added ${newArticles.length} new articles to Airtable`)
  } catch (error) {
    console.error("Error adding articles to Airtable:", error)
    throw error
  }
}

/**
 * Gets existing articles from Airtable
 */
async function getExistingArticles() {
  try {
    const records = await articlesTable.select().all()
    return records
  } catch (error) {
    console.error("Error getting existing articles from Airtable:", error)
    return []
  }
}

/**
 * Fetches news sources from Airtable
 */
export async function fetchNewsSources() {
  try {
    const records = await sourcesTable.select().all()

    // Parse the sources
    const sources = []
    
    records.forEach((record) => {
      const category = record.get("Category") || "Uncategorized"
      const name = record.get("Name")
      const url = record.get("URL")

      if (name && url) {
        sources.push({
          name,
          url,
          category,
          selectors: getSelectorsForWebsite(url),
        })
      }
    })

    console.log(`Fetched ${sources.length} sources from Airtable`)
    return sources
  } catch (error) {
    console.error("Error fetching news sources from Airtable:", error)
    return []
  }
}

/**
 * Determines the appropriate selectors for a given website
 */
function getSelectorsForWebsite(url: string) {
  // Default selectors
  const defaultSelectors = {
    articleSelector: "article",
    titleSelector: "h2, h3",
    linkSelector: "a",
    dateSelector: "time",
    contentSelector: "article, .article-content, .entry-content, .post-content",
  }

  // Website-specific selectors
  if (url.includes("techcrunch.com")) {
    return {
      articleSelector: "article",
      titleSelector: "h2",
      linkSelector: "a",
      dateSelector: "time",
      contentSelector: ".article-content",
    }
  } else if (url.includes("theverge.com")) {
    return {
      articleSelector: "article",
      titleSelector: "h2",
      linkSelector: "a",
      dateSelector: "time",
      contentSelector: ".c-entry-content",
    }
  }
  
  // Add more website-specific selectors as needed
  
  // Return default selectors for other websites
  return defaultSelectors
}