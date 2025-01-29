// app/components/MainForm.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AudioSelector } from './AudioSelector'
import { LanguageSelector } from './LanguageSelector'
import { PasswordSelector } from './PasswordSelector'

type Props = {
  onSubmit: (e: React.FormEvent) => Promise<void>
  file: File | null
  setFile: (file: File | null) => void
  password: string
  setPassword: (password: string) => void
  language: string
  setLanguage: (language: string) => void
  isLoading: boolean
}

export const MainForm = ({ onSubmit, file, setFile, password, setPassword, language, setLanguage, isLoading }: Props) => (
  <form onSubmit={onSubmit}>
    <Card className="p-4 mb-4">
      <AudioSelector file={file} setFile={setFile} isLoading={isLoading} />
      <PasswordSelector password={password} setPassword={setPassword} isLoading={isLoading} />
      <LanguageSelector language={language} setLanguage={setLanguage} isLoading={isLoading} />
      <Button type="submit" disabled={isLoading || !file || !password} className="w-full">
        {isLoading ? 'Bezig...' : 'Audio transcriptie'}
      </Button>
    </Card>
  </form>
)
