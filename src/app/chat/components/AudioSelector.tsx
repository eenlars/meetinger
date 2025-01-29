'use client'

import { Button } from '@/components/ui/button'
import { Mic, Square, Trash2, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

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
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioPreviewRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    return () => {
      mediaRecorder.current?.stream?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      mediaRecorder.current = recorder

      recorder.ondataavailable = (e) => {
        setAudioChunks((prev) => [...prev, e.data])
      }

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        const audioFile = new File([audioBlob], 'recording.wav', {
          type: 'audio/wav',
          lastModified: Date.now(),
        })
        setFile(audioFile)
        if (audioPreviewRef.current) {
          audioPreviewRef.current.src = URL.createObjectURL(audioBlob)
        }
      }

      recorder.start()
      setIsRecording(true)
      setAudioChunks([])
      setFile(null) // Clear any existing file when starting new recording
    } catch (err) {
      console.error('Microphone access error:', err)
      alert('Microphone access required for recording')
    }
  }

  const stopRecording = () => {
    mediaRecorder.current?.stop()
    mediaRecorder.current?.stream?.getTracks().forEach((track) => track.stop())
    setIsRecording(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      if (mediaRecorder.current) {
        stopRecording() // Stop any active recording when file is selected
      }
    }
  }

  const handleClear = () => {
    setFile(null)
    setAudioChunks([])
    if (audioPreviewRef.current) {
      audioPreviewRef.current.src = ''
    }
    stopRecording()
  }

  return (
    <div className="mb-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Upload Card */}
        <div className="flex flex-col gap-2">
          <Button variant={file ? 'default' : 'outline'} className="h-24 flex-col gap-2 text-lg" asChild>
            <label>
              <Upload className="h-6 w-6" />
              Upload File
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isLoading || isRecording}
              />
            </label>
          </Button>
          {file && <div className="text-sm text-muted-foreground truncate">Selected: {file.name}</div>}
        </div>

        {/* Record Card */}
        <div className="flex flex-col gap-2">
          <Button
            variant={isRecording ? 'destructive' : 'outline'}
            className="h-24 flex-col gap-2 text-lg"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isLoading}
          >
            {isRecording ? (
              <>
                <Square className="h-6 w-6" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="h-6 w-6" />
                Start Recording
              </>
            )}
          </Button>
          {isRecording && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <div className="h-3 w-3 bg-destructive rounded-full animate-pulse" />
              Recording...
            </div>
          )}
        </div>
      </div>

      {/* Preview and Clear */}
      {(file || audioChunks.length > 0) && (
        <div className="space-y-2">
          <audio ref={audioPreviewRef} controls className="w-full" />
          <Button variant="ghost" onClick={handleClear} className="gap-2" size="sm">
            <Trash2 className="h-4 w-4" />
            Clear Audio
          </Button>
        </div>
      )}
    </div>
  )
}
