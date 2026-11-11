import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles, Check, X } from 'lucide-react';
import { useAuth, apiError } from '../context/AuthContext';
import Mascot from '../components/Mascot';
import FloatingHearts from '../components/FloatingHearts';

function strength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-zA-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
  if (pw.length >= 12 || /[^a-zA-Z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: 'Weak', color: 'bg-blush-400' };
  if (score === 2) return { score, label: 'Nice', color: 'bg-peach-400' };
  return { score, label: 'Strong', color: 'bg-mint-400' };
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const s = strength(password);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (name.trim().length < 2) return setError('Please tell us your name (2+ characters) 💌');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('That email looks a little off');
    if (password.length < 8) return setError('Password needs at least 8 characters');
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) return setError('Password needs a letter and a number');
    if (password !== confirm) return setError('Passwords do not match');
    setLoading(true);
    try {
      await register(name.trim(), email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-lav-200/60 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-sky2-200/60 blur-3xl" />
      </div>
      <FloatingHearts density="low" />

      <div className="relative grid w-full max-w-4xl gap-8 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden flex-col items-center justify-center lg:flex"
        >
          <Mascot size={240} />
          <p className="mt-4 font-display text-2xl font-bold text-slate-600">
            A whole universe is <span className="text-gradient">waiting</span>
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-400">for your tiny tasks.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass w-full rounded-4xl p-8 shadow-card"
        >
          <Link to="/" className="mb-6 flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-blush-400 to-lav-400 text-white shadow-glow">
              <Heart size={16} className="fill-white" />
            </span>
            <span className="font-display text-xl font-bold text-gradient">CuteVerse</span>
          </Link>

          <h1 className="font-display text-3xl font-extrabold text-slate-700">Create account</h1>
          <p className="mt-1 text-sm font-semibold text-slate-400">Plant the seed of your productivity garden.</p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-slate-400">Full name</label>
              <div className="relative">
                <User size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky2-400" />
                <input className="input-cute pl-11" placeholder="Mochi Mochi" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-slate-400">Email</label>
              <div className="relative">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-blush-300" />
                <input type="email" className="input-cute pl-11" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-slate-400">Password</label>
              <div className="relative">
                <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-lav-300" />
                <input
                  type={show ? 'text' : 'password'}
                  className="input-cute pl-11 pr-11"
                  placeholder="8+ chars, letter & number"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blush-400" aria-label="Toggle password visibility">
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {password && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2">
                  <div className="flex gap-1.5">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= s.score ? s.color : 'bg-blush-100'}`} />
                    ))}
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-xs font-bold text-slate-400">
                    {s.score >= 2 ? <Check size={12} className="text-mint-500" /> : <X size={12} className="text-blush-400" />}
                    Password strength: <span className={s.score >= 2 ? 'text-mint-500' : 'text-blush-500'}>{s.label}</span>
                  </p>
                </motion.div>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-slate-400">Confirm password</label>
              <div className="relative">
                <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-peach-400" />
                <input
                  type={show ? 'text' : 'password'}
                  className="input-cute pl-11"
                  placeholder="Repeat your password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              {confirm && password !== confirm && (
                <p className="mt-1 text-xs font-bold text-blush-500">Passwords don&apos;t match yet</p>
              )}
            </div>

            {error && (
              <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-blush-50 px-4 py-2.5 text-sm font-bold text-blush-500">
                {error}
              </motion.p>
            )}

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blush-400 to-lav-400 px-6 py-3.5 font-display text-base font-bold text-white shadow-glow transition-all hover:scale-[1.02] hover:shadow-soft disabled:opacity-60"
            >
              <Sparkles size={17} /> {loading ? 'Growing your world…' : 'Create my world'}
              <ArrowRight size={17} />
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm font-semibold text-slate-400">
            Already a friend?{' '}
            <Link to="/login" className="font-extrabold text-blush-500 transition hover:text-blush-400">
              Log in ✿
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
