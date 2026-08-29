import React, { useEffect, useState } from 'react';
import api from '../api/client';

export const JobSeekerDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error('Gagal mengambil daftar pekerjaan:', err);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const res = await api.get('/applications/my-applications');
      setMyApplications(res.data);
    } catch (err) {
      console.error('Gagal mengambil riwayat lamaran:', err);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchMyApplications();
  }, []);

  const handleApply = async (jobId: string) => {
    try {
      await api.post('/applications/apply', { jobId });
      showToast('Berhasil melamar pekerjaan!');
      fetchMyApplications();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Gagal melamar pekerjaan', 'error');
    }
  };

  const hasApplied = (jobId: string) => {
    return myApplications.some((app) => app.jobId === jobId || app.job?.id === jobId);
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

  return (
    <div className="max-w-5xl mx-auto p-6 relative">
      {/* Custom Toast Notification */}
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
        <h1 className="text-2xl font-bold">Cari Karir Impianmu</h1>
        <p className="text-blue-100 text-sm mt-1">Temukan berbagai lowongan kerja terbaik dan pantau status lamaranmu.</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-3 mb-8 border-b border-gray-200 pb-3">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'jobs'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          🔍 Cari Lowongan
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'applications'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          📄 Riwayat Lamaran ({myApplications.length})
        </button>
      </div>

      {activeTab === 'jobs' ? (
        <div className="space-y-4">
          {jobs.map((job) => {
            const isApplied = hasApplied(job.id);
            return (
              <div key={job.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
                    <p className="text-sm font-medium text-gray-600 mt-0.5">🏢 {job.company?.name || 'Perusahaan'} • 📍 {job.location}</p>
                  </div>
                  <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-semibold border border-blue-200">{job.jobType}</span>
                </div>
                <div className="mt-3">
                  <span className="inline-block bg-emerald-50 text-emerald-700 text-xs px-3 py-1 rounded-md font-semibold border border-emerald-200">💰 {job.salary}</span>
                </div>
                <p className="text-sm text-gray-600 my-4">{job.description}</p>
                <button
                  onClick={() => handleApply(job.id)}
                  disabled={isApplied}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                    isApplied
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                  }`}
                >
                  {isApplied ? '✓ Sudah Dilamar' : 'Lamar Sekarang'}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {myApplications.length === 0 ? (
            <div className="bg-white border rounded-2xl p-8 text-center text-gray-500">Belum ada lowongan yang dilamar.</div>
          ) : (
            myApplications.map((app) => (
              <div key={app.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex justify-between items-center hover:shadow-md transition">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{app.job?.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">🏢 {app.job?.company?.name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(app.status)}`}>
                  {app.status}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};