import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function getAiSuggestion(code: string, language: string, error: string | null): Promise<string> {
  try {
    let prompt = `I have the following ${language} code:\n\n${code}\n\n`

    if (error) {
      prompt += `I'm getting this error:\n${error}\n\nCan you help me fix it and explain what's wrong?`
    } else {
      prompt += `Can you review this code and suggest improvements or optimizations?`
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      system:
        "You are an expert programming assistant. Provide clear, concise explanations and code fixes. Focus on best practices, performance improvements, and readability. Always explain your reasoning.",
    })

    return text
  } catch (error) {
    console.error("Error getting AI suggestion:", error)
    return "Sorry, I was unable to generate suggestions at this time. Please try again later."
  }
}

