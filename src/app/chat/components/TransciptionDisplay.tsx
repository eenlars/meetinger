// app/components/TranscriptDisplay.tsx
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { TranscriptData } from '../types'

type Props = {
  transcriptData: TranscriptData
  onDelete: () => void
}

export const TranscriptDisplay = ({ transcriptData, onDelete }: Props) => (
  <Card className="p-4">
    <div className="flex justify-between items-start mb-2">
      <h3 className="font-bold">Transcriptie:</h3>
      <Button variant="destructive" size="sm" onClick={onDelete}>
        Verwijder
      </Button>
    </div>
    <p className="whitespace-pre-wrap mb-2">{transcriptData.text}</p>
    <p className="text-sm text-muted-foreground/90">{transcriptData.seconds} seconden</p>
  </Card>
)
