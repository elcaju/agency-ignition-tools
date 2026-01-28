import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const tools = [
    {
      title: "Company Name & Job Title Formatter",
      description: "Standardize company names and job titles with rule-based or AI-powered normalization.",
      href: "/formatter",
      icon: "🧹",
    },
    {
      title: "TAM Calculator",
      description: "Calculate Total Addressable Market based on industry, roles, and company size.",
      href: "/tam-calculator",
      icon: "📈",
    },
    {
      title: "ROI Calculator",
      description: "Estimate ROI for outreach and lead gen campaigns with detailed funnel metrics.",
      href: "/roi-calculator",
      icon: "💰",
    },
    {
      title: "Cold Email Copywriter",
      description: "Generate effective cold email sequences using the Triple Tap framework with your OpenAI API key.",
      href: "/copywriter",
      icon: "✍️",
    },
    {
      title: "Market Researcher",
      description: "Drop in your niche to get trends, competitors, and tailored insights.",
      href: "/market-researcher",
      icon: "🔍",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Agency Ignition Tools
          </h1>
          <p className="text-xl text-muted-foreground">
            Your agency tools in one place
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {tools.map((tool) => (
            <Card key={tool.href} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{tool.icon}</span>
                  <CardTitle>{tool.title}</CardTitle>
                </div>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <div className="px-6 pb-6">
                <Link href={tool.href}>
                  <Button className="w-full">Open Tool</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
