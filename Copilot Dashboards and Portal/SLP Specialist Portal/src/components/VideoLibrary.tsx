import React, { useState } from 'react';
import { X, PlayCircle, ExternalLink, Eye } from 'lucide-react';
import { PatientViewWrapper } from './layout/PatientViewWrapper';
import { cn } from '../lib/utils';

interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  source: string;
}

const AUTHORITATIVE_VIDEOS: Video[] = [
  {
    id: 'swallow-mechanism',
    title: 'Normal Pharyngeal Swallow Mechanism',
    description: 'Detailed analysis of the pharyngeal phase of swallowing, showing the coordinated action of the pharyngeal constrictors and the UES.',
    url: 'https://www.youtube.com/watch?v=kY0w6-3-9u0',
    thumbnail: 'https://img.youtube.com/vi/kY0w6-3-9u0/0.jpg',
    source: 'National Institutes of Health (NIH)'
  },
  {
    id: 'vocal-fold-vibration',
    title: 'High-Speed Vocal Fold Vibration',
    description: 'Visualization of mucosal wave during phonation, demonstrating the Bernoulli effect and vocal fold oscillation.',
    url: 'https://www.youtube.com/watch?v=iYhACrAeot0',
    thumbnail: 'https://img.youtube.com/vi/iYhACrAeot0/0.jpg',
    source: 'Voice Research Laboratory'
  }
];

interface VideoLibraryProps {
  onClose: () => void;
}

export const VideoLibrary = ({ onClose }: VideoLibraryProps) => {
  const [isPatientView, setIsPatientView] = useState(false);

  const renderContent = () => (
    <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      {AUTHORITATIVE_VIDEOS.map(video => (
        <div key={video.id} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="aspect-video bg-slate-200 rounded-xl mb-4 flex items-center justify-center">
            <PlayCircle className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">{video.title}</h3>
          <p className="text-sm text-slate-500 mb-4">{video.description}</p>
          <a href={video.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm">
            Watch on {video.source} <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      ))}
    </div>
  );

  if (isPatientView) {
    return (
      <PatientViewWrapper title="Clinical Video Library" onExit={() => setIsPatientView(false)}>
        {renderContent()}
      </PatientViewWrapper>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Clinical Video Library</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPatientView(true)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              title="Patient View"
            >
              <Eye className="w-6 h-6 text-slate-500" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <X className="w-6 h-6 text-slate-500" />
            </button>
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};
