import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Image as ImageIcon, 
  Trash2, 
  Download, 
  Search, 
  X, 
  Loader2,
  Calendar,
  Grid,
  List,
  ArrowLeft,
  ExternalLink,
  Eye
} from 'lucide-react';
import { persistenceService } from '../services/persistence-service';
import { cn } from '../lib/utils';
import { PatientViewWrapper } from './layout/PatientViewWrapper';

export function AssetGallery({ onBack }: { onBack?: () => void }) {
  const [assets, setAssets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [isPatientView, setIsPatientView] = useState(false);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    setIsLoading(true);
    try {
      const data = await persistenceService.getGeneratedAssets();
      // Sort by date descending
      setAssets(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error("Failed to load assets", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this asset?")) {
      try {
        await persistenceService.deleteGeneratedAsset(id);
        setAssets(prev => prev.filter(a => a.id !== id));
        if (selectedAsset?.id === id) setSelectedAsset(null);
      } catch (error) {
        console.error("Failed to delete asset", error);
        alert("Failed to delete asset. Please try again.");
      }
    }
  };

  const handleDownload = (asset: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = asset.data;
    link.download = `slp-asset-${asset.id}.${asset.type === 'image' ? 'png' : 'mp4'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredAssets = assets.filter(asset => 
    asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (asset.prompt && asset.prompt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderContent = () => (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2 mb-3">
               <div className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded">Media Library</div>
               <div className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
               <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">AI Generated Assets</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Asset <span className="text-indigo-600 dark:text-indigo-500">Gallery</span></h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg mt-4 max-w-xl font-medium">Access all your AI-generated images and visual therapy aids.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsPatientView(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-200 transition-all"
          >
            <Eye className="w-4 h-4" />
            Patient View
          </button>
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "text-slate-400 hover:text-slate-600")}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "text-slate-400 hover:text-slate-600")}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Library...</p>
          </div>
        ) : filteredAssets.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredAssets.map((asset) => (
                <motion.div
                  key={asset.id}
                  layoutId={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className="group relative aspect-square bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/10 transition-all"
                >
                  <img 
                    src={asset.data} 
                    alt="Generated asset" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    {asset.metadata?.category && (
                      <div className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-1">{asset.metadata.category}</div>
                    )}
                    <div className="text-xs font-bold text-white truncate mb-3">
                      {asset.prompt || asset.id}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-[10px] font-bold text-white/70 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(asset.date).toLocaleDateString()}
                      </div>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => setSelectedAsset(asset)}
                          className="p-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white backdrop-blur-md transition-colors"
                          title="View Full Size"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={(e) => handleDownload(asset, e)}
                          className="p-1.5 bg-white/20 hover:bg-white/40 rounded-lg text-white backdrop-blur-md transition-colors"
                          title="Download"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={(e) => handleDelete(asset.id, e)}
                          className="p-1.5 bg-rose-500/20 hover:bg-rose-500/40 rounded-lg text-rose-200 backdrop-blur-md transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Preview</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID / Prompt</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map((asset) => (
                    <tr 
                      key={asset.id} 
                      onClick={() => setSelectedAsset(asset)}
                      className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800">
                          <img src={asset.data} alt="preview" className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs">
                          {asset.prompt || asset.id}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{asset.type}</div>
                          {asset.metadata?.category && (
                            <>
                              <div className="w-1 h-1 bg-slate-300 rounded-full" />
                              <div className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">{asset.metadata.category}</div>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {new Date(asset.date).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setSelectedAsset(asset)}
                            className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg transition-colors"
                            title="View"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => handleDownload(asset, e)}
                            className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => handleDelete(asset.id, e)}
                            className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6 text-slate-300 dark:text-slate-600">
              <ImageIcon className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No assets found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              {searchQuery ? "No assets match your search criteria." : "Generated images from Handout Studio and Therapy Studio will appear here."}
            </p>
          </div>
        )}
      </div>

      {/* Asset Detail Modal */}
      <AnimatePresence>
        {selectedAsset && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAsset(null)}
              className="absolute inset-0 bg-slate-900/95 backdrop-blur-2xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row z-10"
            >
              <div className="flex-1 bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-8 min-h-[300px]">
                <img 
                  src={selectedAsset.data} 
                  alt="Full preview" 
                  className="max-w-full max-h-full object-contain shadow-2xl rounded-xl"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/asset-fallback/800/600';
                  }}
                />
              </div>
              <div className="w-full md:w-80 p-8 flex flex-col justify-between border-l border-slate-100 dark:border-slate-800">
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-1">Asset Details</h3>
                      <p className="text-lg font-black text-slate-900 dark:text-white leading-tight">Generated Image</p>
                    </div>
                    <button 
                      onClick={() => setSelectedAsset(null)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {selectedAsset.prompt && (
                      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                        <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Prompt / Description</div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                          {selectedAsset.prompt}
                        </div>
                      </div>
                    )}
                    {selectedAsset.metadata?.category && (
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Source Category</div>
                        <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                          {selectedAsset.metadata.category}
                        </div>
                      </div>
                    )}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date Generated</div>
                      <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        {new Date(selectedAsset.date).toLocaleString()}
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Asset ID</div>
                      <div className="text-xs font-mono text-slate-500 break-all">
                        {selectedAsset.id}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-8">
                  <button 
                    onClick={(e) => handleDownload(selectedAsset, e)}
                    className="flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button 
                    onClick={(e) => handleDelete(selectedAsset.id, e)}
                    className="flex items-center justify-center gap-2 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold text-sm hover:bg-rose-500 hover:text-white transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      {isPatientView ? (
        <PatientViewWrapper title="Asset Gallery" onExit={() => setIsPatientView(false)}>
          {renderContent()}
        </PatientViewWrapper>
      ) : (
        renderContent()
      )}
    </>
  );
}
