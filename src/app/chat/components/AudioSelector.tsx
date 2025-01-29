export const AudioSelector = ({
  file,
  setFile,
  isLoading,
}: {
  file: File | null
  setFile: (file: File | null) => void
  isLoading?: boolean
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">
        Audio bestand:
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mt-1 block w-full border rounded p-2"
          disabled={isLoading}
        />
      </label>
    </div>
  )
}
