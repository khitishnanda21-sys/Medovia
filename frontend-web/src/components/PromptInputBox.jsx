import { useState, useRef, useEffect, createContext, useContext, forwardRef } from 'react';
import { ArrowUp, Paperclip, Mic, StopCircle, X, Search, BrainCog } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PromptInputContext = createContext(null);
function usePromptInput() {
  return useContext(PromptInputContext);
}

const Textarea = forwardRef(({ className = '', ...props }, ref) => (
  <textarea
    ref={ref}
    rows={1}
    className={`flex w-full rounded-md border-none bg-transparent px-3 py-2.5 text-sm text-gray-100 placeholder:text-gray-400 focus:outline-none resize-none min-h-[44px] ${className}`}
    {...props}
  />
));

function VoiceRecorder({ isRecording, onStop }) {
  const [time, setTime] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
      setTime(0);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRecording]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  if (!isRecording) return null;

  return (
    <div className="flex flex-col items-center justify-center w-full py-3">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
        <span className="font-mono text-sm text-white/80">{formatTime(time)}</span>
      </div>
      <div className="w-full h-8 flex items-center justify-center gap-0.5 px-4">
        {[...Array(28)].map((_, i) => (
          <div
            key={i}
            className="w-0.5 rounded-full bg-white/50 animate-pulse"
            style={{ height: `${Math.max(15, Math.random() * 100)}%`, animationDelay: `${i * 0.05}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export function PromptInputBox({ onSend = () => {}, isLoading = false, placeholder = 'Type your message...' }) {
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showThink, setShowThink] = useState(false);
  const uploadRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
  }, [input]);

  const processFile = (f) => {
    if (!f.type.startsWith('image/')) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setFilePreview(e.target.result);
    reader.readAsDataURL(f);
  };

  const handleSubmit = () => {
    if (!input.trim() && !file) return;
    let prefix = '';
    if (showSearch) prefix = '[Search symptoms] ';
    else if (showThink) prefix = '[Deep analysis] ';
    onSend(prefix + input, file);
    setInput('');
    setFile(null);
    setFilePreview(null);
  };

  const hasContent = input.trim() !== '' || !!file;

  return (
    <>
      <div className="rounded-3xl border border-[#444444] bg-[#1F2023] p-2 shadow-lg">
        {file && filePreview && (
          <div className="flex gap-2 p-1 pb-2">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden cursor-pointer" onClick={() => setPreviewOpen(true)}>
              <img src={filePreview} alt="attachment" className="w-full h-full object-cover" />
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null); setFilePreview(null); }}
                className="absolute top-0.5 right-0.5 rounded-full bg-black/70 p-0.5"
              >
                <X className="h-3 w-3 text-white" />
              </button>
            </div>
          </div>
        )}

        {!isRecording ? (
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={showSearch ? 'Search symptoms or conditions...' : showThink ? 'Describe in detail for deeper analysis...' : placeholder}
          />
        ) : (
          <VoiceRecorder isRecording={isRecording} onStop={() => {}} />
        )}

        <div className="flex items-center justify-between gap-2 pt-2">
          <div className={`flex items-center gap-1 ${isRecording ? 'opacity-0 pointer-events-none' : ''}`}>
            <button
              title="Attach a photo"
              onClick={() => uploadRef.current?.click()}
              className="flex h-8 w-8 text-gray-400 cursor-pointer items-center justify-center rounded-full hover:bg-white/10 hover:text-gray-200"
            >
              <Paperclip className="h-4 w-4" />
              <input
                ref={uploadRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files[0] && processFile(e.target.files[0])}
              />
            </button>

            <button
              type="button"
              onClick={() => { setShowSearch((p) => !p); setShowThink(false); }}
              className={`rounded-full flex items-center gap-1 px-2.5 py-1.5 border h-8 text-xs cursor-pointer transition-all ${
                showSearch ? 'bg-[#1EAEDB]/15 border-[#1EAEDB] text-[#1EAEDB]' : 'bg-transparent border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <AnimatePresence>
                {showSearch && (
                  <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: 'auto', opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="overflow-hidden whitespace-nowrap">
                    Search
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              type="button"
              onClick={() => { setShowThink((p) => !p); setShowSearch(false); }}
              className={`rounded-full flex items-center gap-1 px-2.5 py-1.5 border h-8 text-xs cursor-pointer transition-all ${
                showThink ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] text-[#8B5CF6]' : 'bg-transparent border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              <BrainCog className="w-3.5 h-3.5" />
              <AnimatePresence>
                {showThink && (
                  <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: 'auto', opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="overflow-hidden whitespace-nowrap">
                    Analyze
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          <button
            title={isRecording ? 'Stop recording' : hasContent ? 'Send message' : 'Voice message'}
            onClick={() => {
              if (isRecording) setIsRecording(false);
              else if (hasContent) handleSubmit();
              else setIsRecording(true);
            }}
            className={`h-8 w-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
              isRecording ? 'text-red-500 hover:bg-white/10' : hasContent ? 'bg-white text-[#1F2023] hover:bg-white/80' : 'text-gray-400 hover:bg-white/10 hover:text-gray-200'
            }`}
          >
            {isRecording ? <StopCircle className="h-5 w-5" /> : hasContent ? <ArrowUp className="h-4 w-4" /> : <Mic className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {previewOpen && filePreview && (
        <div
          onClick={() => setPreviewOpen(false)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 cursor-pointer"
        >
          <img src={filePreview} alt="preview" className="max-h-[80vh] max-w-[90vw] rounded-2xl" onClick={(e) => e.stopPropagation()} />
          <button onClick={() => setPreviewOpen(false)} className="absolute top-6 right-6 rounded-full bg-[#2E3033]/80 p-2">
            <X className="h-5 w-5 text-white" />
          </button>
        </div>
      )}
    </>
  );
}