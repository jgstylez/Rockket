import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { LaunchPadTemplate } from '../../types';
import { 
  Database, Plus, Edit2, Trash2, Eye, EyeOff, Save, X, 
  Search, Server, AlertTriangle, CheckCircle2 
} from 'lucide-react';

interface AdminPanelProps {
  templates: LaunchPadTemplate[];
  onAdd: (template: LaunchPadTemplate) => void;
  onUpdate: (template: LaunchPadTemplate) => void;
  onDelete: (id: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ templates, onAdd, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTemplate, setCurrentTemplate] = useState<Partial<LaunchPadTemplate>>({});

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (template: LaunchPadTemplate) => {
    setCurrentTemplate({ ...template });
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentTemplate({
      id: Date.now().toString(),
      name: '',
      industry: '',
      description: '',
      difficulty: 'Medium',
      features: [],
      isAvailable: false
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (currentTemplate.id && currentTemplate.name) {
      if (templates.find(t => t.id === currentTemplate.id)) {
        onUpdate(currentTemplate as LaunchPadTemplate);
      } else {
        onAdd(currentTemplate as LaunchPadTemplate);
      }
      setIsEditing(false);
      setCurrentTemplate({});
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to decommission this chassis?')) {
      onDelete(id);
    }
  };

  const toggleAvailability = (template: LaunchPadTemplate) => {
    onUpdate({ ...template, isAvailable: !template.isAvailable });
  };

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Server className="text-red-500" size={18} />
             <h2 className="text-sm font-mono font-bold text-red-500 uppercase tracking-widest">Root Access // Fleet Command</h2>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Template Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Configure global launch vehicle availability and specifications.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg font-bold flex items-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
        >
          <Plus size={18} className="mr-2" /> Design New Chassis
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search manifest by name or industry..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex-1 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/40">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/50 sticky top-0 z-10">
              <tr>
                <th className="p-4 text-xs font-mono uppercase text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">Status</th>
                <th className="p-4 text-xs font-mono uppercase text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">Chassis Name</th>
                <th className="p-4 text-xs font-mono uppercase text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">Industry</th>
                <th className="p-4 text-xs font-mono uppercase text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">Complexity</th>
                <th className="p-4 text-xs font-mono uppercase text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTemplates.map((template) => (
                <tr key={template.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="p-4">
                    <button 
                      onClick={() => toggleAvailability(template)}
                      className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-bold border transition-all ${
                        template.isAvailable 
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 opacity-70'
                      }`}
                    >
                      {template.isAvailable ? <Eye size={12} /> : <EyeOff size={12} />}
                      {template.isAvailable ? 'DEPLOYED' : 'CLASSIFIED'}
                    </button>
                  </td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{template.name}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{template.industry}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded border ${
                      template.difficulty === 'High' ? 'border-red-200 text-red-600 dark:border-red-900/50 dark:text-red-400' :
                      template.difficulty === 'Medium' ? 'border-yellow-200 text-yellow-600 dark:border-yellow-900/50 dark:text-yellow-400' :
                      'border-emerald-200 text-emerald-600 dark:border-emerald-900/50 dark:text-emerald-400'
                    }`}>
                      {template.difficulty}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(template)}
                        className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                        title="Edit Configuration"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(template.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Decommission"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={() => setIsEditing(false)}></div>
          <GlassCard className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col bg-white dark:bg-slate-900">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                   <Database size={20} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                   {currentTemplate.id && templates.find(t => t.id === currentTemplate.id) ? 'Edit Configuration' : 'New Launch Vehicle'}
                 </h3>
               </div>
               <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-mono uppercase text-slate-500 mb-2">Chassis Name</label>
                   <input 
                      type="text" 
                      value={currentTemplate.name || ''} 
                      onChange={e => setCurrentTemplate({...currentTemplate, name: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-3 outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                   />
                </div>
                <div>
                   <label className="block text-xs font-mono uppercase text-slate-500 mb-2">Industry Sector</label>
                   <input 
                      type="text" 
                      value={currentTemplate.industry || ''} 
                      onChange={e => setCurrentTemplate({...currentTemplate, industry: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-3 outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                   />
                </div>
              </div>

              <div>
                 <label className="block text-xs font-mono uppercase text-slate-500 mb-2">Technical Description</label>
                 <textarea 
                    rows={3}
                    value={currentTemplate.description || ''} 
                    onChange={e => setCurrentTemplate({...currentTemplate, description: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-3 outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                 />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-mono uppercase text-slate-500 mb-2">Complexity Level</label>
                   <select 
                      value={currentTemplate.difficulty || 'Medium'} 
                      onChange={e => setCurrentTemplate({...currentTemplate, difficulty: e.target.value as any})}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-3 outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                   >
                     <option value="Low">Low</option>
                     <option value="Medium">Medium</option>
                     <option value="High">High</option>
                   </select>
                </div>
                <div className="flex items-center pt-6">
                   <label className="flex items-center cursor-pointer">
                      <div className={`w-10 h-6 rounded-full p-1 transition-colors ${currentTemplate.isAvailable ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${currentTemplate.isAvailable ? 'translate-x-4' : ''}`}></div>
                      </div>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={currentTemplate.isAvailable || false}
                        onChange={e => setCurrentTemplate({...currentTemplate, isAvailable: e.target.checked})}
                      />
                      <span className="ml-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                        {currentTemplate.isAvailable ? 'Deployed to Public' : 'Classified / Hidden'}
                      </span>
                   </label>
                </div>
              </div>

              <div>
                 <label className="block text-xs font-mono uppercase text-slate-500 mb-2">Included Modules (comma separated)</label>
                 <input 
                    type="text" 
                    placeholder="e.g. CRM, Analytics, Billing"
                    value={currentTemplate.features?.join(', ') || ''} 
                    onChange={e => setCurrentTemplate({...currentTemplate, features: e.target.value.split(',').map(s => s.trim())})}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-3 outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                 />
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900/30 p-4 rounded-lg flex items-start">
                <AlertTriangle className="text-orange-500 shrink-0 mr-3" size={20} />
                <p className="text-xs text-orange-800 dark:text-orange-400">
                  Modifying chassis parameters will instantaneously affect all new mission initializations. Active missions are not affected.
                </p>
              </div>

              <div className="flex justify-end pt-4">
                 <button 
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 text-slate-500 hover:text-slate-800 dark:hover:text-white mr-4 transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                    onClick={handleSave}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg flex items-center transition-transform hover:scale-105"
                 >
                   <Save size={18} className="mr-2" /> Save Configuration
                 </button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;