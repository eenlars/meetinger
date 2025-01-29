import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function GenUICard() {
  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Vergaderingsanalyse AI</CardTitle>
          <CardDescription>Analyseer je vergaderingen met AI!</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground/90 leading-normal prose">
          <p className="mb-3">Upload een audio-opname van je vergadering en ontvang direct een gedetailleerde transcriptie.</p>
          <p className="mb-3">Stel vragen over de vergadering en krijg slimme inzichten en samenvattingen.</p>
          <p className="mb-3">Analyseer spreektijd, belangrijke actiepunten en beslissingen met één druk op de knop.</p>
        </CardContent>
      </Card>
    </div>
  )
}
