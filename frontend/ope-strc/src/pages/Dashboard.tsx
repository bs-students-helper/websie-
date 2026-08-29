import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code2,
  BookOpen,
  ArrowRight,
  Sparkles,
  ChevronRight,
  FileCode,
  Database,
  Network,
} from 'lucide-react';
import { ALL_PROBLEMS } from '../data/problems';
import { SUBJECTS } from '../data/subjects';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return <Code2 className="w-6 h-6 text-[#E65527] dark:text-[#FF7E54]" />;
      case 'FileCode':
        return <FileCode className="w-6 h-6 text-[#E65527] dark:text-[#FF7E54]" />;
      case 'Database':
        return <Database className="w-6 h-6 text-[#E65527] dark:text-[#FF7E54]" />;
      default:
        return <Network className="w-6 h-6 text-[#E65527] dark:text-[#FF7E54]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8EFE6] dark:bg-[#0F0D13] text-[#231815] dark:text-[#F7F5F8] flex flex-col bsh-bg-grid transition-colors">
      {/* Top Navbar */}
      <header className="h-16 bg-[#FFF9F5] dark:bg-[#17141E] border-b border-[#EADACD] dark:border-white/10 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src="/assets/images/logo.png"
            alt="BSH Logo"
            className="h-9 w-auto object-contain cursor-pointer hover:scale-105 transition-transform"
            onClick={() => window.location.href = '/'}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '../assets/images/logo.png';
            }}
          />
          <div>
            <h1 className="font-extrabold text-[#231815] dark:text-[#F7F5F8] text-base leading-tight">OPPE Practice Lab</h1>
            <p className="text-xs font-bold text-[#E65527] dark:text-[#FF7E54]">IIT Madras BS Data Science</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-[#E65527]/10 hover:bg-[#E65527]/20 text-[#D84C1E] dark:text-[#FF7E54] font-semibold text-xs rounded-xl border border-[#E65527]/30 transition-all"
          >
            <span>Back to BSH Portal</span>
          </a>
          <button
            onClick={() => navigate('/subject/java')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#E65527] to-[#C43B0E] dark:from-[#FF6B3B] dark:to-[#E04E1F] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <span>OPPE Question Papers</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Welcome Header Banner */}
        <div className="bg-gradient-to-r from-[#E65527] via-[#D84C1E] to-[#231815] dark:from-[#FF6B3B] dark:via-[#E04E1F] dark:to-[#17141E] text-white rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden border border-[#E65527]/30">
          <div className="relative z-10 space-y-3 max-w-2xl">
            <div className="bsh-pill-badge !bg-white/15 !border-white/30 !text-white">
              <span className="bsh-badge-dot !bg-white !shadow-[0_0_8px_#ffffff]"></span>
              <span>OPPE 1 & OPPE 2 Examination Prep</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome back, IITM BS Student! 👋
            </h2>
            <p className="text-sm text-amber-50/90 leading-relaxed font-medium">
              Select your subject below to explore official OPPE 1 & OPPE 2 question paper sets with interactive live IDE testing.
            </p>
          </div>

          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12">
            <Code2 className="w-96 h-96 text-white" />
          </div>
        </div>

        {/* Subject Cards Section */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-[#231815] dark:text-[#F7F5F8] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#E65527] dark:text-[#FF7E54]" />
              Select Course Subject
            </h3>
            <span className="text-xs font-semibold text-[#685952] dark:text-[#BBB3C5]">
              Choose a subject to view OPPE 1 & 2 Question Papers
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SUBJECTS.map((subj) => {
              const subjProblems = ALL_PROBLEMS.filter((p) => p.subjectId === subj.id);

              return (
                <div
                  key={subj.id}
                  onClick={() => navigate(`/subject/${subj.id}`)}
                  className="bg-[#FFF9F5] dark:bg-[#1E1A28] p-6 rounded-2xl border border-[#EADACD] dark:border-white/10 shadow-sm hover:border-[#E65527] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-[#E65527]/10 dark:bg-[#FF6B3B]/15 flex items-center justify-center">
                        {getSubjectIcon(subj.iconName)}
                      </div>
                      <span className="text-xs font-mono font-bold text-[#E65527] dark:text-[#FF7E54] bg-[#E65527]/10 dark:bg-[#FF6B3B]/15 px-2.5 py-1 rounded-md">
                        {subj.code}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-[#231815] dark:text-[#F7F5F8] text-base group-hover:text-[#E65527] dark:group-hover:text-[#FF7E54] transition-colors">
                        {subj.name}
                      </h4>
                      <p className="text-xs text-[#685952] dark:text-[#BBB3C5] line-clamp-2 mt-1 leading-relaxed">
                        {subj.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#EADACD]/60 dark:border-white/10 flex items-center justify-between text-xs font-bold text-[#E65527] dark:text-[#FF7E54]">
                    <span>{subjProblems.length} OPPE Practice Questions</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};
