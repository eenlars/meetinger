// app/GenUI.tsx
'use client'

import { GenUICard } from '@/components/cards/genuicard'
import { Card } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { AudioService } from '../audio-service'
import { CommandForm } from './components/CommandForm'
import { MainForm } from './components/MainForm'
import { TranscriptDisplay } from './components/TransciptionDisplay'
import { clearAllData, loadPersistedData, saveCommandResult, saveTranscript } from './storage'
import { CommandResult, TranscriptData } from './types'

export default function GenUI() {
  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState('')
  const [transcriptData, setTranscriptData] = useState<TranscriptData | null>(null)
  const [commandResult, setCommandResult] = useState<CommandResult | null>(null)
  const [error, setError] = useState('')
  const [commandError, setCommandError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState('nl')
  const [isProcessingCommand, setIsProcessingCommand] = useState(false)

  useEffect(() => {
    const { commandResult, transcript } = loadPersistedData()
    setCommandResult(commandResult)
    setTranscriptData(transcript)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !password) {
      setError('Selecteer een bestand en voer je wachtwoord in')
      return
    }

    setIsLoading(true)
    setError('')
    setCommandResult(null)

    try {
      const data = await AudioService.transcribe(file, password, language)
      saveTranscript(data)
      setTranscriptData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Audio transcriptie mislukt')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCommandSubmit = async (command: string) => {
    if (!transcriptData?.text) return

    setIsProcessingCommand(true)
    setCommandError('')

    try {
      const data = await AudioService.processCommand(transcriptData.text, command, password, language)
      const result = { result: data.result, cost: data.cost || 0, language }
      saveCommandResult(result)
      setCommandResult(result)
    } catch (err) {
      setCommandError(err instanceof Error ? err.message : 'Opdracht verwerken mislukt')
    } finally {
      setIsProcessingCommand(false)
    }
  }

  const handleDeleteTranscript = () => {
    clearAllData()
    setTranscriptData(null)
    setCommandResult(null)
  }

  return (
    <div className="relative flex h-[calc(100vh-(--spacing(16)))] overflow-hidden pb-10 flex-col">
      <div className="group w-full overflow-auto">
        <div className="max-w-xl mx-auto mt-10 mb-24 space-y-4">
          {!transcriptData && !isLoading && <GenUICard />}
          {isLoading && <div className="text-center text-gray-500">Bezig met audio transcriptie...</div>}
          {error && <div className="text-red-500 mb-4">{error}</div>}

          {transcriptData && (
            <div className="space-y-4">
              <TranscriptDisplay transcriptData={transcriptData} onDelete={handleDeleteTranscript} />
              <CommandForm onSubmit={handleCommandSubmit} disabled={isProcessingCommand} />
              {commandError && <div className="text-red-500 text-sm">{commandError}</div>}
              {commandResult && (
                <Card className="p-4">
                  <h3 className="font-bold mb-2">Resultaat van de opdracht:</h3>
                  <p className="whitespace-pre-wrap">{commandResult.result}</p>
                  {commandResult.cost > 0 && (
                    <p className="text-sm text-muted-foreground/90 mt-2">Kosten: €{commandResult.cost.toFixed(4)}</p>
                  )}
                </Card>
              )}
            </div>
          )}

          <MainForm
            onSubmit={handleSubmit}
            file={file}
            setFile={setFile}
            password={password}
            setPassword={setPassword}
            language={language}
            setLanguage={setLanguage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
