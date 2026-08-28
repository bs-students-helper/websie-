import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ArrowRight, ArrowLeft, CheckCircle2, Bookmark } from 'lucide-react';
import { ALL_PROBLEMS, filterProblems } from '../data/problems';
import { SUBJECTS } from '../data/subjects';
import { Badge } from '../components/common/Badge';
import { getProgress, getBookmarks } from '../utils/storage';

export const ProblemsPage: React.FC = () => {
  const navigate = useNavigate();
  const progress = getProgress();
  const bookmarks = getBookmarks();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = filterProblems({
    subjectId: selectedSubjectId === 'All' ? undefined : selectedSubjectId,
    topic: selectedTopic,
    difficulty: selectedDifficulty,
    searchQuery,
  });

  return (
    <div className="min-h-screen bg-[#F8EFE6] dark:bg-[#0F0D13] text-[#231815] dark:text-[#F7F5F8] flex flex-col bsh-bg-grid transition-colors">
      {/* Header */}
      <header className="h-16 bg-[#FFF9F5] dark:bg-[#17141E] border-b border-[#EADACD] dark:border-white/10 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg text-[#685952] dark:text-[#BBB3C5] hover:bg-[#F3EAE1] dark:hover:bg-[#252033] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="font-extrabold text-base text-[#231815] dark:text-[#F7F5F8]">
            Problem Catalog ({filtered.length})
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-6">
        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search problem title, topic, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Subject Filter Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 outline-none"
            >
              <option value="All">All Subjects</option>
              {SUBJECTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 outline-none"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Problems List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((prob) => {
            const isSolved = progress[prob.id]?.solved;
            const isBookmarked = bookmarks.includes(prob.id);

            return (
              <div
                key={prob.id}
                onClick={() => navigate(`/practice/${prob.id}`)}
                className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                        {prob.subject}
                      </span>
                      {isSolved && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Solved
                        </span>
                      )}
                    </div>
                    <Badge variant="difficulty" difficulty={prob.difficulty}>
                      {prob.difficulty}
                    </Badge>
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 transition-colors flex items-center justify-between">
                    <span>{prob.title}</span>
                    {isBookmarked && (
                      <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500" />
                    )}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{prob.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-medium text-slate-600 dark:text-slate-400">
                      {prob.topic}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform">
                    Solve <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
