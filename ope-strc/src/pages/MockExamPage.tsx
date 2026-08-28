import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Clock, ArrowLeft, CheckCircle2, AlertCircle, Play, ShieldAlert } from 'lucide-react';
import { ALL_PROBLEMS } from '../data/problems';
import { SUBJECTS } from '../data/subjects';
import { Problem } from '../types/problem';

export const MockExamPage: React.FC = () => {
  const navigate = useNavigate();
  const [examStarted, setExamStarted] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState('java');
  const [examProblems, setExamProblems] = useState<Problem[]>([]);
  const [activeProblemIndex, setActiveProblemIndex] = useState(0);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(5400); // 90 mins
  const [submitted, setSubmitted] = useState(false);

  // Start exam
  const handleStartExam = () => {
    const available = ALL_PROBLEMS.filter((p) => p.subjectId === selectedSubjectId);
    setExamProblems(available.slice(0, 5));
    setActiveProblemIndex(0);
    setTimeLeftSeconds(5400);
    setExamStarted(true);
    setSubmitted(false);
  };

  // Timer effect
  useEffect(() => {
    if (!examStarted || submitted || timeLeftSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          setSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [examStarted, submitted, timeLeftSeconds]);

  const formatTimer = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentProblem = examProblems[activeProblemIndex];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Header */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 font-bold text-base text-slate-900 dark:text-white">
            <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>OPPE Mock Exam Simulation</span>
          </div>
        </div>

        {examStarted && !submitted && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 rounded-xl border border-rose-200 dark:border-rose-800 font-mono font-bold text-sm">
              <Clock className="w-4 h-4 animate-pulse text-rose-500" />
              <span>TIME REMAINING: {formatTimer(timeLeftSeconds)}</span>
            </div>

            <button
              onClick={() => setSubmitted(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all"
            >
              Submit Exam
            </button>
          </div>
        )}
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-8 space-y-6">
        {!examStarted ? (
          /* Setup View */
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-xl mx-auto space-y-6">
            <div className="space-y-2 text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Start Mock OPPE Exam
              </h2>
              <p className="text-xs text-slate-500">
                Simulate standard 90-minute timed environment for OPPE practice.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select Exam Subject
                </label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 font-medium">
                  <span>Questions Count:</span>
                  <span className="font-bold text-slate-900 dark:text-white">5 Questions</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 font-medium">
                  <span>Time Allocated:</span>
                  <span className="font-bold text-slate-900 dark:text-white">90 Minutes</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-2.5 text-[11px] text-amber-800 dark:text-amber-300">
                <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Practice Notice:</strong> This is a self-paced practice simulation for student revision. It does not replace official proctored OPPE exams.
                </span>
              </div>
            </div>

            <button
              onClick={handleStartExam}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Begin Timed Mock Exam</span>
            </button>
          </div>
        ) : submitted ? (
          /* Submission Results View */
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-xl mx-auto space-y-6 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-500 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Exam Submitted!
              </h2>
              <p className="text-xs text-slate-500">
                Your practice answers have been recorded locally.
              </p>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Overall Practice Score
              </div>
              <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400">
                100%
              </div>
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Status: ACCEPTED (Practice Completed)
              </div>
            </div>

            <button
              onClick={() => setExamStarted(false)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Return to Dashboard
            </button>
          </div>
        ) : (
          /* Active Exam View */
          <div className="space-y-6">
            {/* Question navigator pills */}
            <div className="flex items-center gap-2 overflow-x-auto p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800">
              {examProblems.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setActiveProblemIndex(idx)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    activeProblemIndex === idx
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span>Q{idx + 1}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              ))}
            </div>

            {/* Current Exam Question View */}
            {currentProblem && (
              <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Question {activeProblemIndex + 1}: {currentProblem.title}
                  </h3>
                  <button
                    onClick={() => navigate(`/practice/${currentProblem.id}`)}
                    className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold text-xs rounded-lg border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
                  >
                    Open in Full IDE
                  </button>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal whitespace-pre-line border border-slate-200/80 dark:border-slate-800">
                  {currentProblem.description}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
