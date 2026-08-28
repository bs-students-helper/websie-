import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  FileCode,
  CheckCircle2,
  Code2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Filter,
  Play,
  Award,
  Clock,
  Layers,
} from 'lucide-react';
import { SUBJECTS } from '../data/subjects';
import { filterProblems } from '../data/problems';
import { Problem } from '../types/problem';

export const SubjectOPPEPage: React.FC = () => {
  const { subjectId } = useParams<{ subjectId?: string }>();
  const navigate = useNavigate();

  // Active Subject
  const currentSubject = SUBJECTS.find((s) => s.id === subjectId) || SUBJECTS[0];

  // Active OPPE Tab: OPPE 1 or OPPE 2
  const [oppeType, setOppeType] = useState<'oppe1' | 'oppe2'>('oppe1');

  // Filters
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedSet, setSelectedSet] = useState<string>('All');

  // Question Set Dropdown Open State
  const [openSetDropdown, setOpenSetDropdown] = useState<string | null>(null);

  // Collapsed / Expanded Paper Sets state (default false -> hidden by default)
  const [expandedSets, setExpandedSets] = useState<{ [key: string]: boolean }>({});

  const toggleSetExpand = (groupTitle: string) => {
    setExpandedSets((prev) => ({
      ...prev,
      [groupTitle]: !prev[groupTitle],
    }));
  };

  // Filter problems by subject, OPPE type, year, set
  const filteredProblems = filterProblems({
    subjectId: currentSubject.id,
    oppeType,
    year: selectedYear,
    setName: selectedSet,
  });

  // Group problems by Year & Set to display structured Question Paper sets (3-4 problems each)
  const setGroups: { [key: string]: Problem[] } = {};
  filteredProblems.forEach((prob) => {
    const groupKey = `${prob.year || '2024'} - ${prob.term || 'Term 1'} (${prob.setName || 'Set 1'})`;
    if (!setGroups[groupKey]) {
      setGroups[groupKey] = [];
    }
    setGroups[groupKey].push(prob);
  });

  return (
    <div className="min-h-screen bg-[#F8EFE6] dark:bg-[#0F0D13] text-[#231815] dark:text-[#F7F5F8] flex flex-col bsh-bg-grid transition-colors">
      {/* Top Main Navbar */}
      <header className="h-16 bg-[#FFF9F5] dark:bg-[#17141E] border-b border-[#EADACD] dark:border-white/10 px-6 flex items-center justify-between shadow-sm flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-xl text-[#685952] dark:text-[#BBB3C5] hover:bg-[#F3EAE1] dark:hover:bg-[#252033] transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <img
            src="/assets/images/logo.png"
            alt="BSH Logo"
            className="h-8 w-auto object-contain cursor-pointer hover:scale-105 transition-transform"
            onClick={() => window.location.href = '/'}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '../assets/images/logo.png';
            }}
          />
          <div className="hidden sm:block">
            <h1 className="font-extrabold text-[#231815] dark:text-[#F7F5F8] text-base leading-tight">
              {currentSubject.name} OPPE Vault
            </h1>
            <p className="text-xs font-bold text-[#E65527] dark:text-[#FF7E54]">
              {currentSubject.code} • IITM BS Data Science
            </p>
          </div>
        </div>

        {/* Subject Switcher Pills moved into Main Top Navbar */}
        <div className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
          {SUBJECTS.map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(`/subject/${s.id}`)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                s.id === currentSubject.id
                  ? 'bg-[#E65527]/15 dark:bg-[#FF6B3B]/20 text-[#E65527] dark:text-[#FF7E54] border-[#E65527]/40 shadow-sm'
                  : 'bg-[#F3EAE1]/50 dark:bg-[#252033]/50 text-[#685952] dark:text-[#BBB3C5] border-transparent hover:bg-[#F3EAE1]'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-[#E65527]/10 hover:bg-[#E65527]/20 text-[#D84C1E] dark:text-[#FF7E54] font-semibold text-xs rounded-xl border border-[#E65527]/30 transition-all"
          >
            <span>BSH Main Portal</span>
          </a>
        </div>
      </header>

      {/* Sub-Header Bar: ONLY OPPE 1 & OPPE 2 Question Papers Tabs */}
      <div className="bg-[#FFF9F5] dark:bg-[#17141E] border-b border-[#EADACD] dark:border-white/10 px-4 py-2.5 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          {/* OPPE 1 & OPPE 2 Selector Buttons */}
          <div className="flex items-center gap-1 p-1 bg-[#F3EAE1] dark:bg-[#252033] rounded-xl border border-[#EADACD] dark:border-white/10">
            <button
              onClick={() => setOppeType('oppe1')}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-extrabold transition-all ${
                oppeType === 'oppe1'
                  ? 'bg-gradient-to-r from-[#E65527] to-[#C43B0E] dark:from-[#FF6B3B] dark:to-[#E04E1F] text-white shadow-md'
                  : 'text-[#685952] dark:text-[#BBB3C5] hover:text-[#231815] dark:hover:text-[#F7F5F8]'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>OPPE 1 Question Papers</span>
            </button>

            <button
              onClick={() => setOppeType('oppe2')}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-extrabold transition-all ${
                oppeType === 'oppe2'
                  ? 'bg-gradient-to-r from-[#E65527] to-[#C43B0E] dark:from-[#FF6B3B] dark:to-[#E04E1F] text-white shadow-md'
                  : 'text-[#685952] dark:text-[#BBB3C5] hover:text-[#231815] dark:hover:text-[#F7F5F8]'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>OPPE 2 Question Papers</span>
            </button>
          </div>

          {/* Subject Switcher for Mobile Screens */}
          <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-0.5">
            {SUBJECTS.map((s) => (
              <button
                key={s.id}
                onClick={() => navigate(`/subject/${s.id}`)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                  s.id === currentSubject.id
                    ? 'bg-[#E65527]/15 dark:bg-[#FF6B3B]/20 text-[#E65527] dark:text-[#FF7E54] border-[#E65527]/40'
                    : 'bg-[#F3EAE1]/50 dark:bg-[#252033]/50 text-[#685952] dark:text-[#BBB3C5] border-transparent'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Body Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-6">

        {/* Question Paper Sets Display */}
        {Object.keys(setGroups).length === 0 ? (
          <div className="bg-[#FFF9F5] dark:bg-[#1E1A28] p-12 text-center rounded-2xl border border-[#EADACD] dark:border-white/10 space-y-3">
            <BookOpen className="w-10 h-10 text-[#685952] dark:text-[#BBB3C5] mx-auto" />
            <h4 className="font-extrabold text-[#231815] dark:text-[#F7F5F8] text-base">
              No Question Papers Found
            </h4>
            <p className="text-xs text-[#685952] dark:text-[#BBB3C5]">
              Try adjusting your Year or Paper Set filter selection.
            </p>
          </div>
        ) : (
          Object.keys(setGroups).map((groupTitle) => {
            const problemsInSet = setGroups[groupTitle];
            const isExpanded = !!expandedSets[groupTitle];

            return (
              <div
                key={groupTitle}
                className="bg-[#FFF9F5] dark:bg-[#1E1A28] rounded-2xl border border-[#EADACD] dark:border-white/10 shadow-sm overflow-hidden space-y-0 transition-all duration-300"
              >
                {/* Paper Header Strip */}
                <div
                  onClick={() => toggleSetExpand(groupTitle)}
                  className="bg-[#F3EAE1] dark:bg-[#252033] px-6 py-4 border-b border-[#EADACD] dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none hover:bg-[#EADACD]/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="bsh-pill-badge">
                      <span className="bsh-badge-dot"></span>
                      <span>IITM Official OPPE Paper</span>
                    </div>
                    <h3 className="font-extrabold text-base text-[#231815] dark:text-[#F7F5F8]">
                      {currentSubject.name} — {oppeType.toUpperCase()} ({groupTitle})
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-semibold text-[#685952] dark:text-[#BBB3C5] flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#E65527] dark:text-[#FF7E54]" />
                      120 Mins Exam
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-[#E65527] dark:text-[#FF7E54]" />
                      {problemsInSet.length} Problems
                    </span>

                    {/* Expand / Collapse Toggle Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSetExpand(groupTitle);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-[#E65527] to-[#C43B0E] dark:from-[#FF6B3B] dark:to-[#E04E1F] text-white rounded-xl text-xs font-extrabold shadow-sm hover:opacity-95 transition-all"
                    >
                      <span>{isExpanded ? 'Hide Problems' : 'Show Problems'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* 3 to 10 Problems Grid in the Set (Shown when expanded) */}
                {isExpanded && (
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                    {problemsInSet.map((prob, idx) => (
                      <div
                        key={prob.id}
                        onClick={() => navigate(`/practice/${prob.id}`)}
                        className="bg-[#F8EFE6]/60 dark:bg-[#0F0D13]/60 p-5 rounded-xl border border-[#EADACD] dark:border-white/10 hover:border-[#E65527] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-white bg-[#E65527] dark:bg-[#FF6B3B] px-2 py-0.5 rounded">
                              Problem {prob.setProblemNumber || idx + 1}
                            </span>
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#FFF9F5] dark:bg-[#1E1A28] border border-[#EADACD] dark:border-white/10 text-[#685952] dark:text-[#BBB3C5]">
                              {prob.difficulty}
                            </span>
                          </div>

                          <h4 className="font-extrabold text-sm text-[#231815] dark:text-[#F7F5F8] group-hover:text-[#E65527] dark:group-hover:text-[#FF7E54] transition-colors">
                            {prob.title}
                          </h4>

                          <p className="text-xs text-[#685952] dark:text-[#BBB3C5] line-clamp-2 leading-relaxed">
                            {prob.description}
                          </p>
                        </div>

                        <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#E65527] dark:text-[#FF7E54]">
                          <span className="text-[11px] text-[#685952] dark:text-[#BBB3C5]">Topic: {prob.topic}</span>
                          <div className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            <span>Solve in IDE</span>
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </main>
    </div>
  );
};
