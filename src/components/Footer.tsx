import React from 'react';
import { useQueue } from '../context/QueueContext';
import { Shield, PhoneCall, Globe, CheckCircle2, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language } = useQueue();

  const content = {
    en: {
      desc: 'National citizen queue platform for fast-track public document generation and token booking across municipal boards, land record units, and local electrical circles.',
      helpline: 'State Helpline Desk',
      links: 'Citizen Guidelines',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      accessibility: 'Accessibility Declaration',
      emergency: 'Call 1912 for immediate administrative support.',
      rights: 'All Rights Reserved. Digital India Corporation.',
      designed: 'Designed and engineered for state counter services.'
    },
    hi: {
      desc: 'नगरपालिका बोर्डों, भूमि रिकॉर्ड इकाइयों और स्थानीय विद्युत मंडलों में तेजी से सार्वजनिक दस्तावेज बनाने और टोकन बुकिंग के लिए राष्ट्रीय नागरिक कतार मंच।',
      helpline: 'राज्य हेल्पलाइन डेस्क',
      links: 'नागरिक दिशानिर्देश',
      terms: 'सेवा की शर्तें',
      privacy: 'गोपनीयता नीति',
      accessibility: 'पहुंच घोषणा',
      emergency: 'तत्काल प्रशासनिक सहायता के लिए 1912 पर कॉल करें।',
      rights: 'सर्वाधिकार सुरक्षित। डिजिटल इंडिया कॉर्पोरेशन।',
      designed: 'राज्य काउंटर सेवाओं के लिए विशेष रूप से डिज़ाइन किया गया।'
    },
    ta: {
      desc: 'நகராட்சி வாரியங்கள், நிலப் பதிவு அலகுகள் மற்றும் உள்ளூர் மின்சார வட்டங்களில் விரைவான பொது ஆவண உருவாக்கம் மற்றும் டோக்கன் முன்பதிவுக்கான தேசிய குடிமக்கள் வரிசை தளம்.',
      helpline: 'மாநில உதவி மையம்',
      links: 'குடிமக்கள் வழிகாட்டுதல்கள்',
      terms: 'சேவை விதிமுறைகள்',
      privacy: 'தனியுரிமைக் கொள்கை',
      accessibility: 'அணுகல்தன்மை பிரகடனம்',
      emergency: 'உடனடி நிர்வாக ஆதரவுக்கு 1912 ஐ அழைக்கவும்.',
      rights: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. டிஜிட்டல் இந்தியா கார்ப்பரேஷன்.',
      designed: 'மாநில கவுண்டர் சேவைகளுக்காக வடிவமைக்கப்பட்டது.'
    }
  };

  const c = content[language];

  return (
    <footer id="gov-footer" className="bg-[#002B5B] text-blue-100/70 border-t-4 border-orange-500">
      {/* Top Footer Sections */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="p-1.5 bg-orange-500 rounded text-white font-black text-xs uppercase tracking-widest">NIC</span>
            <span className="font-extrabold text-white tracking-widest text-xs uppercase">DIGITAL INDIA CELLS</span>
          </div>
          <p className="text-xs text-blue-100/60 leading-relaxed uppercase tracking-wider font-medium text-[10px]">
            {c.desc}
          </p>
          <div className="mt-4 flex items-center gap-2 text-[9px] text-green-400 bg-white/5 p-2 rounded border border-green-400/20 max-w-max uppercase tracking-wider font-black">
            <CheckCircle2 size={12} className="text-green-400" />
            <span>VeriSafe SSL Encrypted Portal</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-4 border-l-2 border-orange-500 pl-2">
            {c.links}
          </h3>
          <ul className="space-y-2 text-xs uppercase tracking-wider font-semibold text-[10px]">
            <li><a href="#services" className="hover:text-orange-400 transition">Browse Service Centers</a></li>
            <li><a href="#token-track" className="hover:text-orange-400 transition">Track Token Status</a></li>
            <li><a href="#appointment" className="hover:text-orange-400 transition">Schedule Appointments</a></li>
            <li><a href="#about" className="hover:text-orange-400 transition">National Portal directory</a></li>
          </ul>
        </div>

        {/* Legal Policies */}
        <div>
          <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-4 border-l-2 border-orange-500 pl-2">
            Legal & Compliance
          </h3>
          <ul className="space-y-2 text-xs uppercase tracking-wider font-semibold text-[10px]">
            <li><a href="#terms" className="hover:text-orange-400 transition">{c.terms}</a></li>
            <li><a href="#privacy" className="hover:text-orange-400 transition">{c.privacy}</a></li>
            <li><a href="#accessibility" className="hover:text-orange-400 transition">{c.accessibility}</a></li>
            <li><a href="#sitemap" className="hover:text-orange-400 transition">Sitemap Circulars</a></li>
          </ul>
        </div>

        {/* Emergency Helpline Contact */}
        <div>
          <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-4 border-l-2 border-orange-500 pl-2">
            {c.helpline}
          </h3>
          <div className="bg-black/20 p-4 rounded-lg border border-white/10">
            <div className="flex items-center gap-3 mb-2.5 text-white">
              <PhoneCall size={18} className="text-orange-400 animate-pulse" />
              <div>
                <p className="text-[9px] text-blue-200 uppercase tracking-wider font-black">Toll-Free Support</p>
                <p className="text-sm font-black font-mono text-orange-400">1800-425-1912</p>
              </div>
            </div>
            <p className="text-[9px] text-blue-100/60 leading-normal uppercase tracking-wider font-semibold">
              {c.emergency}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black/20 text-[9px] py-6 border-t border-white/5 px-4 font-bold uppercase tracking-widest text-blue-100/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-blue-100/30" />
            <span>&copy; 2026 NIC. {c.rights}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>{c.designed}</span>
            <Heart size={11} className="text-orange-500 fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
