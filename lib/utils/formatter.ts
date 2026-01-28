// Company name suffixes to remove
const COMPANY_SUFFIXES = [
  /,\s*(Inc\.?|Incorporated|LLC|L\.L\.C\.?|Ltd\.?|Limited|Corp\.?|Corporation|Co\.?|Company)\s*$/i,
  /\s+(Inc\.?|Incorporated|LLC|L\.L\.C\.?|Ltd\.?|Limited|Corp\.?|Corporation|Co\.?|Company)\s*$/i,
];

// Company prefixes to handle
const COMPANY_PREFIXES = /^(The|A|An)\s+/i;

// Common job title abbreviations
const JOB_TITLE_MAP: Record<string, string> = {
  vp: "Vice President",
  "v.p.": "Vice President",
  "vice pres": "Vice President",
  sr: "Senior",
  "sr.": "Senior",
  jr: "Junior",
  "jr.": "Junior",
  dir: "Director",
  "dir.": "Director",
  mgr: "Manager",
  "mgr.": "Manager",
  exec: "Executive",
  "exec.": "Executive",
};

export function formatCompanyName(name: string): string {
  let formatted = name.trim();

  // Remove common suffixes
  for (const suffix of COMPANY_SUFFIXES) {
    formatted = formatted.replace(suffix, "");
  }

  // Handle prefixes
  formatted = formatted.replace(COMPANY_PREFIXES, "");

  // Remove extra whitespace
  formatted = formatted.replace(/\s+/g, " ").trim();

  // Title case normalization (basic)
  formatted = toTitleCase(formatted);

  // Remove trailing/leading punctuation (except apostrophes in names)
  formatted = formatted.replace(/^[^\w']+|[^\w']+$/g, "");

  return formatted.trim();
}

export function formatJobTitle(title: string): string {
  let formatted = title.trim();

  // Replace common abbreviations
  const words = formatted.split(/\s+/);
  const formattedWords = words.map((word) => {
    const lowerWord = word.toLowerCase().replace(/[.,;:!?]/g, "");
    return JOB_TITLE_MAP[lowerWord] || word;
  });
  formatted = formattedWords.join(" ");

  // Remove redundant words/phrases (basic)
  formatted = formatted.replace(/\b(of|the|at|in)\b/gi, "");

  // Remove extra whitespace
  formatted = formatted.replace(/\s+/g, " ").trim();

  // Title case normalization
  formatted = toTitleCase(formatted);

  // Remove trailing/leading punctuation
  formatted = formatted.replace(/^[^\w]+|[^\w]+$/g, "");

  return formatted.trim();
}

function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export async function formatWithAI(
  text: string,
  type: "company" | "title",
  apiKey: string
): Promise<string> {
  const prompt =
    type === "company"
      ? `Normalize this company name to a standard format. Remove legal suffixes (Inc, LLC, etc.), standardize capitalization, and clean up formatting. Return only the cleaned name, nothing else: "${text}"`
      : `Normalize this job title to a standard format. Expand common abbreviations (VP to Vice President, etc.), standardize capitalization, and clean up formatting. Return only the cleaned title, nothing else: "${text}"`;

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
            content: "You are a helpful assistant that normalizes business data.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "API request failed");
    }

    const data = await response.json();
    return data.choices[0]?.message?.content?.trim() || text;
  } catch (error) {
    throw error;
  }
}

