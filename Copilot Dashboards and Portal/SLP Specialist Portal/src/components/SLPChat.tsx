import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { PatientViewWrapper } from './layout/PatientViewWrapper';

export const SLPChat = () => {
  const whatsappUrl = 'https://chat.whatsapp.com/HR8gVzfzF1S4SNcAGZ58kd';
  const [isPatientView, setIsPatientView] = useState(false);

  const renderContent = () => (
    <div className="p-8 text-center relative">
      {/* Patient View Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setIsPatientView(true)}
          className="p-3 bg-white/90 backdrop-blur-sm shadow-lg rounded-full hover:bg-white transition-colors border border-slate-200"
          title="Patient View"
        >
          <Eye className="w-6 h-6 text-slate-600" />
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-4">SLP Group Chat</h2>
      <p className="text-slate-500 mb-6">Click the button below to join our WhatsApp group chat.</p>
      <a 
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 inline-block"
      >
        Open WhatsApp Group Chat
      </a>
    </div>
  );

  return (
    <>
      {isPatientView ? (
        <PatientViewWrapper title="SLP Chat" onExit={() => setIsPatientView(false)}>
          {renderContent()}
        </PatientViewWrapper>
      ) : (
        renderContent()
      )}
    </>
  );
};
