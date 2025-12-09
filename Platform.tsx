
import React, { useState, useEffect, useRef } from 'react';
import { View, LaunchPadTemplate, Stage } from './types';
import Dashboard from './components/views/Dashboard';
import LaunchPads from './components/views/LaunchPads';
import MissionKits from './components/views/MissionKits';
import FlightPlans from './components/views/FlightPlans';
import Settings from './components/views/Settings';
import MissionCockpit from './components/views/MissionCockpit';
import AdminPanel from './components/views/AdminPanel';
import BrandIdentityLab from './components/views/BrandIdentityLab';
import SignalScanner from './components/views/SignalScanner';
import AcquisitionDeck from './components/views/AcquisitionDeck';
import BroadcastDeck from './components/views/BroadcastDeck';
import EngineeringDeck from './components/views/EngineeringDeck';
import MessageBuilder from './components/views/MessageBuilder';
import CommunicationDeck from './components/views/CommunicationDeck';
import { templates as initialTemplates } from './data/templates';
import { Rocket, LayoutDashboard, Briefcase, FileText, ListTodo, Settings as SettingsIcon, Command, Sun, Moon, ShieldAlert, TerminalSquare, Activity, GripHorizontal, Users, Radio, Workflow, MessageSquare } from 'lucide-react';

import { useMission } from './context/MissionContext';

const Platform: React.FC = () => {
  // App State
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [broadcastTab, setBroadcastTab] = useState<'campaigns' | 'audience' | 'templates' | 'analytics' | 'uplink'>('campaigns');
  const [engineeringTab, setEngineeringTab] = useState<'workflows' | 'integrations' | 'logs'>('workflows');
  const [communicationTab, setCommunicationTab] = useState<'inbox' | 'agents' | 'settings'>('inbox');
  const [acquisitionTab, setAcquisitionTab] = useState<'pipeline' | 'contacts' | 'calendar'>('pipeline');

  // Context State
  const {
    missionName,
    stage,
    setStage,
    template,
    setTemplate
  } = useMission();

  // Data State (Lifted for Admin Control)
  const [allTemplates, setAllTemplates] = useState<LaunchPadTemplate[]>(initialTemplates);

  // Draggable Dev Console State
  const [devConsolePosition, setDevConsolePosition] = useState<{ x: number, y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartOffset = useRef({ x: 0, y: 0 });
  const devConsoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Dragging Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if (devConsoleRef.current) {
      const rect = devConsoleRef.current.getBoundingClientRect();
      // If first drag, initialize position from current CSS position
      if (!devConsolePosition) {
        setDevConsolePosition({ x: rect.left, y: rect.top });
        dragStartOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      } else {
        dragStartOffset.current = { x: e.clientX - devConsolePosition.x, y: e.clientY - devConsolePosition.y };
      }
      setIsDragging(true);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setDevConsolePosition({
          x: e.clientX - dragStartOffset.current.x,
          y: e.clientY - dragStartOffset.current.y
        });
      }
    };
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLaunchPadDeployed = (template: LaunchPadTemplate) => {
    setTemplate(template);
    // Navigate to Mission Kits after deployment
    setCurrentView('missionkits');
  };

  // Admin CRUD Functions
  const handleAddTemplate = (template: LaunchPadTemplate) => {
    setAllTemplates([...allTemplates, template]);
  };

  const handleUpdateTemplate = (template: LaunchPadTemplate) => {
    setAllTemplates(allTemplates.map(t => t.id === template.id ? template : t));
  };

  const handleDeleteTemplate = (id: string) => {
    setAllTemplates(allTemplates.filter(t => t.id !== id));
  };

  // Dev Tool Actions
  const handleStageSwitch = (newStage: Stage) => {
    setStage(newStage);
    if (currentView === 'admin') setCurrentView('dashboard');
  };

  const toggleAdminView = () => {
    if (currentView === 'admin') {
      setCurrentView('dashboard');
    } else {
      setCurrentView('admin');
    }
  };

  // Get active deck for sub-navigation headers
  const getActiveDeck = () => {
    if (['acquisition', 'broadcast', 'engineering', 'communication'].includes(currentView)) return currentView;
    return null;
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return (
        <Dashboard
          onNavigate={setCurrentView}
        />
      );
      case 'launchpads': return (
        <LaunchPads
          onDeploy={handleLaunchPadDeployed}
          templates={allTemplates}
          stage={stage}
        />
      );
      case 'missionkits': return <MissionKits onNavigate={setCurrentView} />;
      case 'flightplans': return <FlightPlans />;
      case 'settings': return <Settings />;
      case 'mission_cockpit': return <MissionCockpit onNavigate={setCurrentView} />;
      case 'brand_identity': return (
        <BrandIdentityLab
          onNavigate={setCurrentView}

        />
      );
      case 'signal_scanner': return (
        <SignalScanner
          onNavigate={setCurrentView}
          onValidationComplete={() => { }}
        />
      );
      case 'acquisition': return <AcquisitionDeck activeTab={acquisitionTab} onTabChange={setAcquisitionTab} />;
      case 'broadcast': return <BroadcastDeck onNavigate={setCurrentView} activeTab={broadcastTab} onTabChange={setBroadcastTab} />;
      case 'engineering': return <EngineeringDeck activeTab={engineeringTab} onTabChange={setEngineeringTab} />;
      case 'communication': return <CommunicationDeck activeTab={communicationTab} onTabChange={setCommunicationTab} />;
      case 'message_builder': return (
        <MessageBuilder
          onNavigate={setCurrentView}
          missionContext={{ name: missionName, industry: 'Technology' }}
        />
      );
      case 'admin': return (
        <AdminPanel
          templates={allTemplates}
          onAdd={handleAddTemplate}
          onUpdate={handleUpdateTemplate}
          onDelete={handleDeleteTemplate}
        />
      );
      default: return (
        <Dashboard
          onNavigate={setCurrentView}
        />
      );
    }
  };

  return (
    <div className={`min-h-screen bg-space-50 dark:bg-space-950 text-slate-900 dark:text-slate-200 font-sans selection:bg-orange-500/30 transition-colors duration-300`}>
      {/* Background Ambience - Global */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Light Mode Blobs (Subtle) */}
        <div className={`absolute transition-opacity duration-1000 ${theme === 'dark' ? 'opacity-0' : 'opacity-60'}`}>
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-100 rounded-full blur-[100px]" />
        </div>

        {/* Dark Mode Blobs (Deep) */}
        <div className={`absolute w-full h-full transition-opacity duration-1000 ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/10 rounded-full blur-[120px]" />
          <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] bg-orange-500/5 rounded-full blur-[100px]" />

          {/* Stars (Simple CSS implementation for dark mode depth) */}
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        </div>
      </div>

      {/* DEV TOOLS OVERLAY (Draggable) */}
      <div
        ref={devConsoleRef}
        style={devConsolePosition ? { left: devConsolePosition.x, top: devConsolePosition.y, bottom: 'auto', right: 'auto' } : {}}
        className={`fixed z-50 flex flex-col items-end gap-2 pointer-events-auto ${!devConsolePosition ? 'bottom-6 right-6' : ''}`}
      >
        <div
          onMouseDown={handleMouseDown}
          className="text-[10px] font-mono text-slate-400 mb-1 bg-white/80 dark:bg-black/80 px-2 py-0.5 rounded backdrop-blur border border-slate-200 dark:border-slate-800 shadow-sm flex items-center cursor-move select-none"
        >
          <GripHorizontal size={12} className="mr-1.5 text-slate-400" />
          <Activity size={10} className="mr-1 text-emerald-500 animate-pulse" /> DEV TOOLS
        </div>
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 p-2 rounded-xl shadow-2xl flex items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button onClick={() => handleStageSwitch('ideation')} className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${stage === 'ideation' ? 'bg-indigo-500 text-white shadow' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>Ideation</button>
            <button onClick={() => handleStageSwitch('setup')} className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${stage === 'setup' ? 'bg-orange-500 text-white shadow' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>Setup</button>
            <button onClick={() => handleStageSwitch('growth')} className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${stage === 'growth' ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>Growth</button>
          </div>
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
          <button
            onClick={toggleAdminView}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 ${currentView === 'admin' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            title="Platform Admin Panel"
          >
            <TerminalSquare size={16} />
            <span className={`text-[10px] font-bold ${currentView === 'admin' ? 'block' : 'hidden md:block'}`}>
              {currentView === 'admin' ? 'ADMIN MODE ON' : 'ADMIN MODE'}
            </span>
          </button>
        </div>
      </div>



      <div className="relative z-10 flex h-screen overflow-hidden animate-fade-in">
        {/* Sidebar */}
        <aside className="w-20 lg:w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 z-20">
          <div>
            <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-200 dark:border-slate-800/50">
              <div className="relative w-10 h-10 bg-gradient-to-tr from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                <Rocket className="text-white transform -rotate-45" size={20} />
              </div>
              <h1 className="hidden lg:block ml-3 text-xl font-bold tracking-tight text-slate-800 dark:text-white">ROCKKET</h1>
            </div>

            <div className="mt-8 px-2 lg:px-4 space-y-8">
              {/* DASHBOARD - THE BRIDGE */}
              <div className="mb-6">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`w-full flex items-center justify-center lg:justify-start px-3 py-2.5 rounded-xl transition-all duration-200 group ${currentView === 'dashboard'
                    ? 'bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30'
                    : 'text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                >
                  <LayoutDashboard size={18} className={`${currentView === 'dashboard' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                  <span className="hidden lg:block ml-3 font-medium text-sm">The Bridge</span>
                  {currentView === 'dashboard' && <div className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />}
                </button>
              </div>

              {/* COMMAND DECKS */}
              <div>
                <h3 className="hidden lg:block text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest px-3 mb-2">Command Decks</h3>
                <nav className="space-y-1">
                  {[
                    { id: 'acquisition', label: 'Acquisition', icon: Users },
                    { id: 'broadcast', label: 'Broadcast', icon: Radio },
                    { id: 'engineering', label: 'Engineering', icon: Workflow },
                    { id: 'communication', label: 'Comms', icon: MessageSquare },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setCurrentView(item.id as View)}
                      className={`w-full flex items-center justify-center lg:justify-start px-3 py-2.5 rounded-xl transition-all duration-200 group ${currentView === item.id
                        ? 'bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30'
                        : 'text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                        }`}
                    >
                      <item.icon size={18} className={`${currentView === item.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                      <span className="hidden lg:block ml-3 font-medium text-sm">{item.label}</span>
                      {currentView === item.id && <div className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />}
                    </button>
                  ))}
                </nav>
              </div>

              {/* MISSION SUPPORT */}
              <div>
                <h3 className="hidden lg:block text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest px-3 mb-2">Mission Support</h3>
                <nav className="space-y-1">
                  {[
                    { id: 'launchpads', label: 'Launch Pads', icon: Briefcase },
                    { id: 'missionkits', label: 'Mission Kits', icon: FileText },
                    { id: 'flightplans', label: 'Flight Plans', icon: ListTodo },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setCurrentView(item.id as View)}
                      className={`w-full flex items-center justify-center lg:justify-start px-3 py-2.5 rounded-xl transition-all duration-200 group ${currentView === item.id
                        ? 'bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30'
                        : 'text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                        }`}
                    >
                      <item.icon size={18} className={`${currentView === item.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                      <span className="hidden lg:block ml-3 font-medium text-sm">{item.label}</span>
                      {currentView === item.id && <div className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-2 border-t border-slate-200 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-center lg:justify-start px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              <span className="hidden lg:block ml-3 font-medium text-sm">
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </span>
            </button>

            <button
              onClick={() => setCurrentView('settings')}
              className={`w-full flex items-center justify-center lg:justify-start px-3 py-2.5 rounded-xl transition-all ${currentView === 'settings'
                ? 'bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
            >
              <SettingsIcon size={18} />
              <span className="hidden lg:block ml-3 font-medium text-sm">System</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {/* Top Bar */}
          <header className="h-20 border-b border-slate-200 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md flex items-center justify-between px-8 transition-colors duration-300 z-10">
            {/* Dynamic Header Context */}
            <div className="flex items-center">
              <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm font-mono mr-6 border-r border-slate-300 dark:border-slate-700 pr-6 h-8">
                <Command size={14} className="mr-2" />
                <span className="opacity-50">SYSTEM STATUS: ONLINE</span>
              </div>

              {/* Context Sub-Nav */}
              {getActiveDeck() === 'acquisition' && (
                <div className="hidden md:flex gap-6 text-sm font-medium">
                  <button
                    onClick={() => setAcquisitionTab('pipeline')}
                    className={`transition-colors ${acquisitionTab === 'pipeline'
                      ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                  >
                    Pipelines
                  </button>
                  <button
                    onClick={() => setAcquisitionTab('contacts')}
                    className={`transition-colors ${acquisitionTab === 'contacts'
                      ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                  >
                    Contacts
                  </button>
                  <button
                    onClick={() => setAcquisitionTab('calendar')}
                    className={`transition-colors ${acquisitionTab === 'calendar'
                      ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                  >
                    Calendar
                  </button>
                </div>
              )}
              {getActiveDeck() === 'broadcast' && (
                <div className="hidden md:flex gap-6 text-sm font-medium">
                  <button
                    onClick={() => setBroadcastTab('campaigns')}
                    className={`transition-colors ${broadcastTab === 'campaigns'
                      ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                  >
                    Campaigns
                  </button>
                  <button
                    onClick={() => setBroadcastTab('templates')}
                    className={`transition-colors ${broadcastTab === 'templates'
                      ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                  >
                    Templates
                  </button>
                  <button
                    onClick={() => setBroadcastTab('analytics')}
                    className={`transition-colors ${broadcastTab === 'analytics'
                      ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                  >
                    Analytics
                  </button>
                </div>
              )}
              {getActiveDeck() === 'engineering' && (
                <div className="hidden md:flex gap-6 text-sm font-medium">
                  <button
                    onClick={() => setEngineeringTab('workflows')}
                    className={`transition-colors ${engineeringTab === 'workflows'
                      ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                  >
                    Workflows
                  </button>
                  <button
                    onClick={() => setEngineeringTab('integrations')}
                    className={`transition-colors ${engineeringTab === 'integrations'
                      ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                  >
                    Integrations
                  </button>
                  <button
                    onClick={() => setEngineeringTab('logs')}
                    className={`transition-colors ${engineeringTab === 'logs'
                      ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                  >
                    Logs
                  </button>
                </div>
              )}
              {getActiveDeck() === 'communication' && (
                <div className="hidden md:flex gap-6 text-sm font-medium">
                  <button
                    onClick={() => setCommunicationTab('inbox')}
                    className={`transition-colors ${communicationTab === 'inbox'
                      ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                  >
                    Inbox
                  </button>
                  <button
                    onClick={() => setCommunicationTab('agents')}
                    className={`transition-colors ${communicationTab === 'agents'
                      ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                  >
                    Agents
                  </button>
                  <button
                    onClick={() => setCommunicationTab('settings')}
                    className={`transition-colors ${communicationTab === 'settings'
                      ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                  >
                    Settings
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-end mr-2">
                <span className="text-slate-800 dark:text-white text-sm font-bold">{missionName}</span>
                <span className="text-xs text-indigo-500 dark:text-indigo-400 capitalize">
                  Stage: {stage}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-b from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 border border-slate-200 dark:border-slate-600 shadow-inner overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          </header>

          {/* View Container */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-8 relative scroll-smooth">
            {renderView()}
          </div>
        </main>
      </div>
    </div >
  );
};

export default Platform;
