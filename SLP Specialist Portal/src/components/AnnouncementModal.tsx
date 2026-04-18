import React, { useState } from 'react';
import { X, Plus, Trash2, Megaphone, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'success' | 'warning';
  date: string;
  category?: 'news' | 'task';
  priority?: 'low' | 'medium' | 'high';
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  announcements: Announcement[];
  onSave: (announcements: Announcement[]) => void;
  isAdminMode: boolean;
}

export function AnnouncementModal({ isOpen, onClose, announcements, onSave, isAdminMode }: Props) {
  const [localAnnouncements, setLocalAnnouncements] = useState<Announcement[]>(announcements);
  const [prevAnnouncements, setPrevAnnouncements] = useState(announcements);

  if (announcements !== prevAnnouncements) {
    setPrevAnnouncements(announcements);
    setLocalAnnouncements(announcements);
  }

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState<'info' | 'success' | 'warning'>('info');
  const [activeTab, setActiveTab] = useState<'news' | 'task'>('news');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    const newAnn: Announcement = {
      id: Date.now().toString(),
      title: newTitle,
      content: newContent,
      type: newType,
      date: new Date().toISOString(),
      category: activeTab,
      priority: activeTab === 'task' ? newPriority : undefined
    };
    setLocalAnnouncements([newAnn, ...localAnnouncements]);
    setNewTitle('');
    setNewContent('');
  };

  const handleRemove = (id: string) => {
    setLocalAnnouncements(localAnnouncements.filter(a => a.id !== id));
  };

  const handleSave = () => {
    onSave(localAnnouncements);
    onClose();
  };

  const filteredAnnouncements = localAnnouncements.filter(a => 
    activeTab === 'news' ? (!a.category || a.category === 'news') : a.category === 'task'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Clinical Ecosystem</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 flex gap-6 border-b border-slate-100">
          <button 
            onClick={() => setActiveTab('news')}
            className={cn(
              "pb-3 text-sm font-bold transition-all relative",
              activeTab === 'news' ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
            )}
          >
            News & Updates
            {activeTab === 'news' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
          </button>
          <button 
            onClick={() => setActiveTab('task')}
            className={cn(
              "pb-3 text-sm font-bold transition-all relative",
              activeTab === 'task' ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
            )}
          >
            Upcoming Tasks
            {activeTab === 'task' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          {/* Add New (Admin Only) */}
          {isAdminMode && (
            <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-blue-500" /> Add New {activeTab === 'news' ? 'Announcement' : 'Task'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder={activeTab === 'news' ? "Announcement Title (e.g., New Feature)" : "Task Title (e.g., Complete CEU)"}
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  {activeTab === 'news' ? (
                    <select
                      value={newType}
                      onChange={e => setNewType(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="info">Info (Blue)</option>
                      <option value="success">Success (Green)</option>
                      <option value="warning">Warning (Amber)</option>
                    </select>
                  ) : (
                    <select
                      value={newPriority}
                      onChange={e => setNewPriority(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  )}
                </div>
                <div className="md:col-span-3">
                  <textarea
                    placeholder={activeTab === 'news' ? "Announcement Content..." : "Task Description..."}
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>
              <button
                onClick={handleAdd}
                disabled={!newTitle.trim() || !newContent.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                <Plus className="w-4 h-4" /> Add {activeTab === 'news' ? 'Announcement' : 'Task'}
              </button>
            </div>
          )}

          {/* Existing */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-700">All {activeTab === 'news' ? 'Announcements' : 'Tasks'}</h3>
            {filteredAnnouncements.length === 0 ? (
              <p className="text-sm text-slate-500">No {activeTab === 'news' ? 'announcements' : 'tasks'} at this time.</p>
            ) : (
              filteredAnnouncements.map(ann => (
                <div key={ann.id} className="flex items-start justify-between gap-4 p-4 border border-slate-100 rounded-xl bg-white shadow-sm">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {activeTab === 'news' ? (
                        <span className={`w-2 h-2 rounded-full ${
                          ann.type === 'info' ? 'bg-blue-500' :
                          ann.type === 'success' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`} />
                      ) : (
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                          ann.priority === 'high' ? 'bg-rose-100 text-rose-700' :
                          ann.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {ann.priority}
                        </span>
                      )}
                      <span className="text-sm font-bold text-slate-800">{ann.title}</span>
                      <span className="text-xs text-slate-400">{new Date(ann.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-slate-600">{ann.content}</p>
                  </div>
                  {isAdminMode && (
                    <button
                      onClick={() => handleRemove(ann.id)}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                      title="Delete Announcement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors">
            {isAdminMode ? 'Cancel' : 'Close'}
          </button>
          {isAdminMode && (
            <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
              Save Changes
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
