import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Activity, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Download,
  Share2,
  Eye
} from 'lucide-react';
import { cn } from '../lib/utils';
import { PatientViewWrapper } from './layout/PatientViewWrapper';

import { generateProgressReport } from '../utils/pdf-generator';

const data = [
  { date: 'Jan', accuracy: 65, latency: 2.4, sessions: 4 },
  { date: 'Feb', accuracy: 72, latency: 2.1, sessions: 6 },
  { date: 'Mar', accuracy: 68, latency: 2.3, sessions: 5 },
  { date: 'Apr', accuracy: 78, latency: 1.8, sessions: 8 },
  { date: 'May', accuracy: 85, latency: 1.5, sessions: 7 },
  { date: 'Jun', accuracy: 82, latency: 1.6, sessions: 9 },
  { date: 'Jul', accuracy: 90, latency: 1.2, sessions: 10 },
];

const COLORS = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b'];

export const ProgressTracker: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState<'accuracy' | 'latency' | 'sessions'>('accuracy');
  const [isPatientView, setIsPatientView] = useState(false);

  const stats = [
    { label: 'Avg. Accuracy', value: '82%', trend: '+12%', up: true, icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Mean Latency', value: '1.4s', trend: '-0.8s', up: true, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Sessions', value: '49', trend: '+5', up: true, icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Goal Mastery', value: '4/6', trend: '+1', up: true, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const handleExport = () => {
    // In a real app, we'd capture the chart as an image using html2canvas or similar.
    // For now, we'll pass an empty string for the chartDataUrl
    generateProgressReport('All_Active_Patients', '', stats);
  };

  const renderContent = () => (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 relative">
      {/* Patient View Toggle */}
      <div className="absolute top-0 right-0 z-50">
        <button
          onClick={() => setIsPatientView(true)}
          className="p-3 bg-white/90 backdrop-blur-sm shadow-lg rounded-full hover:bg-white transition-colors border border-slate-200"
          title="Patient View"
        >
          <Eye className="w-6 h-6 text-slate-600" />
        </button>
      </div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Clinical Progress Tracker</h1>
          <p className="text-slate-500 font-medium mt-1">Visualizing outcomes and mastery trends across all active patients.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full",
                stat.up ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              )}>
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mb-1">{stat.value}</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Performance Trends</h3>
            <div className="flex bg-slate-50 p-1 rounded-xl">
              {(['accuracy', 'latency', 'sessions'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setActiveMetric(m)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                    activeMetric === m ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey={activeMetric} 
                  stroke="#3b82f6" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorMetric)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl">
            <h3 className="text-lg font-black tracking-tight mb-6">Goal Mastery Distribution</h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Aphasia', value: 85 },
                  { name: 'Dysphagia', value: 65 },
                  { name: 'Cognitive', value: 92 },
                  { name: 'Voice', value: 45 },
                ]}>
                  <Bar dataKey="value" radius={[10, 10, 10, 10]}>
                    {[0, 1, 2, 3].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                  <XAxis dataKey="name" hide />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {[
                { label: 'Aphasia', color: 'bg-blue-500' },
                { label: 'Dysphagia', color: 'bg-emerald-500' },
                { label: 'Cognitive', color: 'bg-indigo-500' },
                { label: 'Voice', color: 'bg-amber-500' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", item.color)} />
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
            <h3 className="text-lg font-black text-slate-900 tracking-tight mb-6">Recent Milestones</h3>
            <div className="space-y-6">
              {[
                { title: 'Goal Achieved', patient: 'Patient A.M.', desc: '80% accuracy in word finding', time: '2h ago' },
                { title: 'New Baseline', patient: 'Patient J.D.', desc: 'Improved vocal intensity by 5dB', time: '5h ago' },
                { title: 'Session Streak', patient: 'System', desc: '10 sessions completed this week', time: '1d ago' },
              ].map((m, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900">{m.title}</div>
                    <div className="text-xs font-bold text-blue-600">{m.patient}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{m.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl font-bold text-slate-600 transition-all text-sm">
              View All Milestones
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isPatientView ? (
        <PatientViewWrapper title="Progress Tracker" onExit={() => setIsPatientView(false)}>
          {renderContent()}
        </PatientViewWrapper>
      ) : (
        renderContent()
      )}
    </>
  );
};
