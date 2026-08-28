import React, { useState, useRef, useEffect } from 'react';
import { FileText, Code2 } from 'lucide-react';

interface ResizableLayoutProps {
  questionPanel: React.ReactNode;
  editorPanel: React.ReactNode;
}

export const ResizableLayout: React.FC<ResizableLayoutProps> = ({
  questionPanel,
  editorPanel,
}) => {
  // Mobile tab state
  const [mobileTab, setMobileTab] = useState<'question' | 'code'>('code');

  // Desktop panel left width percentage (default 45%)
  const [leftWidth, setLeftWidth] = useState(45);

  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalWidth = rect.width;
      const mouseX = e.clientX - rect.left;
      const newLeftPct = Math.max(25, Math.min(75, (mouseX / totalWidth) * 100));
      setLeftWidth(newLeftPct);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden relative">
      {/* Mobile Adaptive Navigation Bar (< md screens) */}
      <div className="md:hidden flex items-center justify-around bg-[#FFF9F5] dark:bg-[#17141E] border-b border-[#EADACD] dark:border-white/10 text-xs font-semibold p-1.5 z-20">
        <button
          onClick={() => setMobileTab('question')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-colors ${
            mobileTab === 'question'
              ? 'bg-[#E65527] dark:bg-[#FF6B3B] text-white'
              : 'text-[#685952] dark:text-[#BBB3C5] hover:text-[#231815] dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Question & Tests</span>
        </button>

        <button
          onClick={() => setMobileTab('code')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-colors ${
            mobileTab === 'code'
              ? 'bg-[#E65527] dark:bg-[#FF6B3B] text-white'
              : 'text-[#685952] dark:text-[#BBB3C5] hover:text-[#231815] dark:hover:text-white'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Code Editor</span>
        </button>
      </div>

      {/* Mobile View Container */}
      <div className="md:hidden flex-1 overflow-hidden">
        {mobileTab === 'question' && questionPanel}
        {mobileTab === 'code' && editorPanel}
      </div>

      {/* Desktop 2-Column Resizable Container (>= md screens) */}
      <div className="hidden md:flex flex-1 w-full h-full overflow-hidden select-none">
        {/* Left Panel: Question / Test Cases / Solution */}
        <div style={{ width: `${leftWidth}%` }} className="h-full overflow-hidden flex-shrink-0">
          {questionPanel}
        </div>

        {/* Drag Handle */}
        <div
          onMouseDown={startDrag}
          className="w-1.5 hover:w-2 bg-[#EADACD] dark:bg-white/10 hover:bg-[#E65527] dark:hover:bg-[#FF6B3B] cursor-col-resize transition-all h-full z-10 flex items-center justify-center group"
          title="Drag to resize panels"
        >
          <div className="w-0.5 h-6 rounded-full bg-[#685952] dark:bg-[#BBB3C5] group-hover:bg-white" />
        </div>

        {/* Right Panel: Code Editor */}
        <div
          style={{ width: `${100 - leftWidth}%` }}
          className="h-full overflow-hidden flex-1"
        >
          {editorPanel}
        </div>
      </div>
    </div>
  );
};
