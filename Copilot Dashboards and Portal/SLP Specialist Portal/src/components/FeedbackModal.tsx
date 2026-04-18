import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquare, Send, CheckCircle2, Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { logger } from '../utils/logger';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    
    // Simulate API call
    try {
      logger.info('User feedback submitted:', { rating, feedback });
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
      
      // Open mail client with feedback
      const subject = encodeURIComponent('App Feedback');
      const body = encodeURIComponent(`Rating: ${rating}/5\n\nFeedback: ${feedback}`);
      window.location.href = `mailto:KevinMoon7@gmail.com?subject=${subject}&body=${body}`;
      
      // Reset after 3 seconds
      setTimeout(() => {
        onClose();
        // Reset state after closing animation
        setTimeout(() => {
          setIsSubmitted(false);
          setRating(0);
          setFeedback('');
        }, 500);
      }, 3000);
    } catch (error) {
      logger.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-10"
          >
            <button
              onClick={onClose}
              className="absolute top-8 right-8 p-3 rounded-2xl hover:bg-slate-100 transition-all text-slate-400 hover:text-slate-900"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-8 h-8 text-indigo-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Share Your Feedback</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Your insights help us refine SLP Nexus for clinical excellence.
              </p>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12"
                >
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Thank You!</h3>
                  <p className="text-slate-500">Your feedback has been received.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                      How would you rate your experience?
                    </label>
                    <div className="flex items-center justify-center gap-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                            rating >= star 
                              ? "bg-amber-50 text-amber-500 shadow-sm" 
                              : "bg-slate-50 text-slate-300 hover:bg-slate-100"
                          )}
                        >
                          <Star className={cn("w-6 h-6", rating >= star && "fill-current")} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Tell us more (optional)
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="What can we improve? What do you love?"
                      className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={rating === 0 || isSubmitting}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold transition-all shadow-lg",
                      rating > 0 && !isSubmitting
                        ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    )}
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      >
                        <Send className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Feedback
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
