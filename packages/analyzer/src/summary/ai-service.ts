import { GoogleGenerativeAI } from "@google/generative-ai";

export class AiService {
  private client: GoogleGenerativeAI;
  private model: string = "gemini-2.5-flash-lite";

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("Gemini API key is required");
    }
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async generate(prompt: string): Promise<string> {
    const model = this.client.getGenerativeModel({
      model: this.model,
      systemInstruction: `You are a senior software architect reviewing a codebase.
Give a short, crisp analysis. No fluff, no filler, no generic advice.

You MUST respond in exactly this markdown format and nothing else:

## Repository Overview
One sentence only. What this codebase is and what it does.

## Key Findings
- Specific finding with file names and numbers
- Specific finding with file names and numbers
- Specific finding with file names and numbers
- Specific finding with file names and numbers
- Specific finding with file names and numbers

## Recommendations
- Specific actionable fix mentioning file names
- Specific actionable fix mentioning file names
- Specific actionable fix mentioning file names
- Specific actionable fix mentioning file names

Rules:
- EXACTLY 5 bullets in Key Findings, EXACTLY 4 in Recommendations
- Every bullet is one sentence, max 15 words
- Always mention specific file names, counts, or scores
- No intro sentence, no closing sentence, no extra sections`,
    });

    const result = await model.generateContent(prompt);
    return result.response.text();
  }
}