import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { Ticket, Calendar, ShieldCheck, MessageSquare, Bell, Search, Star, Sparkles, Trash2, Clock, MapPin, Upload, AlertCircle, Check, X } from 'lucide-react';
import { Token, Appointment, Feedback } from '../types';

export const CitizenDash: React.FC = () => {
  const { state, generateToken, bookAppointment, updateTokenStatus, submitFeedback, language } = useQueue();
  const [activeTab, setActiveTab] = useState<'TICKETS' | 'APPOINTMENT' | 'VAULT' | 'FEEDBACK' | 'NOTIFS'>('TICKETS');
  
  // Feedback States
  const [fbTokenNumber, setFbTokenNumber] = useState('');
  const [fbRating, setFbRating] = useState<number>(5);
  const [fbComments, setFbComments] = useState('');
  const [fbSuccess, setFbSuccess] = useState(false);

  // Appointment states
  const [aptName, setAptName] = useState('');
  const [aptMobile, setAptMobile] = useState('');
  const [aptDeptId, setAptDeptId] = useState('');
  const [aptSrvId, setAptSrvId] = useState('');
  const [aptDate, setAptDate] = useState('');
  const [aptSlot, setAptSlot] = useState('');
  const [aptSuccess, setAptSuccess] = useState(false);

  // Doc verification mock statuses
  const [docStatuses, setDocStatuses] = useState([
    { id: 'doc-1', name: 'Aadhaar Card UIDAI', type: 'Identification', status: 'VERIFIED', uploadedAt: '2026-07-10' },
    { id: 'doc-2', name: 'Driving Licence LLR', type: 'Licencing', status: 'VERIFIED', uploadedAt: '2026-07-11' },
    { id: 'doc-3', name: 'PAN Tax Card ID', type: 'Tax Record', status: 'PENDING', uploadedAt: '2026-07-14' },
    { id: 'doc-4', name: 'Indian Passport File', type: 'Travel Passport', status: 'REJECTED', uploadedAt: '2026-07-12' }
  ]);

  const activeTokens = state.tokens.filter(t => t.status === 'PENDING' || t.status === 'CALLING');
  const pastTokens = state.tokens.filter(t => t.status === 'COMPLETED' || t.status === 'SKIPPED' || t.status === 'CANCELLED');

  const handleCancel = async (tokenId: string) => {
    if (confirm('Are you sure you want to cancel this token?')) {
      await updateTokenStatus(tokenId, 'CANCELLED');
    }
  };

  const handleAptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aptName || !aptMobile || !aptDeptId || !aptSrvId || !aptDate || !aptSlot) {
      alert('Please fill out all fields.');
      return;
    }
    const res = await bookAppointment({
      citizenName: aptName,
      mobile: aptMobile,
      departmentId: aptDeptId,
      serviceId: aptSrvId,
      date: aptDate,
      slot: aptSlot
    });
    if (res) {
      setAptSuccess(true);
      setTimeout(() => setAptSuccess(false), 4000);
      setAptName('');
      setAptMobile('');
      setAptDeptId('');
      setAptSrvId('');
      setAptDate('');
      setAptSlot('');
    }
  };

  const handleFbSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbTokenNumber || !fbComments) {
      alert('Please select a token and enter comments.');
      return;
    }
    const success = await submitFeedback({
      tokenNumber: fbTokenNumber,
      citizenName: 'Active Citizen',
      rating: fbRating,
      comments: fbComments
    });
    if (success) {
      setFbSuccess(true);
      setTimeout(() => setFbSuccess(false), 4000);
      setFbTokenNumber('');
      setFbComments('');
      setFbRating(5);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Dashboard Sub Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            Citizen Digital Services Workspace
          </h2>
          <p className="text-xs text-gray-400">Manage digital tokens, file e-verification papers, schedule appointments, and leave rating reviews.</p>
        </div>

        {/* Tab buttons switcher */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'TICKETS', label: 'My Queue Tickets', icon: Ticket },
            { id: 'APPOINTMENT', label: 'Book Appointment', icon: Calendar },
            { id: 'VAULT', label: 'Document Vault', icon: ShieldCheck },
            { id: 'FEEDBACK', label: 'Rate Services', icon: MessageSquare },
            { id: 'NOTIFS', label: 'Notifications', icon: Bell }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-orange-600/10 border-orange-500/30 text-orange-600 dark:text-orange-400 font-bold shadow-sm'
                    : 'bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Area Content */}
      <div className="grid grid-cols-1">
        
        {/* TAB 1: TICKETS */}
        {activeTab === 'TICKETS' && (
          <div className="space-y-6">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
              Active Queue Tokens
            </h3>

            {activeTokens.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeTokens.map((tok) => (
                  <div
                    key={tok.id}
                    className="bg-white dark:bg-slate-900 border-l-4 border-l-orange-500 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-black font-mono text-slate-400 uppercase">
                          TOKEN REFERENCE
                        </span>
                        <h4 className="text-2xl font-black text-gray-900 dark:text-gray-100 font-mono tracking-wide mt-0.5">
                          {tok.tokenNumber}
                        </h4>
                        <p className="text-xs text-gray-400 font-bold mt-1">{tok.serviceName}</p>
                      </div>

                      <span className={`text-[9px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider ${
                        tok.status === 'CALLING' 
                          ? 'bg-green-500/10 text-green-500 border border-green-500/20 shadow-[0_0_8px_rgba(34,197,94,0.15)] animate-pulse' 
                          : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        {tok.status === 'CALLING' ? 'Now Serving' : 'Pending Queue'}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl text-center border border-slate-100 dark:border-slate-800/40">
                      <div>
                        <span className="text-[9px] text-gray-400 block font-bold leading-none mb-1">POSITION</span>
                        <span className="font-bold text-gray-800 dark:text-gray-200 font-mono text-xs">#{tok.queuePosition}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 block font-bold leading-none mb-1">WAITING</span>
                        <span className="font-bold text-gray-800 dark:text-gray-200 font-mono text-xs">~{tok.estimatedWaitMinutes}m</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 block font-bold leading-none mb-1">DESK</span>
                        <span className="font-bold text-gray-800 dark:text-gray-200 font-mono text-xs">
                          {tok.counterNumber ? `C-${tok.counterNumber}` : 'General'}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[10px] text-gray-400 font-mono">Issued: {new Date(tok.createdAt).toLocaleTimeString()}</span>
                      <button
                        onClick={() => handleCancel(tok.id)}
                        className="text-xs font-bold text-red-500 hover:text-white hover:bg-red-600 px-3.5 py-1.5 rounded-lg border border-red-500/20 transition flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={13} /> Cancel Token
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 rounded-2xl text-center text-sm text-gray-400">
                You have no active generated tokens. Go generate one on the homepage!
              </div>
            )}

            {/* History past tokens */}
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 pt-4">
              Historical Generated Tokens ({pastTokens.length})
            </h3>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-gray-400 uppercase tracking-wider font-extrabold">
                    <th className="p-4">Token</th>
                    <th className="p-4">Citizen Name</th>
                    <th className="p-4">Service</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Completed Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {pastTokens.map((tok) => (
                    <tr key={tok.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition text-gray-700 dark:text-gray-300">
                      <td className="p-4 font-black font-mono text-orange-500">{tok.tokenNumber}</td>
                      <td className="p-4 font-bold">{tok.citizenName}</td>
                      <td className="p-4">{tok.serviceName}</td>
                      <td className="p-4">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                          tok.status === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-800/40'
                        }`}>
                          {tok.status}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-gray-400">
                        {tok.completedAt ? new Date(tok.completedAt).toLocaleString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: APPOINTMENT */}
        {activeTab === 'APPOINTMENT' && (
          <div className="max-w-2xl mx-auto w-full">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-2xl shadow-sm space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  Schedule Future Services Session
                </h3>
                <p className="text-xs text-gray-400">Secure an upcoming timeslot, eliminating physical waiting entirely. Limit 5 per slot.</p>
              </div>

              {aptSuccess && (
                <div className="bg-green-500/10 border border-green-500/30 text-green-500 p-4 rounded-xl text-xs font-bold flex items-center gap-2">
                  <Check size={16} /> Appointment scheduled successfully! Check your email or phone for reminders.
                </div>
              )}

              <form onSubmit={handleAptSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase">Citizen Name</label>
                    <input
                      type="text"
                      required
                      value={aptName}
                      onChange={(e) => setAptName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 focus:border-orange-500 focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase">Mobile number</label>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      value={aptMobile}
                      onChange={(e) => setAptMobile(e.target.value)}
                      placeholder="10-digit number"
                      className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 focus:border-orange-500 focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase">Department ID</label>
                    <select
                      required
                      value={aptDeptId}
                      onChange={(e) => setAptDeptId(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 focus:border-orange-500 focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-white"
                    >
                      <option value="">-- Choose Department --</option>
                      {state.counters.map(c => {
                        // Gather name
                        const dId = c.departmentId;
                        const dName = dId === 'dept-revenue' ? 'Revenue' : dId === 'dept-aadhaar' ? 'Aadhaar' : 'Licencing';
                        return <option key={c.id} value={dId}>{dName}</option>;
                      })}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase">Services</label>
                    <select
                      required
                      value={aptSrvId}
                      onChange={(e) => setAptSrvId(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 focus:border-orange-500 focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-white"
                    >
                      <option value="">-- Choose Service --</option>
                      <option value="srv-patta">Patta Land Transfer</option>
                      <option value="srv-aadhaar-new">New Aadhaar Registration</option>
                      <option value="srv-dl-new">New Driving Licence</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase">Date Selection</label>
                    <input
                      type="date"
                      required
                      value={aptDate}
                      onChange={(e) => setAptDate(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 focus:border-orange-500 focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase">Preferred Timeslot</label>
                    <select
                      required
                      value={aptSlot}
                      onChange={(e) => setAptSlot(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 focus:border-orange-500 focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-white"
                    >
                      <option value="">-- Choose Slot --</option>
                      <option value="10:00 AM - 10:30 AM">10:00 AM - 10:30 AM</option>
                      <option value="11:30 AM - 12:00 PM">11:30 AM - 12:00 PM</option>
                      <option value="02:30 PM - 03:00 PM">02:30 PM - 03:00 PM</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-xl text-xs transition cursor-pointer"
                >
                  Confirm Appointment Booking
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: VAULT DOCUMENT VERIFICATION MODULE (Demo ONLY) */}
        {activeTab === 'VAULT' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="space-y-1">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">
                  Document Vault & e-Verification Hub
                </h3>
                <p className="text-xs text-gray-400">DEMO MODULE ONLY. Upload scans of essential government ID cards for online verification prior to your turn.</p>
              </div>

              <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition cursor-pointer">
                <Upload size={14} /> Upload New Scan ID
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {docStatuses.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-4 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div className="p-2.5 bg-orange-600/10 border border-orange-500/20 rounded-xl text-orange-500">
                      <ShieldCheck size={20} />
                    </div>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                      doc.status === 'VERIFIED' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                      doc.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                      'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                      {doc.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm truncate leading-snug">
                      {doc.name}
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-1">{doc.type} ID</p>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800/60 pt-2.5 flex justify-between items-center text-[10px] text-gray-400 font-mono">
                    <span>Uploaded:</span>
                    <span>{doc.uploadedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: RATE SERVICES */}
        {activeTab === 'FEEDBACK' && (
          <div className="max-w-xl mx-auto w-full">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-2xl shadow-sm space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  Citizen Services Feedback
                </h3>
                <p className="text-xs text-gray-400">Your comments are analyzed server-side via Gemini API for immediate sentiment evaluation to improve counter staff efficiencies.</p>
              </div>

              {fbSuccess && (
                <div className="bg-green-500/10 border border-green-500/30 text-green-500 p-4 rounded-xl text-xs font-bold flex items-center gap-2">
                  <Sparkles size={14} className="animate-spin" /> Feedback analyzed and saved successfully! Thank you for helping us serve you better.
                </div>
              )}

              <form onSubmit={handleFbSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Token Number</label>
                  <select
                    required
                    value={fbTokenNumber}
                    onChange={(e) => setFbTokenNumber(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 focus:border-orange-500 focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-white"
                  >
                    <option value="">-- Select Completed Token --</option>
                    <option value="REV-021">REV-021 (Amit Shah)</option>
                    <option value="REV-022">REV-022 (Priya Dharshini)</option>
                    {state.tokens.filter(t => t.status === 'COMPLETED').map(tok => (
                      <option key={tok.id} value={tok.tokenNumber}>{tok.tokenNumber} ({tok.citizenName})</option>
                    ))}
                  </select>
                </div>

                {/* Rating stars */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Staff Performance Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFbRating(star)}
                        className="p-1 hover:scale-110 transition cursor-pointer"
                      >
                        <Star
                          size={24}
                          className={star <= fbRating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Feedback Comments</label>
                  <textarea
                    required
                    rows={4}
                    value={fbComments}
                    onChange={(e) => setFbComments(e.target.value)}
                    placeholder="Provide specific feedback. Describe how staff or wait times were managed..."
                    className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 focus:border-orange-500 focus:outline-none rounded-xl p-3.5 text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-xl text-xs transition cursor-pointer"
                >
                  Analyze & Submit Feedback Card
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 5: NOTIFICATIONS */}
        {activeTab === 'NOTIFS' && (
          <div className="space-y-4 max-w-xl mx-auto w-full">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
              Notification Center Hub
            </h3>

            <div className="space-y-3">
              {[
                { title: 'Token Generated', desc: 'Token REV-023 successfully queued under demographic priorities.', date: 'Today, 10:20 AM', icon: Ticket, color: 'text-orange-500 bg-orange-500/10' },
                { title: 'Now Serving Alert', desc: 'Token AAD-118 please proceed immediately to Aadhaar Fingerprint Counter #2.', date: 'Today, 10:15 AM', icon: Bell, color: 'text-green-500 bg-green-500/10' },
                { title: 'e-Registry VeriCheck complete', desc: 'Aadhaar Card copy verification status: VERIFIED.', date: 'Yesterday, 11:30 AM', icon: ShieldCheck, color: 'text-blue-500 bg-blue-500/10' },
                { title: 'Upcoming Appointment Reminder', desc: 'Your appointment is confirmed for tomorrow in Revenue division at 10:00 AM.', date: 'Yesterday, 10:00 AM', icon: Calendar, color: 'text-purple-500 bg-purple-500/10' }
              ].map((notif, i) => {
                const Icon = notif.icon;
                return (
                  <div
                    key={i}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex gap-4"
                  >
                    <div className={`p-2.5 rounded-lg shrink-0 ${notif.color}`}>
                      <Icon size={16} />
                    </div>
                    <div className="space-y-1 flex-1 text-xs">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-gray-800 dark:text-gray-200">{notif.title}</h4>
                        <span className="text-[10px] text-gray-400 font-mono">{notif.date}</span>
                      </div>
                      <p className="text-gray-400 dark:text-gray-500 leading-relaxed">
                        {notif.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
export default CitizenDash;
