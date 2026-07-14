import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { Landmark, Sun, Moon, Languages, ShieldAlert, LogIn, LogOut, ChevronDown, User, Shield } from 'lucide-react';
import { TEST_USERS } from '../data';

export const Header: React.FC = () => {
  const { user, login, logout, language, setLanguage, darkMode, setDarkMode } = useQueue();
  const [showQuickLogin, setShowQuickLogin] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const translations = {
    en: {
      title: 'NATIONAL CITIZEN PORTAL',
      subtitle: 'Smart Public Service Counter & Queue System',
      govt: 'GOVERNMENT OF INDIA',
      quickLogin: 'Quick Login',
      logout: 'Logout',
      roles: 'Role Actions',
      activeUser: 'Logged in as',
      langLabel: 'Languages'
    },
    hi: {
      title: 'राष्ट्रीय नागरिक पोर्टल',
      subtitle: 'स्मार्ट लोक सेवा काउंटर और कतार प्रणाली',
      govt: 'भारत सरकार',
      quickLogin: 'त्वरित प्रवेश',
      logout: 'लॉग आउट',
      roles: 'भूमिका कार्रवाई',
      activeUser: 'लॉग इन किया',
      langLabel: 'भाषाएं'
    },
    ta: {
      title: 'தேசிய குடிமக்கள் போர்டல்',
      subtitle: 'ஸ்மார்ட் பொது சேவை கவுண்டர் & வரிசை மேலாண்மை',
      govt: 'இந்திய அரசு',
      quickLogin: 'விரைவு உள்நுழைவு',
      logout: 'வெளியேறு',
      roles: 'பங்கு நடவடிக்கைகள்',
      activeUser: 'உள்நுழைந்துள்ளார்',
      langLabel: 'மொழிகள்'
    }
  };

  const t = translations[language];

  const handleQuickLogin = async (email: string, role: string) => {
    await login(email, role);
    setShowQuickLogin(false);
  };

  return (
    <header className="bg-[#002B5B] dark:bg-slate-950 text-white shadow-md relative z-50">
      {/* Top Banner */}
      <div className="bg-[#001c3d] dark:bg-slate-900 text-[11px] text-blue-200/80 py-2 px-4 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="font-bold text-orange-400 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
            SECURE GOVERNMENT PORTAL
          </span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="hidden sm:inline font-medium uppercase tracking-wider text-[10px]">Ministry of Personnel, Public Grievances & Pensions</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="hover:text-white transition flex items-center gap-1 font-medium text-[10px]">
            <ShieldAlert size={12} className="text-orange-500" /> WCAG 2.1 AAA Compliant
          </button>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="font-mono text-blue-300">Time: 10:23 AM IST</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* State Seal & Logo Pairing */}
        <div className="flex items-center gap-4 cursor-pointer">
          <div className="bg-white rounded-full flex items-center justify-center p-2 shadow-lg w-12 h-12 border border-slate-200">
            <Landmark size={24} className="text-[#002B5B]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-white/15 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-widest uppercase border border-white/10">
                {t.govt}
              </span>
            </div>
            <h1 className="text-lg font-black tracking-tight leading-none text-white sm:text-xl uppercase mt-1">
              {t.title}
            </h1>
            <p className="text-xs text-blue-200/75 font-semibold uppercase tracking-wider mt-0.5">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Action Widgets */}
        <div className="flex items-center flex-wrap justify-center gap-3">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="bg-slate-800/80 hover:bg-slate-800 text-gray-200 px-3.5 py-2 rounded-lg text-sm font-medium border border-slate-700 flex items-center gap-2 transition"
            >
              <Languages size={15} className="text-orange-500" />
              <span>
                {language === 'en' ? 'English' : language === 'hi' ? 'हिन्दी' : 'தமிழ்'}
              </span>
              <ChevronDown size={14} className="opacity-60" />
            </button>

            {showLanguageDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
                <button
                  onClick={() => { setLanguage('en'); setShowLanguageDropdown(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-800 transition ${language === 'en' ? 'text-orange-400 font-bold bg-slate-800/40' : 'text-gray-300'}`}
                >
                  English (EN)
                </button>
                <button
                  onClick={() => { setLanguage('hi'); setShowLanguageDropdown(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-800 transition ${language === 'hi' ? 'text-orange-400 font-bold bg-slate-800/40' : 'text-gray-300'}`}
                >
                  हिन्दी (Hindi)
                </button>
                <button
                  onClick={() => { setLanguage('ta'); setShowLanguageDropdown(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-800 transition ${language === 'ta' ? 'text-orange-400 font-bold bg-slate-800/40' : 'text-gray-300'}`}
                >
                  தமிழ் (Tamil)
                </button>
              </div>
            )}
          </div>

          {/* Dark Mode Switcher */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-slate-800/80 hover:bg-slate-800 text-gray-200 p-2 rounded-lg border border-slate-700 transition"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-blue-400" />}
          </button>

          {/* Quick-Login Panel Trigger for Evaluators */}
          <div className="relative">
            <button
              onClick={() => setShowQuickLogin(!showQuickLogin)}
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2 transition"
            >
              <LogIn size={15} />
              <span>{user ? `${user.name.split(' ')[0]} (${user.role})` : t.quickLogin}</span>
              <ChevronDown size={14} className="opacity-80" />
            </button>

            {showQuickLogin && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 text-left">
                <div className="bg-slate-950 p-3.5 border-b border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                    <Shield size={13} /> Select Testing Profile
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Toggle roles instantly to explore the fully functional dashboard workflows.
                  </p>
                </div>
                <div className="p-1 max-h-80 overflow-y-auto">
                  {TEST_USERS.map((u, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickLogin(u.email, u.role)}
                      className="w-full text-left px-3.5 py-2.5 rounded-lg hover:bg-slate-800 flex items-center justify-between text-sm transition group"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-200 group-hover:text-orange-400 transition">
                          {u.name}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          {u.email}
                        </span>
                      </div>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                        u.role === 'SUPER_ADMIN' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        u.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                        u.role === 'OFFICER' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </button>
                  ))}
                </div>
                {user && (
                  <div className="p-2 border-t border-slate-800 bg-slate-950">
                    <button
                      onClick={() => { logout(); setShowQuickLogin(false); }}
                      className="w-full bg-red-600/20 text-red-400 border border-red-500/30 font-bold hover:bg-red-600 hover:text-white py-1.5 rounded-lg text-xs transition flex items-center justify-center gap-1.5"
                    >
                      <LogOut size={13} /> Log Out Active Session
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
