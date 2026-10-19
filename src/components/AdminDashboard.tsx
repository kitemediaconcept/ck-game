import React, { useState } from 'react';
import { GameStats, CorporateEnquiry } from '../types/campaign';
import { CorekraftLogo } from './CorekraftLogo';
import {
  X,
  Lock,
  BarChart3,
  Users,
  Trophy,
  Clock,
  Compass,
  Download,
  Trash2,
  CheckCircle,
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  enquiries: CorporateEnquiry[];
  onClearStats: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  stats,
  enquiries,
  onClearStats,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passkeyInput, setPasskeyInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'analytics' | 'enquiries'>('analytics');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkeyInput === 'corekraft2026' || passkeyInput === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect organizer passkey. (Hint: corekraft2026)');
    }
  };

  const exportEnquiriesCsv = () => {
    if (enquiries.length === 0) return;
    const headers = ['ID,Name,Email,Company,Team Size,Budget,Delivery Date,Submitted At,Notes'];
    const rows = enquiries.map((enq) =>
      `"${enq.id}","${enq.name}","${enq.email}","${enq.company}","${enq.teamSize}","${enq.budgetPerHamper}","${enq.deliveryDate}","${enq.submittedAt}","${(enq.notes || '').replace(/"/g, '""')}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Corekraft_Gifting_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const winRate =
    stats.puzzleStarts > 0
      ? Math.round((stats.challengeWins / stats.puzzleStarts) * 100)
      : 0;

  const avgMoves =
    stats.puzzleStarts > 0
      ? Math.round(stats.totalMovesMade / (stats.challengeWins + stats.timeouts || 1))
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close admin dashboard"
        >
          <X className="w-5 h-5" />
        </button>

        {!isAuthenticated ? (
          <div className="max-w-md mx-auto py-8 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center">
              <Lock className="w-6 h-6 text-[#FF4A68]" />
            </div>

            <CorekraftLogo className="h-7 mx-auto mb-3" theme="dark" />

            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Organizer & Campaign Analytics
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Enter the authorized organizer passkey to review live gameplay telemetry, engagement metrics, and corporate gifting leads.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={passkeyInput}
                  onChange={(e) => setPasskeyInput(e.target.value)}
                  placeholder="Enter Passkey (corekraft2026)"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-center text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#FF4A68] focus:ring-1 focus:ring-[#FF4A68]"
                />
                {authError && <p className="text-xs text-red-500 mt-2">{authError}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Access Organizer Console
              </button>
            </form>
          </div>
        ) : (
          <div>
            {/* Authenticated Dashboard Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="w-4 h-4 text-[#FF4A68]" />
                  <span className="text-xs font-bold text-[#FF4A68] uppercase tracking-wider">
                    mycorekraft.com Console
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Christmas Box Analytics & Leads
                </h3>
              </div>

              {/* Tab Navigation */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'analytics'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Gameplay Metrics
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('enquiries')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeTab === 'enquiries'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <span>Leads</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 text-[#FF4A68] font-bold">
                    {enquiries.length}
                  </span>
                </button>
              </div>
            </div>

            {activeTab === 'analytics' ? (
              <div className="space-y-6">
                {/* Primary Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Puzzle Starts
                    </span>
                    <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                      {stats.puzzleStarts}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Challenge Wins
                    </span>
                    <span className="text-2xl font-extrabold text-[#FF4A68] font-mono tabular-nums">
                      {stats.challengeWins}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold ml-1">({winRate}% win rate)</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Timeouts (0s)
                    </span>
                    <span className="text-2xl font-extrabold text-amber-600 font-mono tabular-nums">
                      {stats.timeouts}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Practice Runs
                    </span>
                    <span className="text-2xl font-extrabold text-slate-700 font-mono tabular-nums">
                      {stats.practiceSessions}
                    </span>
                  </div>
                </div>

                {/* Secondary Telemetry Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium block">Fastest Solve</span>
                      <span className="text-base font-bold text-slate-900 font-mono">
                        {stats.bestTimeSeconds !== null ? `${stats.bestTimeSeconds} seconds` : '—'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#FF4A68]" />
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium block">Hints Triggered</span>
                      <span className="text-base font-bold text-slate-900 font-mono">
                        {stats.hintsUsedCount} hints
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                    <Compass className="w-5 h-5 text-blue-500" />
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium block">Avg Moves / Game</span>
                      <span className="text-base font-bold text-slate-900 font-mono">
                        {avgMoves > 0 ? `${avgMoves} moves` : '—'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reset Action */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-100 text-xs">
                  <span className="text-slate-400">
                    Tracks challenge completions, easy/standard games, and enquiry leads.
                  </span>
                  <button
                    onClick={() => {
                      if (confirm('Reset all gameplay telemetry counters?')) {
                        onClearStats();
                      }
                    }}
                    type="button"
                    className="flex items-center gap-1.5 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Reset Telemetry</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-600">
                    {enquiries.length} corporate gifting proposals submitted.
                  </p>
                  {enquiries.length > 0 && (
                    <button
                      onClick={exportEnquiriesCsv}
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export to CSV</span>
                    </button>
                  )}
                </div>

                {enquiries.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200">
                    <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-700 font-medium">No enquiries recorded yet.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Lead submissions from “Plan My Corporate Gifts” will appear here with one-click CSV export.
                    </p>
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto space-y-3 pr-1">
                    {enquiries.map((enq) => (
                      <div
                        key={enq.id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-bold text-slate-900 text-sm">{enq.company}</span>
                            <span className="text-slate-500 block">{enq.name} · {enq.email}</span>
                          </div>
                          <span className="font-mono text-[10px] text-[#FF4A68] bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 font-bold">
                            {enq.id}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 py-1 text-[11px] border-y border-slate-200 text-slate-700">
                          <div>
                            <span className="text-slate-400 block">Team Size:</span>
                            <span className="font-semibold text-slate-900">{enq.teamSize}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Budget:</span>
                            <span className="font-semibold text-[#FF4A68]">{enq.budgetPerHamper}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Target Date:</span>
                            <span className="font-semibold text-slate-900">{enq.deliveryDate}</span>
                          </div>
                        </div>

                        {enq.notes && (
                          <div className="text-slate-600 italic bg-white p-2.5 rounded-xl border border-slate-100">
                            "{enq.notes}"
                          </div>
                        )}

                        <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                          <span>Received: {new Date(enq.submittedAt).toLocaleString()}</span>
                          <span className="text-emerald-600 font-medium flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Ready for Quotation
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
