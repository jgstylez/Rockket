
import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import {
  User, Building2, Users, Shield, Save, Mail, Upload,
  CreditCard, Bell, Lock, Plus, MoreHorizontal, BadgeCheck,
  Trash2, RefreshCw, Zap, Check, Rocket, AlertCircle, FileText,
  LogOut, Download, Layout
} from 'lucide-react';
import { TeamMember, Role } from '../../types';
import { useMission } from '../../context/MissionContext';

type SettingsTab = 'missions' | 'profile' | 'business' | 'team' | 'billing';

const Settings: React.FC = () => {
  const {
    user, login, logout,
    missions, currentMissionId, createMission, switchMission, deleteMission, exportCurrentMission,
    missionName, setMissionName
  } = useMission();

  const [activeTab, setActiveTab] = useState<SettingsTab>('missions');
  const [loading, setLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // New Mission State
  const [isCreatingMission, setIsCreatingMission] = useState(false);
  const [newMissionName, setNewMissionName] = useState('');

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginName, setLoginName] = useState('');

  // Mock State for Team (Preserved)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', name: 'Alex Commander', email: 'alex@rockket.io', role: 'Commander', status: 'Active', lastActive: 'Now' },
    { id: '2', name: 'Sarah Pilot', email: 'sarah@rockket.io', role: 'Pilot', status: 'Active', lastActive: '2h ago' },
    { id: '3', name: 'Mike Specialist', email: 'mike@rockket.io', role: 'Specialist', status: 'Offline', lastActive: '2d ago' },
    { id: '4', name: 'New Recruit', email: 'recruit@rockket.io', role: 'Specialist', status: 'Pending', lastActive: '-' },
  ]);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginName && loginEmail) {
      login(loginName, loginEmail);
    }
  };

  const handleCreateMission = () => {
    if (newMissionName.trim()) {
      createMission(newMissionName);
      setNewMissionName('');
      setIsCreatingMission(false);
    }
  };

  const getRoleColor = (role: Role) => {
    switch (role) {
      case 'Commander': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800';
      case 'Pilot': return 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800';
      case 'Specialist': return 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-fade-in h-full">

      {/* Settings Navigation */}
      <div className="lg:col-span-1 space-y-4">
        <GlassCard className="p-2">
          <nav className="space-y-1">
            {[
              { id: 'missions', label: 'Mission Control', icon: Layout },
              { id: 'profile', label: 'User Profile', icon: User },
              { id: 'business', label: 'Business Entity', icon: Building2 },
              { id: 'team', label: 'Crew & Permissions', icon: Users },
              { id: 'billing', label: 'Billing & Fuel', icon: CreditCard },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as SettingsTab)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${activeTab === item.id
                    ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
              >
                <item.icon size={18} className={`mr-3 ${activeTab === item.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                {item.label}
              </button>
            ))}
          </nav>
        </GlassCard>

        {/* User Info Widget */}
        <div className="hidden lg:block">
          <GlassCard className="bg-gradient-to-br from-indigo-600 to-purple-700 border-none text-white">
            {user ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    {user.avatar ? <img src={user.avatar} className="w-full h-full rounded-full" /> : <User size={20} />}
                  </div>
                  <div>
                    <div className="font-bold">{user.name}</div>
                    <div className="text-xs text-indigo-200">{user.email}</div>
                  </div>
                </div>
                <div className="w-full bg-black/20 rounded-full h-1.5 mb-2">
                  <div className="bg-white/90 h-1.5 rounded-full w-[95%]"></div>
                </div>
                <p className="text-indigo-100 text-xs">Security: Tier 1 (Encrypted)</p>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="font-bold mb-2">Guest Access</p>
                <p className="text-xs text-indigo-200 mb-4">Sign in to sync your missions</p>
                <button onClick={() => setActiveTab('profile')} className="text-xs bg-white text-indigo-600 px-3 py-1.5 rounded-lg font-bold">Sign In</button>
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      {/* Main Settings Content */}
      <div className="lg:col-span-3">

        {/* Missions Tab */}
        {activeTab === 'missions' && (
          <GlassCard className="animate-fade-in space-y-8">
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Mission Control</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Manage multiple startups and export your data.</p>
              </div>
              <button
                onClick={() => setIsCreatingMission(true)}
                className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Plus className="mr-2" size={16} /> New Mission
              </button>
            </div>

            {isCreatingMission && (
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 animate-slide-in">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">New Mission Name</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMissionName}
                    onChange={(e) => setNewMissionName(e.target.value)}
                    placeholder="e.g. Next Unicorn Inc."
                    className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800"
                    autoFocus
                  />
                  <button onClick={handleCreateMission} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500">Create</button>
                  <button onClick={() => setIsCreatingMission(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg hover:bg-slate-300">Cancel</button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Your Missions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {missions.map((mission) => (
                  <div
                    key={mission.id}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative group ${currentMissionId === mission.id
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-slate-900/50'
                      }`}
                    onClick={() => switchMission(mission.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className={`font-bold text-lg ${currentMissionId === mission.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>{mission.name}</h4>
                      {currentMissionId === mission.id && <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900 text-indigo-600 px-2 py-1 rounded-full font-bold uppercase">Active</span>}
                    </div>
                    <p className="text-xs text-slate-500">Last accessed: {new Date(mission.lastAccessed).toLocaleDateString()}</p>

                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteMission(mission.id); }}
                        className="p-1.5 bg-white dark:bg-slate-800 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 border border-slate-200 dark:border-slate-700 shadow-sm"
                        title="Delete Mission"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Data Management</h3>
              <div className="flex gap-4">
                <button
                  onClick={exportCurrentMission}
                  className="flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <Download size={16} className="mr-2" /> Export JSON
                </button>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <GlassCard className="animate-fade-in space-y-8">
            {!user ? (
              /* Login Form */
              <div className="max-w-md mx-auto text-center py-12">
                <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600 dark:text-indigo-400">
                  <Rocket size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome to Rockket</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8">Create your commander profile to sync your missions.</p>

                <form onSubmit={handleLogin} className="space-y-4 text-left">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Commander Name</label>
                    <input
                      type="text"
                      required
                      value={loginName}
                      onChange={e => setLoginName(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Email Channel</label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                  <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors mt-4">
                    Initialize Profile
                  </button>
                </form>
              </div>
            ) : (
              /* Authenticated Profile */
              <>
                <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Commander Profile</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your personal details and security credentials.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={logout}
                      className="flex items-center px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors"
                    >
                      <LogOut className="mr-2" size={16} /> Logout
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex items-center px-4 py-2 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      {loading ? <RefreshCw className="animate-spin mr-2" size={16} /> : <Save className="mr-2" size={16} />}
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-shrink-0 flex flex-col items-center space-y-4">
                    <div className="w-32 h-32 rounded-full bg-slate-200 dark:bg-slate-700 relative overflow-hidden group cursor-pointer border-4 border-white dark:border-slate-800 shadow-lg">
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                        <Upload className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <img src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.name} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <button className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">Change Avatar</button>
                  </div>

                  <div className="flex-1 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-2">Name</label>
                        <input type="text" defaultValue={user.name} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-2">Rank</label>
                        <input type="text" disabled defaultValue="Commander" className="w-full bg-slate-100 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-500" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input type="email" defaultValue={user.email} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                        <Lock size={16} className="mr-2 text-orange-500" /> Security
                      </h3>
                      <button className="text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        Change Password
                      </button>
                      <button className="ml-4 text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </GlassCard>
        )}

        {/* Business Tab (Modified to sync with Mission Name) */}
        {activeTab === 'business' && (
          <GlassCard className="animate-fade-in space-y-8">
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Entity Configuration</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Update your organization's legal and public profile.</p>
              </div>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {loading ? <RefreshCw className="animate-spin mr-2" size={16} /> : <Save className="mr-2" size={16} />}
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-2">Legal Business Name</label>
                  <input type="text" value={missionName} onChange={(e) => setMissionName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-2">Industry Sector</label>
                  <select className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option>Food & Beverage</option>
                    <option>Technology</option>
                    <option>Retail</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-2">Mission Headquarters (Address)</label>
                <input type="text" defaultValue="123 Nebula Way, Sector 7" className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none mb-3" />
                <div className="grid grid-cols-3 gap-4">
                  <input type="text" defaultValue="San Francisco" placeholder="City" className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white outline-none" />
                  <input type="text" defaultValue="CA" placeholder="State" className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white outline-none" />
                  <input type="text" defaultValue="94107" placeholder="Zip" className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-2 flex items-center">
                    <CreditCard size={16} className="mr-2 text-emerald-500" /> Subscription Plan
                  </h3>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Current Plan</p>
                      <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">Ignition (Pro)</p>
                    </div>
                    <button onClick={() => setActiveTab('billing')} className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-500 underline">Manage Billing</button>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-2 flex items-center">
                    <Bell size={16} className="mr-2 text-orange-500" /> Notifications
                  </h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500">Mission Updates</span>
                    <div className="w-8 h-4 bg-emerald-500 rounded-full relative cursor-pointer"><div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Marketing</span>
                    <div className="w-8 h-4 bg-slate-300 dark:bg-slate-600 rounded-full relative cursor-pointer"><div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div></div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Team Tab (Preserved) */}
        {activeTab === 'team' && (
          <GlassCard className="animate-fade-in space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 dark:border-slate-800 pb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Crew Manifest</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Manage access permissions and role assignments.</p>
              </div>
              <button className="flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-orange-500/20">
                <Plus className="mr-2" size={16} />
                Invite Officer
              </button>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700/50">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <th className="px-6 py-4 font-mono uppercase text-xs font-semibold">Member</th>
                    <th className="px-6 py-4 font-mono uppercase text-xs font-semibold">Role</th>
                    <th className="px-6 py-4 font-mono uppercase text-xs font-semibold">Status</th>
                    <th className="px-6 py-4 font-mono uppercase text-xs font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {teamMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 mr-3">
                            {member.avatarUrl ? (
                              <img src={member.avatarUrl} alt="" className="w-full h-full rounded-full" />
                            ) : (
                              <span className="font-bold">{member.name.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">{member.name}</div>
                            <div className="text-xs text-slate-500">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(member.role)}`}>
                          {member.role === 'Commander' && <BadgeCheck size={12} className="mr-1" />}
                          {member.role}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${member.status === 'Active' ? 'bg-emerald-500' :
                              member.status === 'Pending' ? 'bg-orange-400' : 'bg-slate-400'
                            }`}></div>
                          <span className="text-slate-600 dark:text-slate-300">{member.status}</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">Last active: {member.lastActive}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg p-4 flex items-start">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg mr-4">
                <Lock className="text-blue-600 dark:text-blue-400" size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-1">Role Permissions Guide</h4>
                <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
                  <li>• <strong>Commander:</strong> Full access to all modules, billing, and team management.</li>
                  <li>• <strong>Pilot:</strong> Can create and edit Mission Kits and Flight Plans. Cannot invite users.</li>
                  <li>• <strong>Specialist:</strong> View-only access to assigned Launch Pads.</li>
                </ul>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Billing Tab (Preserved) */}
        {activeTab === 'billing' && (
          <GlassCard className="animate-fade-in space-y-8">
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Plan & Fuel</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Upgrade your engine capacity and manage payment sources.</p>
              </div>

              {/* Billing Toggle */}
              <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-white dark:bg-slate-600 shadow text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${billingCycle === 'yearly' ? 'bg-white dark:bg-slate-600 shadow text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  Yearly <span className="text-[10px] text-emerald-500 ml-1">(-20%)</span>
                </button>
              </div>
            </div>

            {/* Pricing Plans */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Plan 1: Genesis */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-6 bg-slate-50 dark:bg-slate-900/30 hover:border-indigo-500/30 transition-all flex flex-col">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Genesis</h3>
                  <p className="text-xs text-slate-500">For explorers and idea validation.</p>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">$0</span>
                  <span className="text-slate-500 text-sm"> / mo</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {['3 Signal Scans', 'Basic Launch Pads', '1 Mission Kit', 'Community Support'].map((feat, i) => (
                    <li key={i} className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                      <Check size={16} className="text-slate-400 mr-2" /> {feat}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3 border border-slate-300 dark:border-slate-600 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-sm">
                  Downgrade
                </button>
              </div>

              {/* Plan 2: Ignition (Active) */}
              <div className="border-2 border-orange-500 rounded-2xl p-6 bg-white dark:bg-slate-900 relative shadow-xl shadow-orange-500/10 flex flex-col transform scale-105 z-10">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-t-xl"></div>
                <div className="absolute top-[-12px] left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Current Plan
                </div>
                <div className="mb-4 mt-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Ignition <Rocket size={16} className="text-orange-500" />
                  </h3>
                  <p className="text-xs text-slate-500">For early-stage startups taking flight.</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">${billingCycle === 'monthly' ? '29' : '24'}</span>
                  <span className="text-slate-500 text-sm"> / mo</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {['Unlimited Signal Scans', 'All Launch Pads', '5 Mission Kits', 'Flight Plans (3 Active)', 'Basic Analytics'].map((feat, i) => (
                    <li key={i} className="flex items-center text-sm text-slate-800 dark:text-slate-200 font-medium">
                      <Check size={16} className="text-orange-500 mr-2" /> {feat}
                    </li>
                  ))}
                </ul>
                <button disabled className="w-full py-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-slate-400 cursor-not-allowed text-sm">
                  Plan Active
                </button>
              </div>

              {/* Plan 3: Velocity */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-6 bg-slate-50 dark:bg-slate-900/30 hover:border-indigo-500/50 hover:shadow-lg transition-all flex flex-col">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Velocity <Zap size={16} className="text-indigo-500" />
                  </h3>
                  <p className="text-xs text-slate-500">For scaling businesses at warp speed.</p>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">${billingCycle === 'monthly' ? '99' : '79'}</span>
                  <span className="text-slate-500 text-sm"> / mo</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {['Everything in Ignition', 'Unlimited Mission Kits', 'Advanced Telemetry', 'Priority Support', 'Team Access (5 Seats)'].map((feat, i) => (
                    <li key={i} className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                      <Check size={16} className="text-indigo-500 mr-2" /> {feat}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all text-sm">
                  Upgrade
                </button>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Payment Source</h3>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-slate-800 rounded flex items-center justify-center text-white font-bold text-xs">
                    VISA
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">•••• •••• •••• 4242</p>
                    <p className="text-xs text-slate-500">Expires 12/25</p>
                  </div>
                </div>
                <button className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                  Update
                </button>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Invoice History</h3>
                <div className="space-y-2">
                  {[
                    { date: 'Oct 1, 2023', amount: '$29.00', status: 'Paid' },
                    { date: 'Sep 1, 2023', amount: '$29.00', status: 'Paid' },
                  ].map((inv, i) => (
                    <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-lg transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <div className="flex items-center gap-3">
                        <FileText size={16} className="text-slate-400" />
                        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{inv.date}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-600 dark:text-slate-400">{inv.amount}</span>
                        <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">{inv.status}</span>
                        <button className="text-slate-400 hover:text-indigo-500"><Upload size={14} className="rotate-180" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        )}

      </div>
    </div>
  );
};

export default Settings;
