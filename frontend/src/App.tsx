import { useState } from 'react';
import { Auth } from './pages/Auth';
import { JobSeekerDashboard } from './pages/JobSeekerDashboard';
import { CompanyDashboard } from './pages/CompanyDashboard';

export function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('name');

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
  };

  if (!token) {
    return <Auth onLogin={() => setToken(localStorage.getItem('token'))} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-blue-600">IndoKerja</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">
            Halo, {name} ({role === 'COMPANY' ? 'Perusahaan' : 'Pencari Kerja'})
          </span>
          <button onClick={handleLogout} className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-300">
            Keluar
          </button>
        </div>
      </header>

      <main>
        {role === 'COMPANY' ? <CompanyDashboard /> : <JobSeekerDashboard />}
      </main>
    </div>
  );
}

export default App;