import { usd_per_minute } from '@/app/pricing'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import { formatDuration } from '../util'
export const UploadButton = ({
  source,
  file,
  isLoading,
  isRecording,
  recordingDuration,
  handleFileUpload,
}: {
  source: string
  file: File | null
  isLoading: boolean
  isRecording: boolean
  recordingDuration: number
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Button variant={source === 'upload' ? 'default' : 'outline'} className="h-24 flex-col gap-2 text-lg relative" asChild>
        <label>
          <Upload className="h-6 w-6" />
          Upload Bestand
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isLoading || isRecording}
          />
          {source === 'upload' && <span className="absolute bottom-1 text-sm">{formatDuration(recordingDuration)}</span>}
        </label>
      </Button>
      {source === 'upload' && <div className="text-sm text-muted-foreground truncate">{file?.name}</div>}
      <p className="text-sm text-muted-foreground/90">
        Geschatte kosten: €{((recordingDuration / 60) * usd_per_minute['whisper-and-deepseek-chat'] * 1.04).toFixed(4)}
      </p>
    </div>
  )
}
