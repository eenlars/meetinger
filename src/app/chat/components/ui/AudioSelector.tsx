'use client'

import { usd_per_minute } from '@/app/pricing'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { RecordButton } from '../buttons/RecordButton'
import { UploadButton } from '../buttons/UploadButton'

export const AudioSelector = ({
  file,
  setFile,
  isLoading,
}: {
  file: File | null
  setFile: (file: File | null) => void
  isLoading?: boolean
}) => {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [source, setSource] = useState<'upload' | 'record' | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const recordingStart = useRef<number>(0)
  const intervalRef = useRef<NodeJS.Timeout>()
  const ignoreRecordingStop = useRef(false)

  useEffect(() => {
    return () => {
      mediaRecorder.current?.stream?.getTracks().forEach((track) => track.stop())
      clearInterval(intervalRef.current)
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = MediaRecorder.isTypeSupported('audio/webm; codecs=opus') ? 'audio/webm; codecs=opus' : 'audio/webm'

      const recorder = new MediaRecorder(stream, { mimeType })
      mediaRecorder.current = recorder
      recordingStart.current = Date.now()
      setSource('record')
      setFile(null)

      const chunks: BlobPart[] = []
      recorder.ondataavailable = (e) => chunks.push(e.data)

      recorder.onstop = () => {
        if (ignoreRecordingStop.current) return
        const duration = (Date.now() - recordingStart.current) / 1000

        const blob = new Blob(chunks, { type: mimeType })
        const audioFile = new File([blob], 'recording.webm', {
          type: mimeType,
          lastModified: Date.now(),
        })

        setFile(audioFile)
        setRecordingDuration(duration)

        if (audioUrl) URL.revokeObjectURL(audioUrl)
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
      }

      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - recordingStart.current) / 1000
        setRecordingDuration(elapsed)
      }, 100)

      recorder.start()
      setIsRecording(true)
    } catch (err) {
      console.error('Microphone access error:', err)
      alert('Microphone access required for recording')
    }
  }

  const stopRecording = (ignoreStop = false) => {
    ignoreRecordingStop.current = ignoreStop
    if (mediaRecorder.current?.state === 'recording') {
      mediaRecorder.current.stop()
      clearInterval(intervalRef.current)
      setIsRecording(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      stopRecording(true)
      if (audioUrl) URL.revokeObjectURL(audioUrl)

      const url = URL.createObjectURL(selectedFile)
      setAudioUrl(url)
      setFile(selectedFile)
      setSource('upload')

      const audio = new Audio(url)
      audio.onloadedmetadata = () => {
        setRecordingDuration(audio.duration)
      }
    }
  }

  const handleClear = () => {
    setFile(null)
    setSource(null)
    setRecordingDuration(0)
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
    }
    stopRecording()
  }

  return (
    <div className="mb-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <UploadButton
          source={source || ''}
          file={file}
          isLoading={isLoading || false}
          isRecording={isRecording}
          recordingDuration={recordingDuration}
          handleFileUpload={handleFileUpload}
        />

        <RecordButton
          isRecording={isRecording}
          source={source || ''}
          isLoading={isLoading || false}
          recordingDuration={recordingDuration}
          startRecording={startRecording}
          stopRecording={stopRecording}
        />
      </div>

      {audioUrl && (
        <div className="space-y-2">
          <audio
            src={audioUrl}
            controls
            className="w-full"
            onLoadedMetadata={(e) => {
              setRecordingDuration(e.currentTarget.duration)
            }}
          />
          <p className="text-sm text-muted-foreground/90">
            Geschatte kosten: €{((recordingDuration / 60) * usd_per_minute['whisper-and-deepseek-chat'] * 1.04).toFixed(4)}
          </p>
          <Button variant="ghost" onClick={handleClear} className="gap-2" size="sm">
            <Trash2 className="h-4 w-4" />
            Verwijderen
          </Button>
        </div>
      )}
    </div>
  )
}
