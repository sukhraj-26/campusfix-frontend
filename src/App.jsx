import React, { useState, useEffect } from 'react';
import { fetchComplaints, createComplaint } from './services/api';
import { 
  LayoutDashboard, 
  AlertCircle, 
  PlusCircle, 
  CheckCircle2, 
  MapPin, 
  Tag, 
  RefreshCw, 
  Send,
  Building2,
  CheckCircle
} from 'lucide-react';

export default function App() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Infrastructure',
    location: '',
    priority: 'MEDIUM',
    imageUrl: ''
  });

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchComplaints();
      setComplaints(data);
    } catch (err) {
      setError('Could not fetch complaints. Make sure Spring Boot is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMsg('');

    try {
      const newComplaint = await createComplaint(form);
      setComplaints([newComplaint, ...complaints]);
      setForm({ title: '', description: '', category: 'Infrastructure', location: '', priority: 'MEDIUM', imageUrl: '' });
      setSuccessMsg('Complaint submitted successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/complaints/${id}/status?status=${newStatus}&remarks=Resolved by Staff`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Failed to update status');
      loadComplaints();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredComplaints = complaints.filter(item => {
    return filterCategory === 'ALL' || item.category === filterCategory;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">CampusFix</h1>
              <p className="text-xs text-slate-400">University Complaint Portal</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            API Connected (8080)
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Submit Form */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <div className="flex items-center space-x-2 mb-5">
              <PlusCircle className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-white">File New Complaint</h2>
            </div>

            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> {successMsg}
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Issue Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Broken Projector in Audi 2"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Category</label>
                  <select
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.category}
                    onChange={e => setForm({...form, category: e.target.value})}
                  >
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="IT">IT & Wi-Fi</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Mess">Mess & Food</option>
                    <option value="Electrical">Electrical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Priority</label>
                  <select
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.priority}
                    onChange={e => setForm({...form, priority: e.target.value})}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Location / Room</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Block C, Room 402"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.location}
                  onChange={e => setForm({...form, location: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Description</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Provide precise details about the problem..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 rounded-xl shadow-lg shadow-blue-600/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {submitting ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Feed */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl shadow-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <LayoutDashboard className="w-5 h-5 text-blue-500" />
              <h2 className="font-semibold text-white">Live Feed</h2>
              <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full">{filteredComplaints.length}</span>
            </div>

            <div className="flex items-center space-x-3">
              <select 
                className="bg-slate-900 border border-slate-800 text-slate-200 text-xs px-3 py-2 rounded-xl focus:outline-none"
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
              >
                <option value="ALL">All Categories</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="IT">IT & Wi-Fi</option>
                <option value="Hostel">Hostel</option>
                <option value="Mess">Mess & Food</option>
                <option value="Electrical">Electrical</option>
              </select>

              <button 
                onClick={loadComplaints}
                className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl transition"
                title="Refresh Feed"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {filteredComplaints.length === 0 ? (
            <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              No complaints found. File one using the form on the left!
            </div>
          ) : (
            <div className="space-y-4">
              {filteredComplaints.map(item => (
                <div key={item.id} className="bg-slate-950/80 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-mono bg-slate-900 text-slate-400 px-2.5 py-1 rounded-lg border border-slate-800">#{item.id}</span>
                      <h3 className="font-semibold text-base text-white">{item.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${
                        item.priority === 'HIGH' || item.priority === 'URGENT' 
                          ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm">{item.description}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-900 text-xs text-slate-400">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-blue-500" /> {item.location}</span>
                      <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-indigo-500" /> {item.category}</span>
                    </div>
                    <button
                      onClick={() => handleStatusUpdate(item.id, 'RESOLVED')}
                      className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-xl transition font-medium flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Mark Resolved
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}