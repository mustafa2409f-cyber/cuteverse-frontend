import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth, apiError } from '../context/AuthContext';
import Mascot from '../components/Mascot';
import FloatingHearts from '../components/FloatingHearts';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in both fields 💌');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      if (remember) localStorage.setItem('cv_remember', '1');
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
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blush-200/60 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-lav-200/60 blur-3xl" />
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
            Welcome back, <span className="text-gradient">friend</span>!
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-400">Your tasks missed you.</p>
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

          <h1 className="font-display text-3xl font-extrabold text-slate-700">Log in</h1>
          <p className="mt-1 text-sm font-semibold text-slate-400">Step back into your magical world.</p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-slate-400">Email</label>
              <div className="relative">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-blush-300" />
                <input
                  type="email"
                  className="input-cute pl-11"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-slate-400">Password</label>
              <div className="relative">
                <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-lav-300" />
                <input
                  type={show ? 'text' : 'password'}
                  className="input-cute pl-11 pr-11"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blush-400"
                  aria-label="Toggle password visibility"
                >
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-slate-500">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded accent-blush-400"
                />
                Remember me
              </label>
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
              <Sparkles size={17} /> {loading ? 'Sparkling in…' : 'Enter CuteVerse'}
              <ArrowRight size={17} />
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm font-semibold text-slate-400">
            New here?{' '}
            <Link to="/register" className="font-extrabold text-blush-500 transition hover:text-blush-400">
              Create an account ✿
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
