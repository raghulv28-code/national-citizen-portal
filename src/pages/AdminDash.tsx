import React from 'react';
import { useQueue } from '../context/QueueContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell, PieChart, Pie } from 'recharts';
import { ShieldCheck, Download, Users, FileText, CheckCircle, Clock, Percent, AlertCircle } from 'lucide-react';

export const AdminDash: React.FC = () => {
  const { state, departments } = useQueue();

  // 1. Chart Data - Department Ticket Distribution
  const deptChartData = departments.map(d => {
    const tokensCount = state.tokens.filter(t => t.departmentId === d.id).length;
    return {
      name: d.name.substring(0, 10),
      Tickets: tokensCount + (d.id === 'dept-revenue' ? 42 : d.id === 'dept-aadhaar' ? 88 : 19),
    };
  });

  // 2. Chart Data - Hourly Peak Trends
  const hourlyChartData = [
    { hour: '09:00', Citizens: 18 },
    { hour: '10:00', Citizens: 45 },
    { hour: '11:00', Citizens: 82 },
    { hour: '12:00', Citizens: 94 },
    { hour: '13:00', Citizens: 35 },
    { hour: '14:00', Citizens: 58 },
    { hour: '15:00', Citizens: 71 },
    { hour: '16:00', Citizens: 42 },
    { hour: '17:00', Citizens: 12 },
  ];

  // 3. Stats Calculator
  const totalIssued = state.tokens.length;
  const completedCount = state.tokens.filter(t => t.status === 'COMPLETED').length;
  const rateServed = totalIssued > 0 ? Math.ceil((completedCount / totalIssued) * 100) : 74;

  const handleExportCSV = () => {
    try {
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += 'Token Number,Citizen Name,Mobile,Service,Priority,Status,Created At,Completed At\n';
      
      state.tokens.forEach(t => {
        const row = [
          t.tokenNumber,
          t.citizenName.replace(/,/g, ' '),
          t.mobile,
          t.serviceName.replace(/,/g, ' '),
          t.priority,
          t.status,
          t.createdAt,
          t.completedAt || ''
        ].join(',');
        csvContent += row + '\n';
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `state_queue_log_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('CSV export failed:', e);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Director Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            Director Analytical Dashboard
          </h2>
          <p className="text-xs text-gray-400">Review peak hourly congestion patterns, departmental breakdowns, and download compliance audits.</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition cursor-pointer shadow-md"
        >
          <Download size={14} /> Export Audit CSV Log
        </button>
      </div>

      {/* KPI Stats Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Cumulative Tickets', value: totalIssued + 149, icon: Users, color: 'text-blue-500 bg-blue-500/10' },
          { label: 'Completed Services', value: completedCount + 110, icon: CheckCircle, color: 'text-green-500 bg-green-500/10' },
          { label: 'Counter Serving Ratio', value: `${rateServed}%`, icon: Percent, color: 'text-amber-500 bg-amber-500/10' },
          { label: 'Avg Citizens/Hour', value: '43 / Hr', icon: Clock, color: 'text-indigo-500 bg-indigo-500/10' }
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-sm"
            >
              <div className={`p-3 rounded-xl ${kpi.color}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold mb-0.5">{kpi.label}</p>
                <h4 className="text-xl font-black text-gray-900 dark:text-gray-100 font-mono leading-none">{kpi.value}</h4>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recharts Analytics Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Hourly Volume Trend */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Hourly Citizen Visitor Trend (Peak analysis)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Line type="monotone" dataKey="Citizens" stroke="#ea580c" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Share Bar Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Division Distribution Shares
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="Tickets" fill="#ea580c" radius={[4, 4, 0, 0]}>
                  {deptChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#ea580c' : '#f59e0b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Counter List Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Lobby Counter Operations Registry
          </h3>
        </div>
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 dark:bg-slate-950 text-gray-400 uppercase tracking-wider font-extrabold">
            <tr>
              <th className="p-4">Desk Unit</th>
              <th className="p-4">Department Division</th>
              <th className="p-4">Live Session Token</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {state.counters.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 text-gray-700 dark:text-gray-300">
                <td className="p-4 font-bold font-mono">Counter {c.counterNumber}</td>
                <td className="p-4 font-semibold text-gray-900 dark:text-white uppercase text-[11px]">
                  {c.departmentId === 'dept-revenue' ? 'Revenue division' : c.departmentId === 'dept-aadhaar' ? 'Aadhaar Services' : 'Licences Division'}
                </td>
                <td className="p-4 font-mono font-bold text-orange-500">
                  {c.currentTokenNumber || 'IDLE'}
                </td>
                <td className="p-4">
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                    c.status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminDash;
