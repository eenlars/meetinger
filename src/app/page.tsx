import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Vergaderingsanalyse AI</h1>

        <div className="grid gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-3">Stap 1: Upload je audio</h2>
            <p className="text-gray-600">
              Upload een audiobestand van je vergadering in een ondersteund formaat (.mp3, .wav, etc.)
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-3">Stap 2: AI Transcriptie</h2>
            <p className="text-gray-600">Ons AI systeem zet je audio automatisch om naar tekst met hoge nauwkeurigheid</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-3">Stap 3: Analyse & Inzichten</h2>
            <p className="text-gray-600">Krijg direct bruikbare inzichten, samenvattingen en actiepunten uit je vergadering</p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/chat"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Start Analyse
          </Link>
        </div>
      </div>
    </div>
  )
}
