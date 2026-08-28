import React from 'react';
import { Modal } from '../common/Modal';
import { Sliders, Monitor, Type, Server } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fontSize: number;
  onFontSizeChange: (newSize: number) => void;
  editorTheme: 'vs-dark' | 'light';
  onEditorThemeChange: (theme: 'vs-dark' | 'light') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  fontSize,
  onFontSizeChange,
  editorTheme,
  onEditorThemeChange,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="IDE & Lab Settings"
      footer={
        <button
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors"
        >
          Save & Close
        </button>
      }
    >
      <div className="space-y-6">
        {/* Editor Theme setting */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Monitor className="w-4 h-4 text-indigo-500" />
            <span>Monaco Editor Theme</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onEditorThemeChange('vs-dark')}
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                editorTheme === 'vs-dark'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>Dark IDE (vs-dark)</span>
              <span className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700" />
            </button>

            <button
              onClick={() => onEditorThemeChange('light')}
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                editorTheme === 'light'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>Light IDE</span>
              <span className="w-3 h-3 rounded-full bg-white border border-slate-300" />
            </button>
          </div>
        </div>

        {/* Font Size setting */}
        <div className="space-y-2">
          <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-indigo-500" />
              <span>Editor Font Size ({fontSize}px)</span>
            </div>
          </label>
          <input
            type="range"
            min={12}
            max={22}
            value={fontSize}
            onChange={(e) => onFontSizeChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        {/* Execution API info */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
            <Server className="w-4 h-4 text-emerald-500" />
            <span>Code Execution Engine</span>
          </div>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Connected to <strong>Piston Public Execution Engine</strong> (https://emkc.org/api/v2/piston). Supports Java 15+, Python 3.10+, and SQL. Fallbacks gracefully to Demo Mode if offline.
          </p>
        </div>
      </div>
    </Modal>
  );
};
