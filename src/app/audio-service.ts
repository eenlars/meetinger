'use client'

export const AudioService = {
  transcribe: async (file: File, password: string, language: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('password', password)
    formData.append('language', language)

    const response = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    localStorage.setItem('transcript', data.text)
    return data
  },

  processCommand: async (transcript: string, command: string, password: string, language: string) => {
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

    const data = await response.json()
    if (response.ok) {
      localStorage.setItem('actionResult', JSON.stringify(data))
    } else {
      throw new Error(data.error || 'Opdracht verwerken mislukt')
    }

    return data
  },
}
