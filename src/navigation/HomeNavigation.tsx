import { Link } from 'react-router-dom'

function HomeNavigation() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="mx-4 px-4 py-4 flex items-center justify-between">
        <span className="text-xl font-bold">Hackathon Quiz-Master</span>

        <nav className="space-x-6">
          <Link to="/questions" className="hover:underline">
            Übersicht
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default HomeNavigation
