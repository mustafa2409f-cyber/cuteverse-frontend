import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Menu, X, LayoutDashboard, LogOut, User as UserIcon, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="sticky top-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mt-3 flex items-center justify-between rounded-full border border-white/60 bg-white/70 px-5 py-3 shadow-card backdrop-blur-xl">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-blush-400 to-lav-400 text-white shadow-glow">
              <Heart size={18} className="fill-white" />
            </span>
            <span className="font-display text-xl font-bold text-gradient">CuteVerse</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {[
              { to: '/', label: 'Home' },
              { to: '/#features', label: 'Features' },
              { to: '/#how', label: 'How it works' },
            ].map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-bold transition-all hover:bg-blush-50 ${
                    isActive ? 'text-blush-500' : 'text-slate-600'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full border border-blush-100 bg-white/80 py-1.5 pl-1.5 pr-4 transition hover:shadow-soft"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-sky2-300 to-lav-300 text-sm font-extrabold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="max-w-[110px] truncate text-sm font-bold text-slate-700">{user.name}</span>
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 mt-2 w-52 overflow-hidden rounded-3xl border border-white/70 bg-white/95 p-2 shadow-card backdrop-blur-xl"
                    >
                      <Link
                        to="/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-blush-50 hover:text-blush-500"
                      >
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                      <Link
                        to="/dashboard?tab=settings"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-blush-50 hover:text-blush-500"
                      >
                        <UserIcon size={16} /> Profile & Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-left text-sm font-bold text-blush-500 transition hover:bg-blush-50"
                      >
                        <LogOut size={16} /> Log out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-blush-50"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="group flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blush-400 to-lav-400 px-5 py-2.5 text-sm font-bold text-white shadow-glow transition-all hover:scale-105 hover:shadow-soft active:scale-95"
                >
                  <Sparkles size={15} /> Get started
                </Link>
              </>
            )}
          </div>

          <button
            className="grid h-10 w-10 place-items-center rounded-full bg-blush-50 text-blush-500 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 rounded-3xl border border-white/60 bg-white/90 p-3 shadow-card backdrop-blur-xl md:hidden"
            >
              {[
                { to: '/', label: 'Home' },
                { to: '/#features', label: 'Features' },
                { to: '/#how', label: 'How it works' },
              ].map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-blush-50"
                >
                  {l.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 text-sm font-bold text-blush-500 hover:bg-blush-50">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="block w-full rounded-2xl px-4 py-3 text-left text-sm font-bold text-blush-500 hover:bg-blush-50">
                    Log out
                  </button>
                </>
              ) : (
                <div className="mt-2 flex gap-2 px-1">
                  <Link to="/login" onClick={() => setOpen(false)} className="flex-1 rounded-full bg-blush-50 px-4 py-2.5 text-center text-sm font-bold text-slate-600">
                    Log in
                  </Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="flex-1 rounded-full bg-gradient-to-r from-blush-400 to-lav-400 px-4 py-2.5 text-center text-sm font-bold text-white">
                    Get started
                  </Link>
                </div>
              )}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
