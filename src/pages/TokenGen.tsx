import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { Ticket, Printer, ArrowRight, User, Phone, Mail, Fingerprint, CalendarCheck2, ShieldAlert, CheckCircle2, ChevronRight, RefreshCw, Barcode } from 'lucide-react';
import { Token } from '../types';

interface TokenGenProps {
  onNavigate: (view: string) => void;
}

export const TokenGen: React.FC<TokenGenProps> = ({ onNavigate }) => {
  const { departments, services, generateToken, language } = useQueue();
  
  // Form State
  const [citizenName, setCitizenName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedSrvId, setSelectedSrvId] = useState('');
  const [slot, setSlot] = useState<'MORNING' | 'AFTERNOON'>('MORNING');
  const [priority, setPriority] = useState<string>('REGULAR');
  
  // Result Receipt State
  const [activeToken, setActiveToken] = useState<Token | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredServices = services.filter(s => s.departmentId === selectedDeptId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenName || !mobile || !selectedDeptId || !selectedSrvId) {
      alert('Please fill out all mandatory fields.');
      return;
    }
    
    setLoading(true);
    const resultToken = await generateToken({
      citizenName,
      mobile,
      email,
      aadhaar,
      departmentId: selectedDeptId,
      serviceId: selectedSrvId,
      priority,
      slot
    });
    setLoading(false);
    
    if (resultToken) {
      setActiveToken(resultToken);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const translations = {
    en: {
      header: 'GENERATE SECURE CITIZEN TOKEN',
      sub: 'Acquire your unique digital queue number immediately by verifying your service division.',
      formHead: 'Citizen Registry Entry',
      lblName: 'Full Name',
      lblMob: 'Mobile number',
      lblMail: 'Email address',
      lblAadhaar: 'Aadhaar ID (Optional)',
      lblDept: 'Select Government Department',
      lblSrv: 'Select Required Service',
      lblSlot: 'Select Preferred Slot',
      lblPriority: 'Priority Division (If Applicable)',
      btnSubmit: 'Verify & Generate Token',
      pReg: 'Regular Citizen Desk',
      pSenior: 'Senior Citizen (60+)',
      pDisabled: 'Disabled/Differently-Abled',
      pEmergency: 'Emergency/Maternity Priority',
      receiptHead: 'OFFICIAL TOKEN RECEIPT',
      receiptTitle: 'DEPARTMENTAL CITIZEN MEMORANDUM'
    },
    hi: {
      header: 'सुरक्षित नागरिक टोकन जनरेट करें',
      sub: 'अपने सेवा प्रभाग का सत्यापन करके तुरंत अपना विशिष्ट डिजिटल कतार नंबर प्राप्त करें।',
      formHead: 'नागरिक रजिस्ट्री प्रविष्टि',
      lblName: 'पूरा नाम',
      lblMob: 'मोबाइल नंबर',
      lblMail: 'ईमेल पता',
      lblAadhaar: 'आधार आईडी (वैकल्पिक)',
      lblDept: 'सरकारी विभाग चुनें',
      lblSrv: 'आवश्यक सेवा चुनें',
      lblSlot: 'पसंदीदा स्लॉट चुनें',
      lblPriority: 'प्राथमिकता प्रभाग (यदि लागू हो)',
      btnSubmit: 'सत्यापित करें और टोकन जनरेट करें',
      pReg: 'नियमित कतार',
      pSenior: 'वरिष्ठ नागरिक (60+)',
      pDisabled: 'दिव्यांग / विकलांग श्रेणी',
      pEmergency: 'आपातकालीन / मातृत्व प्राथमिकता',
      receiptHead: 'आधिकारिक टोकन रसीद',
      receiptTitle: 'विभागीय नागरिक ज्ञापन'
    },
    ta: {
      header: 'டிஜிட்டல் டோக்கன் உருவாக்கம்',
      sub: 'சேவைத் துறையைத் தேர்ந்தெடுத்து உங்களுக்கான பிரத்தியேக வரிசை எண்ணைப் பெறுங்கள்.',
      formHead: 'குடிமகன் பதிவு நுழைவு',
      lblName: 'முழு பெயர்',
      lblMob: 'கைபேசி எண்',
      lblMail: 'மின்னஞ்சல் முகவரி',
      lblAadhaar: 'ஆதார் எண் (விருப்பத்தேர்வு)',
      lblDept: 'அரசுத் துறையைத் தேர்ந்தெடுக்கவும்',
      lblSrv: 'தேவையான சேவையைத் தேர்ந்தெடுக்கவும்',
      lblSlot: 'விருப்பமான நேரத்தை தேர்ந்தெடுக்கவும்',
      lblPriority: 'முன்னுரிமைப் பிரிவு (தேவையெனில்)',
      btnSubmit: 'டோக்கன் உருவாக்கவும்',
      pReg: 'வழக்கமான பிரிவு',
      pSenior: 'மூத்த குடிமக்கள் (60+)',
      pDisabled: 'மாற்றுத்திறனாளி பிரிவு',
      pEmergency: 'அவசரகால / மகப்பேறு முன்னுரிமை',
      receiptHead: 'அதிகாரப்பூர்வ டோக்கன் ரसीது',
      receiptTitle: 'அரசாங்க டோக்கன் குறிப்பாணை'
    }
  };

  const t = translations[language];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100">
          {activeToken ? t.receiptHead : t.header}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          {t.sub}
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {!activeToken ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3">
            {/* Left Info Column */}
            <div className="bg-gradient-to-br from-[#002B5B] to-[#001c3d] p-6 text-white space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="bg-white/10 border border-white/20 text-orange-400 rounded-lg p-3 max-w-max">
                  <Ticket size={24} />
                </div>
                <h3 className="text-base font-bold text-gray-100 uppercase tracking-wider">
                  Queue Priority Rules
                </h3>
                <p className="text-xs text-blue-100/80 leading-relaxed">
                  Our algorithm processes tickets according to **FIFO** (First-In, First-Out) standards, with priority lanes bumped first to maintain administrative care and dignity for senior citizens and mothers.
                </p>
              </div>

              <div className="p-4 bg-white/10 border border-white/20 rounded-lg text-xs space-y-2">
                <div className="flex gap-2 items-center font-bold text-orange-400">
                  <ShieldAlert size={14} className="shrink-0" />
                  <span>Important Notice</span>
                </div>
                <p className="text-blue-100/70 leading-relaxed text-[11px]">
                  Please arrive at least 10 minutes prior to your slots. Present the generated QR card directly to Counter Officers.
                </p>
              </div>
            </div>

            {/* Form Column */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8 md:col-span-2 space-y-5">
              <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">
                {t.formHead}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase flex items-center gap-1">
                    <User size={12} /> {t.lblName} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 focus:border-[#002B5B] focus:outline-none rounded-lg px-3.5 py-2.5 text-xs text-gray-800 dark:text-gray-200 transition"
                  />
                </div>

                {/* Mobile */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase flex items-center gap-1">
                    <Phone size={12} /> {t.lblMob} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 focus:border-[#002B5B] focus:outline-none rounded-lg px-3.5 py-2.5 text-xs text-gray-800 dark:text-gray-200 transition"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase flex items-center gap-1">
                    <Mail size={12} /> {t.lblMail}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 focus:border-[#002B5B] focus:outline-none rounded-lg px-3.5 py-2.5 text-xs text-gray-800 dark:text-gray-200 transition"
                  />
                </div>

                {/* Aadhaar */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase flex items-center gap-1">
                    <Fingerprint size={12} /> {t.lblAadhaar}
                  </label>
                  <input
                    type="text"
                    pattern="[0-9]{12}"
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value)}
                    placeholder="12-digit Aadhaar ID"
                    className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 focus:border-[#002B5B] focus:outline-none rounded-lg px-3.5 py-2.5 text-xs text-gray-800 dark:text-gray-200 transition"
                  />
                </div>

                {/* Department Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase">
                    {t.lblDept} <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={selectedDeptId}
                    onChange={(e) => { setSelectedDeptId(e.target.value); setSelectedSrvId(''); }}
                    className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 focus:border-[#002B5B] focus:outline-none rounded-lg px-3.5 py-2.5 text-xs text-gray-800 dark:text-gray-200 transition"
                  >
                    <option value="">-- Choose Department --</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                    ))}
                  </select>
                </div>

                {/* Service Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase">
                    {t.lblSrv} <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    disabled={!selectedDeptId}
                    value={selectedSrvId}
                    onChange={(e) => setSelectedSrvId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 focus:border-[#002B5B] focus:outline-none rounded-lg px-3.5 py-2.5 text-xs text-gray-800 dark:text-gray-200 transition disabled:opacity-50"
                  >
                    <option value="">-- Choose Service --</option>
                    {filteredServices.map(s => (
                      <option key={s.id} value={s.id}>{s.name} (~{s.avgMinutes} min)</option>
                    ))}
                  </select>
                </div>

                {/* Slot Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase flex items-center gap-1">
                    <CalendarCheck2 size={12} /> {t.lblSlot}
                  </label>
                  <select
                    value={slot}
                    onChange={(e) => setSlot(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 focus:border-[#002B5B] focus:outline-none rounded-lg px-3.5 py-2.5 text-xs text-gray-800 dark:text-gray-200 transition"
                  >
                    <option value="MORNING">Morning Session (09:00 AM - 01:30 PM)</option>
                    <option value="AFTERNOON">Afternoon Session (02:00 PM - 06:00 PM)</option>
                  </select>
                </div>

                {/* Priority Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase">
                    {t.lblPriority}
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 focus:border-[#002B5B] focus:outline-none rounded-lg px-3.5 py-2.5 text-xs text-gray-800 dark:text-gray-200 transition"
                  >
                    <option value="REGULAR">{t.pReg}</option>
                    <option value="SENIOR_CITIZEN">{t.pSenior}</option>
                    <option value="DISABLED">{t.pDisabled}</option>
                    <option value="EMERGENCY">{t.pEmergency}</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#002B5B] hover:bg-[#001c3d] text-white font-black py-3 px-6 rounded text-xs uppercase tracking-widest shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  {loading ? (
                    <RefreshCw className="animate-spin" size={16} />
                  ) : (
                    <>
                      <CheckCircle2 size={16} /> {t.btnSubmit}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Receipt View Section */
          <div className="max-w-md mx-auto space-y-6">
            <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">
              {/* Receipt Header Style Banner */}
              <div className="bg-[#002B5B] text-white p-5 text-center space-y-2 border-b-4 border-orange-500">
                <div className="mx-auto bg-white/10 p-2.5 rounded-full w-12 h-12 flex items-center justify-center font-black border border-white/25">
                  NIC
                </div>
                <div>
                  <h3 className="text-xs font-black tracking-widest text-orange-400 uppercase">
                    {t.receiptHead}
                  </h3>
                  <p className="text-[10px] text-blue-200 uppercase font-semibold">
                    {t.receiptTitle}
                  </p>
                </div>
              </div>

              {/* Receipt Details */}
              <div className="p-6 space-y-6">
                <div className="text-center space-y-1 border-b border-dashed border-slate-200 dark:border-slate-800 pb-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Citizen Token ID</p>
                  <h2 className="text-4xl font-black text-gray-900 dark:text-gray-100 font-mono tracking-tight text-orange-500">
                    {activeToken.tokenNumber}
                  </h2>
                  <span className="inline-block bg-orange-500/15 text-orange-600 dark:text-orange-400 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-orange-500/10">
                    Lane: {activeToken.priority.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs border-b border-dashed border-slate-200 dark:border-slate-800 pb-5">
                  <div>
                    <span className="text-gray-400 uppercase font-bold text-[10px] leading-none block mb-1">Citizen Name</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">{activeToken.citizenName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase font-bold text-[10px] leading-none block mb-1">Contact Phone</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200 font-mono">{activeToken.mobile}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400 uppercase font-bold text-[10px] leading-none block mb-1">Target Service Division</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">{activeToken.serviceName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase font-bold text-[10px] leading-none block mb-1">Queue Position</span>
                    <span className="font-black text-orange-500 text-sm font-mono">#{activeToken.queuePosition}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase font-bold text-[10px] leading-none block mb-1">Counter Assigned</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200 font-mono">
                      {activeToken.counterNumber ? `Counter ${activeToken.counterNumber}` : 'General Waiting'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase font-bold text-[10px] leading-none block mb-1">Estimated Waiting</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200 font-mono">{activeToken.estimatedWaitMinutes} Minutes</span>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase font-bold text-[10px] leading-none block mb-1">Preferred Slot</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">{activeToken.slot}</span>
                  </div>
                </div>

                {/* Simulated Vector QR & Barcode Section */}
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="space-y-2">
                    {/* Barcode Mock */}
                    <div className="h-10 w-36 bg-white border border-slate-300 rounded flex flex-col justify-between items-center p-1 overflow-hidden">
                      <div className="flex gap-0.5 justify-center items-stretch h-6 w-full">
                        {[2, 1, 3, 1, 4, 1, 2, 3, 1, 4, 2, 1, 3, 1, 2, 4, 1, 3].map((w, idx) => (
                          <div key={idx} className="bg-slate-950" style={{ width: `${w * 1.5}px` }} />
                        ))}
                      </div>
                      <span className="text-[7px] font-mono font-black tracking-widest text-slate-500">
                        {activeToken.tokenNumber.replace('-', '')}{activeToken.sequence}
                      </span>
                    </div>
                    <p className="text-[9px] text-gray-400 font-medium">Scan barcode at counter</p>
                  </div>

                  {/* QR Mock */}
                  <div className="bg-white border border-slate-300 p-2 rounded-xl flex flex-col items-center justify-center shrink-0">
                    <div className="grid grid-cols-5 gap-0.5 w-14 h-14 bg-white">
                      {/* Generates a pseudo-random qr grid */}
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-sm ${(i % 2 === 0 || i % 5 === 0 || i === 0 || i === 4 || i === 20 || i === 24) ? 'bg-slate-950' : 'bg-transparent'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Circular memo instructions */}
                <div className="text-[10px] text-gray-400 leading-normal bg-orange-500/5 p-3 rounded-xl border border-orange-500/10">
                  <strong>Verification Notice:</strong> Ensure you bring all documents listed in the *Services directory* or ask Seva Mitra AI for verification.
                </div>
              </div>
            </div>

            {/* Print actions */}
            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="flex-1 bg-gradient-to-r from-orange-600 to-amber-500 text-white hover:from-orange-700 hover:to-amber-600 font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Printer size={16} /> Print Token Receipt
              </button>
              <button
                onClick={() => { setActiveToken(null); onNavigate('citizen-dashboard'); }}
                className="bg-slate-800 hover:bg-slate-700 text-gray-200 font-bold px-5 py-3.5 rounded-xl text-xs sm:text-sm border border-slate-700 transition"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default TokenGen;
