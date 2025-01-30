// app/storage.ts

import type { AIResult } from '../audio-service'

const TRANSCRIPT_KEY = 'transcript'
const COMMAND_RESULT_KEY = 'commandResult'

export const loadPersistedData = () => {
  try {
    return {
      commandResult: localStorage.getItem(COMMAND_RESULT_KEY) ? JSON.parse(localStorage.getItem(COMMAND_RESULT_KEY)!) : null,
      transcript: localStorage.getItem(TRANSCRIPT_KEY) ? JSON.parse(localStorage.getItem(TRANSCRIPT_KEY)!) : null,
    }
  } catch (e) {
    console.error('Failed to load persisted data:', e)
    return { commandResult: null, transcript: null }
  }
}

export const saveTranscript = (data: AIResult) => {
  localStorage.setItem(TRANSCRIPT_KEY, JSON.stringify(data))
}

export const saveCommandResult = (result: AIResult) => {
  localStorage.setItem(COMMAND_RESULT_KEY, JSON.stringify(result))
}

export const clearAllData = () => {
  localStorage.removeItem(TRANSCRIPT_KEY)
  localStorage.removeItem(COMMAND_RESULT_KEY)
}
