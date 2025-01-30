// app/components/CommandForm.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useState } from 'react'

type Props = {
  onSubmit: (command: string) => Promise<void>
  disabled: boolean
}

export const CommandForm = ({ onSubmit, disabled }: Props) => {
  const [command, setCommand] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(command)
  }

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Opdracht:
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
              placeholder="e.g., Summarize this, Make bullet points, etc."
              disabled={disabled}
            />
          </label>
        </div>
        <Button type="submit" disabled={disabled || !command.trim()} className="w-full">
          {disabled ? 'Aan het verwerken...' : 'Opdracht uitvoeren'}
        </Button>
      </form>
    </Card>
  )
}
