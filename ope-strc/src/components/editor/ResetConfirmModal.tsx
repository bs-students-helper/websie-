import React from 'react';
import { Modal } from '../common/Modal';
import { AlertTriangle } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reset Code Confirmation"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-sm transition-colors"
          >
            Reset Code
          </button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-200">
            Reset code to the original starter code?
          </p>
          <p className="text-xs text-slate-500 mt-1">
            All your current edits for this problem will be discarded. This action cannot be undone.
          </p>
        </div>
      </div>
    </Modal>
  );
};
