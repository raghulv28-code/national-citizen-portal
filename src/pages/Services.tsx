import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { DEPARTMENTS, SERVICES } from '../data';
import { Landmark, Fingerprint, FileText, Briefcase, Building2, Shield, Zap, Info, Clock, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { Service } from '../types';

export const Services: React.FC = () => {
  const { language } = useQueue();
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const getDeptIcon = (iconName: string) => {
    const iconClass = "text-[#002B5B] dark:text-blue-400";
    switch (iconName) {
      case 'Landmark': return <Landmark className={iconClass} size={24} />;
      case 'Fingerprint': return <Fingerprint className={iconClass} size={24} />;
      case 'FileText': return <FileText className={iconClass} size={24} />;
      case 'Briefcase': return <Briefcase className={iconClass} size={24} />;
      case 'Building2': return <Building2 className={iconClass} size={24} />;
      case 'Shield': return <Shield className={iconClass} size={24} />;
      case 'Zap': return <Zap className={iconClass} size={24} />;
      default: return <Landmark className={iconClass} size={24} />;
    }
  };

  const translations = {
    en: {
      header: 'Government service Center Registry',
      sub: 'Browse direct state directories and verify required files before taking queue slots.',
      lblDept: 'Service Departments',
      lblServices: 'Services catalog',
      btnChecklist: 'Check Mandatory Documents',
      btnBack: 'Close Directory',
      modalHead: 'STATE DOCUMENT VERIFICATION CHECKLIST',
      modalSec: 'Mandatory items required at the Counter',
      modalWait: 'Estimated Service processing'
    },
    hi: {
      header: 'सरकारी सेवा केंद्र रजिस्ट्री',
      sub: 'कतार स्लॉट लेने से पहले सीधे राज्य निर्देशिकाओं को ब्राउज़ करें और आवश्यक फ़ाइलों का सत्यापन करें।',
      lblDept: 'सेवा विभाग',
      lblServices: 'सेवाएं कैटलॉग',
      btnChecklist: 'अनिवार्य दस्तावेजों की जांच करें',
      btnBack: 'निर्देशिका बंद करें',
      modalHead: 'राज्य दस्तावेज सत्यापन चेकलिस्ट',
      modalSec: 'काउंटर पर आवश्यक अनिवार्य वस्तुएं',
      modalWait: 'अनुमानित सेवा प्रसंस्करण समय'
    },
    ta: {
      header: 'அரசு சேவை மைய பதிவேடு',
      sub: 'வரிசை இடங்களைப் பெறுவதற்கு முன், மாநில விவரங்களை உலாவவும், தேவையான கோப்புகளை சரிபார்க்கவும்.',
      lblDept: 'சேவைத் துறைகள்',
      lblServices: 'சேவைகள் பட்டியல்',
      btnChecklist: 'கட்டாய ஆவணங்களை சரிபார்க்கவும்',
      btnBack: 'டைரக்டரியை மூடு',
      modalHead: 'மாநில ஆவண சரிபார்ப்பு பட்டியல்',
      modalSec: 'கவுண்டரில் சமர்ப்பிக்க வேண்டிய கட்டாய ஆவணங்கள்',
      modalWait: 'மதிப்பிடப்பட்ட சேவை நேரம்'
    }
  };

  const t = translations[language];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100">
          {t.header}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          {t.sub}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {DEPARTMENTS.map((dept) => {
          const deptServices = SERVICES.filter(s => s.departmentId === dept.id);
          return (
            <div
              key={dept.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Header Info */}
                <div className="flex gap-4 items-start border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 rounded-lg">
                    {getDeptIcon(dept.icon)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase font-mono tracking-wider">
                        DEPT ID: {dept.code}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base mt-1.5 uppercase tracking-tight">
                      {dept.name}
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">
                      {dept.description}
                    </p>
                  </div>
                </div>

                {/* Services Catalog List */}
                <div className="space-y-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-slate-500">
                    {t.lblServices} ({deptServices.length})
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {deptServices.map((srv) => (
                      <div
                        key={srv.id}
                        onClick={() => setSelectedService(srv)}
                        className="p-3 bg-slate-50 dark:bg-slate-950/40 hover:bg-blue-500/5 hover:border-blue-500/30 border border-slate-200 dark:border-slate-800 rounded-lg text-left cursor-pointer transition flex justify-between items-center group"
                      >
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-tight truncate pr-2">
                          {srv.name}
                        </span>
                        <ChevronRight size={14} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Required Checklist modal Popup */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[#002B5B] p-5 text-white flex justify-between items-center border-b border-white/10">
              <div className="flex items-center gap-3">
                <Info size={20} className="text-orange-400" />
                <div>
                  <h4 className="text-[10px] font-black tracking-widest text-orange-400 uppercase">
                    {t.modalHead}
                  </h4>
                  <p className="font-bold text-sm text-gray-100 leading-tight uppercase tracking-wide mt-0.5">
                    {selectedService.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content body */}
            <div className="p-6 space-y-6">
              {/* Avg wait */}
              <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">
                  {t.modalWait}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold font-mono text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-full">
                  <Clock size={13} /> {selectedService.avgMinutes} Minutes
                </span>
              </div>

              {/* Required Documents checklist */}
              <div className="space-y-3.5">
                <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  {t.modalSec}
                </h5>
                <ul className="space-y-2.5">
                  {selectedService.requiredDocuments.map((doc, idx) => (
                    <li
                      key={idx}
                      className="flex gap-3 items-start text-xs text-gray-700 dark:text-gray-300"
                    >
                      <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{doc}</p>
                        <p className="text-[10px] text-gray-400">Original & duplicate copy required for verification.</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setSelectedService(null)}
                className="bg-slate-800 text-white hover:bg-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                {t.btnBack}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Services;
