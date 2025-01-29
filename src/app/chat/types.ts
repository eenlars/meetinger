// app/types.ts
export type CommandResult = {
  result: string
  cost: number
  language: string
}

export type TranscriptData = {
  text: string
  seconds: number
}
