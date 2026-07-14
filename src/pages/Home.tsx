import React from 'react';
import { useQueue } from '../context/QueueContext';
import { Ticket, Calendar, Monitor, Users, CheckSquare, Clock, ArrowRight, ShieldAlert, FileText } from 'lucide-react';

interface HomeProps {
  onNavigate: (view: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { state, announcements, language } = useQueue();

  const totalGenerated = state.tokens.length;
  const activeCounters = state.counters.filter(c => c.status === 'OPEN').length;
  
  // Calculate average wait time (simulated based on pending tokens)
  const pendingCount = state.tokens.filter(t => t.status === 'PENDING').length;
  const avgWait = pendingCount > 0 ? Math.min(60, Math.ceil(pendingCount * 12 / Math.max(1, activeCounters))) : 12;

  const translations = {
    en: {
      welcome: 'Skip the Wait. Book Your Spot.',
      sub: 'Generate official digital tokens, schedule future appointments, and monitor live queue statuses in real time before visiting state office service wings.',
      btnGen: 'Generate Token Now',
      btnApt: 'Schedule Appointment',
      quickStats: 'Quick Bureau Statistics',
      vToday: 'Today\'s Visitors',
      cActive: 'Counters Active',
      avgW: 'Avg. Waiting Time',
      genToks: 'Tokens Issued Today',
      quickActions: 'Quick Citizen Gateways',
      noticeHeader: 'Central Emergency announcements',
      timings: 'Office Operating Timings',
      monLive: 'View Public LED Display'
    },
    hi: {
      welcome: 'कतार से बचें। अपना स्थान सुरक्षित करें।',
      sub: 'राज्य कार्यालय सेवा विंग में जाने से पहले वास्तविक समय में आधिकारिक डिजिटल टोकन उत्पन्न करें, भविष्य की नियुक्तियों को निर्धारित करें और लाइव कतार की स्थिति की निगरानी करें।',
      btnGen: 'अभी टोकन जनरेट करें',
      btnApt: 'अपॉइंटमेंट बुक करें',
      quickStats: 'त्वरित ब्यूरो सांख्यिकी',
      vToday: 'आज के आगंतुक',
      cActive: 'सक्रिय काउंटर',
      avgW: 'औसत प्रतीक्षा समय',
      genToks: 'आज जारी किए गए टोकन',
      quickActions: 'त्वरित नागरिक गेटवे',
      noticeHeader: 'केंद्रीय आपातकालीन घोषणाएं',
      timings: 'कार्यालय संचालन का समय',
      monLive: 'सार्वजनिक एलईडी डिस्प्ले देखें'
    },
    ta: {
      welcome: 'வரிசையைத் தவிர்க்கவும். உங்கள் இடத்தை முன்பதிவு செய்யுங்கள்.',
      sub: 'அரசு சேவை மையங்களுக்குச் செல்வதற்கு முன், டிஜிட்டல் டோக்கன்களை உருவாக்கவும், சந்திப்புகளைத் திட்டமிடவும், நேரடி வரிசை நிலைகளைக் கண்காணிக்கவும்.',
      btnGen: 'டோக்கன் உருவாக்கவும்',
      btnApt: 'அப்பாயிண்ட்மெண்ட் முன்பதிவு',
      quickStats: 'விரைவு புள்ளிவிவரங்கள்',
      vToday: 'இன்றைய பார்வையாளர்கள்',
      cActive: 'செயலில் உள்ள கவுண்டர்கள்',
      avgW: 'சராசரி காத்திருப்பு நேரம்',
      genToks: 'இன்று வழங்கப்பட்ட டோக்கன்கள்',
      quickActions: 'விரைவு குடிமக்கள் நுழைவாயில்கள்',
      noticeHeader: 'மத்திய அவசர அறிவிப்புகள்',
      timings: 'அலுவலக வேலை நேரம்',
      monLive: 'பொது எல்.ஈ.டி காட்சியைப் பார்க்கவும்'
    }
  };

  const t = translations[language];

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Active Emergencies Rolling Ticker */}
      {announcements.filter(a => a.category === 'EMERGENCY').length > 0 && (
        <div className="bg-red-500/10 border-y border-red-500/30 py-3.5 px-4 text-xs font-bold text-red-500 flex items-center gap-3">
          <ShieldAlert size={16} className="animate-bounce text-red-500 shrink-0" />
          <div className="overflow-hidden relative w-full h-4">
            <span className="absolute animate-marquee whitespace-nowrap pl-full">
              {announcements.filter(a => a.category === 'EMERGENCY')[0]?.content}
            </span>
          </div>
        </div>
      )}

      {/* Hero Layout */}
      <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#002B5B] via-[#003c7d] to-[#001d3f] text-white p-8 md:p-12 shadow-md border border-[#002B5B]/30">
        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-orange-400 rounded-lg text-[10px] font-extrabold tracking-widest uppercase border border-white/20">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            LIVE QUEUE SYNC ACTIVE
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight uppercase">
            {t.welcome}
          </h2>
          <p className="text-xs md:text-sm text-blue-100/80 leading-relaxed max-w-2xl font-medium uppercase tracking-wider">
            {t.sub}
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => onNavigate('token-gen')}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded text-white font-black text-xs uppercase tracking-widest shadow-lg transition active:scale-95 flex items-center gap-2"
            >
              <Ticket size={14} /> {t.btnGen} <ArrowRight size={12} />
            </button>
            <button
              onClick={() => onNavigate('appointment')}
              className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded font-black text-xs uppercase tracking-widest transition active:scale-95 flex items-center gap-2"
            >
              <Calendar size={14} /> {t.btnApt}
            </button>
          </div>
        </div>

        {/* Decorative Grid Mesh */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-5 hidden lg:block" />
      </section>

      {/* Quick Statistics Bar */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">
            {t.quickStats}
          </h3>
          <span className="text-[9px] bg-green-500/10 text-green-600 dark:text-green-400 font-extrabold px-2 py-0.5 rounded uppercase tracking-wider border border-green-500/20">
            AUTO REFRESH: 3s
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800 shadow-sm">
          {[
            { label: t.vToday, value: totalGenerated + 142, icon: Users, color: 'text-blue-500', sub: '+12% load' },
            { label: t.genToks, value: totalGenerated, icon: Ticket, color: 'text-orange-500', sub: 'Active issued' },
            { label: t.cActive, value: `${activeCounters}/7`, icon: CheckSquare, color: 'text-green-500', sub: 'System Normal' },
            { label: t.avgW, value: `${avgWait}m`, icon: Clock, color: 'text-amber-500', sub: 'Target: 15m' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-6 flex flex-col justify-center bg-white dark:bg-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition"
              >
                <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <Icon size={12} className={stat.color} />
                  {stat.label}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#002B5B] dark:text-blue-400 tracking-tight leading-none">
                    {stat.value}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{stat.sub}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Primary Grid: Quick Gateways & Timing Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gateways */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
            {t.quickActions}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div
              onClick={() => onNavigate('services')}
              className="bg-white dark:bg-slate-900 hover:border-orange-500 dark:hover:border-orange-500 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl cursor-pointer transition shadow-sm hover:shadow-md group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <FileText className="text-orange-500" size={24} />
                <h4 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-orange-500 transition text-sm">
                  Service Center Guides
                </h4>
                <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                  Browse list of government departments, check eligibility, and view mandatory checklists verified by officers.
                </p>
              </div>
              <span className="text-[11px] text-orange-500 font-bold flex items-center gap-1 mt-4 group-hover:translate-x-1.5 transition-transform duration-300">
                Explore Services &rarr;
              </span>
            </div>

            <div
              onClick={() => onNavigate('live-queue')}
              className="bg-white dark:bg-slate-900 hover:border-orange-500 dark:hover:border-orange-500 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl cursor-pointer transition shadow-sm hover:shadow-md group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <Monitor className="text-orange-500" size={24} />
                <h4 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-orange-500 transition text-sm">
                  {t.monLive}
                </h4>
                <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                  View full LED style counters board. Speaks currently called tokens aloud using dynamic Speech Synthesizers.
                </p>
              </div>
              <span className="text-[11px] text-orange-500 font-bold flex items-center gap-1 mt-4 group-hover:translate-x-1.5 transition-transform duration-300">
                Open Display Board &rarr;
              </span>
            </div>
          </div>
        </div>

        {/* Notices & Office Schedules */}
        <div className="space-y-6">
          {/* Working Timings */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 text-white p-5 rounded-2xl space-y-4 shadow-md">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 border-b border-slate-800 pb-2">
              {t.timings}
            </h4>
            <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
              <div className="flex justify-between">
                <span>Working Days:</span>
                <span className="font-semibold text-white">Monday - Saturday</span>
              </div>
              <div className="flex justify-between">
                <span>Counters Hours:</span>
                <span className="font-semibold text-white font-mono">09:00 AM - 06:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Lunch Break:</span>
                <span className="font-semibold text-orange-400 font-mono">01:30 PM - 02:00 PM</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800">
                <span>Current Status:</span>
                <span className="bg-green-500/10 text-green-400 border border-green-500/30 px-2.5 py-0.5 rounded font-black uppercase text-[10px]">
                  Open Now
                </span>
              </div>
            </div>
          </div>

          {/* Administrative Notice Cards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Recent Service Circulars
            </h4>
            <div className="space-y-3">
              {announcements.slice(0, 2).map((a, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm text-xs space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      a.category === 'NOTICE' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    }`}>
                      {a.category}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">{a.date}</span>
                  </div>
                  <h5 className="font-bold text-gray-800 dark:text-gray-200">
                    {a.title}
                  </h5>
                  <p className="text-gray-400 dark:text-gray-500 leading-relaxed">
                    {a.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
