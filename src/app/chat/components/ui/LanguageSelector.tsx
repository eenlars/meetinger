import { ChangeEvent } from 'react'

interface LanguageSelectorProps {
  language: string
  setLanguage: (language: string) => void
  isLoading?: boolean
}

export const LanguageSelector = ({ language, setLanguage, isLoading }: LanguageSelectorProps): JSX.Element => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value)
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">
        Taal:
        <select value={language} onChange={handleChange} className="mt-1 block w-full border rounded p-2" disabled={isLoading}>
          <option value="en">Engels</option>
          <option value="nl">Nederlands</option>
          <option value="de">Duits</option>
        </select>
      </label>
    </div>
  )
}
