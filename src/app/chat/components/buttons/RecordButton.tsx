import { Button } from '@/components/ui/button'
import { Mic, Square } from 'lucide-react'
import { formatDuration } from '../util'

export const RecordButton = ({
  isRecording,
  source,
  isLoading,
  recordingDuration,
  startRecording,
  stopRecording,
}: {
  isRecording: boolean
  source: string
  isLoading: boolean
  recordingDuration: number
  startRecording: () => void
  stopRecording: () => void
}) => {
  return (
    <>
      <Button
        variant={isRecording ? 'destructive' : source === 'record' ? 'default' : 'outline'}
        className="h-24 flex-col gap-2 text-lg relative"
        onClick={() => (isRecording ? stopRecording() : startRecording())}
        disabled={isLoading}
      >
        {isRecording ? (
          <>
            <Square className="h-6 w-6" />
            Stop Opnemen
          </>
        ) : (
          <>
            <Mic className="h-6 w-6" />
            Start Opnemen
          </>
        )}
        {(isRecording || source === 'record') && (
          <span className="absolute bottom-1 text-sm">{formatDuration(recordingDuration)}</span>
        )}
      </Button>
      {isRecording && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <div className="h-3 w-3 bg-destructive rounded-full animate-pulse" />
          Aan het opnemen...
        </div>
      )}
    </>
  )
}
