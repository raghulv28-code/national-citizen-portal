import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { Database, ShieldCheck, Clock, ShieldAlert, Calendar, RefreshCw, CheckCircle, Search, Trash } from 'lucide-react';

export const SuperAdminDash: React.FC = () => {
  const { state, triggerBackup, triggerRestore } = useQueue();
  const [backupFile, setBackupFile] = useState<string>('');
  const [backupSuccess, setBackupSuccess] = useState(false);
  const [restoreSuccess, setRestoreSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // System parameters state
  const [officeOpen, setOfficeOpen] = useState('09:00');
  const [officeClose, setOfficeClose] = useState('18:00');
  const [avgHandling, setAvgHandling] = useState('12');

  // Holiday List state
  const [holidays, setHolidays] = useState([
    { id: 'h-1', name: 'Independence Day', date: '2026-08-15', desc: 'National Holiday' },
    { id: 'h-2', name: 'Gandhi Jayanti', date: '2026-10-02', desc: 'National Holiday' },
    { id: 'h-3', name: 'Diwali Festival', date: '2026-11-08', desc: 'Gazetted Holiday' }
  ]);
  const [newHoliName, setNewHoliName] = useState('');
  const [newHoliDate, setNewHoliDate] = useState('');

  const handleBackup = async () => {
    setActionLoading(true);
    const filename = await triggerBackup();
    setActionLoading(false);
    if (filename) {
      setBackupFile(filename);
      setBackupSuccess(true);
      setTimeout(() => setBackupSuccess(false), 4000);
    }
  };

  const handleRestore = async () => {
    if (confirm('Are you sure you want to restore the system state? This resets active tokens to clean seed defaults.')) {
      setActionLoading(true);
      const ok = await triggerRestore();
      setActionLoading(false);
      if (ok) {
        setRestoreSuccess(true);
        setTimeout(() => setRestoreSuccess(false), 4000);
      }
    }
  };

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHoliName || !newHoliDate) return;
    setHolidays(prev => [...prev, {
      id: `h-${Date.now()}`,
      name: newHoliName,
      date: newHoliDate,
      desc: 'Scheduled Administrative Holiday'
    }]);
    setNewHoliName('');
    setNewHoliDate('');
  };

  const handleDeleteHoliday = (id: string) => {
    setHolidays(prev => prev.filter(h => h.id !== id));
  };

  const filteredLogs = state.auditLogs.filter(log => 
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Super Admin Title */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            Super Administrative Controls
          </h2>
          <p className="text-xs text-gray-400">Trigger database restorations, manage official calendar holiday lists, configure office variables, and review system logs.</p>
        </div>

        <div className="flex gap-2">
          <span className="bg-red-500/10 text-red-500 border border-red-500/30 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
            SUPER_ADMIN_MODE: AUTHORIZED
          </span>
        </div>
      </div>

      {/* Grid: Params Configuration & Holiday scheduler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Params & DB Backup Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <Clock size={14} className="text-orange-500" /> Office Constants & Database Backups
          </h3>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-gray-400 font-bold block">Office Opening hour</label>
              <input
                type="time"
                value={officeOpen}
                onChange={(e) => setOfficeOpen(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 focus:border-orange-500 focus:outline-none rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-gray-400 font-bold block">Office Closing Hour</label>
              <input
                type="time"
                value={officeClose}
                onChange={(e) => setOfficeClose(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 focus:border-orange-500 focus:outline-none rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <label className="text-gray-400 font-bold block">Avg Handling session limit (Minutes)</label>
              <input
                type="number"
                value={avgHandling}
                onChange={(e) => setAvgHandling(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 focus:border-orange-500 focus:outline-none rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/60 pt-5 space-y-4">
            <h4 className="text-xs font-bold uppercase text-gray-500">Database Operations</h4>
            
            {backupSuccess && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-500 p-3.5 rounded-xl text-xs font-bold leading-normal">
                Backup triggered successfully! Saved state file: <span className="font-mono text-[11px] block mt-1 bg-green-500/5 p-1 rounded border border-green-500/10">{backupFile}</span>
              </div>
            )}

            {restoreSuccess && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-500 p-3.5 rounded-xl text-xs font-bold">
                System state restored from template default files!
              </div>
            )}

            <div className="flex gap-3">
              <button
                disabled={actionLoading}
                onClick={handleBackup}
                className="flex-1 bg-slate-850 hover:bg-slate-700 text-white font-bold text-xs py-3 rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer transition"
              >
                <Database size={14} /> {actionLoading ? 'Saving...' : 'Backup database'}
              </button>
              <button
                disabled={actionLoading}
                onClick={handleRestore}
                className="flex-1 bg-red-600/15 text-red-500 hover:bg-red-600 hover:text-white font-bold text-xs py-3 rounded-xl border border-red-500/20 flex items-center justify-center gap-1.5 cursor-pointer transition"
              >
                <RefreshCw size={14} className={actionLoading ? 'animate-spin' : ''} /> {actionLoading ? 'Restoring...' : 'Restore defaults'}
              </button>
            </div>
          </div>
        </div>

        {/* Holiday Scheduler */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <Calendar size={14} className="text-orange-500" /> Holiday & Closure Calendar
          </h3>

          <form onSubmit={handleAddHoliday} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Holiday Name (e.g. Eid)"
              value={newHoliName}
              onChange={(e) => setNewHoliName(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 focus:border-orange-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
            />
            <div className="flex gap-2">
              <input
                type="date"
                required
                value={newHoliDate}
                onChange={(e) => setNewHoliDate(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 focus:border-orange-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
              />
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-3.5 rounded-xl transition cursor-pointer"
              >
                Add
              </button>
            </div>
          </form>

          <div className="space-y-2.5 max-h-48 overflow-y-auto">
            {holidays.map((h) => (
              <div
                key={h.id}
                className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800/40 text-xs"
              >
                <div>
                  <p className="font-bold text-gray-800 dark:text-gray-200">{h.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{h.desc}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded font-black">
                    {h.date}
                  </span>
                  <button
                    onClick={() => handleDeleteHoliday(h.id)}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-gray-400 hover:text-red-500 rounded-lg transition"
                  >
                    <Trash size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Audit Logs Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Government e-Governance Audit Registry Logs
          </h3>
          
          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-2.5 text-gray-500" size={14} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit actions..."
              className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 focus:border-orange-500 focus:outline-none rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-950 text-gray-400 uppercase tracking-wider font-extrabold">
              <tr>
                <th className="p-4">Action</th>
                <th className="p-4">Operator Desk</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.slice(0, 8).map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 text-gray-700 dark:text-gray-300">
                  <td className="p-4">
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[9px] font-black font-mono px-2 py-0.5 rounded uppercase tracking-wider border border-slate-200/40 dark:border-slate-800/30">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 font-bold">{log.operator}</td>
                  <td className="p-4 font-mono text-gray-400">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-4 text-gray-400 leading-relaxed font-medium">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default SuperAdminDash;
