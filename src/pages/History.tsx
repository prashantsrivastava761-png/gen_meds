import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserHistory } from '../services/historyService';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  History as HistoryIcon, 
  Search, 
  ImageIcon, 
  ChevronRight, 
  Clock,
  Calendar,
  Loader2,
  Inbox
} from 'lucide-react';

import Navbar from '../components/Navbar';

export default function History() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchHistory() {
      if (!user) return;
      try {
        const data = await getUserHistory(user.uid);
        setHistory(data);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [user]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate();
    const day = date.getDate().toString().padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 pt-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-emerald-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading your history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="bg-slate-50 p-6 rounded-full mb-6">
              <Inbox className="h-12 w-12 text-slate-300" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">No history yet</h2>
            <p className="text-slate-600 mt-2 mb-8 text-center max-w-xs">
              No searches yet. Start by searching a medicine.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all"
            >
              Start Searching
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate('/results', { state: { result: item.fullResult, type: item.type } })}
                className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      item.type === 'text' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                    }`}>
                      {item.type === 'text' ? <Search className="h-6 w-6" /> : <ImageIcon className="h-6 w-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          {item.medicineName}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.type === 'text' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {item.type === 'text' ? 'Text Search' : 'Image Scan'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-1">
                        {item.composition}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDate(item.createdAt)}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                          <HistoryIcon className="h-3.5 w-3.5" />
                          {item.alternativesCount} Alternatives
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-full group-hover:bg-emerald-50 transition-all">
                    <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-emerald-600" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}


        {history.length > 0 && (
          <p className="text-center text-slate-400 text-xs mt-12 pb-8">
            Showing your last 20 searches.
          </p>
        )}
      </main>
    </div>
  );
}
