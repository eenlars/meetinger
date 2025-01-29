import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseURL: 'https://api.deepseek.com/v1',
})

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { transcript, command, password, language } = data

    if (!transcript || !command || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (password !== process.env.PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
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

    const cost = ((completion.usage?.total_tokens ?? 0) * 0.28) / 1000000
    console.log('cost', cost)

    return NextResponse.json({
      result: completion.choices[0].message.content,
      cost,
    })
  } catch (error) {
    console.error('Error processing command:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      },
      { status: 500 }
    )
  }
}
