'use client'

export const AudioService = {
  transcribe: async (file: File, password: string, language: string): Promise<AIResult> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('password', password)
    formData.append('language', language)

    const response = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = (await response.json()).error
      return Promise.reject(new Error(error || 'Audio transcriptie mislukt'))
    }

    const data = (await response.json()) as AIResult

    if (data.text) localStorage.setItem('transcript', data.text)
    return data
  },

  processCommand: async (transcript: string | null, command: string, password: string, language: string): Promise<AIResult> => {
    if (!transcript) return Promise.reject(new Error('Geen transcriptie gevonden'))

    const response = await fetch('/api/audio/custom-action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transcript,
        command,
        password,
        language,
      }),
    })

    if (response.ok) {
      const data = (await response.json()) as AIResult
      if (data.text) localStorage.setItem('actionResult', JSON.stringify(data))
      return data
    } else {
      const error = (await response.json()).error
      return Promise.reject(new Error(error || 'Opdracht verwerken mislukt'))
    }
  },
}

export type AIResult = {
  text: string | null
  cost: number
  seconds: number
}
