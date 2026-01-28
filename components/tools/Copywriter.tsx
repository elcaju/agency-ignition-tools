"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EmailVariant {
  subject: string;
  body: string;
}

interface EmailSequence {
  email_1?: EmailVariant[];
  email_2?: EmailVariant[];
  email_3?: EmailVariant[];
}

export default function Copywriter() {
  const [apiKey, setApiKey] = useState("");
  const [campaignThesis, setCampaignThesis] = useState("");
  const [numVariants1, setNumVariants1] = useState(3);
  const [numVariants2, setNumVariants2] = useState(3);
  const [numVariants3, setNumVariants3] = useState(3);
  const [companyInfo, setCompanyInfo] = useState({
    companyName: "",
    websiteLink: "",
    emailAddress: "",
    whatYouSell: "",
    targetMarket: "",
    riskReversal: "",
    clientLocations: "",
    additionalOfferInfo: "",
    clientProblems: "",
    desiredMonthlyAppointments: "",
    currentMonthlyRevenue: "",
    clientResults: "",
    companySize: "",
    dreamClientWebsites: "",
    prospectList: "",
    doNotContactList: "",
    jobTitles: "",
    industry: "",
    excludedIndustries: "",
    estimatedAnnualRevenue: "",
    keywords: "",
    keywordsToExclude: "",
    recentlyFunded: "",
    additionalClientInfo: "",
    mostRecentCaseStudy: "",
    whatMakesYouUnique: "",
    desiredMonthlyRevenue: "",
    averageCurrentAppointments: "",
    finalNotes: "",
    beforeWorkingWithYou: "",
    timeEnergySpentBefore: "",
    emotionalImpact: "",
    whyTheyActedThen: "",
    howTheyFoundYou: "",
    firstImpressions: "",
    companyExplainer: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emails, setEmails] = useState<EmailSequence>({});
  const [currentStep, setCurrentStep] = useState<"email1" | "email2" | "email3" | null>(null);

  const generateEmail1 = useCallback(async () => {
    if (!apiKey) {
      setError("Please enter your OpenAI API key");
      return;
    }
    if (!campaignThesis) {
      setError("Please enter a campaign thesis");
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentStep("email1");

    const prompt = `You are an expert outbound email copywriter.  
Your task is to generate short, punchy, and effective cold email scripts using the "Triple Tap" framework.

You must generate **${numVariants1} unique versions of email 1 only**.  
The output format must be **valid JSON** with the following structure:

{
  "emails": {
    "email_1": [
      {
        "subject": "...",
        "body": "..."
      }
    ]
  }
}

---

### Triple Tap Framework:
1. **First Tap (Open)**: Write a subject line that sparks curiosity, sounds like a vendor or client email, and never feels salesy.  
2. **Second Tap (Read)**: Write the body (max 3–4 sentences). Identify a problem, show credibility (clients/results), and offer a simple solution. Use a 6th-grade reading level.  
3. **Third Tap (Reply)**: End with a low-friction CTA answerable in one word. No links. No "book a call." No friction.

---

### Rules:
- Output must include **only email_1** with **${numVariants1} versions**, formatted in JSON as shown.
- Each version must include: \`subject\` (string) and \`body\` (string).
- Max total per email: **6 sentences**.
- Always personalize with recipient's first name if available.
- Use these variables:
  - \`{FIRST_NAME}\` for the prospect's first name  
  - \`{COMPANY}\` for the company name
- Use a natural, conversational tone that matches the target market.
- Avoid buzzwords, overpromises, or bait-and-switch.
- Include credibility (case studies, clients, proof).
- Do not insert real names or companies. Use variables only.
- Never mention the "Triple Tap" formula.
- Do NOT ask for review or approval. Just create the emails.
- Do NOT use euphoric words.
- NEVER use phrases like "this isn't just" or "it's not just".
- Use only **short dash with spaces** like this: \` - \` (not long dashes).
- Avoid semicolons or excessive punctuation.
- Map data provided by the user naturally, **only if relevant**.
- Ignore irrelevant fields.

---

### Input Data (structured):

Company Name: ${companyInfo.companyName || "N/A"}  
Website Link: ${companyInfo.websiteLink || "N/A"}  
Email Address: ${companyInfo.emailAddress || "N/A"}  
What EXACTLY do you sell to your Target Market: ${companyInfo.whatYouSell || "N/A"}  
Who EXACTLY is your Target Market: ${companyInfo.targetMarket || "N/A"}  
Risk reversal/guarantee: ${companyInfo.riskReversal || "N/A"}  
Location(s) of your ideal clients: ${companyInfo.clientLocations || "N/A"}  
Additional offer info: ${companyInfo.additionalOfferInfo || "N/A"}  
Problems your ideal clients have: ${companyInfo.clientProblems || "N/A"}  
Desired monthly appointments: ${companyInfo.desiredMonthlyAppointments || "N/A"}  
Current monthly revenue: ${companyInfo.currentMonthlyRevenue || "N/A"}  
Results you've gotten for clients: ${companyInfo.clientResults || "N/A"}  
Company size of ideal clients: ${companyInfo.companySize || "N/A"}  
Dream client websites: ${companyInfo.dreamClientWebsites || "N/A"}  
Prospect list: ${companyInfo.prospectList || "N/A"}  
Do-not-contact list: ${companyInfo.doNotContactList || "N/A"}  
Job Title(s) of ideal clients: ${companyInfo.jobTitles || "N/A"}  
Industry of ideal clients: ${companyInfo.industry || "N/A"}  
Excluded industries: ${companyInfo.excludedIndustries || "N/A"}  
Estimated Annual Revenue of ideal clients: ${companyInfo.estimatedAnnualRevenue || "N/A"}  
Keywords used by ideal clients: ${companyInfo.keywords || "N/A"}  
Keywords to exclude: ${companyInfo.keywordsToExclude || "N/A"}  
Recently funded?: ${companyInfo.recentlyFunded || "N/A"}  
Additional client info: ${companyInfo.additionalClientInfo || "N/A"}  
Most recent case study: ${companyInfo.mostRecentCaseStudy || "N/A"}  
What makes you unique: ${companyInfo.whatMakesYouUnique || "N/A"}  
Desired monthly revenue (target date + why): ${companyInfo.desiredMonthlyRevenue || "N/A"}  
Average current appointments per month: ${companyInfo.averageCurrentAppointments || "N/A"}  
Final notes: ${companyInfo.finalNotes || "N/A"}  
Before working with you: ${companyInfo.beforeWorkingWithYou || "N/A"}  
Time/energy spent before: ${companyInfo.timeEnergySpentBefore || "N/A"}  
Emotional impact: ${companyInfo.emotionalImpact || "N/A"}  
Why they acted then: ${companyInfo.whyTheyActedThen || "N/A"}  
How they found you: ${companyInfo.howTheyFoundYou || "N/A"}  
First impressions: ${companyInfo.firstImpressions || "N/A"}  
Company Explainer: ${companyInfo.companyExplainer || "N/A"}

---

Here is the campaign thesis we have for this campaign. It's very important to have it in mind to base the scripts:
${campaignThesis}

---

Now, write the ${numVariants1} versions of email_1.`;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "The email should be easy to read. The email should be readable that a 3rd grade student can read it, and it be understood.\n\nReturn ONLY valid minified JSON. No comments. No markdown. No explanations.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to generate email");
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No content received from OpenAI");
      }

      let parsed;
      try {
        parsed = typeof content === "string" ? JSON.parse(content) : content;
      } catch (parseError) {
        throw new Error("Failed to parse JSON response from OpenAI");
      }

      if (!parsed.emails || !parsed.emails.email_1) {
        throw new Error("Invalid response format from OpenAI");
      }

      setEmails((prev) => ({ ...prev, email_1: parsed.emails.email_1 || [] }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate email 1");
    } finally {
      setLoading(false);
      setCurrentStep(null);
    }
  }, [apiKey, campaignThesis, numVariants1, companyInfo]);

  const generateEmail2 = useCallback(async () => {
    if (!apiKey) {
      setError("Please enter your OpenAI API key");
      return;
    }
    if (!campaignThesis) {
      setError("Please enter a campaign thesis");
      return;
    }
    if (!emails.email_1 || emails.email_1.length === 0) {
      setError("Please generate Email 1 first");
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentStep("email2");

    const previousEmailBody = emails.email_1[0]?.body || "";

    const prompt = `You are an expert outbound email copywriter. 
Your task is to generate short, punchy, and effective cold follow-up email scripts using the "Triple Tap" framework.

The scripts are going to be used as templates, so do not insert person or company names directly. Use variables instead.

---

### Triple Tap Framework:
1. **First Tap (Open)**  
   - Generate a subject line and a preview line (first sentence of the body). These should spark curiosity, feel like a real vendor/client message, and never feel salesy.

2. **Second Tap (Read)**  
   - Generate the body of the email. Keep it 3–4 short sentences. Identify the recipient's problem, show proof or credibility (case study, client result), and offer a simple solution. Use plain, 6th-grade language and a conversational tone.

3. **Third Tap (Reply)**  
   - End with a **low-resistance CTA** that can be answered with **one word**.  
   - Absolutely no links, no "book a call," and nothing that creates friction.

---

Here is the campaign thesis we have for this campaign. It's very important to have it in mind to base the scripts:
${campaignThesis}

---

### Output Format (MANDATORY):

Return **exactly ${numVariants2} versions** of the follow-up email in the following valid JSON format:

{
  "emails": {
    "email_2": [
      {
        "subject": "...",
        "body": "..."
      }
    ]
  }
}

Previous email: ${previousEmailBody}`;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "The email should be easy to read. The email should be readable that a 3rd grade student can read it, and it be understood.\n\nReturn ONLY valid minified JSON. No comments. No markdown. No explanations.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to generate email");
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No content received from OpenAI");
      }

      let parsed;
      try {
        parsed = typeof content === "string" ? JSON.parse(content) : content;
      } catch (parseError) {
        throw new Error("Failed to parse JSON response from OpenAI");
      }

      if (!parsed.emails || !parsed.emails.email_2) {
        throw new Error("Invalid response format from OpenAI");
      }

      setEmails((prev) => ({ ...prev, email_2: parsed.emails.email_2 || [] }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate email 2");
    } finally {
      setLoading(false);
      setCurrentStep(null);
    }
  }, [apiKey, campaignThesis, numVariants2, emails.email_1]);

  const generateEmail3 = useCallback(async () => {
    if (!apiKey) {
      setError("Please enter your OpenAI API key");
      return;
    }
    if (!campaignThesis) {
      setError("Please enter a campaign thesis");
      return;
    }
    if (!emails.email_2 || emails.email_2.length === 0) {
      setError("Please generate Email 2 first");
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentStep("email3");

    const previousEmailBody = emails.email_2[0]?.body || "";

    const prompt = `You are an expert outbound email copywriter.  
Your task is to generate short, punchy, and effective cold **follow-up email scripts** using the "Triple Tap" framework.

These emails follow a second email, and should continue the conversation naturally.

Second Email: ${previousEmailBody}

---

### Triple Tap Framework:
1. **First Tap (Open)**  
   - Write a **subject** and **preview line** (first sentence of the email). These should spark curiosity and sound like a real vendor or client message. Never feel salesy or promotional.

2. **Second Tap (Read)**  
   - Write the **body** (3–4 short sentences).  
   - Identify the recipient's pain or friction point, show credibility (case study, client results), and offer a natural, easy solution.  
   - Use a 6th grade reading level. Keep the tone casual and human.

3. **Third Tap (Reply)**  
   - End with a **low-resistance CTA** that can be answered with one word.  
   - Do not include links. Do not say "book a call" or anything high friction.

---

Here is the campaign thesis we have for this campaign. It's very important to have it in mind to base the scripts:
${campaignThesis}

---

### Output Format:

Return **exactly ${numVariants3} versions** in this valid **JSON format**:

{
  "emails": {
    "email_3": [
      {
        "subject": "...",
        "body": "..."
      }
    ]
  }
}`;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "The email should be easy to read. The email should be readable that a 3rd grade student can read it, and it be understood.\n\nReturn ONLY valid minified JSON. No comments. No markdown. No explanations.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to generate email");
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No content received from OpenAI");
      }

      let parsed;
      try {
        parsed = typeof content === "string" ? JSON.parse(content) : content;
      } catch (parseError) {
        throw new Error("Failed to parse JSON response from OpenAI");
      }

      if (!parsed.emails || !parsed.emails.email_3) {
        throw new Error("Invalid response format from OpenAI");
      }

      setEmails((prev) => ({ ...prev, email_3: parsed.emails.email_3 || [] }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate email 3");
    } finally {
      setLoading(false);
      setCurrentStep(null);
    }
  }, [apiKey, campaignThesis, numVariants3, emails.email_2]);

  const handleCompanyInfoChange = useCallback(
    (field: keyof typeof companyInfo, value: string) => {
      setCompanyInfo((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Cold Email Copywriter</h1>
        <p className="text-muted-foreground">
          Generate effective cold email sequences using the Triple Tap framework. Use your own OpenAI API key.
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
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Enter your OpenAI API key and campaign details</CardDescription>
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
              <Label htmlFor="campaign-thesis">Campaign Thesis *</Label>
              <Textarea
                id="campaign-thesis"
                value={campaignThesis}
                onChange={(e) => setCampaignThesis(e.target.value)}
                placeholder="Enter your campaign thesis here..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="variants-1">Email 1 Variants</Label>
                <Input
                  id="variants-1"
                  type="number"
                  min="1"
                  max="10"
                  value={numVariants1}
                  onChange={(e) => setNumVariants1(parseInt(e.target.value) || 3)}
                />
              </div>
              <div>
                <Label htmlFor="variants-2">Email 2 Variants</Label>
                <Input
                  id="variants-2"
                  type="number"
                  min="1"
                  max="10"
                  value={numVariants2}
                  onChange={(e) => setNumVariants2(parseInt(e.target.value) || 3)}
                />
              </div>
              <div>
                <Label htmlFor="variants-3">Email 3 Variants</Label>
                <Input
                  id="variants-3"
                  type="number"
                  min="1"
                  max="10"
                  value={numVariants3}
                  onChange={(e) => setNumVariants3(parseInt(e.target.value) || 3)}
                />
              </div>
            </div>

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="detailed">Detailed Info</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4">
                <div>
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={companyInfo.companyName}
                    onChange={(e) => handleCompanyInfoChange("companyName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="what-you-sell">What EXACTLY do you sell?</Label>
                  <Textarea
                    id="what-you-sell"
                    value={companyInfo.whatYouSell}
                    onChange={(e) => handleCompanyInfoChange("whatYouSell", e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="target-market">Who EXACTLY is your Target Market?</Label>
                  <Textarea
                    id="target-market"
                    value={companyInfo.targetMarket}
                    onChange={(e) => handleCompanyInfoChange("targetMarket", e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="client-problems">Problems your ideal clients have</Label>
                  <Textarea
                    id="client-problems"
                    value={companyInfo.clientProblems}
                    onChange={(e) => handleCompanyInfoChange("clientProblems", e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="client-results">Results you've gotten for clients</Label>
                  <Textarea
                    id="client-results"
                    value={companyInfo.clientResults}
                    onChange={(e) => handleCompanyInfoChange("clientResults", e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="case-study">Most recent case study</Label>
                  <Textarea
                    id="case-study"
                    value={companyInfo.mostRecentCaseStudy}
                    onChange={(e) => handleCompanyInfoChange("mostRecentCaseStudy", e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="what-makes-unique">What makes you unique?</Label>
                  <Textarea
                    id="what-makes-unique"
                    value={companyInfo.whatMakesYouUnique}
                    onChange={(e) => handleCompanyInfoChange("whatMakesYouUnique", e.target.value)}
                    rows={3}
                  />
                </div>
              </TabsContent>
              <TabsContent value="detailed" className="space-y-4 max-h-[600px] overflow-y-auto">
                <div>
                  <Label htmlFor="website-link">Website Link</Label>
                  <Input
                    id="website-link"
                    value={companyInfo.websiteLink}
                    onChange={(e) => handleCompanyInfoChange("websiteLink", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email-address">Email Address</Label>
                  <Input
                    id="email-address"
                    value={companyInfo.emailAddress}
                    onChange={(e) => handleCompanyInfoChange("emailAddress", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="risk-reversal">Risk reversal/guarantee</Label>
                  <Textarea
                    id="risk-reversal"
                    value={companyInfo.riskReversal}
                    onChange={(e) => handleCompanyInfoChange("riskReversal", e.target.value)}
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="client-locations">Location(s) of ideal clients</Label>
                  <Input
                    id="client-locations"
                    value={companyInfo.clientLocations}
                    onChange={(e) => handleCompanyInfoChange("clientLocations", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="additional-offer">Additional offer info</Label>
                  <Textarea
                    id="additional-offer"
                    value={companyInfo.additionalOfferInfo}
                    onChange={(e) => handleCompanyInfoChange("additionalOfferInfo", e.target.value)}
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="job-titles">Job Title(s) of ideal clients</Label>
                  <Input
                    id="job-titles"
                    value={companyInfo.jobTitles}
                    onChange={(e) => handleCompanyInfoChange("jobTitles", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry of ideal clients</Label>
                  <Input
                    id="industry"
                    value={companyInfo.industry}
                    onChange={(e) => handleCompanyInfoChange("industry", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="company-size">Company size of ideal clients</Label>
                  <Input
                    id="company-size"
                    value={companyInfo.companySize}
                    onChange={(e) => handleCompanyInfoChange("companySize", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="estimated-revenue">Estimated Annual Revenue of ideal clients</Label>
                  <Input
                    id="estimated-revenue"
                    value={companyInfo.estimatedAnnualRevenue}
                    onChange={(e) => handleCompanyInfoChange("estimatedAnnualRevenue", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="company-explainer">Company Explainer</Label>
                  <Textarea
                    id="company-explainer"
                    value={companyInfo.companyExplainer}
                    onChange={(e) => handleCompanyInfoChange("companyExplainer", e.target.value)}
                    rows={3}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2">
              <Button
                onClick={generateEmail1}
                disabled={loading || !apiKey || !campaignThesis}
                className="flex-1"
              >
                {loading && currentStep === "email1" ? "Generating..." : "Generate Email 1"}
              </Button>
              <Button
                onClick={generateEmail2}
                disabled={loading || !apiKey || !campaignThesis || !emails.email_1}
                className="flex-1"
              >
                {loading && currentStep === "email2" ? "Generating..." : "Generate Email 2"}
              </Button>
              <Button
                onClick={generateEmail3}
                disabled={loading || !apiKey || !campaignThesis || !emails.email_2}
                className="flex-1"
              >
                {loading && currentStep === "email3" ? "Generating..." : "Generate Email 3"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Emails</CardTitle>
            <CardDescription>Your cold email sequences</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="email1" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="email1">
                  Email 1 {emails.email_1 && `(${emails.email_1.length})`}
                </TabsTrigger>
                <TabsTrigger value="email2">
                  Email 2 {emails.email_2 && `(${emails.email_2.length})`}
                </TabsTrigger>
                <TabsTrigger value="email3">
                  Email 3 {emails.email_3 && `(${emails.email_3.length})`}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="email1" className="space-y-4">
                {emails.email_1 && emails.email_1.length > 0 ? (
                  emails.email_1.map((email, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">Variant {index + 1}</CardTitle>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(`${email.subject}\n\n${email.body}`)}
                          >
                            Copy
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label className="text-xs text-muted-foreground">Subject</Label>
                          <p className="font-medium">{email.subject}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Body</Label>
                          <p className="whitespace-pre-wrap">{email.body}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Generate Email 1 to see variants here
                  </p>
                )}
              </TabsContent>
              <TabsContent value="email2" className="space-y-4">
                {emails.email_2 && emails.email_2.length > 0 ? (
                  emails.email_2.map((email, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">Variant {index + 1}</CardTitle>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(`${email.subject}\n\n${email.body}`)}
                          >
                            Copy
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label className="text-xs text-muted-foreground">Subject</Label>
                          <p className="font-medium">{email.subject}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Body</Label>
                          <p className="whitespace-pre-wrap">{email.body}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Generate Email 2 to see variants here
                  </p>
                )}
              </TabsContent>
              <TabsContent value="email3" className="space-y-4">
                {emails.email_3 && emails.email_3.length > 0 ? (
                  emails.email_3.map((email, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">Variant {index + 1}</CardTitle>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(`${email.subject}\n\n${email.body}`)}
                          >
                            Copy
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label className="text-xs text-muted-foreground">Subject</Label>
                          <p className="font-medium">{email.subject}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Body</Label>
                          <p className="whitespace-pre-wrap">{email.body}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Generate Email 3 to see variants here
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
