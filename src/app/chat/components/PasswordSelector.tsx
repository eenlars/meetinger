interface PasswordSelectorProps {
  password: string
  setPassword: (password: string) => void
  isLoading?: boolean
}

export const PasswordSelector = ({ password, setPassword, isLoading }: PasswordSelectorProps): JSX.Element => {
  return (
    <div className="mb-4">
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
    </div>
  )
}
