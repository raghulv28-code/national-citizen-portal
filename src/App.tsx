import React, { useState } from 'react';
import { QueueProvider, useQueue } from './context/QueueContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import Home from './pages/Home';
import Services from './pages/Services';
import TokenGen from './pages/TokenGen';
import LiveDisplay from './pages/LiveDisplay';
import CitizenDash from './pages/CitizenDash';
import OfficerDash from './pages/OfficerDash';
import AdminDash from './pages/AdminDash';
import SuperAdminDash from './pages/SuperAdminDash';
import { Home as HomeIcon, BookOpen, Ticket, Monitor, User, ShieldCheck, AreaChart, Settings, HelpCircle, ArrowRight } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { user, language } = useQueue();
  const [currentView, setCurrentView] = useState<string>('home');

  const navigationLabels = {
    en: {
      home: 'Home',
      services: 'Service Directory',
      tokenGen: 'Get Token',
      live: 'Live LED Board',
      citizen: 'Citizen Workspace',
      officer: 'Officer Desk',
      admin: 'Director Desk',
      super: 'System Console',
      alertBanner: 'National e-Queue Portal actively monitoring counter volumes.'
    },
    hi: {
      home: 'मुख्य पृष्ठ',
      services: 'सेवा निर्देशिका',
      tokenGen: 'टोकन प्राप्त करें',
      live: 'लाइव एलईडी बोर्ड',
      citizen: 'नागरिक कार्यक्षेत्र',
      officer: 'अधिकारी डेस्क',
      admin: 'निदेशक डेस्क',
      super: 'सिस्टम कंसोल',
      alertBanner: 'राष्ट्रीय ई-कतार पोर्टल सक्रिय रूप से काउंटरों की निगरानी कर रहा है।'
    },
    ta: {
      home: 'முகப்பு',
      services: 'சேவை அடைவு',
      tokenGen: 'டோக்கன் பெறுக',
      live: 'நேரடி எல்இடி போர்டு',
      citizen: 'குடிமகன் பக்கம்',
      officer: 'அதிகாரி பணிமனை',
      admin: 'இயக்குனர் மேடை',
      super: 'கணினி பணியகம்',
      alertBanner: 'தேசிய மின்-வரிசை போர்டல் கவுண்டர் அளவுகளை தீவிரமாக கண்காணிக்கிறது.'
    }
  };

  const nav = navigationLabels[language];

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home onNavigate={(v) => {
          if (v === 'token-gen') setCurrentView('token-gen');
          if (v === 'appointment') setCurrentView('citizen-dashboard');
          if (v === 'services') setCurrentView('services');
          if (v === 'live-queue') setCurrentView('live-queue');
          if (v === 'citizen-dashboard') setCurrentView('citizen-dashboard');
        }} />;
      case 'services':
        return <Services />;
      case 'token-gen':
        return <TokenGen onNavigate={(v) => setCurrentView(v)} />;
      case 'live-queue':
        return <LiveDisplay />;
      case 'citizen-dashboard':
        return <CitizenDash />;
      case 'officer-dashboard':
        return <OfficerDash />;
      case 'admin-dashboard':
        return <AdminDash />;
      case 'super-dashboard':
        return <SuperAdminDash />;
      default:
        return <Home onNavigate={(v) => setCurrentView(v)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-gray-100 flex flex-col transition-colors duration-300 font-sans">
      
      {/* Top Government Ribbon */}
      <div className="h-1.5 bg-gradient-to-r from-orange-500 via-white to-green-600 w-full shrink-0"></div>

      {/* Official Government Header */}
      <Header />

      {/* Primary Navigation Hub */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'home', label: nav.home, icon: HomeIcon },
              { id: 'services', label: nav.services, icon: BookOpen },
              { id: 'token-gen', label: nav.tokenGen, icon: Ticket },
              { id: 'live-queue', label: nav.live, icon: Monitor },
              { id: 'citizen-dashboard', label: nav.citizen, icon: User }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[11px] font-extrabold uppercase tracking-wider transition cursor-pointer border ${
                    isActive
                      ? 'bg-[#002B5B] dark:bg-blue-600 text-white border-[#002B5B] dark:border-blue-600 shadow-md'
                      : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 shadow-xs'
                  }`}
                >
                  <Icon size={13} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Separator line on small screens, spacer on larger ones */}
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden lg:block" />

          {/* Administrative Portals Quick Switcher (visible to all for quick assessment) */}
          <div className="flex flex-wrap gap-1.5 pt-2 sm:pt-0">
            {[
              { id: 'officer-dashboard', label: nav.officer, icon: ShieldCheck, role: 'OFFICER' },
              { id: 'admin-dashboard', label: nav.admin, icon: AreaChart, role: 'ADMIN' },
              { id: 'super-dashboard', label: nav.super, icon: Settings, role: 'SUPER_ADMIN' }
            ].map((item) => {
              const Icon = item.icon;
              const isRoleActive = user?.role === item.role;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-[11px] font-extrabold uppercase tracking-wider transition cursor-pointer border ${
                    isActive
                      ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                      : isRoleActive
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                        : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-gray-400 shadow-xs'
                  }`}
                >
                  <Icon size={13} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Running Info Banner */}
      <div className="bg-slate-100 dark:bg-slate-950 py-2.5 px-4 text-center border-b border-slate-200 dark:border-slate-900">
        <p className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2 uppercase tracking-wide">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse shrink-0" />
          <span>{nav.alertBanner}</span>
        </p>
      </div>

      {/* Main Dynamic Workspace Container */}
      <main id="gov-workspace" className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 md:py-10">
        {renderView()}
      </main>

      {/* AI Bot float action dialog */}
      <AIAssistant />

      {/* State Official Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <QueueProvider>
      <MainAppContent />
    </QueueProvider>
  );
}
