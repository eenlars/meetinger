import type { AIResult } from '@/app/audio-service'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseURL: 'https://api.deepseek.com/v1',
})

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const start = Date.now()
    const data = await req.json()
    const { transcript, command, password, language } = data

    if (!transcript || !command || !password) {
      return NextResponse.json(
        {
          error:
            'Vereiste velden ontbreken: ' +
            (!transcript ? 'transcript, ' : '') +
            (!command ? 'command, ' : '') +
            (!password ? 'password' : ''),
        },
        { status: 400 }
      )
    }

    if (password !== process.env.PASSWORD) {
      return NextResponse.json({ error: 'Ongeldig wachtwoord. Probeer het opnieuw.' }, { status: 401 })
    }

    const completion = await deepseek.chat.completions.create({
      model: 'deepseek-reasoner',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant. Process the following text based on the user command. Return the response in this language: ${
            language || 'nl'
          }`,
        },
        {
          role: 'user',
          content: `Command: ${command}\n\nText: ${transcript}`,
        },
      ],
    })

    // 0.28 is the price per 1m tokens
    const cost = ((completion.usage?.total_tokens ?? 0) * 0.28) / 1000000

    const res: AIResult = {
      text: completion.choices[0].message.content,
      cost,
      seconds: (Date.now() - start) / 1000,
    }
    return NextResponse.json(res)
  } catch (error) {
    console.error('Error processing command:', error)

    // Determine if it's an API connection error or a model error
    let errorMessage = 'Er is een onbekende fout opgetreden'

    if (error instanceof Error) {
      errorMessage = `Fout bij het verwerken van de opdracht: ${error.message}`

      // Handle network and connection errors specifically
      if (error.message.includes('ECONNREFUSED') || error.message.includes('ETIMEDOUT')) {
        errorMessage = 'Kon geen verbinding maken met de AI-service. Controleer uw internetverbinding en probeer het opnieuw.'
      }

      // Handle quota or rate limit errors
      if (error.message.includes('rate') || error.message.includes('quota') || error.message.includes('limit')) {
        errorMessage = 'API-limiet bereikt. Probeer het later opnieuw.'
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
