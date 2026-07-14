import React, { useEffect, useRef } from 'react';
import { useQueue } from '../context/QueueContext';
import { Monitor, Bell, Volume2, VolumeX, Clock, Users, ArrowRightLeft } from 'lucide-react';

export const LiveDisplay: React.FC = () => {
  const { state, language } = useQueue();
  const [speakOn, setSpeakOn] = React.useState(true);
  
  // Track previously called tokens to avoid repeat speech announcements
  const prevCalledTokens = useRef<Record<string, string>>({});

  useEffect(() => {
    if (!speakOn) return;

    state.counters.forEach(c => {
      if (c.status === 'OPEN' && c.currentTokenNumber) {
        const lastAnnounced = prevCalledTokens.current[c.id];
        
        // If there is a new called token at this counter, announce it
        if (lastAnnounced !== c.currentTokenNumber) {
          prevCalledTokens.current[c.id] = c.currentTokenNumber;
          
          // Trigger Speech Synthesis
          try {
            const sentence = `Token number ${c.currentTokenNumber.split('').join(' ')}, please proceed to Counter number ${c.counterNumber}`;
            const utterance = new SpeechSynthesisUtterance(sentence);
            utterance.rate = 0.85; // Natural speed
            window.speechSynthesis.speak(utterance);
          } catch (e) {
            console.warn('Speech synthesis not supported or blocked by user gesture:', e);
          }
        }
      }
    });
  }, [state.counters, speakOn]);

  const activeCounters = state.counters.filter(c => c.status === 'OPEN');
  
  // Find upcoming tokens
  const nextUpTokens = state.tokens
    .filter(t => t.status === 'PENDING')
    .slice(0, 3);

  // Calculate stats
  const pendingCount = state.tokens.filter(t => t.status === 'PENDING').length;
  const avgWait = pendingCount > 0 ? Math.min(60, Math.ceil(pendingCount * 12 / Math.max(1, activeCounters.length))) : 12;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Controls bar */}
      <div className="flex justify-between items-center bg-[#002B5B] text-white p-4 rounded-xl border border-[#002B5B]/30">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 text-white px-2.5 py-1.5 rounded text-[9px] font-black tracking-widest uppercase animate-pulse">
            LIVE BROADCAST
          </div>
          <div>
            <h2 className="text-sm font-black tracking-wider uppercase">State Service Counter Board</h2>
            <p className="text-[9px] text-blue-200/80 uppercase font-mono tracking-widest">Main Lobby Display Unit #1</p>
          </div>
        </div>

        <button
          onClick={() => setSpeakOn(!speakOn)}
          className={`flex items-center gap-2 px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest border transition cursor-pointer ${
            speakOn 
              ? 'bg-white/10 border-white/20 text-orange-400' 
              : 'bg-black/20 border-white/10 text-slate-400'
          }`}
        >
          {speakOn ? <Volume2 size={13} /> : <VolumeX size={13} />}
          <span>{speakOn ? 'Voice On' : 'Voice Muted'}</span>
        </button>
      </div>

      {/* Main Electronic Board Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LED Counters Column (Spans 2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-950 rounded-xl border-4 border-slate-800 shadow-2xl p-6 relative overflow-hidden">
            {/* Glossy LED glass reflection effect */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            {/* Grid Headers */}
            <div className="grid grid-cols-3 text-center border-b border-slate-800 pb-4 text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">
              <div>Counter Desk</div>
              <div>Now Serving</div>
              <div>Status</div>
            </div>

            {/* LED Counter Rows */}
            <div className="divide-y divide-slate-900 mt-2">
              {state.counters.map((c) => (
                <div
                  key={c.id}
                  className="grid grid-cols-3 text-center py-5 items-center font-mono"
                >
                  {/* Desk Number */}
                  <div className="text-xl sm:text-2xl font-black text-gray-400 flex flex-col justify-center items-center">
                    <span className="text-[9px] text-slate-600 font-extrabold tracking-widest leading-none mb-1 uppercase">UNIT</span>
                    <span className="leading-none text-white font-mono">C-{String(c.counterNumber).padStart(2, '0')}</span>
                  </div>

                  {/* Active Token Call */}
                  <div className="flex flex-col items-center">
                    {c.status === 'OPEN' && c.currentTokenNumber ? (
                      <div className="text-2xl sm:text-4xl font-black text-orange-400 tracking-wider animate-pulse font-mono drop-shadow-[0_0_12px_rgba(234,88,12,0.3)]">
                        {c.currentTokenNumber}
                      </div>
                    ) : c.status === 'PAUSED' ? (
                      <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded">
                        TEMPORARY PAUSE
                      </span>
                    ) : (
                      <span className="text-sm font-black text-slate-700">
                        OFFLINE
                      </span>
                    )}
                  </div>

                  {/* Operational Status */}
                  <div className="flex justify-center">
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                      c.status === 'OPEN' ? 'bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_8px_rgba(34,197,94,0.15)]' :
                      c.status === 'PAUSED' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-slate-900 text-slate-500 border border-slate-800/40'
                    }`}>
                      {c.status === 'OPEN' ? '● Serving Live' : c.status === 'PAUSED' ? '● Lunch/Break' : '● Closed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LED Right Sidebar (Queue status info) */}
        <div className="space-y-6">
          
          {/* LED Stats panel */}
          <div className="bg-slate-950 rounded-xl border-2 border-slate-800 p-5 space-y-4 font-mono relative overflow-hidden">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Lobby Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1.5">
                  <Clock size={13} className="text-orange-500" /> Avg. Wait
                </span>
                <span className="text-base font-black text-orange-400 font-mono drop-shadow-[0_0_8px_rgba(249,115,22,0.2)]">
                  {avgWait} MIN
                </span>
              </div>
              <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1.5">
                  <Users size={13} className="text-orange-500" /> Waiters list
                </span>
                <span className="text-base font-black text-orange-400 font-mono">
                  {pendingCount} CITIZENS
                </span>
              </div>
            </div>
          </div>

          {/* LED Next Up Queue */}
          <div className="bg-slate-950 rounded-xl border-2 border-slate-800 p-5 space-y-4 font-mono">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Next Up in Queue
              </h3>
              <Bell size={14} className="text-orange-500 animate-bounce" />
            </div>

            <div className="space-y-2">
              {nextUpTokens.length > 0 ? (
                nextUpTokens.map((tok, index) => (
                  <div
                    key={tok.id}
                    className="flex justify-between items-center bg-slate-900/40 p-3 rounded-lg border border-slate-800/40"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs text-slate-600 font-bold">#{index + 1}</span>
                      <span className="text-sm font-bold text-gray-300 tracking-wide">{tok.tokenNumber}</span>
                    </div>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded font-mono ${
                      tok.priority === 'EMERGENCY' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      tok.priority === 'SENIOR_CITIZEN' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {tok.priority.substring(0, 6)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-slate-600 font-bold">
                  QUEUE IS EMPTY
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default LiveDisplay;
