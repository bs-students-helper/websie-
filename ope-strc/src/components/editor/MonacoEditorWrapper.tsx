import React, { useRef, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';

interface MonacoEditorWrapperProps {
  value: string;
  onChange: (newValue: string) => void;
  language: string;
  fileName?: string;
  fontSize?: number;
  theme?: 'vs-dark' | 'light';
  onRun?: () => void;
  onSubmit?: () => void;
  onSave?: () => void;
}

export const MonacoEditorWrapper: React.FC<MonacoEditorWrapperProps> = ({
  value,
  onChange,
  language,
  fileName = 'FClass.java',
  fontSize = 14,
  theme = 'vs-dark',
  onRun,
  onSubmit,
  onSave,
}) => {
  const editorRef = useRef<any>(null);

  // Map language string to Monaco editor language
  const monacoLanguage = language === 'sql' ? 'sql' : language === 'python' ? 'python' : 'java';

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Configure editor settings
    editor.updateOptions({
      fontSize,
      tabSize: 4,
      insertSpaces: true,
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
      fontLigatures: true,
      lineNumbers: 'on',
      folding: true,
      bracketPairColorization: { enabled: true },
      formatOnPaste: true,
      formatOnType: true,
    });

    // Intercept keyboard shortcuts inside editor
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (onSave) onSave();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (onRun) onRun();
    });

    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter,
      () => {
        if (onSubmit) onSubmit();
      }
    );

    // Decorate "// Write your code here" lines with distinct styling
    const applyCodeDecorations = () => {
      const model = editor.getModel();
      if (!model) return;
      const matches = model.findMatches('Write your code here', false, false, false, null, true);
      const decorations = matches.map((m: any) => ({
        range: m.range,
        options: {
          isWholeLine: true,
          className: 'bg-emerald-500/10 dark:bg-emerald-500/20 border-l-4 border-emerald-500 font-bold',
          glyphMarginClassName: 'text-emerald-400 font-bold',
        },
      }));
      editor.deltaDecorations([], decorations);
    };

    applyCodeDecorations();
    editor.onDidChangeModelContent(applyCodeDecorations);
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({ fontSize });
    }
  }, [fontSize]);

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 overflow-hidden relative">
      {/* File tab banner above editor */}
      <div className="h-9 bg-slate-800 dark:bg-slate-900 border-b border-slate-700/60 px-4 flex items-center justify-between text-xs text-slate-300 font-mono select-none">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          <span className="font-semibold text-slate-200">{fileName}</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="hidden sm:inline">Ctrl+S: Save</span>
          <span className="hidden sm:inline">Ctrl+Enter: Run</span>
          <span className="hidden sm:inline">Ctrl+Shift+Enter: Submit</span>
        </div>
      </div>

      {/* Editor component */}
      <div className="flex-1 w-full h-full">
        <Editor
          height="100%"
          language={monacoLanguage}
          theme={theme}
          value={value}
          onChange={(val) => onChange(val || '')}
          onMount={handleEditorDidMount}
          loading={
            <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-400 text-sm">
              Loading IDE Editor...
            </div>
          }
        />
      </div>
    </div>
  );
};
