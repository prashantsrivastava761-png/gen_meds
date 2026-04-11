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
  CheckCircle2
} from 'lucide-react';

interface Medicine {
  name: string;
  manufacturer: string;
  composition: string;
  price: string;
  savings: string;
  form: string;
  reason: string;
  availability: string;
}

interface MedicineCardProps {
  medicine: Medicine;
}

export default function MedicineCard({ medicine }: MedicineCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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

      <div className="grid grid-cols-2 gap-4 mb-4">
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

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full mt-2 py-2 flex items-center justify-center gap-1 text-xs font-bold text-slate-400 hover:text-emerald-600 transition-colors border-t border-slate-50 pt-4"
      >
        {isExpanded ? (
          <>
            Show Less <ChevronUp className="h-3 w-3" />
          </>
        ) : (
          <>
            More Info <ChevronDown className="h-3 w-3" />
          </>
        )}
      </button>
    </motion.div>
  );
}
