import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
})

export async function POST(req: Request) {
  try {
    const start = Date.now()
    const formData = await req.formData()
    const file = formData.get('file') as File
    const password = formData.get('password') as string
    const language = formData.get('language') as string

    if (password !== process.env.PASSWORD) {
      return NextResponse.json({ error: 'Verkeerd wachtwoord' }, { status: 401 })
    }

    if (!file) {
      return NextResponse.json({ error: 'Geen bestand aangeleverd' }, { status: 400 })
    }

    let transcription
    try {
      transcription = await openai.audio.transcriptions.create({
        file: file,
        model: 'whisper-1',
        language: language ?? 'en',
      })
    } catch (error) {
      console.error('Error during transcription:', error)
      return NextResponse.json({ error: error instanceof Error ? error.message : 'Audio transcriptie mislukt' }, { status: 500 })
    }

    let completion
    try {
      completion = await deepseek.chat.completions.create({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant. Your task is to fix any transcription errors and separate different speakers in the transcript. 
              Maintain proper punctuation and capitalization.
              ALWAYS RETURN THE FULL OUTPUT IN THIS LANGUAGE: ${language}.`,
          },
          {
            role: 'user',
            content: `Please clean up and format this transcript with speaker separation VERY IMPORTANT RETURN IN THE LANGUAGE OF THE TRANSCRIPT:\n${transcription.text}`,
          },
        ],
      })
      //pricing deepseek chat: 0.28 per 1M tokens
      console.log('cost', ((completion.usage?.total_tokens ?? 0) * 0.28) / 1000000)
    } catch (error) {
      console.error('Error during transcript formatting:', error)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Transcript formatteren mislukt' },
        { status: 500 }
      )
    }

    const formattedTranscript = completion.choices[0].message.content

    return NextResponse.json({ text: formattedTranscript, seconds: (Date.now() - start) / 1000 })
  } catch (error) {
    console.error('General error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Een onbekende fout is opgetreden' },
      { status: 500 }
    )
  }
}
