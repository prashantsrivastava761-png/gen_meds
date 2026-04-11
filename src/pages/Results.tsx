import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Info, 
  CheckCircle2, 
  TrendingDown, 
  AlertTriangle, 
  Building2, 
  FlaskConical,
  IndianRupee,
  LogOut,
  History as HistoryIcon,
  Search,
  X,
  ArrowUpDown,
  ShoppingBag
} from 'lucide-react';
import { logOut } from '../services/authService';

import Navbar from '../components/Navbar';
import MedicineCard from '../components/MedicineCard';

type SortOption = 'best' | 'price' | 'savings';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, type } = location.state || {};

  const [isBannerDismissed, setIsBannerDismissed] = useState(() => {
    return localStorage.getItem('genmeds_banner_dismissed') === 'true';
  });
  const [sortBy, setSortBy] = useState<SortOption>('best');

  // Redirect if no result data is present
  useEffect(() => {
    if (!result) {
      navigate('/', { replace: true });
    }
  }, [result, navigate]);

  const parsePrice = (priceStr: string) => {
    return parseFloat(priceStr.replace(/[^\d.]/g, '')) || 0;
  };

  const parseSavings = (savingsStr: string) => {
    return parseFloat(savingsStr.replace(/[^\d.]/g, '')) || 0;
  };

  const sortedAlternatives = useMemo(() => {
    if (!result?.alternatives) return [];
    
    const alternatives = [...result.alternatives];
    
    switch (sortBy) {
      case 'price':
        return alternatives.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
      case 'savings':
        return alternatives.sort((a, b) => parseSavings(b.savings) - parseSavings(a.savings));
      case 'best':
      default:
        return alternatives;
    }
  }, [result, sortBy]);

  const handleDismissBanner = () => {
    setIsBannerDismissed(true);
    localStorage.setItem('genmeds_banner_dismissed', 'true');
  };

  if (!result) return null;

  const original = type === 'text' ? result.original : result.detected;

  const getConfidenceColor = (confidence: string) => {
    switch (confidence?.toLowerCase()) {
      case 'high': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'price': return 'Lowest Price';
      case 'savings': return 'Highest Savings';
      case 'best': return 'Best Match';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 pt-8">
        {/* Banner */}
        <AnimatePresence>
          {!isBannerDismissed && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl flex items-center justify-between shadow-lg shadow-blue-100">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 p-1.5 rounded-lg">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-medium">Click any platform button to search and buy directly from trusted pharmacies.</p>
                </div>
                <button 
                  onClick={handleDismissBanner}
                  className="p-1 hover:bg-blue-500 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Original Medicine Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50/50 rounded-3xl p-6 shadow-sm border border-emerald-100 mb-8"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block px-3 py-1 bg-white text-emerald-600 text-xs font-bold rounded-full border border-emerald-100 uppercase tracking-wider">
                  {type === 'image' ? 'Detected Medicine' : 'Searched Medicine'}
                </span>
                {type === 'image' && original.confidence && (
                  <span className={`px-3 py-1 text-[10px] font-bold rounded-full border uppercase tracking-widest ${getConfidenceColor(original.confidence)}`}>
                    {original.confidence} Confidence
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{original.name}</h2>
              <div className="flex items-center gap-2 mt-1 text-slate-500">
                <Building2 className="h-4 w-4" />
                <span className="text-sm">{original.manufacturer}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-slate-900 flex items-center justify-end">
                <IndianRupee className="h-5 w-5" />
                {original.price}
              </div>
              <p className="text-xs text-slate-400 mt-1">Approx. Market Price</p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl flex items-center gap-3 border border-emerald-100/50">
            <FlaskConical className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-xs text-emerald-600 font-bold uppercase tracking-wide">Active Composition</p>
              <p className="text-slate-900 font-medium">{original.composition}</p>
            </div>
          </div>
        </motion.div>

        {/* Alternatives Section Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              {result.alternatives?.length || 0} Affordable Alternatives Found
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-slate-500 text-sm">Same salt composition, better prices.</p>
              <span className="text-slate-300">•</span>
              <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wider">
                Showing {sortedAlternatives.length} results — sorted by {getSortLabel()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Sort by:</span>
            <div className="flex gap-1">
              {(['best', 'price', 'savings'] as SortOption[]).map((option) => (
                <button
                  key={option}
                  onClick={() => setSortBy(option)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    sortBy === option 
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100' 
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {option === 'best' ? 'Best Match' : option === 'price' ? 'Lowest Price' : 'Highest Savings'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {sortedAlternatives.map((alt: any, index: number) => (
            <React.Fragment key={index}>
              <MedicineCard medicine={alt} />
            </React.Fragment>
          ))}
        </div>


        {/* Disclaimer */}
        <div className="mt-12 p-6 bg-amber-50 border border-amber-100 rounded-3xl flex items-start gap-4">
          <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0" />
          <div>
            <h5 className="font-bold text-amber-900">Medical Disclaimer</h5>
            <p className="text-sm text-amber-800 mt-1 leading-relaxed italic">
              {result.disclaimer} Always consult a qualified medical professional before switching or starting any new medication. This information is for educational purposes only.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg hover:bg-emerald-700 transition-all"
          >
            <Search className="h-5 w-5" />
            Search Again
          </button>
        </div>
      </main>
    </div>
  );
}

