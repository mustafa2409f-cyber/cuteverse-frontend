import { motion } from 'framer-motion';
import { Check, Trash2, Pencil, CalendarDays, Flag } from 'lucide-react';
import type { Task } from '../types';

export const CATEGORY_META: Record<string, { label: string; emoji: string; classes: string }> = {
  personal: { label: 'Personal', emoji: '🌸', classes: 'bg-blush-50 text-blush-500 border-blush-200' },
  work: { label: 'Work', emoji: '💼', classes: 'bg-lav-50 text-lav-500 border-lav-200' },
  study: { label: 'Study', emoji: '📚', classes: 'bg-sky2-50 text-sky2-500 border-sky2-200' },
  health: { label: 'Health', emoji: '💗', classes: 'bg-mint-50 text-mint-500 border-mint-200' },
  creative: { label: 'Creative', emoji: '🎨', classes: 'bg-peach-50 text-peach-500 border-peach-200' },
  other: { label: 'Other', emoji: '✨', classes: 'bg-slate-50 text-slate-500 border-slate-200' },
};

export const PRIORITY_META: Record<string, { label: string; classes: string }> = {
  low: { label: 'Low', classes: 'bg-mint-100 text-mint-600' },
  medium: { label: 'Medium', classes: 'bg-peach-100 text-peach-500' },
  high: { label: 'High', classes: 'bg-blush-100 text-blush-600' },
};

interface Props {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  index?: number;
}

export default function TaskCard({ task, onToggle, onEdit, onDelete, index = 0 }: Props) {
  const cat = CATEGORY_META[task.category] ?? CATEGORY_META.other;
  const pri = PRIORITY_META[task.priority] ?? PRIORITY_META.medium;
  const due = task.dueDate ? new Date(task.dueDate) : null;
  const overdue = due && !task.completed && due < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 28, delay: Math.min(index * 0.04, 0.3) }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-4 shadow-card backdrop-blur transition-shadow hover:shadow-soft"
    >
      <div className="flex items-start gap-3">
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={() => onToggle(task)}
          aria-label={task.completed ? 'Mark as pending' : 'Mark as completed'}
          className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition-all ${
            task.completed
              ? 'border-mint-400 bg-gradient-to-br from-mint-300 to-mint-400 text-white shadow-glow'
              : 'border-blush-200 bg-white text-transparent hover:border-blush-300 hover:bg-blush-50'
          }`}
        >
          <motion.span
            initial={false}
            animate={task.completed ? { scale: [0, 1.2, 1] } : { scale: 1 }}
            transition={{ duration: 0.35 }}
          >
            <Check size={15} strokeWidth={3.5} />
          </motion.span>
        </motion.button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`font-display text-[15px] font-bold leading-snug transition-all ${
                task.completed ? 'text-slate-400 line-through decoration-blush-300' : 'text-slate-700'
              }`}
            >
              {task.title}
            </h3>
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-extrabold ${cat.classes}`}>
              {cat.emoji} {cat.label}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${pri.classes}`}>
              <Flag size={9} className="mr-0.5 inline" />
              {pri.label}
            </span>
          </div>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-xs font-semibold text-slate-400">{task.description}</p>
          )}
          <div className="mt-2 flex items-center gap-3 text-[11px] font-bold text-slate-400">
            {due && (
              <span className={`flex items-center gap-1 ${overdue ? 'text-blush-500' : ''}`}>
                <CalendarDays size={12} />
                {due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                {overdue && ' · overdue'}
              </span>
            )}
            <span>{new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onEdit(task)}
            className="grid h-8 w-8 place-items-center rounded-full bg-lav-50 text-lav-500 transition hover:bg-lav-100 active:scale-90"
            aria-label="Edit task"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="grid h-8 w-8 place-items-center rounded-full bg-blush-50 text-blush-500 transition hover:bg-blush-100 active:scale-90"
            aria-label="Delete task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
