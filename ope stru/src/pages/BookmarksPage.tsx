import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, ArrowRight, ArrowLeft, Code2 } from 'lucide-react';
import { ALL_PROBLEMS } from '../data/problems';
import { getBookmarks } from '../utils/storage';
import { Badge } from '../components/common/Badge';

export const BookmarksPage: React.FC = () => {
  const navigate = useNavigate();
  const bookmarkedIds = getBookmarks();
  const bookmarkedProblems = ALL_PROBLEMS.filter((p) => bookmarkedIds.includes(p.id));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Header */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 font-bold text-base text-slate-900 dark:text-white">
            <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>Bookmarked Problems</span>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-8 space-y-6">
        {bookmarkedProblems.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-500 mx-auto flex items-center justify-center">
              <Bookmark className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No Bookmarked Problems Yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click the bookmark icon in the IDE header while solving any problem to save it here for quick revision.
            </p>
            <button
              onClick={() => navigate('/practice/java-exception-001')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2"
            >
              <Code2 className="w-4 h-4" />
              <span>Browse Problems</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookmarkedProblems.map((prob) => (
              <div
                key={prob.id}
                onClick={() => navigate(`/practice/${prob.id}`)}
                className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                      {prob.subject}
                    </span>
                    <Badge variant="difficulty" difficulty={prob.difficulty}>
                      {prob.difficulty}
                    </Badge>
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 transition-colors">
                    {prob.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{prob.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                  <span>Topic: {prob.topic}</span>
                  <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform">
                    Practice <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
