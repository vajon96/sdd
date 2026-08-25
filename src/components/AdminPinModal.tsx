import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, X, KeyRound } from 'lucide-react';

interface AdminPinModalProps {
  isOpen: boolean;
  isAdmin: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onDeactivate: () => void;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  isOpen,
  isAdmin,
  onClose,
  onSuccess,
  onDeactivate
}) => {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default system admin PIN is 1234 or 2025
    if (pin === '1234' || pin === '2025' || pin === 'admin') {
      onSuccess();
      setPin('');
      setError(null);
      onClose();
    } else {
      setError('Incorrect Admin Security PIN. (Hint: default is 1234)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="max-w-sm w-full p-6 rounded-2xl bg-slate-900 border border-white/15 shadow-2xl space-y-4 text-white">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              {isAdmin ? 'Admin Mode Active' : 'Officer PIN Verification'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-white/5 text-white/60 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isAdmin ? (
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin privileges currently unlocked. You have full edit/delete rights.</span>
            </div>
            <button
              onClick={() => {
                onDeactivate();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 font-bold"
            >
              Lock / Deactivate Admin Mode
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <p className="text-white/60 leading-relaxed">
              Enter authorized Platoon Commander or Adjutant PIN to perform record modifications, cadet deletions, and data resets.
            </p>

            <div>
              <input
                type="password"
                maxLength={8}
                autoFocus
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(null);
                }}
                placeholder="Enter 4-digit PIN (default: 1234)"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-center text-lg font-mono tracking-widest text-amber-300 focus:outline-none focus:border-amber-400"
              />
              {error && <p className="text-red-400 text-[11px] mt-1.5 text-center">{error}</p>}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-white/10 text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold"
              >
                Unlock Access
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
