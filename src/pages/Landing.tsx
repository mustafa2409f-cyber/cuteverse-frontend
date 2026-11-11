import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, Heart, Star, CheckCircle2, Search, Filter, BarChart3,
  Palette, Bell, ShieldCheck, ArrowRight, Wand2, ListChecks,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Mascot from '../components/Mascot';
import FloatingHearts from '../components/FloatingHearts';
import { useAuth } from '../context/AuthContext';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: 'easeOut' as const },
  }),
};

const FEATURES = [
  { icon: ListChecks, title: 'Cute task cards', desc: 'Every task gets a pastel card with priority, category & due date — delightful to check off.', color: 'from-blush-400 to-blush-300', bg: 'bg-blush-50' },
  { icon: Filter, title: 'Smart filters', desc: 'Search, filter by category or priority, and sort however feels right today.', color: 'from-lav-400 to-lav-300', bg: 'bg-lav-50' },
  { icon: BarChart3, title: 'Progress magic', desc: 'Animated stats show your completion rate and keep motivation sparkling.', color: 'from-sky2-400 to-sky2-300', bg: 'bg-sky2-50' },
  { icon: Palette, title: 'Pastel themes', desc: 'Switch between light, dark and pastel modes — your vibe, your rules.', color: 'from-peach-400 to-peach-300', bg: 'bg-peach-50' },
  { icon: Bell, title: 'Gentle reminders', desc: 'Due dates and overdue nudges wrapped in the softest UI hugs.', color: 'from-mint-400 to-mint-300', bg: 'bg-mint-50' },
  { icon: ShieldCheck, title: 'Safe & secure', desc: 'JWT auth, hashed passwords, refresh tokens — your data stays yours.', color: 'from-blush-400 to-lav-400', bg: 'bg-blush-50' },
];

const STEPS = [
  { n: '1', title: 'Create your account', desc: 'A name, an email, a password — poof, your magical world appears.' },
  { n: '2', title: 'Add your first tasks', desc: 'Title, category, priority, due date. It takes ten seconds.' },
  { n: '3', title: 'Watch progress bloom', desc: 'Check tasks off, watch the bar fill, feel the joy.' },
];

function DemoCard() {
  const demoTasks = [
    { title: 'Stretch & smile ☀️', cat: 'Health', done: true },
    { title: 'Finish design mockups', cat: 'Work', done: false },
    { title: 'Read 10 pages 📖', cat: 'Study', done: false },
  ];
  return (
    <div className="glass w-full max-w-md rounded-4xl p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-display text-lg font-bold text-slate-700">Today&apos;s sparkle</p>
        <span className="rounded-full bg-mint-100 px-3 py-1 text-xs font-extrabold text-mint-600">67%</span>
      </div>
      <div className="mb-4 h-3 overflow-hidden rounded-full bg-blush-50">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-mint-300 to-mint-400"
          initial={{ width: 0 }}
          whileInView={{ width: '67%' }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }}
        />
      </div>
      <div className="space-y-2.5">
        {demoTasks.map((t, i) => (
          <motion.div
            key={t.title}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + i * 0.15 }}
            className="flex items-center gap-3 rounded-2xl bg-white/80 p-3 shadow-sm"
          >
            <span className={`grid h-6 w-6 place-items-center rounded-full border-2 ${t.done ? 'border-mint-400 bg-mint-300 text-white' : 'border-blush-200'}`}>
              {t.done && <CheckCircle2 size={14} />}
            </span>
            <span className={`flex-1 text-sm font-bold ${t.done ? 'text-slate-400 line-through' : 'text-slate-600'}`}>{t.title}</span>
            <span className="rounded-full bg-lav-50 px-2 py-0.5 text-[10px] font-extrabold text-lav-500">{t.cat}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen overflow-x-clip">
      {/* Animated gradient blobs */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-blush-200/50 blur-3xl" />
        <div className="absolute top-40 -right-40 h-[480px] w-[480px] rounded-full bg-lav-200/50 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[380px] w-[380px] rounded-full bg-sky2-200/50 blur-3xl" />
        <div className="absolute top-24 left-1/4 h-40 w-40 animate-drift rounded-full bg-white/40 blur-xl" style={{ animationDuration: '80s' }} />
        <div className="absolute top-64 right-1/4 h-56 w-56 animate-drift rounded-full bg-white/30 blur-xl" style={{ animationDuration: '95s', animationDelay: '-30s' }} />
      </div>
      <FloatingHearts />

      <Navbar />

      {/* HERO */}
      <section className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 pb-20 pt-10 lg:grid-cols-2 lg:pt-16">
        <div>
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-blush-200 bg-white/70 px-4 py-1.5 text-xs font-extrabold text-blush-500 shadow-card backdrop-blur">
            <Sparkles size={13} className="text-peach-400" /> A magical productivity world
          </motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-slate-700 sm:text-6xl lg:text-7xl">
            Your tasks,
            <br />
            but <span className="text-gradient">make them cute</span>
            <br />
            <Heart size={44} className="mb-2 inline-block fill-blush-400 text-blush-400" />
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="mt-6 max-w-md text-lg font-semibold leading-relaxed text-slate-500">
            CuteVerse turns productivity into a pastel playground — adorable tasks, animated progress,
            and a dashboard that feels like a hug.
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to={user ? '/dashboard' : '/register'}
              className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-blush-400 to-lav-400 px-8 py-4 font-display text-lg font-bold text-white shadow-glow transition-all hover:scale-105 hover:shadow-soft active:scale-95"
            >
              {user ? 'Go to dashboard' : 'Start Your Journey'}
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#features"
              className="rounded-full border-2 border-lav-200 bg-white/70 px-8 py-4 font-display text-lg font-bold text-lav-500 backdrop-blur transition-all hover:bg-lav-50 hover:scale-105 active:scale-95"
            >
              Explore Features
            </a>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
            className="mt-8 flex items-center gap-6 text-sm font-bold text-slate-400">
            <span className="flex items-center gap-1.5"><Star size={15} className="fill-peach-300 text-peach-300" /> 10k+ happy users</span>
            <span className="flex items-center gap-1.5"><Heart size={15} className="fill-blush-300 text-blush-300" /> 100% cute</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
          className="relative flex flex-col items-center gap-6"
        >
          <Mascot size={260} className="drop-shadow-2xl" />
          <DemoCard />
        </motion.div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative mx-auto max-w-7xl px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="mb-2 text-sm font-extrabold uppercase tracking-widest text-blush-400">✿ Features ✿</p>
          <h2 className="font-display text-4xl font-extrabold text-slate-700 sm:text-5xl">
            Everything you need, <span className="text-gradient">nothing you don&apos;t</span>
          </h2>
        </motion.div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.08, duration: 0.55 }}
              whileHover={{ y: -8, rotate: i % 2 ? 1 : -1 }}
              className="glass group rounded-4xl p-6 transition-shadow hover:shadow-soft"
            >
              <div className={`mb-4 inline-grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${f.color} text-white shadow-glow transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                <f.icon size={22} />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-700">{f.title}</h3>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-500">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="glass rounded-[2.5rem] p-8 sm:p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center"
          >
            <p className="mb-2 text-sm font-extrabold uppercase tracking-widest text-lav-400">✿ How it works ✿</p>
            <h2 className="font-display text-4xl font-extrabold text-slate-700">Three tiny steps</h2>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="relative rounded-4xl border border-white/70 bg-white/70 p-6 text-center shadow-card"
              >
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-blush-300 to-lav-300 font-display text-2xl font-extrabold text-white shadow-glow">
                  {s.n}
                </div>
                <h3 className="font-display text-lg font-bold text-slate-700">{s.title}</h3>
                <p className="mt-2 text-sm font-semibold text-slate-500">{s.desc}</p>
                {i < 2 && (
                  <ArrowRight className="absolute -right-4 top-1/2 hidden -translate-y-1/2 text-blush-300 md:block" size={22} />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-7xl px-6 py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blush-300 via-lav-300 to-sky2-300 p-10 text-center shadow-glow sm:p-16"
        >
          <div className="absolute inset-0 opacity-30" aria-hidden>
            {Array.from({ length: 14 }).map((_, i) => (
              <Star key={i} size={10 + (i % 3) * 6} className="absolute text-white" style={{ left: `${(i * 71) % 100}%`, top: `${(i * 37) % 100}%` }} />
            ))}
          </div>
          <div className="relative">
            <Wand2 className="mx-auto mb-4 text-white" size={40} />
            <h2 className="font-display text-4xl font-extrabold text-white drop-shadow sm:text-5xl">
              Ready to enter your cute universe?
            </h2>
            <p className="mx-auto mt-4 max-w-md font-semibold text-white/90">
              Join CuteVerse today — free forever, infinitely adorable.
            </p>
            <Link
              to={user ? '/dashboard' : '/register'}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-10 py-4 font-display text-lg font-bold text-blush-500 shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              {user ? 'Open dashboard' : 'Start Your Journey'} <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
