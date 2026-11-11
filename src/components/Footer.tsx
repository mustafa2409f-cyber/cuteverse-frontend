import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/60 bg-white/50 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-6 py-10 text-center">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-blush-400 to-lav-400 text-white">
            <Heart size={14} className="fill-white" />
          </span>
          <span className="font-display text-lg font-bold text-gradient">CuteVerse</span>
        </div>
        <p className="text-sm font-semibold text-slate-400">
          Made with love &amp; sparkles · Your magical productivity world
        </p>
        <p className="text-xs font-semibold text-slate-300">© {new Date().getFullYear()} CuteVerse. All tasks are cute.</p>
      </div>
    </footer>
  );
}
