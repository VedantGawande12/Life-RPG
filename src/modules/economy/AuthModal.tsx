import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, ShieldCheck, Sparkles, AlertCircle, LogOut, CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../core/supabaseClient';
import { useGameState } from '../core/GameStateContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, signOut, profile } = useGameState();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      setSuccessMessage('Covenant severed. Walking as Pilgrim.');
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1000);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to sever covenant.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!isSupabaseConfigured || !supabase) {
      setSuccessMessage('Supabase credentials unconfigured. Running in interactive Demo Mode with local state persistence.');
      setTimeout(() => onClose(), 1500);
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username: username.trim() || 'Hero' }
          }
        });
        if (error) throw error;
        setSuccessMessage('Oath recorded. Verify your email to commune.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setSuccessMessage('Welcome back, Champion.');
        setTimeout(() => onClose(), 1000);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
      <div
        className="relative w-full max-w-md bg-[#070a10] border border-white/15 p-6 sm:p-8 shadow-2xl space-y-4"
        role="dialog"
        aria-modal="true"
      >
        {/* Corner Accents */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-amber-500/40" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-amber-500/40" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-amber-500/40" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-amber-500/40" />

        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <div className="text-[9px] font-mono tracking-[0.3em] text-sanctum-ash uppercase">
              SANCTUM COVENANT
            </div>
            <h2 className="text-xl font-serif tracking-widest text-slate-100 font-bold uppercase">
              {currentUser ? 'Covenant Sealed' : isSignUp ? 'Inscribe Champion' : 'Sanctuary Communion'}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close authentication dialog"
            className="p-1 text-slate-500 hover:text-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Messages */}
        {errorMessage && (
          <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-serif tracking-wider uppercase flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-serif tracking-wider uppercase flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {currentUser ? (
          /* Active Signed-In Covenant State */
          <div className="space-y-4 py-2">
            <div className="p-4 bg-[#04060a] border border-amber-500/40 rounded-sm space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-mono tracking-widest text-emerald-300 uppercase font-semibold">
                    ACTIVE COVENANT
                  </span>
                </div>
                <span className="text-[9px] font-mono text-stone-500 uppercase">
                  SOUL LEVEL {profile.level}
                </span>
              </div>

              <div className="text-sm font-serif tracking-wide text-slate-100 font-bold">
                {currentUser.username || profile.username}
              </div>

              <div className="text-xs font-mono text-amber-200/80">
                {currentUser.email || 'champion@realm.archive'}
              </div>

              <div className="text-[9px] font-mono text-stone-500 truncate pt-1 border-t border-white/[0.06]">
                UID: {currentUser.id}
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleSignOut}
                disabled={loading}
                className="w-full py-2.5 border border-red-500/60 text-red-300 bg-red-950/30 hover:bg-red-900/40 text-[9px] font-serif tracking-[0.25em] uppercase transition cursor-pointer font-bold flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{loading ? 'Severing...' : 'Sever Covenant (Sign Out)'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 border border-amber-500/30 text-stone-400 hover:text-stone-200 text-[9px] font-serif tracking-[0.2em] uppercase transition cursor-pointer"
              >
                Return to Sanctuary [ESC]
              </button>
            </div>
          </div>
        ) : (
          /* Sign In / Sign Up Form */
          <>
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {isSignUp && (
                <div>
                  <label className="block text-[9px] font-serif tracking-[0.2em] text-slate-400 uppercase mb-1 font-bold">
                    Champion Epithet
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. Edaran Voss"
                      className="w-full pl-9 pr-4 py-2 bg-[#030508] border border-white/15 text-slate-100 placeholder-slate-600 text-xs focus:outline-none focus:border-amber-400 font-sans transition"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[9px] font-serif tracking-[0.2em] text-slate-400 uppercase mb-1 font-bold">
                  Oracle Scroll (Email)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="champion@realm.archive"
                    className="w-full pl-9 pr-4 py-2 bg-[#030508] border border-white/15 text-slate-100 placeholder-slate-600 text-xs focus:outline-none focus:border-amber-400 font-sans transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-serif tracking-[0.2em] text-slate-400 uppercase mb-1 font-bold">
                  Secret Cipher (Password)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2 bg-[#030508] border border-white/15 text-slate-100 placeholder-slate-600 text-xs focus:outline-none focus:border-amber-400 font-sans transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 border border-amber-500/80 text-amber-200 bg-amber-950/40 hover:bg-amber-900/60 text-[9px] font-serif tracking-[0.25em] uppercase transition cursor-pointer font-bold disabled:opacity-50 shadow-md"
              >
                {loading ? 'Communing...' : isSignUp ? 'Inscribe Covenant' : 'Commune with Realm'}
              </button>
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[10px] text-amber-400/80 hover:text-amber-200 font-serif tracking-wider uppercase transition cursor-pointer"
              >
                {isSignUp ? 'Existing Champion? Enter Sanctuary' : "No Inscription? Inscribe New Champion"}
              </button>
            </div>

            {/* Demo Mode Bypass */}
            <div className="pt-2 border-t border-white/10 text-center">
              <button
                type="button"
                onClick={onClose}
                className="text-[9px] font-serif tracking-widest uppercase text-sanctum-ash hover:text-slate-300 flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Walk as Pilgrim (Guest Demo Mode)</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
