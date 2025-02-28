import type { AIResult } from '@/app/audio-service'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
})

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB

export async function POST(req: Request) {
  try {
    let cost = 0
    const start = Date.now()
    const formData = await req.formData()
    const file = formData.get('file') as File
    const password = formData.get('password') as string
    const language = formData.get('language') as string

    if (password !== process.env.PASSWORD) {
      console.log('Verkeerd wachtwoord')
      return NextResponse.json({ error: 'Verkeerd wachtwoord' }, { status: 401 })
    }

    if (!file) {
      return NextResponse.json({ error: 'Geen bestand aangeleverd' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Bestand is te groot. Maximum grootte is 20MB.' }, { status: 400 })
    }

    let transcription
    try {
      const duration = Math.ceil(file.size / (16000 * 2)) // Estimate duration in seconds based on file size
      transcription = await openai.audio.transcriptions.create({
        file: file,
        model: 'whisper-1',
        language: language ?? 'en',
      })
      cost += (duration / 60) * 0.006 // Convert duration to minutes and multiply by cost per minute
    } catch (error) {
      console.error('Error during transcription:', error)
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? `Audiotranscriptie mislukt: ${error.message}`
              : 'Audiotranscriptie mislukt: Er is een onbekende fout opgetreden',
        },
        { status: 500 }
      )
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
    } catch (error) {
      console.error('Error during transcript formatting:', error)
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? `Transcript formatteren mislukt: ${error.message}`
              : 'Transcript formatteren mislukt: Er is een onbekende fout opgetreden',
        },
        { status: 500 }
      )
    }
    //pricing deepseek chat: 0.28 per 1M tokens
    cost += ((completion?.usage?.total_tokens ?? 0) * 0.28) / 1000000

    const formattedTranscript = completion.choices[0].message.content

    const res: AIResult = {
      text: formattedTranscript,
      cost,
      seconds: (Date.now() - start) / 1000,
    }
    return NextResponse.json(res)
  } catch (error) {
    console.error('General error:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `Een fout is opgetreden: ${error.message}`
            : 'Een onbekende fout is opgetreden tijdens de verwerking van uw verzoek',
      },
      { status: 500 }
    )
  }
}
