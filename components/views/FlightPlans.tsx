import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { CheckCircle, Circle, Clock, MoreVertical, Plus, Filter, X } from 'lucide-react';
import { FlightTask } from '../../types';

const initialTasks: FlightTask[] = [
    { id: '1', title: 'Register Domain Name', status: 'complete', priority: 'high', dueDate: '2023-10-20' },
    { id: '2', title: 'Set up Business Banking', status: 'in-progress', priority: 'high', dueDate: '2023-10-22' },
    { id: '3', title: 'Draft Privacy Policy', status: 'pending', priority: 'medium', dueDate: '2023-10-25' },
    { id: '4', title: 'Configure Analytics', status: 'pending', priority: 'low', dueDate: '2023-10-30' },
    { id: '5', title: 'Social Media Handles', status: 'complete', priority: 'medium', dueDate: '2023-10-18' },
];

const FlightPlans: React.FC = () => {
    const [tasks, setTasks] = useState<FlightTask[]>(initialTasks);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [activeTaskMenu, setActiveTaskMenu] = useState<string | null>(null);
    const [editingTask, setEditingTask] = useState<FlightTask | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        priority: 'medium' as 'high' | 'medium' | 'low',
        dueDate: '',
    });

    // Reset form
    const resetForm = () => {
        setFormData({
            title: '',
            priority: 'medium',
            dueDate: '',
        });
        setEditingTask(null);
    };

    // CREATE: Add new task
    const handleAddTask = () => {
        if (!formData.title.trim()) {
            alert('Please enter a task title');
            return;
        }

        const newTask: FlightTask = {
            id: Date.now().toString(),
            title: formData.title,
            status: 'pending',
            priority: formData.priority,
            dueDate: formData.dueDate || new Date().toISOString().split('T')[0],
        };

        setTasks([...tasks, newTask]);
        setShowAddModal(false);
        resetForm();
    };

    // UPDATE: Edit existing task
    const handleEditTask = (task: FlightTask) => {
        setEditingTask(task);
        setFormData({
            title: task.title,
            priority: task.priority,
            dueDate: task.dueDate,
        });
        setShowAddModal(true);
        setActiveTaskMenu(null);
    };

    const handleUpdateTask = () => {
        if (!editingTask || !formData.title.trim()) {
            alert('Please enter a task title');
            return;
        }

        setTasks(tasks.map(t =>
            t.id === editingTask.id
                ? { ...t, title: formData.title, priority: formData.priority, dueDate: formData.dueDate }
                : t
        ));
        setShowAddModal(false);
        resetForm();
    };

    // DELETE: Remove task
    const handleDeleteTask = (id: string) => {
        if (confirm('Are you sure you want to delete this task?')) {
            setTasks(tasks.filter(t => t.id !== id));
            setActiveTaskMenu(null);
        }
    };

    // DUPLICATE: Copy task
    const handleDuplicateTask = (task: FlightTask) => {
        const duplicatedTask: FlightTask = {
            ...task,
            id: Date.now().toString(),
            title: `${task.title} (Copy)`,
            status: 'pending',
        };
        setTasks([...tasks, duplicatedTask]);
        setActiveTaskMenu(null);
    };

    const toggleStatus = (id: string) => {
        setTasks(tasks.map(t => {
            if (t.id !== id) return t;
            if (t.status === 'complete') return { ...t, status: 'pending' };
            if (t.status === 'pending') return { ...t, status: 'in-progress' };
            return { ...t, status: 'complete' };
        }));
    };

    const filteredTasks = tasks.filter(task => {
        const statusMatch = statusFilter === 'all' || task.status === statusFilter;
        const priorityMatch = priorityFilter === 'all' || task.priority === priorityFilter;
        return statusMatch && priorityMatch;
    });

    const clearFilters = () => {
        setStatusFilter('all');
        setPriorityFilter('all');
    };

    const hasActiveFilters = statusFilter !== 'all' || priorityFilter !== 'all';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in h-full">
            <div className="lg:col-span-2 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Active Flight Plan</h2>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors shadow-lg shadow-orange-500/30 dark:shadow-[0_0_15px_rgba(249,115,22,0.3)] w-full md:w-auto justify-center"
                    >
                        <Plus size={16} className="mr-1" /> Add Task
                    </button>
                </div>

                {/* Filters Toolbar */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center px-3 py-2 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
                        <Filter size={14} className="text-slate-400 mr-2" />
                        <span className="text-xs font-semibold text-slate-500 uppercase mr-2">Status:</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-transparent text-sm text-slate-700 dark:text-slate-200 outline-none cursor-pointer hover:text-indigo-500 transition-colors"
                        >
                            <option value="all">All Systems</option>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="complete">Complete</option>
                        </select>
                    </div>

                    <div className="flex items-center px-3 py-2 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
                        <Filter size={14} className="text-slate-400 mr-2" />
                        <span className="text-xs font-semibold text-slate-500 uppercase mr-2">Priority:</span>
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="bg-transparent text-sm text-slate-700 dark:text-slate-200 outline-none cursor-pointer hover:text-indigo-500 transition-colors"
                        >
                            <option value="all">All Levels</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center px-3 py-2 text-xs font-medium text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-900/30"
                        >
                            <X size={14} className="mr-1" /> Clear Filters
                        </button>
                    )}
                </div>

                <GlassCard className="p-0 overflow-hidden">
                    <div className="bg-slate-100 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-700 flex text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        <div className="w-12 text-center">Stat</div>
                        <div className="flex-1 px-4">Objective</div>
                        <div className="w-24">Priority</div>
                        <div className="w-32 text-right">ETA</div>
                        <div className="w-10"></div>
                    </div>
                    <div className="divide-y divide-slate-200 dark:divide-slate-800">
                        {filteredTasks.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                                <p>No maneuvers found matching current filters.</p>
                                <button onClick={clearFilters} className="text-indigo-500 hover:underline text-sm mt-2">Clear filters</button>
                            </div>
                        ) : (
                            filteredTasks.map(task => (
                                <div key={task.id} className="p-4 flex items-center hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                    <div className="w-12 flex justify-center cursor-pointer" onClick={() => toggleStatus(task.id)}>
                                        {task.status === 'complete' ? (
                                            <CheckCircle className="text-emerald-500" size={20} />
                                        ) : task.status === 'in-progress' ? (
                                            <Clock className="text-orange-500 animate-pulse-slow" size={20} />
                                        ) : (
                                            <Circle className="text-slate-400 dark:text-slate-600 group-hover:text-slate-500" size={20} />
                                        )}
                                    </div>
                                    <div className="flex-1 px-4">
                                        <p className={`text-sm font-medium ${task.status === 'complete' ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                                            {task.title}
                                        </p>
                                    </div>
                                    <div className="w-24">
                                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full border ${task.priority === 'high' ? 'border-red-500/30 text-red-600 dark:text-red-400 bg-red-500/10' :
                                            task.priority === 'medium' ? 'border-yellow-500/30 text-yellow-600 dark:text-yellow-400 bg-yellow-500/10' :
                                                'border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/10'
                                            }`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                    <div className="w-32 text-right text-xs text-slate-500 font-mono">
                                        {task.dueDate}
                                    </div>
                                    <div className="w-10 flex justify-center relative">
                                        <button
                                            onClick={() => setActiveTaskMenu(activeTaskMenu === task.id ? null : task.id)}
                                            className="text-slate-400 hover:text-slate-900 dark:text-slate-600 dark:hover:text-white transition-colors"
                                        >
                                            <MoreVertical size={16} />
                                        </button>
                                        {activeTaskMenu === task.id && (
                                            <div className="absolute right-0 top-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-10 min-w-[150px]">
                                                <button
                                                    onClick={() => handleEditTask(task)}
                                                    className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDuplicateTask(task)}
                                                    className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                                >
                                                    Duplicate
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTask(task.id)}
                                                    className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </GlassCard>
            </div>

            <div className="space-y-6">
                <GlassCard>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Workflow Automation</h3>
                    <div className="relative pt-4 pb-8 px-2">
                        <div className="absolute left-[7px] top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800"></div>

                        {[
                            { label: 'Incorporation', done: true },
                            { label: 'Branding Kit', done: true },
                            { label: 'Web Presence', done: false, active: true },
                            { label: 'Go-to-Market', done: false },
                            { label: 'Scale Up', done: false },
                        ].map((step, i) => (
                            <div key={i} className="relative flex items-center mb-8 last:mb-0">
                                <div className={`w-4 h-4 rounded-full border-2 z-10 ${step.done ? 'bg-emerald-500 border-emerald-500' :
                                    step.active ? 'bg-white dark:bg-slate-900 border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]' :
                                        'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700'
                                    }`} />
                                <div className={`ml-6 p-3 rounded-lg flex-1 border transition-colors ${step.active ? 'bg-white dark:bg-slate-800/80 border-orange-500/30 shadow-sm' :
                                    step.done ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-50' :
                                        'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'
                                    }`}>
                                    <p className={`text-sm font-medium ${step.active ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>{step.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>

            {/* Add Maneuver Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                {editingTask ? 'Edit Task' : 'Add New Task'}
                            </h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                    Task Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Set up Payment Gateway"
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                    Priority
                                </label>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'high' | 'medium' | 'low' })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                                >
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => {
                                        setShowAddModal(false);
                                        resetForm();
                                    }}
                                    className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-bold rounded-lg transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        editingTask ? handleUpdateTask() : handleAddTask();
                                    }}
                                    className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-all"
                                >
                                    {editingTask ? 'Update Task' : 'Add Task'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlightPlans;