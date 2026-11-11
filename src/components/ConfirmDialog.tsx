import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel, loading }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] grid place-items-center bg-slate-900/30 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.85, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-4xl border border-white/70 bg-white/95 p-6 text-center shadow-card"
          >
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-blush-50">
              <AlertTriangle className="text-blush-500" size={26} />
            </div>
            <h3 className="font-display text-xl font-bold text-slate-700">{title}</h3>
            <p className="mt-2 text-sm font-semibold text-slate-500">{message}</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={onCancel}
                disabled={loading}
                className="flex-1 rounded-full bg-blush-50 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-blush-100 active:scale-95 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 rounded-full bg-gradient-to-r from-blush-400 to-blush-500 px-4 py-2.5 text-sm font-bold text-white shadow-glow transition hover:scale-[1.03] active:scale-95 disabled:opacity-60"
              >
                {loading ? '…' : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
