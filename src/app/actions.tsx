'use server'

import { CoreMessage } from 'ai'
import { ReactNode } from 'react'

export interface Message {
  role: 'user' | 'assistant'
  content: string
  display?: ReactNode
}

// Streaming Chat
export async function continueTextConversation(messages: CoreMessage[]) {
  return ''
  // const result = await streamText({
  //   model: openai('gpt-4-turbo'),
  //   messages,
  // })

  // const stream = createStreamableValue(result.textStream)
  // return stream.value
}

// Gen UIs
export async function continueConversation(history: Message[]) {
  return ''
  // const stream = createStreamableUI()

  // const { text, toolResults } = await generateText({
  //   model: openai('gpt-3.5-turbo'),
  //   system: 'You are a friendly weather assistant!',
  //   messages: history,
  //   tools: {
  //     showWeather: {
  //       description: 'Show the weather for a given location.',
  //       parameters: z.object({
  //         city: z.string().describe('The city to show the weather for.'),
  //         unit: z.enum(['F']).describe('The unit to display the temperature in'),
  //       }),
  //       execute: async ({ city, unit }) => {
  //         stream.done(<Weather city={city} unit={unit} />)
  //         return `Here's the weather for ${city}!`
  //       },
  //     },
  //   },
  // })

  // return {
  //   messages: [
  //     ...history,
  //     {
  //       role: 'assistant' as const,
  //       content: text || toolResults.map((toolResult) => toolResult.result).join(),
  //       display: stream.value,
  //     },
  //   ],
  // }
}

// Utils
export async function checkAIAvailability() {
  const envVarExists = !!process.env.OPENAI_API_KEY
  return envVarExists
}
