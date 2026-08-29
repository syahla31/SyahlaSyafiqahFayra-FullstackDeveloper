import React, { useEffect, useState } from 'react';
import api from '../api/client';

export const CompanyDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'my-jobs' | 'candidates'>('create');
  
  // Form State
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [jobType, setJobType] = useState('Full-Time');
  const [description, setDescription] = useState('');

  // Data State
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  // State untuk mengontrol Dropdown mana yang sedang terbuka
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchMyJobs = async () => {
    try {
      const res = await api.get('/jobs');
      setMyJobs(res.data);
    } catch (err) {
      console.error('Gagal mengambil lowongan:', err);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await api.get('/applications/company-applications');
      setApplications(res.data);
    } catch (err) {
      console.error('Gagal mengambil data pelamar:', err);
    }
  };

  useEffect(() => {
    fetchMyJobs();
    fetchApplications();
  }, []);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/jobs', { title, location, salary, jobType, description });
      showToast('Lowongan pekerjaan berhasil ditambahkan!');
      setTitle(''); setLocation(''); setSalary(''); setDescription('');
      fetchMyJobs();
      setActiveTab('my-jobs');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Gagal menambahkan lowongan', 'error');
    }
  };

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      await api.put(`/applications/${applicationId}/status`, { status: newStatus });
      showToast(`Status pelamar berhasil diperbarui menjadi ${newStatus}!`);
      setOpenDropdownId(null); // Tutup dropdown setelah memilih
      fetchApplications();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Gagal mengubah status pelamar', 'error');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      APPLIED: 'bg-amber-100 text-amber-800 border-amber-300',
      REVIEWING: 'bg-blue-100 text-blue-800 border-blue-300',
      SHORTLISTED: 'bg-purple-100 text-purple-800 border-purple-300',
      REJECTED: 'bg-rose-100 text-rose-800 border-rose-300',
      ACCEPTED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    };
    return styles[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const statusOptions = [
    { label: 'Applied', value: 'APPLIED', color: 'hover:bg-amber-50 text-amber-700' },
    { label: 'Reviewing', value: 'REVIEWING', color: 'hover:bg-blue-50 text-blue-700' },
    { label: 'Shortlisted', value: 'SHORTLISTED', color: 'hover:bg-purple-50 text-purple-700' },
    { label: 'Rejected', value: 'REJECTED', color: 'hover:bg-rose-50 text-rose-700' },
    { label: 'Accepted', value: 'ACCEPTED', color: 'hover:bg-emerald-50 text-emerald-700' },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 relative">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-xl border text-sm font-medium flex items-center gap-3 transition-all duration-300 ${
            toast.type === 'success'
              ? 'bg-emerald-600 text-white border-emerald-500'
              : 'bg-rose-600 text-white border-rose-500'
          }`}
        >
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-lg mb-8">
        <h1 className="text-2xl font-bold">Portal Perusahaan</h1>
        <p className="text-blue-100 text-sm mt-1">Kelola lowongan pekerjaan dan kandidat pelamar dengan cepat.</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-3 mb-8 border-b border-gray-200 pb-3">
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'create'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          ➕ Buat Lowongan Baru
        </button>
        <button
          onClick={() => { setActiveTab('my-jobs'); fetchMyJobs(); }}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'my-jobs'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          💼 Lowongan Aktif ({myJobs.length})
        </button>
        <button
          onClick={() => { setActiveTab('candidates'); fetchApplications(); }}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'candidates'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          👥 Kelola Kandidat ({applications.length})
        </button>
      </div>

      {/* Tab 1: Form Buat Lowongan */}
      {activeTab === 'create' && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Pasang Lowongan Pekerjaan Baru</h2>
          <form onSubmit={handleCreateJob} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul Posisi</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Contoh: Senior React Developer" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                <input type="text" required value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Contoh: Jakarta / Remote" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimasi Gaji</label>
                <input type="text" required value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Contoh: Rp 10.000.000 - Rp 15.000.000" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Pekerjaan</label>
              <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Pekerjaan</label>
              <textarea required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Tuliskan kualifikasi..." />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md">
              Publikasikan Lowongan
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Lowongan Saya */}
      {activeTab === 'my-jobs' && (
        <div className="space-y-4">
          {myJobs.length === 0 ? (
            <div className="bg-white border rounded-2xl p-8 text-center text-gray-500">Belum ada lowongan yang dibuat.</div>
          ) : (
            myJobs.map((job) => (
              <div key={job.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{job.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">📍 {job.location} • 💰 {job.salary}</p>
                  </div>
                  <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-semibold border border-blue-200">{job.jobType}</span>
                </div>
                <p className="text-sm text-gray-600 mt-3">{job.description}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Daftar Kandidat Pelamar (Custom Modern Dropdown) */}
      {activeTab === 'candidates' && (
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="bg-white border rounded-2xl p-8 text-center text-gray-500">
              Belum ada kandidat yang melamar.
            </div>
          ) : (
            applications.map((app) => {
              const isOpen = openDropdownId === app.id;
              return (
                <div
                  key={app.id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition relative"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-gray-800">
                        {app.applicant?.name || 'Pelamar'}
                      </h3>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${getStatusBadge(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">✉️ {app.applicant?.email}</p>
                    <p className="text-sm text-blue-600 font-semibold mt-1">🎯 Melamar Posisi: {app.job?.title}</p>
                  </div>

                  {/* Custom Dropdown Trigger & Popover */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setOpenDropdownId(isOpen ? null : app.id)}
                      className="bg-white border border-gray-300 hover:border-blue-500 px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 flex items-center gap-2 shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <span>Status: <strong className="text-blue-600">{app.status}</strong></span>
                      <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Menu Popover Melayang */}
                    {isOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-30 py-2 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 mb-1">
                          Ubah Status
                        </div>
                        {statusOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => handleStatusChange(app.id, opt.value)}
                            className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors flex items-center justify-between ${opt.color} ${
                              app.status === opt.value ? 'bg-gray-50 font-bold' : ''
                            }`}
                          >
                            <span>{opt.label}</span>
                            {app.status === opt.value && (
                              <span className="text-blue-600 font-bold text-xs">✓</span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};