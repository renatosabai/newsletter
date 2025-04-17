import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-gray-50">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Newsletter Curation System</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Monitor the status of your newsletter curation system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Schedule:</span>
                <span>Daily at 06:00 UTC</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Last Run:</span>
                <span>Pending first execution</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Airtable Base:</span>
                <a
                  href={`https://airtable.com/${process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Base
                </a>
              </div>

              <div className="flex justify-end mt-4">
                <Link href="/api/cron">
                  <Button>Run Manually</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>Overview of the newsletter curation system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">How It Works</h3>
              <p className="text-sm text-gray-600">
                This system automatically checks for new content from configured sources daily, summarizes the content
                using AI, tags it based on relevance criteria, and adds it to Airtable for editorial review.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Features</h3>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                <li>Automatic content retrieval from configured sources</li>
                <li>AI-powered summarization (max 200 words)</li>
                <li>Intelligent tagging based on content analysis</li>
                <li>Automatic Airtable updates</li>
                <li>Daily scheduled runs</li>
                <li>Manual trigger option</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}