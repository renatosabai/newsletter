# Newsletter Curation System

This project automatically curates content for a newsletter by:

1. Checking for the latest news and articles published on select websites
2. Tagging these news and articles based on a set of criteria
3. Summarizing these news and articles in 200 words max
4. Adding news and articles titles, summaries, and tags to Airtable

## Features

- Automatic content retrieval from configured sources
- AI-powered summarization (max 200 words)
- Intelligent tagging based on content analysis
- Automatic Airtable updates
- Daily scheduled runs
- Manual trigger option

## Setup

### Prerequisites

- Vercel account
- Airtable account
- OpenAI API key

### Environment Variables

The following environment variables need to be set in your Vercel project:

- `OPENAI_API_KEY`: Your OpenAI API key
- `AIRTABLE_API_KEY`: Your Airtable API key
- `AIRTABLE_BASE_ID`: Your Airtable Base ID
- `NEXT_PUBLIC_AIRTABLE_BASE_ID`: Same as AIRTABLE_BASE_ID

### Airtable Setup

1. Create a base with two tables:
   - **Articles**: For storing processed articles
   - **News Sources**: For configuring sources to monitor

2. Set up the Articles table with these fields:
   - Article # (Number)
   - Publish Date (Date)
   - Title (Single line text)
   - Summary (Long text)
   - Tags (Multiple select)
   - Source (Single line text)
   - URL (URL)

3. Set up the News Sources table with these fields:
   - Category (Single line text)
   - Name (Single line text)
   - URL (URL)

## Usage

The system runs automatically every day at 6:00 AM UTC. You can also trigger it manually by visiting the `/api/cron` endpoint.

## Development

To run the project locally:

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env.local` file with the required environment variables
4. Run the development server: `npm run dev`