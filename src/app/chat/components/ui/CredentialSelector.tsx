import { useEffect, useState } from 'react'

interface CredentialSelectorProps {
  onCredentialMethodChange: (method: 'password' | 'apikeys') => void
  isLoading?: boolean
}

export const CredentialSelector = ({ onCredentialMethodChange, isLoading = false }: CredentialSelectorProps): JSX.Element => {
  const [usePassword, setUsePassword] = useState(true)
  const [password, setPassword] = useState('')
  const [deepseekApiKey, setDeepseekApiKey] = useState('')
  const [openaiApiKey, setOpenaiApiKey] = useState('')

  useEffect(() => {
    onCredentialMethodChange(usePassword ? 'password' : 'apikeys')
  }, [usePassword, onCredentialMethodChange])

  return (
    <div className="mb-4">
      <div className="mb-4">
        <label className="inline-flex items-center mr-4">
          <input
            type="radio"
            name="credentialMethod"
            value="password"
            checked={usePassword}
            onChange={() => setUsePassword(true)}
            disabled={isLoading}
          />
          <span className="ml-2">Wachtwoord</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="credentialMethod"
            value="apikeys"
            checked={!usePassword}
            onChange={() => setUsePassword(false)}
            disabled={isLoading}
          />
          <span className="ml-2">API Sleutels</span>
        </label>
      </div>
      {usePassword ? (
        <label className="block text-sm font-medium mb-2">
          Wachtwoord:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
            placeholder="Voer je wachtwoord in"
            disabled={isLoading}
          />
        </label>
      ) : (
        <>
          <label className="block text-sm font-medium mb-2">
            Deepseek API Key:
            <input
              type="text"
              value={deepseekApiKey}
              onChange={(e) => setDeepseekApiKey(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
              placeholder="Voer je Deepseek API key in"
              disabled={isLoading}
            />
          </label>
          <label className="block text-sm font-medium mb-2">
            OpenAI API Key:
            <input
              type="text"
              value={openaiApiKey}
              onChange={(e) => setOpenaiApiKey(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
              placeholder="Voer je OpenAI API key in"
              disabled={isLoading}
            />
          </label>
        </>
      )}
    </div>
  )
}
