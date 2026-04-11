import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { findByName, findByImage } from '../services/geminiService';
import { saveSearch } from '../services/historyService';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Upload, Camera, X, Loader2, AlertCircle, Image as ImageIcon } from 'lucide-react';

import Navbar from '../components/Navbar';

export default function Home() {
  const [mode, setMode] = useState<'text' | 'image'>('text');
  const [medicineName, setMedicineName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const switchMode = (newMode: 'text' | 'image') => {
    setMode(newMode);
    setError('');
    if (newMode === 'text') {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleTextSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!medicineName.trim()) return;

    setLoading(true);
    setError('');

    try {
      const result = await findByName(medicineName);
      // Save search in background, don't block the UI
      if (user) {
        saveSearch(user.uid, 'text', result).catch(err => console.error('History save failed:', err));
      }
      navigate('/results', { state: { result, type: 'text' } });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to identify medicine. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSearch = async () => {
    if (!imageFile) return;

    setLoading(true);
    setError('');

    try {
      const result = await findByImage(imageFile);
      
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Save search in background, don't block the UI
      if (user) {
        saveSearch(user.uid, 'image', result).catch(err => console.error('History save failed:', err));
      }
      navigate('/results', { state: { result, type: 'image' } });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to process image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setError('');
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 pt-12">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl"
          >
            Find Affordable <span className="text-emerald-600">Alternatives</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Search by name or upload a photo of your medicine to find high-quality generic substitutes with the same salt composition.
          </motion.p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-200/50 p-1 rounded-2xl flex gap-1">
            <button
              onClick={() => switchMode('text')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                mode === 'text' 
                  ? 'bg-white text-emerald-600 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="h-4 w-4" />
              Search by Name
            </button>
            <button
              onClick={() => switchMode('image')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                mode === 'image' 
                  ? 'bg-white text-emerald-600 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Camera className="h-4 w-4" />
              Upload Image
            </button>
          </div>
        </div>

        {/* Search Content */}
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {mode === 'text' ? (
              <motion.div
                key="text-mode"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100"
              >
                <form onSubmit={handleTextSearch} className="flex flex-col gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={medicineName}
                      onChange={(e) => setMedicineName(e.target.value)}
                      placeholder="e.g. Dolo 650, Crocin, Augmentin 625"
                      className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !medicineName.trim()}
                    className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Search Alternatives'}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="image-mode"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100"
              >
                {!imagePreview ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      if (file) processFile(file);
                    }}
                    className="border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all cursor-pointer group"
                  >
                    <div className="bg-slate-100 p-4 rounded-full group-hover:bg-emerald-100 transition-all">
                      <Upload className="h-8 w-8 text-slate-400 group-hover:text-emerald-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-slate-900 font-semibold">Click or drag to upload</p>
                      <p className="text-slate-500 text-sm mt-1">Supports JPG, PNG, WEBP (Max 5MB)</p>
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-100">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-contain"
                      />
                      <button 
                        onClick={clearImage}
                        className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={handleImageSearch}
                      disabled={loading}
                      className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Scan Medicine'}
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm"
            >
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {[
            { icon: Search, title: 'Smart Search', desc: 'Find medicines by their brand name instantly.' },
            { icon: ImageIcon, title: 'Visual Scan', desc: 'Identify medicines by uploading a photo of the packaging.' },
            { icon: AlertCircle, title: 'Generic Subs', desc: 'Get 100% accurate generic alternatives with same salts.' }
          ].map((feature, i) => (
            <div key={i} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="bg-emerald-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
