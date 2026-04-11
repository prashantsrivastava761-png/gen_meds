import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  FlaskConical, 
  IndianRupee, 
  TrendingDown, 
  ChevronDown, 
  ChevronUp, 
  Info,
  Package,
  ShoppingCart,
  ExternalLink,
  Copy,
  Check,
  Store,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { generateBuyLinks } from '../utils/buyLinks';

interface Medicine {
  name: string;
  manufacturer: string;
  composition: string;
  price: string;
  savings: string;
  form: string;
  reason: string;
  availability: string;
  platforms?: string[];
}

interface MedicineCardProps {
  medicine: Medicine;
}

export default function MedicineCard({ medicine }: MedicineCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPopupWarning, setShowPopupWarning] = useState(false);
  const buyLinks = generateBuyLinks(medicine.name, medicine.platforms);

  const handleCopy = () => {
    navigator.clipboard.writeText(medicine.name);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCompareAll = () => {
    setShowPopupWarning(true);
    buyLinks.forEach(link => {
      window.open(link.url, '_blank');
    });
    // Hide warning after 5 seconds
    setTimeout(() => setShowPopupWarning(false), 5000);
  };

  const isOfflineOnly = medicine.availability.toLowerCase() === 'offline' && (!medicine.platforms || medicine.platforms.length === 0);
  const isBoth = medicine.availability.toLowerCase() === 'both';
  const hasOnline = buyLinks.length > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:border-emerald-200 transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h4 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
            {medicine.name}
          </h4>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm text-slate-500 flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {medicine.manufacturer}
            </p>
            <span className="text-slate-300">•</span>
            <p className="text-sm text-slate-500 flex items-center gap-1">
              <Package className="h-3 w-3" />
              {medicine.form}
            </p>
          </div>
        </div>
        <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shrink-0">
          <TrendingDown className="h-3 w-3" />
          Save {medicine.savings}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="p-3 bg-slate-50 rounded-xl">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Price</p>
          <p className="text-slate-900 font-bold flex items-center">
            <IndianRupee className="h-3 w-3" />
            {medicine.price}
          </p>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Availability</p>
          <p className="text-slate-900 font-bold text-xs flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            {medicine.availability}
          </p>
        </div>
      </div>

      {hasOnline && (
        <div className="mb-4 p-2.5 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-2">
          <span className="text-sm">💡</span>
          <p className="text-[11px] text-amber-800 leading-tight">
            Prices may vary across platforms. <br />
            <span className="font-bold">Compare before buying for best deal.</span>
          </p>
        </div>
      )}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-2 pb-4 space-y-4">
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                  <FlaskConical className="h-3 w-3" />
                  Salt Composition
                </p>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                  {medicine.composition}
                </p>
              </div>
              
              <div className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50/50 p-3 rounded-xl border border-slate-100 italic">
                <Info className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <p>{medicine.reason}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-2 border-t border-slate-50 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            {isOfflineOnly ? 'Availability' : 'Buy Online'}
          </h5>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-emerald-600 transition-colors"
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp className="h-2.5 w-2.5" />
              </>
            ) : (
              <>
                More Info <ChevronDown className="h-2.5 w-2.5" />
              </>
            )}
          </button>
        </div>

        {isOfflineOnly ? (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-start gap-3">
              <div className="bg-white p-2 rounded-xl shadow-sm">
                <Store className="h-5 w-5 text-slate-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900">Available at local pharmacy only</p>
                <p className="text-xs text-slate-500 mt-0.5">Show this medicine name to your pharmacist</p>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className={`w-full mt-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                copied 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-500 hover:text-emerald-600'
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy Name
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {buyLinks.length > 1 && (
              <div className="mb-2">
                <button
                  onClick={handleCompareAll}
                  className="w-full py-2 rounded-xl border-2 border-dashed border-slate-200 text-slate-600 text-xs font-bold hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center justify-center gap-2"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Compare on all platforms
                </button>
                <div className="flex items-center justify-between mt-1 px-1">
                  <p className="text-[9px] text-slate-400 italic">
                    This will open {buyLinks.length} tabs
                  </p>
                  {showPopupWarning && (
                    <p className="text-[9px] text-amber-600 font-bold flex items-center gap-1">
                      <AlertCircle className="h-2.5 w-2.5" />
                      Allow popups if tabs don't open
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {buyLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ backgroundColor: link.color }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-[10px] font-bold shadow-sm hover:brightness-90 transition-all"
                >
                  <ShoppingCart className="h-3 w-3" />
                  {link.label}
                  <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                </a>
              ))}
            </div>
            
            {isBoth && (
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-md w-fit">
                <Store className="h-3 w-3" />
                Also available at local pharmacies
              </div>
            )}

            <p className="text-[9px] text-slate-400">
              Links open pharmacy search pages. Verify medicine availability before purchase.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
