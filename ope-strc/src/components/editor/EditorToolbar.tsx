import React from 'react';
import { Play, CheckCircle, RotateCcw, Loader2 } from 'lucide-react';

interface EditorToolbarProps {
  onRun: () => void;
  onSubmit: () => void;
  onReset: () => void;
  isRunning: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onRun,
  onSubmit,
  onReset,
  isRunning,
}) => {
  return (
    <div className="h-12 bg-[#FFF9F5] dark:bg-[#17141E] border-t border-[#EADACD] dark:border-white/10 px-4 flex items-center justify-between text-xs select-none">
      {/* Left toolbar action: Reset */}
      <button
        onClick={onReset}
        disabled={isRunning}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[#685952] dark:text-[#BBB3C5] hover:text-[#231815] dark:hover:text-white hover:bg-[#F3EAE1] dark:hover:bg-[#252033] disabled:opacity-50 transition-colors border border-[#EADACD] dark:border-white/10 font-semibold"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset</span>
      </button>

      {/* Right toolbar actions: Run & Submit */}
      <div className="flex items-center gap-2.5">
        {/* Run Button */}
        <button
          onClick={onRun}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#E65527] to-[#C43B0E] dark:from-[#FF6B3B] dark:to-[#E04E1F] hover:opacity-95 text-white font-bold shadow-md disabled:opacity-50 transition-all active:scale-95"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Running...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run ▶</span>
            </>
          )}
        </button>

        {/* Submit Button */}
        <button
          onClick={onSubmit}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md disabled:opacity-50 transition-all active:scale-95"
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Submit ✓</span>
        </button>
      </div>
    </div>
  );
};
