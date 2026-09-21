import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PromptInputBox } from '../components/PromptInputBox';
// Drop your background image into src/assets and update this import to match its filename
import bgImage from '../assets/medovia-drmatrix-bg.png';

function getMockReply(message) {
  const text = message.toLowerCase();
  if (text.includes('fever') || text.includes('cold') || text.includes('cough')) {
    return "Mild fever, cold, or cough can often be managed at home: rest, fluids, and paracetamol if needed. If it lasts more than 3 days, or you have breathing difficulty, please consult a doctor in General Medicine.";
  }
  if (text.includes('chest pain') || text.includes('breath')) {
    return "Chest pain or breathing difficulty can be serious. I'd recommend consulting a doctor in Cardiology or Pulmonology right away, rather than waiting.";
  }
  if (text.includes('headache')) {
    return "Occasional headaches can often be relieved with rest, hydration, and a mild over-the-counter pain reliever. If headaches are frequent, severe, or sudden, please consult a doctor in Neurology.";
  }
  if (text.includes('medicine') || text.includes('prescription')) {
    return "I can help with medicine questions. If a prescribed medicine isn't available, tell me its name and I can suggest alternatives with similar composition.";
  }
  return "Thanks for sharing that. Based on what you've described, I'd recommend consulting a doctor so they can properly examine your symptoms. Would you like me to suggest a department?";
}

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const suggestedPrompts = ['I have a fever', 'Chest pain', 'Bad headache', 'Medicine question'];

function DrMatrixScreen() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hi, I'm Dr. Matrix — tell me your symptoms and I'll help you figure out whether home care is enough or you should see a doctor.",
      time: formatTime(),
    },
  ]);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text, file) => {
    if (!text.trim() && !file) return;

    const userMsg = { sender: 'user', text, time: formatTime(), image: file ? URL.createObjectURL(file) : null };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);

    setTimeout(() => {
      const reply = getMockReply(text);
      setMessages((prev) => [...prev, { sender: 'bot', text: reply, time: formatTime() }]);
      setTyping(false);
    }, 1100);
  };

  return (
    <div
      className="relative h-screen w-screen flex flex-col overflow-hidden"
      style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-[#0a0d10]/75" />

      {/* Top bar */}
      <div className="relative z-10 flex items-center gap-3 px-5 py-4 border-b border-white/10">
        <button onClick={() => navigate('/dashboard')} className="text-white text-lg cursor-pointer">
          ←
        </button>
        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-lg">
          🤖
        </div>
        <div>
          <p className="text-white font-semibold text-sm">Dr. Matrix</p>
          <p className="text-white/60 text-xs flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            AI symptom assistant • Online
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="relative z-10 bg-orange-500/10 border-b border-orange-500/20 text-orange-200 text-xs px-5 py-2 text-center">
        ⚠ Not a substitute for professional medical advice. In an emergency, contact a doctor or hospital immediately.
      </div>

      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-2.5 max-w-[80%] ${m.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm ${
                  m.sender === 'user' ? 'bg-white/15' : 'bg-white/10 border border-white/20'
                }`}
              >
                {m.sender === 'user' ? '🙂' : '🤖'}
              </div>
              <div>
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#0F3D3E] text-white rounded-br-md'
                      : 'bg-[#1F2023] text-gray-100 border border-white/10 rounded-bl-md'
                  }`}
                >
                  {m.image && <img src={m.image} alt="attachment" className="rounded-lg mb-2 max-w-[180px]" />}
                  {m.text}
                </div>
                <p className={`text-[10px] text-white/40 mt-1 ${m.sender === 'user' ? 'text-right' : 'text-left'}`}>{m.time}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5 self-start">
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm">🤖</div>
            <div className="px-4 py-3.5 rounded-2xl rounded-bl-md bg-[#1F2023] border border-white/10 flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  className="w-1.5 h-1.5 rounded-full bg-white/60 inline-block"
                />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts */}
      {messages.length === 1 && (
        <div className="relative z-10 flex gap-2 flex-wrap px-5 pb-3">
          {suggestedPrompts.map((p) => (
            <button
              key={p}
              onClick={() => sendMessage(p)}
              className="px-3.5 py-1.5 rounded-full border border-white/20 bg-white/5 text-white text-xs cursor-pointer hover:bg-white/10"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="relative z-10 px-5 pb-5">
        <PromptInputBox onSend={sendMessage} placeholder="Describe your symptoms..." />
      </div>
    </div>
  );
}

export default DrMatrixScreen;