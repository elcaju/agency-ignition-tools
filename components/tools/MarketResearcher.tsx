"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MarketResearch {
  trends: {
    current: string[];
    emerging: string[];
  };
  competitors: {
    name: string;
    positioning: string;
    strengths: string[];
    weaknesses: string[];
  }[];
  opportunities: {
    gap: string;
    description: string;
    potential: string;
  }[];
  targetAudience: {
    demographics: string;
    painPoints: string[];
    buyingBehavior: string;
  };
  growthProjections: {
    marketSize: string;
    growthRate: string;
    keyDrivers: string[];
  };
  insights: string[];
}

export default function MarketResearcher() {
  const [apiKey, setApiKey] = useState("");
  const [niche, setNiche] = useState("");
  const [optionalFilters, setOptionalFilters] = useState({
    geographicFocus: "",
    industryVertical: "",
    companySize: "",
    timePeriod: "12 months",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [research, setResearch] = useState<MarketResearch | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const handleFilterChange = useCallback(
    (field: keyof typeof optionalFilters, value: string) => {
      setOptionalFilters((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const generateResearch = useCallback(async () => {
    if (!apiKey) {
      setError("Please enter your OpenAI API key");
      return;
    }
    if (!niche.trim()) {
      setError("Please enter a market niche or industry to research");
      return;
    }

    setLoading(true);
    setError(null);
    setElapsedTime(0);
    const startTime = Date.now();

    // Start elapsed time counter
    const timeInterval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    console.log("🚀 Starting market research generation...");
    console.log("Niche:", niche);
    console.log("Filters:", optionalFilters);

    const prompt = `You are an expert market researcher and business analyst. Conduct comprehensive market research for the following niche/market.

**Market/Niche to Research:**
${niche}

**Optional Context:**
${optionalFilters.geographicFocus ? `Geographic Focus: ${optionalFilters.geographicFocus}` : ""}
${optionalFilters.industryVertical ? `Industry Vertical: ${optionalFilters.industryVertical}` : ""}
${optionalFilters.companySize ? `Company Size Focus: ${optionalFilters.companySize}` : ""}
${optionalFilters.timePeriod ? `Time Period for Trends: ${optionalFilters.timePeriod}` : ""}

---

**Your Task:**
Provide a comprehensive market research analysis in the following JSON format. Be thorough, specific, and actionable.

**Output Format (MANDATORY - Return ONLY valid JSON):**

{
  "trends": {
    "current": [
      "Current trend 1 with specific details",
      "Current trend 2 with specific details",
      "Current trend 3 with specific details"
    ],
    "emerging": [
      "Emerging trend 1 with specific details",
      "Emerging trend 2 with specific details",
      "Emerging trend 3 with specific details"
    ]
  },
  "competitors": [
    {
      "name": "Competitor Company Name",
      "positioning": "How they position themselves in the market",
      "strengths": [
        "Strength 1",
        "Strength 2",
        "Strength 3"
      ],
      "weaknesses": [
        "Weakness 1",
        "Weakness 2"
      ]
    }
  ],
  "opportunities": [
    {
      "gap": "Specific market gap or opportunity",
      "description": "Detailed description of the opportunity",
      "potential": "Why this opportunity has potential and who it serves"
    }
  ],
  "targetAudience": {
    "demographics": "Detailed description of target audience demographics, psychographics, and characteristics",
    "painPoints": [
      "Pain point 1 with context",
      "Pain point 2 with context",
      "Pain point 3 with context"
    ],
    "buyingBehavior": "How they research, evaluate, and purchase solutions. Include decision-making process, budget considerations, and key influencers."
  },
  "growthProjections": {
    "marketSize": "Current and projected market size with context",
    "growthRate": "Expected growth rate and timeframe",
    "keyDrivers": [
      "Driver 1 explaining market growth",
      "Driver 2 explaining market growth",
      "Driver 3 explaining market growth"
    ]
  },
  "insights": [
    "Key strategic insight 1",
    "Key strategic insight 2",
    "Key strategic insight 3",
    "Key strategic insight 4"
  ]
}

**Requirements:**
- Provide at least 3-5 competitors (if market is small, provide all major players)
- Include 3-5 market opportunities
- List 3-5 current trends and 3-5 emerging trends
- Provide 4-6 key strategic insights
- Be specific and actionable - avoid generic statements
- Use real data and insights where possible
- Focus on actionable intelligence for business decision-making
- If certain information is not available or speculative, indicate that clearly

Return ONLY valid minified JSON. No markdown. No explanations. No comments.`;

    try {
      console.log("📡 Sending request to OpenAI API...");

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout

      const requestBody = {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an expert market researcher. Return ONLY valid minified JSON. No comments. No markdown. No explanations.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      };

      console.log("Request body size:", JSON.stringify(requestBody).length, "characters");

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const requestTime = Math.floor((Date.now() - startTime) / 1000);
      console.log(`⏱️ Request completed in ${requestTime} seconds`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ API Error:", errorData);
        const errorMessage = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(`OpenAI API Error: ${errorMessage}`);
      }

      const data = await response.json();
      console.log("✅ Received response from OpenAI");
      console.log("Response structure:", {
        hasChoices: !!data.choices,
        choicesLength: data.choices?.length,
        hasMessage: !!data.choices?.[0]?.message,
        hasContent: !!data.choices?.[0]?.message?.content,
      });

      const content = data.choices[0]?.message?.content;
      if (!content) {
        console.error("❌ No content in response:", data);
        throw new Error("No content received from OpenAI. Response: " + JSON.stringify(data).substring(0, 200));
      }

      console.log("📝 Content length:", content.length, "characters");

      let parsed;
      try {
        parsed = typeof content === "string" ? JSON.parse(content) : content;
        console.log("✅ JSON parsed successfully");
        console.log("Parsed keys:", Object.keys(parsed));
      } catch (parseError) {
        console.error("❌ JSON Parse Error:", parseError);
        console.error("Content preview:", content.substring(0, 500));
        throw new Error(`Failed to parse JSON response: ${parseError instanceof Error ? parseError.message : "Unknown error"}`);
      }

      // Validate structure
      if (!parsed.trends || !parsed.competitors || !parsed.opportunities) {
        console.error("❌ Invalid structure. Missing required fields:", {
          hasTrends: !!parsed.trends,
          hasCompetitors: !!parsed.competitors,
          hasOpportunities: !!parsed.opportunities,
          allKeys: Object.keys(parsed),
        });
        throw new Error("Invalid response format from OpenAI. Missing required fields.");
      }

      const totalTime = Math.floor((Date.now() - startTime) / 1000);
      console.log(`🎉 Success! Total time: ${totalTime} seconds`);
      
      setResearch(parsed as MarketResearch);
    } catch (err) {
      clearInterval(timeInterval);
      const totalTime = Math.floor((Date.now() - startTime) / 1000);
      
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          console.error("⏰ Request timed out after 120 seconds");
          setError("Request timed out. The API may be slow or overloaded. Please try again.");
        } else {
          console.error("❌ Error:", err.message);
          // Clean up error message for user
          const cleanMessage = err.message.replace(/\(after \d+ seconds\)/g, "").trim();
          setError(cleanMessage || "Failed to generate market research. Please try again.");
        }
      } else {
        console.error("❌ Unknown error:", err);
        setError("Failed to generate market research. Please try again.");
      }
    } finally {
      clearInterval(timeInterval);
      setLoading(false);
    }
  }, [apiKey, niche, optionalFilters]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Market Researcher</h1>
        <p className="text-muted-foreground">
          Drop in your niche to get trends, competitors, and tailored insights.
        </p>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Research Configuration</CardTitle>
            <CardDescription>Enter your OpenAI API key and market details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="api-key">OpenAI API Key</Label>
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your API key is stored locally and never sent to our servers.
              </p>
            </div>

            <div>
              <Label htmlFor="niche">Market/Niche to Research *</Label>
              <Textarea
                id="niche"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g., SaaS project management tools for remote teams, B2B marketing automation for e-commerce, etc."
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Be specific about the market, industry, or niche you want to research.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Optional Filters</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="geographic">Geographic Focus</Label>
                  <Input
                    id="geographic"
                    value={optionalFilters.geographicFocus}
                    onChange={(e) => handleFilterChange("geographicFocus", e.target.value)}
                    placeholder="e.g., North America, Europe, Global"
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry Vertical</Label>
                  <Input
                    id="industry"
                    value={optionalFilters.industryVertical}
                    onChange={(e) => handleFilterChange("industryVertical", e.target.value)}
                    placeholder="e.g., Healthcare, Finance, Technology"
                  />
                </div>
                <div>
                  <Label htmlFor="company-size">Company Size Focus</Label>
                  <Input
                    id="company-size"
                    value={optionalFilters.companySize}
                    onChange={(e) => handleFilterChange("companySize", e.target.value)}
                    placeholder="e.g., SMB, Mid-market, Enterprise"
                  />
                </div>
                <div>
                  <Label htmlFor="time-period">Time Period for Trends</Label>
                  <select
                    id="time-period"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={optionalFilters.timePeriod}
                    onChange={(e) => handleFilterChange("timePeriod", e.target.value)}
                  >
                    <option value="6 months">Last 6 months</option>
                    <option value="12 months">Last 12 months</option>
                    <option value="24 months">Last 24 months</option>
                    <option value="5 years">Last 5 years</option>
                  </select>
                </div>
              </div>
            </div>

            <Button
              onClick={generateResearch}
              disabled={loading || !apiKey || !niche.trim()}
              className="w-full"
              size="lg"
            >
              {loading ? "Researching..." : "Generate Market Research"}
            </Button>
          </CardContent>
        </Card>

        {research && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Trends</CardTitle>
                <CardDescription>Current and emerging trends</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="current" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="current">Current Trends</TabsTrigger>
                    <TabsTrigger value="emerging">Emerging Trends</TabsTrigger>
                  </TabsList>
                  <TabsContent value="current" className="space-y-3">
                    {research.trends.current.map((trend, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">{trend}</p>
                      </div>
                    ))}
                  </TabsContent>
                  <TabsContent value="emerging" className="space-y-3">
                    {research.trends.emerging.map((trend, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">{trend}</p>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Competitor Analysis</CardTitle>
                <CardDescription>Key players in the market</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {research.competitors.map((competitor, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{competitor.name}</CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              `${competitor.name}\n\nPositioning: ${competitor.positioning}\n\nStrengths:\n${competitor.strengths.map((s) => `- ${s}`).join("\n")}\n\nWeaknesses:\n${competitor.weaknesses.map((w) => `- ${w}`).join("\n")}`
                            )
                          }
                        >
                          Copy
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Positioning</Label>
                        <p className="text-sm">{competitor.positioning}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Strengths</Label>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {competitor.strengths.map((strength, i) => (
                            <li key={i}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Weaknesses</Label>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {competitor.weaknesses.map((weakness, i) => (
                            <li key={i}>{weakness}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Opportunities</CardTitle>
                <CardDescription>Gaps and opportunities in the market</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {research.opportunities.map((opportunity, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{opportunity.gap}</CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              `${opportunity.gap}\n\n${opportunity.description}\n\nPotential: ${opportunity.potential}`
                            )
                          }
                        >
                          Copy
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm">{opportunity.description}</p>
                      <div>
                        <Label className="text-xs text-muted-foreground">Potential</Label>
                        <p className="text-sm">{opportunity.potential}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Target Audience Insights</CardTitle>
                <CardDescription>Demographics, pain points, and buying behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Demographics</Label>
                  <p className="text-sm">{research.targetAudience.demographics}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Pain Points</Label>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {research.targetAudience.painPoints.map((painPoint, i) => (
                      <li key={i}>{painPoint}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Buying Behavior</Label>
                  <p className="text-sm whitespace-pre-wrap">{research.targetAudience.buyingBehavior}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Projections</CardTitle>
                <CardDescription>Market size and growth drivers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Market Size</Label>
                  <p className="text-sm">{research.growthProjections.marketSize}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Growth Rate</Label>
                  <p className="text-sm">{research.growthProjections.growthRate}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Key Growth Drivers</Label>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {research.growthProjections.keyDrivers.map((driver, i) => (
                      <li key={i}>{driver}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Strategic Insights</CardTitle>
                <CardDescription>Actionable intelligence for decision-making</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {research.insights.map((insight, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">{insight}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {loading && (
          <Card>
            <CardHeader>
              <CardTitle>Research Results</CardTitle>
              <CardDescription>Generating market research...</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <div>
                    <p className="text-muted-foreground">Researching your market...</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {elapsedTime} seconds
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!research && !loading && (
          <Card>
            <CardHeader>
              <CardTitle>Research Results</CardTitle>
              <CardDescription>Your market research will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Enter your API key and market niche, then click "Generate Market Research" to get started.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
