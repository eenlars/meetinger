import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
})

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { transcript, command, password } = data

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
          content: 'You are a helpful assistant. Process the following text based on the user command.',
        },
        {
          role: 'user',
          content: `Command: ${command}\n\nText: ${transcript}`,
        },
      ],
    })

    //price deepseek reasoner: $2.19 per 1M tokens
    console.log('cost', ((completion.usage?.total_tokens ?? 0) * 2.19) / 1000000)

    return NextResponse.json({
      result: completion.choices[0].message.content,
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
