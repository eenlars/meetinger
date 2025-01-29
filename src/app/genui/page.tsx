'use client'

import GenUICard from '@/components/cards/genuicard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useState } from 'react'

export const maxDuration = 30

export default function GenUI() {
  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState<string>('')
  const [transcript, setTranscript] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !password) {
      setError('Please select a file and enter your API password')
      return
    }

    setIsLoading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('model', 'whisper-1')

    try {
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${password}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`)
      }

      const data = await response.json()
      setTranscript(data.text)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to transcribe audio')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden pb-10 flex-col">
      <div className="group w-full overflow-auto">
        <div className="max-w-xl mx-auto mt-10 mb-24">
          {!transcript && !isLoading && <GenUICard />}

          {isLoading && <div className="text-center text-gray-500">Processing audio...</div>}

          {error && <div className="text-red-500 mb-4">{error}</div>}

          {transcript && (
            <Card className="p-4 mb-4">
              <h3 className="font-bold mb-2">Transcription:</h3>
              <p className="whitespace-pre-wrap">{transcript}</p>
            </Card>
          )}

          <form onSubmit={handleSubmit}>
            <Card className="p-4 mb-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Audio File:
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="mt-1 block w-full border rounded p-2"
                    disabled={isLoading}
                  />
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  OpenAI API Key:
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full border rounded p-2"
                    placeholder="Enter your OpenAI API key"
                    disabled={isLoading}
                  />
                </label>
              </div>

              <Button type="submit" disabled={isLoading || !file || !password} className="w-full">
                {isLoading ? 'Processing...' : 'Transcribe Audio'}
              </Button>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}
