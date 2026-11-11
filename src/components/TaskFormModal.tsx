import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import type { Task, TaskCategory, TaskPriority } from '../types';
import { CATEGORY_META } from './TaskCard';

interface Props {
  open: boolean;
  initial?: Task | null;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    category: TaskCategory;
    priority: TaskPriority;
    dueDate?: string;
  }) => Promise<void>;
  loading?: boolean;
}

const CATEGORIES: TaskCategory[] = ['personal', 'work', 'study', 'health', 'creative', 'other'];
const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];

export default function TaskFormModal({ open, initial, onClose, onSubmit, loading }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('personal');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setTitle(initial?.title ?? '');
      setDescription(initial?.description ?? '');
      setCategory(initial?.category ?? 'personal');
      setPriority(initial?.priority ?? 'medium');
      setDueDate(initial?.dueDate ? new Date(initial.dueDate).toISOString().slice(0, 10) : '');
      setError('');
    }
  }, [open, initial]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please give your task a cute little title ✿');
      return;
    }
    await onSubmit({ title: title.trim(), description: description.trim(), category, priority, dueDate: dueDate || undefined });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-slate-900/30 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.form
            onSubmit={submit}
            initial={{ scale: 0.85, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="my-8 w-full max-w-lg rounded-4xl border border-white/70 bg-white/95 p-6 shadow-card backdrop-blur sm:p-8"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-gradient">
                <Sparkles size={22} /> {initial ? 'Edit task' : 'New little task'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="grid h-9 w-9 place-items-center rounded-full bg-blush-50 text-blush-500 transition hover:bg-blush-100"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-slate-400">
                  Title
                </label>
                <input
                  className="input-cute"
                  placeholder="e.g. Water my plant friend 🌱"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={140}
                  autoFocus
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-slate-400">
                  Description
                </label>
                <textarea
                  className="input-cute min-h-[80px] resize-none"
                  placeholder="Add a sprinkle of detail…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={1000}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-slate-400">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => {
                      const m = CATEGORY_META[c];
                      const active = category === c;
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setCategory(c)}
                          className={`rounded-full border px-3 py-1.5 text-xs font-extrabold transition-all active:scale-95 ${
                            active ? m.classes + ' ring-2 ring-blush-200' : 'border-blush-100 bg-white text-slate-400 hover:border-blush-200'
                          }`}
                        >
                          {m.emoji} {m.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-slate-400">
                      Priority
                    </label>
                    <div className="flex gap-2">
                      {PRIORITIES.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={`flex-1 rounded-full border px-3 py-1.5 text-xs font-extrabold capitalize transition-all active:scale-95 ${
                            priority === p
                              ? p === 'high'
                                ? 'border-blush-300 bg-blush-50 text-blush-500'
                                : p === 'medium'
                                  ? 'border-peach-300 bg-peach-50 text-peach-500'
                                  : 'border-mint-300 bg-mint-50 text-mint-500'
                              : 'border-blush-100 bg-white text-slate-400 hover:border-blush-200'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-slate-400">
                      Due date
                    </label>
                    <input type="date" className="input-cute" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                  </div>
                </div>
              </div>

              {error && (
                <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-bold text-blush-500">
                  {error}
                </motion.p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-full bg-blush-50 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-blush-100 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blush-400 to-lav-400 px-4 py-3 text-sm font-bold text-white shadow-glow transition hover:scale-[1.02] active:scale-95 disabled:opacity-60"
                >
                  <Sparkles size={15} /> {loading ? 'Saving…' : initial ? 'Save changes' : 'Add task'}
                </button>
              </div>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
