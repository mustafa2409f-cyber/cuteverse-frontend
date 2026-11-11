import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Plus, Search, LayoutDashboard, Settings, LogOut, Sparkles,
  CheckCircle2, Clock, ListTodo, TrendingUp, Palette, Camera,
} from 'lucide-react';
import { api, apiError } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import type { Task, TaskCategory, TaskPriority, TaskStats, User } from '../types';
import TaskCard from '../components/TaskCard';
import TaskFormModal from '../components/TaskFormModal';
import ConfirmDialog from '../components/ConfirmDialog';
import Spinner from '../components/Spinner';
import Mascot from '../components/Mascot';
import { CATEGORY_META } from '../components/TaskCard';

const CATEGORIES: (TaskCategory | 'all')[] = ['all', 'personal', 'work', 'study', 'health', 'creative', 'other'];
const PRIORITIES: (TaskPriority | 'all')[] = ['all', 'low', 'medium', 'high'];
const SORTS = [
  { v: 'newest', label: 'Newest' },
  { v: 'oldest', label: 'Oldest' },
  { v: 'dueDate', label: 'Due date' },
  { v: 'priority', label: 'Priority' },
];

function applyTheme(theme: string) {
  document.documentElement.setAttribute('data-theme', theme === 'pastel' ? '' : theme);
  localStorage.setItem('cv_theme', theme);
}

function StatCard({ icon: Icon, label, value, suffix, gradient, delay }: {
  icon: React.ElementType; label: string; value: number | string; suffix?: string;
  gradient: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 260, damping: 24 }}
      whileHover={{ y: -5 }}
      className="glass rounded-3xl p-4 sm:p-5"
    >
      <div className={`mb-3 inline-grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-glow`}>
        <Icon size={18} />
      </div>
      <p className="font-display text-3xl font-extrabold text-slate-700">
        {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
        {suffix && <span className="ml-1 text-sm font-bold text-slate-400">{suffix}</span>}
      </p>
      <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">{label}</p>
    </motion.div>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 900;
    let raf: number;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{display}</>;
}

export default function Dashboard() {
  const { user, logout, updateUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') === 'settings' ? 'settings' : 'tasks';

  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>({ total: 0, completed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<TaskCategory | 'all'>('all');
  const [priFilter, setPriFilter] = useState<TaskPriority | 'all'>('all');
  const [sort, setSort] = useState('newest');
  const [showDone, setShowDone] = useState<'all' | 'pending' | 'completed'>('all');

  const [name, setName] = useState(user?.name ?? '');
  const [avatar, setAvatar] = useState(user?.avatar ?? '');
  const [theme, setTheme] = useState(user?.preferences.theme ?? 'pastel');
  const [savingProfile, setSavingProfile] = useState(false);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3200);
  };

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { sort };
      if (showDone === 'pending') params.completed = 'false';
      if (showDone === 'completed') params.completed = 'true';
      if (catFilter !== 'all') params.category = catFilter;
      if (priFilter !== 'all') params.priority = priFilter;
      if (search.trim()) params.search = search.trim();
      const [t, s] = await Promise.all([
        api.get<{ data: Task[] }>('/tasks', { params }),
        api.get<{ data: TaskStats }>('/tasks/stats'),
      ]);
      setTasks(t.data.data);
      setStats(s.data.data);
    } catch (e) {
      showToast(apiError(e), false);
    } finally {
      setLoading(false);
    }
  }, [sort, showDone, catFilter, priFilter, search]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    setName(user?.name ?? '');
    setAvatar(user?.avatar ?? '');
    setTheme(user?.preferences.theme ?? 'pastel');
  }, [user]);

  const progress = stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100);

  const visibleTasks = useMemo(() => tasks, [tasks]);

  const toggleTask = async (task: Task) => {
    const next = !task.completed;
    setTasks((ts) => ts.map((t) => (t._id === task._id ? { ...t, completed: next } : t)));
    try {
      await api.put(`/tasks/${task._id}`, { completed: next });
      setStats((s) => ({
        ...s,
        completed: s.completed + (next ? 1 : -1),
        pending: s.pending + (next ? -1 : 1),
      }));
      if (next && stats.completed + 1 === stats.total) showToast('All tasks done — you are a superstar! 🌟');
    } catch (e) {
      setTasks((ts) => ts.map((t) => (t._id === task._id ? { ...t, completed: !next } : t)));
      showToast(apiError(e), false);
    }
  };

  const saveTask = async (data: {
    title: string; description: string; category: TaskCategory; priority: TaskPriority; dueDate?: string;
  }) => {
    try {
      if (editing) {
        const res = await api.put<{ data: Task }>(`/tasks/${editing._id}`, data);
        setTasks((ts) => ts.map((t) => (t._id === editing._id ? res.data.data : t)));
        showToast('Task updated ✨');
      } else {
        const res = await api.post<{ data: Task }>('/tasks', data);
        setTasks((ts) => [res.data.data, ...ts]);
        setStats((s) => ({ ...s, total: s.total + 1, pending: s.pending + 1 }));
        showToast('Task added to your world 🌸');
      }
      setModalOpen(false);
      setEditing(null);
    } catch (e) {
      showToast(apiError(e), false);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/tasks/${deleting._id}`);
      setTasks((ts) => ts.filter((t) => t._id !== deleting._id));
      setStats((s) => ({
        total: s.total - 1,
        completed: s.completed - (deleting.completed ? 1 : 0),
        pending: s.pending - (deleting.completed ? 0 : 1),
      }));
      showToast('Task gently removed 🫧');
      setDeleting(null);
    } catch (e) {
      showToast(apiError(e), false);
    } finally {
      setDeleteLoading(false);
    }
  };

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      const [p, pr] = await Promise.all([
        api.put<{ data: User }>('/users/profile', { name: name.trim(), avatar: avatar.trim() }),
        api.put<{ data: User }>('/users/preferences', { theme }),
      ]);
      updateUser({ name: p.data.data.name, avatar: p.data.data.avatar });
      updateUser({ preferences: pr.data.data.preferences });
      showToast('Profile updated 💖');
    } catch (e) {
      showToast(apiError(e), false);
    } finally {
      setSavingProfile(false);
    }
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 5) return 'Up late, starry friend';
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  const initial = (user?.name ?? '?').charAt(0).toUpperCase();

  return (
    <div className="relative flex min-h-screen">
      {/* Sidebar — desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/60 bg-white/60 p-5 backdrop-blur-xl lg:flex">
        <Link to="/" className="mb-8 flex items-center gap-2 px-2">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-blush-400 to-lav-400 text-white shadow-glow">
            <Heart size={16} className="fill-white" />
          </span>
          <span className="font-display text-xl font-bold text-gradient">CuteVerse</span>
        </Link>
        <nav className="space-y-1.5">
          {[
            { id: 'tasks', label: 'My tasks', icon: LayoutDashboard },
            { id: 'settings', label: 'Profile & settings', icon: Settings },
          ].map((n) => (
            <button
              key={n.id}
              onClick={() => setSearchParams(n.id === 'tasks' ? {} : { tab: 'settings' })}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold transition-all ${
                tab === n.id ? 'bg-gradient-to-r from-blush-100 to-lav-100 text-blush-500 shadow-sm' : 'text-slate-500 hover:bg-white/70 hover:text-slate-700'
              }`}
            >
              <n.icon size={17} /> {n.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto space-y-3">
          <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/70 p-3">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-sky2-300 to-lav-300 font-display text-sm font-extrabold text-white">
                {initial}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-slate-700">{user?.name}</p>
              <p className="truncate text-xs font-bold text-slate-400">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold text-blush-500 transition hover:bg-blush-50"
          >
            <LogOut size={17} /> Log out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-white/60 bg-white/70 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-blush-400 to-lav-400 text-white">
            <Heart size={14} className="fill-white" />
          </span>
          <span className="font-display text-lg font-bold text-gradient">CuteVerse</span>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => setSearchParams({})}
            className={`rounded-full px-3.5 py-1.5 text-xs font-extrabold transition ${tab === 'tasks' ? 'bg-blush-100 text-blush-500' : 'bg-white/70 text-slate-500'}`}
          >
            Tasks
          </button>
          <button
            onClick={() => setSearchParams({ tab: 'settings' })}
            className={`rounded-full px-3.5 py-1.5 text-xs font-extrabold transition ${tab === 'settings' ? 'bg-blush-100 text-blush-500' : 'bg-white/70 text-slate-500'}`}
          >
            Settings
          </button>
          <button onClick={logout} className="rounded-full bg-blush-50 px-3.5 py-1.5 text-xs font-extrabold text-blush-500" aria-label="Log out">
            <LogOut size={14} />
          </button>
        </div>
      </div>

      {/* Main */}
      <main className="min-w-0 flex-1 px-4 pb-16 pt-20 sm:px-6 lg:ml-64 lg:px-10 lg:pt-8">
        <div className="mx-auto max-w-6xl">
          {tab === 'tasks' ? (
            <>
              {/* Greeting */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <p className="text-sm font-extrabold uppercase tracking-widest text-blush-400">{today}</p>
                <h1 className="font-display text-3xl font-extrabold text-slate-700 sm:text-4xl">
                  {greeting()}, <span className="text-gradient">{user?.name?.split(' ')[0]}</span>!
                </h1>
                <p className="mt-1 text-sm font-semibold text-slate-400">
                  {stats.pending === 0 && stats.total > 0
                    ? 'Everything is done — go enjoy your day ✨'
                    : stats.pending > 0
                      ? `You have ${stats.pending} little task${stats.pending === 1 ? '' : 's'} waiting` +
                        (progress >= 70 ? ' — almost there!' : '')
                      : 'Let\'s plant some tasks together 🌱'}
                </p>
              </motion.div>

              {/* Stats */}
              <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard icon={ListTodo} label="Total tasks" value={stats.total} gradient="from-lav-400 to-lav-300" delay={0} />
                <StatCard icon={CheckCircle2} label="Completed" value={stats.completed} gradient="from-mint-400 to-mint-300" delay={0.08} />
                <StatCard icon={Clock} label="Pending" value={stats.pending} gradient="from-peach-400 to-peach-300" delay={0.16} />
                <StatCard icon={TrendingUp} label="Progress" value={progress} suffix="%" gradient="from-blush-400 to-sky2-400" delay={0.24} />
              </div>

              {/* Progress bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="glass mb-8 rounded-3xl p-5"
              >
                <div className="mb-2 flex items-center justify-between">
                  <p className="flex items-center gap-2 text-sm font-extrabold text-slate-600">
                    <Sparkles size={15} className="text-peach-400" /> Daily sparkle progress
                  </p>
                  <p className="text-sm font-extrabold text-blush-500">{progress}%</p>
                </div>
                <div className="h-4 overflow-hidden rounded-full bg-blush-50">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-blush-300 via-lav-300 to-sky2-300"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>

              {/* Toolbar */}
              <div className="mb-6 space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-blush-300" />
                    <input
                      className="input-cute pl-11"
                      placeholder="Search your tasks…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <select className="input-cute w-auto cursor-pointer" value={catFilter} onChange={(e) => setCatFilter(e.target.value as TaskCategory | 'all')}>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c === 'all' ? 'All categories' : CATEGORY_META[c].emoji + ' ' + CATEGORY_META[c].label}</option>
                      ))}
                    </select>
                    <select className="input-cute w-auto cursor-pointer" value={priFilter} onChange={(e) => setPriFilter(e.target.value as TaskPriority | 'all')}>
                      {PRIORITIES.map((p) => (
                        <option key={p} value={p}>{p === 'all' ? 'All priorities' : p[0].toUpperCase() + p.slice(1)}</option>
                      ))}
                    </select>
                    <select className="input-cute hidden w-auto cursor-pointer sm:block" value={sort} onChange={(e) => setSort(e.target.value)}>
                      {SORTS.map((s) => (
                        <option key={s.v} value={s.v}>Sort: {s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {(['all', 'pending', 'completed'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setShowDone(f)}
                      className={`rounded-full px-4 py-1.5 text-xs font-extrabold capitalize transition-all active:scale-95 ${
                        showDone === f ? 'bg-gradient-to-r from-blush-400 to-lav-400 text-white shadow-glow' : 'bg-white/70 text-slate-500 hover:bg-blush-50'
                      }`}
                    >
                      {f === 'all' ? 'All' : f}
                    </button>
                  ))}
                  <button
                    onClick={() => { setEditing(null); setModalOpen(true); }}
                    className="ml-auto flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blush-400 to-lav-400 px-5 py-2 text-sm font-bold text-white shadow-glow transition-all hover:scale-105 active:scale-95"
                  >
                    <Plus size={16} strokeWidth={3} /> New task
                  </button>
                </div>
              </div>

              {/* Task list */}
              {loading ? (
                <Spinner label="Fetching your sparkle…" />
              ) : visibleTasks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass flex flex-col items-center rounded-4xl px-6 py-14 text-center"
                >
                  <Mascot size={140} className="mb-2" />
                  <h3 className="font-display text-xl font-bold text-slate-600">
                    {search || catFilter !== 'all' || priFilter !== 'all' ? 'No matches found' : 'A cozy, empty space'}
                  </h3>
                  <p className="mt-1 max-w-xs text-sm font-semibold text-slate-400">
                    {search || catFilter !== 'all' || priFilter !== 'all'
                      ? 'Try widening your filters — magic hides everywhere.'
                      : 'Plant your first task and watch your world come alive 🌱'}
                  </p>
                  {!search && catFilter === 'all' && priFilter === 'all' && (
                    <button
                      onClick={() => setModalOpen(true)}
                      className="mt-5 flex items-center gap-2 rounded-full bg-gradient-to-r from-blush-400 to-lav-400 px-6 py-3 text-sm font-bold text-white shadow-glow transition hover:scale-105"
                    >
                      <Plus size={16} strokeWidth={3} /> Add your first task
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.div layout className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {visibleTasks.map((t, i) => (
                      <TaskCard
                        key={t._id}
                        task={t}
                        index={i}
                        onToggle={toggleTask}
                        onEdit={(task) => { setEditing(task); setModalOpen(true); }}
                        onDelete={setDeleting}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </>
          ) : (
            /* SETTINGS TAB */
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h1 className="font-display text-3xl font-extrabold text-slate-700">Profile & settings</h1>
                <p className="mt-1 text-sm font-semibold text-slate-400">Make CuteVerse feel like yours.</p>
              </div>

              <div className="glass rounded-4xl p-6 sm:p-8">
                <h2 className="mb-5 font-display text-xl font-bold text-slate-700">Your profile</h2>
                <div className="flex items-center gap-4">
                  {avatar ? (
                    <img src={avatar} alt="avatar" className="h-16 w-16 rounded-full border-4 border-white object-cover shadow-card" />
                  ) : (
                    <span className="grid h-16 w-16 place-items-center rounded-full border-4 border-white bg-gradient-to-br from-sky2-300 to-lav-300 font-display text-2xl font-extrabold text-white shadow-card">
                      {initial}
                    </span>
                  )}
                  <div>
                    <p className="font-display text-lg font-bold text-slate-700">{user?.name}</p>
                    <p className="text-sm font-semibold text-slate-400">{user?.email}</p>
                    <p className="mt-0.5 text-xs font-bold text-slate-300">
                      Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : ''}
                    </p>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-slate-400">Display name</label>
                    <input className="input-cute" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-slate-400">
                      <Camera size={11} className="mr-1 inline" /> Avatar image URL (optional)
                    </label>
                    <input className="input-cute" value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://…" />
                  </div>
                </div>
              </div>

              <div className="glass rounded-4xl p-6 sm:p-8">
                <h2 className="mb-5 flex items-center gap-2 font-display text-xl font-bold text-slate-700">
                  <Palette size={20} className="text-lav-400" /> Theme
                </h2>
                <div className="grid gap-3 sm:grid-cols-3">
                  {(
                    [
                      { id: 'pastel', name: 'Pastel Dream', desc: 'Soft pinks & lavenders', swatch: 'from-blush-300 via-lav-200 to-sky2-200' },
                      { id: 'light', name: 'Cloud White', desc: 'Clean & bright', swatch: 'from-white to-blush-100' },
                      { id: 'dark', name: 'Midnight Cocoa', desc: 'Cozy dark mode', swatch: 'from-slate-700 via-slate-800 to-[#2d2646]' },
                    ] as const
                  ).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`overflow-hidden rounded-3xl border-2 p-1 text-left transition-all active:scale-95 ${
                        theme === t.id ? 'border-blush-400 shadow-glow' : 'border-transparent hover:border-blush-200'
                      }`}
                    >
                      <div className={`mb-2 h-16 rounded-2xl bg-gradient-to-br ${t.swatch}`} />
                      <p className="px-2 pb-2 font-display text-sm font-bold text-slate-700">{t.name}</p>
                      <p className="px-2 pb-1 text-[11px] font-semibold text-slate-400">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={saveProfile}
                  disabled={savingProfile}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blush-400 to-lav-400 px-7 py-3 text-sm font-bold text-white shadow-glow transition hover:scale-105 active:scale-95 disabled:opacity-60"
                >
                  <Sparkles size={15} /> {savingProfile ? 'Saving…' : 'Save changes'}
                </button>
                <button
                  onClick={async () => { await logout(); }}
                  className="flex items-center gap-2 rounded-full bg-blush-50 px-7 py-3 text-sm font-bold text-blush-500 transition hover:bg-blush-100 active:scale-95"
                >
                  <LogOut size={15} /> Log out
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Task modal */}
      <TaskFormModal
        open={modalOpen}
        initial={editing}
        loading={false}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSubmit={saveTask}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleting}
        title="Delete this task?"
        message={`"${deleting?.title}" will be gently removed from your world.`}
        confirmLabel="Delete"
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 350, damping: 26 }}
            className={`fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 rounded-full px-6 py-3 font-display text-sm font-bold text-white shadow-glow ${
              toast.ok ? 'bg-gradient-to-r from-mint-400 to-mint-500' : 'bg-gradient-to-r from-blush-400 to-blush-500'
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

