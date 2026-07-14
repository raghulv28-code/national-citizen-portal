import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { Play, Pause, ChevronRight, UserCheck, AlertTriangle, ArrowRightLeft, Users, CheckCircle, RefreshCw, Landmark, AlertCircle, Sparkles } from 'lucide-react';
import { Token, Counter } from '../types';

export const OfficerDash: React.FC = () => {
  const { state, user, callNextToken, updateTokenStatus, updateCounterStatus, departments } = useQueue();
  const [selectedCounterId, setSelectedCounterId] = useState<string>(user?.counterId || 'counter-revenue-1');
  const [transferDeptId, setTransferDeptId] = useState<string>('');
  const [actionLoading, setActionLoading] = useState(false);

  const activeCounter = state.counters.find(c => c.id === selectedCounterId);
  const currentToken = state.tokens.find(t => t.status === 'CALLING' && t.counterId === selectedCounterId);

  // Counter stats
  const deptId = activeCounter?.departmentId;
  const deptTokens = state.tokens.filter(t => t.departmentId === deptId);
  const pendingTokensCount = deptTokens.filter(t => t.status === 'PENDING').length;
  const servedTodayCount = deptTokens.filter(t => t.status === 'COMPLETED').length;

  const handleCallNext = async () => {
    if (!activeCounter || activeCounter.status !== 'OPEN') {
      alert('Please open your Counter desk status before calling citizens.');
      return;
    }
    setActionLoading(true);
    const tok = await callNextToken(selectedCounterId);
    setActionLoading(false);
    if (!tok) {
      alert('The waiting queue for this department is currently empty.');
    }
  };

  const handleUpdateStatus = async (status: 'COMPLETED' | 'SKIPPED') => {
    if (!currentToken) return;
    setActionLoading(true);
    await updateTokenStatus(currentToken.id, status, selectedCounterId);
    setActionLoading(false);
  };

  const handleToggleCounter = async (status: 'OPEN' | 'PAUSED') => {
    setActionLoading(true);
    await updateCounterStatus(selectedCounterId, status);
    setActionLoading(false);
  };

  const handleTransfer = async () => {
    if (!currentToken || !transferDeptId) return;
    setActionLoading(true);
    await updateTokenStatus(currentToken.id, 'PENDING', undefined, transferDeptId);
    setTransferDeptId('');
    setActionLoading(false);
    alert('Citizen successfully transferred to target department queue!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Officer Control Panel Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            Counter Officer Desk Console
          </h2>
          <p className="text-xs text-gray-400">Desk terminal. Select active unit, toggle break pauses, and handle priority citizen workflows.</p>
        </div>

        {/* Counter selector dropdown */}
        <div className="flex gap-3">
          <select
            value={selectedCounterId}
            onChange={(e) => setSelectedCounterId(e.target.value)}
            className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-orange-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-gray-800 dark:text-gray-200 font-bold font-mono transition"
          >
            {state.counters.map(c => (
              <option key={c.id} value={c.id}>
                Counter {c.counterNumber} - {c.departmentId === 'dept-revenue' ? 'Revenue' : c.departmentId === 'dept-aadhaar' ? 'Aadhaar' : 'Licences'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main serving Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Session Console (Spans 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-orange-600/10 text-orange-500 rounded-xl">
                  <Landmark size={20} />
                </span>
                <div>
                  <h4 className="text-xs font-black tracking-wider text-slate-400 uppercase">
                    COUNTER SESSION CONTROLS
                  </h4>
                  <p className="font-bold text-sm text-gray-800 dark:text-gray-200 leading-none mt-1">
                    {activeCounter?.departmentId === 'dept-revenue' ? 'Revenue Department' : activeCounter?.departmentId === 'dept-aadhaar' ? 'Aadhaar services' : 'Driving Licence branch'}
                  </p>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleCounter('OPEN')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                    activeCounter?.status === 'OPEN'
                      ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-gray-400'
                  }`}
                >
                  <Play size={12} /> Open Counter
                </button>
                <button
                  onClick={() => handleToggleCounter('PAUSED')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                    activeCounter?.status === 'PAUSED'
                      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-gray-400'
                  }`}
                >
                  <Pause size={12} /> Pause Break
                </button>
              </div>
            </div>

            {/* Serving Ticket Card */}
            {currentToken ? (
              <div className="bg-slate-50 dark:bg-slate-950/40 border-2 border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 font-mono tracking-widest block mb-1">
                      CURRENTLY SERVING
                    </span>
                    <h3 className="text-4xl font-black text-orange-500 font-mono tracking-tight leading-none">
                      {currentToken.tokenNumber}
                    </h3>
                  </div>

                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider font-mono ${
                    currentToken.priority === 'EMERGENCY' ? 'bg-red-500/15 text-red-500 border border-red-500/30' :
                    currentToken.priority === 'SENIOR_CITIZEN' ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30' :
                    'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    Lane: {currentToken.priority.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400 font-bold block mb-1 uppercase text-[9px]">Citizen Name</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">{currentToken.citizenName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block mb-1 uppercase text-[9px]">Mobile Phone</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200 font-mono">{currentToken.mobile}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400 font-bold block mb-1 uppercase text-[9px]">Target Service division</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">{currentToken.serviceName}</span>
                  </div>
                </div>

                {/* Serving Work Actions */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus('COMPLETED')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle size={15} /> Complete Serving
                  </button>
                  <button
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus('SKIPPED')}
                    className="bg-slate-800 hover:bg-slate-700 text-gray-300 font-bold py-3 px-4 rounded-xl text-xs border border-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <AlertTriangle size={15} className="text-amber-500" /> Absentee Skip
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-center items-center space-y-4">
                <div className="p-3.5 bg-slate-100 dark:bg-slate-950 rounded-full text-slate-400">
                  <Users size={32} />
                </div>
                <div className="space-y-1 max-w-sm">
                  <h5 className="font-bold text-sm text-gray-800 dark:text-gray-200">
                    No Citizen Session Is Active
                  </h5>
                  <p className="text-xs text-gray-400 leading-normal">
                    Open your counter status first and pull the next priority ticket from the central queue database.
                  </p>
                </div>
                <button
                  disabled={actionLoading || activeCounter?.status !== 'OPEN'}
                  onClick={handleCallNext}
                  className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold py-3 px-6 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? <RefreshCw className="animate-spin" size={14} /> : <ChevronRight size={14} />}
                  Call Next Citizen
                </button>
              </div>
            )}

            {/* Transfer division Form */}
            {currentToken && (
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3.5">
                <div className="flex gap-2 items-center text-xs font-bold text-gray-800 dark:text-gray-200">
                  <ArrowRightLeft size={15} className="text-orange-500" />
                  <span>Reroute Citizen (Transfer Queue)</span>
                </div>
                <p className="text-[11px] text-gray-400">
                  Transfer this citizen to another specialized department if they require multi-stage document processing.
                </p>

                <div className="flex gap-3">
                  <select
                    value={transferDeptId}
                    onChange={(e) => setTransferDeptId(e.target.value)}
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-orange-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="">-- Select Target Department --</option>
                    {departments.filter(d => d.id !== deptId).map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  <button
                    disabled={!transferDeptId || actionLoading}
                    onClick={handleTransfer}
                    className="bg-slate-850 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-700 transition"
                  >
                    Reroute Slot
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Counter Stats Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-4 shadow-sm">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
              Desk Stats Today
            </h4>

            <div className="space-y-3 font-mono">
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/40">
                <span className="text-xs text-gray-400 font-medium">Pending Waiters:</span>
                <span className="text-base font-black text-orange-500">
                  {pendingTokensCount}
                </span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/40">
                <span className="text-xs text-gray-400 font-medium">Served Session:</span>
                <span className="text-base font-black text-green-500">
                  {servedTodayCount}
                </span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/40">
                <span className="text-xs text-gray-400 font-medium">Avg Handling Dial:</span>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  9.2 Min/User
                </span>
              </div>
            </div>
          </div>

          <div className="bg-orange-600/5 border border-orange-500/20 p-5 rounded-2xl space-y-3">
            <h4 className="text-xs font-extrabold text-orange-500 flex items-center gap-1.5 uppercase">
              <Sparkles size={14} /> AI Predictor Advice
            </h4>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-normal">
              Based on historical Mondays, peak visitor density is predicted from **11:00 AM to 01:30 PM**. Consider maintaining rapid serving ratios.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
export default OfficerDash;
