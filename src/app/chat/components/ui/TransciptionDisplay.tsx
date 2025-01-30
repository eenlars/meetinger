// app/components/TranscriptDisplay.tsx
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { AIResult } from '../../../audio-service'

type Props = {
  transcriptData: AIResult
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
    <p className="text-sm text-muted-foreground/90">Kosten: €{transcriptData.cost.toFixed(4)}</p>
  </Card>
)
