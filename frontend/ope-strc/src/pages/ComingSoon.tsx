import React, { useState } from 'react';
import {
  Code2,
  Sparkles,
  Rocket,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Bell,
  Terminal,
  Cpu,
  Layers,
  ShieldAlert,
  Home,
  Calculator,
  Gamepad2,
  Sun,
  Moon,
} from 'lucide-react';

export const ComingSoon: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(() => {
    return localStorage.getItem('oppe_notify_subscribed') === 'true';
  });
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('bsh-theme') as 'dark' | 'light') || 'dark';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('bsh-theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    localStorage.setItem('oppe_notify_subscribed', 'true');
    localStorage.setItem('oppe_notify_email', email);
    setSubscribed(true);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-[#0F0D13] text-[#F7F5F8]' : 'bg-[#F8EFE6] text-[#231815]'} flex flex-col font-sans transition-colors duration-300`}>
      {/* Top Navbar */}
      <header className="h-16 bg-[#FFF9F5]/90 dark:bg-[#17141E]/90 backdrop-blur-md border-b border-[#EADACD] dark:border-white/10 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-3 group">
            <img
              src="/assets/images/logo.png"
              alt="BSH Logo"
              className="h-8 sm:h-9 w-auto object-contain group-hover:scale-105 transition-transform"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '../assets/images/logo.png';
              }}
            />
            <div>
              <span className="font-extrabold text-[#231815] dark:text-[#F7F5F8] text-sm sm:text-base leading-tight block">
                OPPE Practice Lab
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-[#E65527] dark:text-[#FF7E54] tracking-wider uppercase block">
                BS Students Helper
              </span>
            </div>
          </a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-[#EADACD] dark:border-white/10 bg-[#FFF9F5] dark:bg-[#1E1A28] text-slate-700 dark:text-slate-200 hover:scale-105 transition-all"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
          <a
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-[#E65527]/10 hover:bg-[#E65527]/20 text-[#D84C1E] dark:text-[#FF7E54] font-semibold text-xs sm:text-sm rounded-xl border border-[#E65527]/30 transition-all"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">BSH Home</span>
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center space-y-10">
        
        {/* Banner Card */}
        <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 border border-[#E65527]/30 bg-gradient-to-br from-[#FFF9F5] via-[#FCEEE3] to-[#F7E2D3] dark:from-[#1E1A28] dark:via-[#17141E] dark:to-[#0F0D13] shadow-2xl">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#E65527]/20 dark:bg-[#FF6B3B]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6 max-w-3xl">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E65527]/15 dark:bg-[#FF7E54]/20 border border-[#E65527]/40 dark:border-[#FF7E54]/40 text-[#D84C1E] dark:text-[#FF7E54] text-xs font-bold uppercase tracking-wider animate-pulse">
              <Rocket className="w-4 h-4" />
              <span>Under Active Development • OPPE Practice Lab 2.0</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Something <span className="bg-gradient-to-r from-[#E65527] to-[#C43B0E] dark:from-[#FF7E54] dark:to-[#FF6B3B] bg-clip-text text-transparent">Amazing</span> is Coding Behind the Scenes!
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              We are currently upgrading the Online Proctored Programming Exam (OPPE) practice platform for IIT Madras BS students. The lab is receiving high-speed sandbox execution, authentic three-panel IDEs, and 90-minute timed mock exams.
            </p>

            {/* Subscription / Notification Form */}
            <div className="pt-2">
              {subscribed ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-3 text-sm font-semibold max-w-md">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>You're registered! We'll notify you as soon as OPPE Lab 2.0 goes live.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-stretch gap-3 max-w-md">
                  <div className="relative flex-1">
                    <Bell className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your IITM Roll No or Email..."
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#120F18] border border-[#EADACD] dark:border-white/15 rounded-xl text-sm outline-none focus:border-[#E65527] dark:focus:border-[#FF7E54] transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-[#E65527] to-[#C43B0E] dark:from-[#FF7E54] dark:to-[#FF6B3B] hover:opacity-95 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Get Notified</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Feature Roadmap Showcase */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#E65527] dark:text-[#FF7E54]" />
              What's Coming in OPPE Lab 2.0
            </h2>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Release Roadmap</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Feature 1 */}
            <div className="p-5 rounded-2xl bg-[#FFF9F5] dark:bg-[#1E1A28] border border-[#EADACD] dark:border-white/10 hover:border-[#E65527] dark:hover:border-[#FF7E54] transition-all space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#E65527]/10 dark:bg-[#FF7E54]/15 flex items-center justify-center text-[#E65527] dark:text-[#FF7E54]">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base">Multi-Language Sandbox</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Python 3.11, Java 17, and SQL query execution engines powered by isolated sandbox containers.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-5 rounded-2xl bg-[#FFF9F5] dark:bg-[#1E1A28] border border-[#EADACD] dark:border-white/10 hover:border-[#E65527] dark:hover:border-[#FF7E54] transition-all space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base">Timed OPPE Simulator</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Authentic 90-minute exam timer, problem status matrix, and real-time score calculation.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-5 rounded-2xl bg-[#FFF9F5] dark:bg-[#1E1A28] border border-[#EADACD] dark:border-white/10 hover:border-[#E65527] dark:hover:border-[#FF7E54] transition-all space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base">Output Diff Visualizer</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Line-by-line expected vs actual output diffing with whitespace & newline normalization.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-5 rounded-2xl bg-[#FFF9F5] dark:bg-[#1E1A28] border border-[#EADACD] dark:border-white/10 hover:border-[#E65527] dark:hover:border-[#FF7E54] transition-all space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base">Smart Non-Spoiler Hints</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Contextual error hints for exception handling, array boundaries, and formatting pitfalls.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Navigation Section */}
        <div className="pt-4 border-t border-[#EADACD] dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 text-center sm:text-left">
            In the meantime, check out our active student tools:
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <a
              href="/quiz_practice.html"
              className="flex items-center gap-2 px-4 py-2.5 bg-[#FFF9F5] dark:bg-[#1E1A28] hover:bg-[#F3EAE1] dark:hover:bg-[#252033] border border-[#EADACD] dark:border-white/10 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Gamepad2 className="w-4 h-4 text-[#E65527] dark:text-[#FF7E54]" />
              <span>Practice Quizzes</span>
            </a>
            <a
              href="/calculator.html"
              className="flex items-center gap-2 px-4 py-2.5 bg-[#FFF9F5] dark:bg-[#1E1A28] hover:bg-[#F3EAE1] dark:hover:bg-[#252033] border border-[#EADACD] dark:border-white/10 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Calculator className="w-4 h-4 text-indigo-500" />
              <span>SEC Calculator</span>
            </a>
            <a
              href="/"
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#E65527] to-[#C43B0E] dark:from-[#FF7E54] dark:to-[#FF6B3B] text-white rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Portal</span>
            </a>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-[#EADACD] dark:border-white/10 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>© 2026 BS Students Helper (BSH). Built for IIT Madras BS Data Science & Electronic Systems Students.</p>
      </footer>
    </div>
  );
};

export default ComingSoon;
