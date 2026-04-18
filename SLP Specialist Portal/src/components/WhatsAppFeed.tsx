import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, User, Clock, ExternalLink } from 'lucide-react';
import { WhatsAppMessage } from '../types';

export const WhatsAppFeed = () => {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const whatsappUrl = 'https://chat.whatsapp.com/HR8gVzfzF1S4SNcAGZ58kd';

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('/api/whatsapp-messages');
        
        // Handle case where dev server is restarting and returns HTML fallback
        if (typeof response.data === 'string' && response.data.includes('<!doctype html>')) {
          console.log('Server is restarting, skipping fetch...');
          return;
        }

        if (Array.isArray(response.data)) {
          setMessages(response.data);
        } else {
          console.error('Expected array of messages, got:', response.data);
          setMessages([]);
        }
      } catch (error) {
        console.error('Failed to fetch WhatsApp messages:', error);
      }
    };
    fetchMessages();
    // Refresh every 5 minutes
    const interval = setInterval(fetchMessages, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bento-card p-6 rounded-3xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
            <MessageCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">WhatsApp Live Feed</h4>
            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Clinical Group Discussion</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Live Updates</span>
        </div>
      </div>

      <div className="space-y-5 flex-1 overflow-hidden">
        <AnimatePresence mode="popLayout">
          {Array.isArray(messages) && messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-default"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center shrink-0 border border-emerald-500/30 shadow-inner">
                  <User className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-black text-white truncate uppercase tracking-tight group-hover:text-emerald-400 transition-colors">
                      {msg.sender}
                    </span>
                    <span className="text-[8px] font-bold text-slate-500 flex items-center gap-1 shrink-0">
                      <Clock className="w-2.5 h-2.5" />
                      {msg.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                    {msg.text}
                  </p>
                </div>
              </div>
              {idx < messages.length - 1 && (
                <div className="ml-11 mt-5 border-b border-white/5" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <a 
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 w-full py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-[10px] font-black text-emerald-400 uppercase tracking-widest transition-all flex items-center justify-center gap-2 group"
      >
        Join Group Discussion
        <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </a>
    </div>
  );
};
