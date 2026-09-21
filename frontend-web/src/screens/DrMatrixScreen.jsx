import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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
      text: "Hi, I'm Dr. Matrix 🤖 — tell me your symptoms and I'll help you figure out whether home care is enough or you should see a doctor.",
      time: formatTime(),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text) => {
    if (!text.trim()) return;

    const userMsg = { sender: 'user', text, time: formatTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const reply = getMockReply(text);
      setMessages((prev) => [...prev, { sender: 'bot', text: reply, time: formatTime() }]);
      setTyping(false);
    }, 1100);
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #F5F3DF 0%, #ECE8CE 100%)',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '16px 20px',
          background: 'linear-gradient(120deg, #0F3D3E 0%, #175B5C 100%)',
          color: '#fff',
          boxShadow: '0 4px 18px rgba(15,61,62,0.25)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <button
          onClick={() => navigate('/dashboard')}
          style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.3rem', cursor: 'pointer' }}
          aria-label="Back to dashboard"
        >
          ←
        </button>

        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem',
            border: '2px solid rgba(255,255,255,0.3)',
          }}
        >
          🤖
        </div>

        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1rem' }}>Dr. Matrix</p>
          <p style={{ margin: 0, fontSize: '0.72rem', opacity: 0.85, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#4ADE80',
                display: 'inline-block',
              }}
            />
            AI symptom assistant • Online
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div
        style={{
          background: '#fdf3e6',
          color: '#a5690c',
          fontSize: '0.75rem',
          padding: '8px 20px',
          textAlign: 'center',
          borderBottom: '1px solid #f2e2c4',
        }}
      >
        ⚠ Not a substitute for professional medical advice. In an emergency, contact a doctor or hospital immediately.
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              style={{
                display: 'flex',
                gap: '10px',
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                flexDirection: m.sender === 'user' ? 'row-reverse' : 'row',
                maxWidth: '80%',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.95rem',
                  background: m.sender === 'user' ? '#0F3D3E' : '#ffffff',
                  color: m.sender === 'user' ? '#fff' : '#0F3D3E',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
              >
                {m.sender === 'user' ? '🙂' : '🤖'}
              </div>

              <div>
                <div
                  style={{
                    backgroundColor: m.sender === 'user' ? '#0F3D3E' : '#ffffff',
                    color: m.sender === 'user' ? '#fff' : '#2c2c2a',
                    padding: '12px 16px',
                    borderRadius: '18px',
                    borderBottomRightRadius: m.sender === 'user' ? '4px' : '18px',
                    borderBottomLeftRadius: m.sender === 'bot' ? '4px' : '18px',
                    boxShadow: '0 3px 12px rgba(0,0,0,0.07)',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                  }}
                >
                  {m.text}
                </div>
                <p
                  style={{
                    margin: '4px 4px 0',
                    fontSize: '0.68rem',
                    color: '#a3a297',
                    textAlign: m.sender === 'user' ? 'right' : 'left',
                  }}
                >
                  {m.time}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {typing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', gap: '10px', alignSelf: 'flex-start' }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.95rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                flexShrink: 0,
              }}
            >
              🤖
            </div>
            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '14px 18px',
                borderRadius: '18px',
                borderBottomLeftRadius: '4px',
                boxShadow: '0 3px 12px rgba(0,0,0,0.07)',
                display: 'flex',
                gap: '4px',
                alignItems: 'center',
              }}
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#0F3D3E',
                    display: 'inline-block',
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts (only show before conversation grows) */}
      {messages.length === 1 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '0 20px 12px' }}>
          {suggestedPrompts.map((p) => (
            <button
              key={p}
              onClick={() => sendMessage(p)}
              style={{
                padding: '8px 14px',
                borderRadius: '999px',
                border: '1px solid #0F3D3E33',
                backgroundColor: '#ffffff',
                color: '#0F3D3E',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <form
        onSubmit={handleSend}
        style={{
          display: 'flex',
          gap: '10px',
          padding: '14px 20px',
          background: '#ffffff',
          borderTop: '1px solid #eee',
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your symptoms..."
          style={{
            flex: 1,
            padding: '13px 18px',
            borderRadius: '999px',
            border: '1px solid #ddd',
            outline: 'none',
            fontSize: '0.9rem',
          }}
        />
        <motion.button
          whileTap={{ scale: 0.92 }}
          type="submit"
          style={{
            background: 'linear-gradient(120deg, #0F3D3E 0%, #175B5C 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '46px',
            height: '46px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            flexShrink: 0,
          }}
          aria-label="Send"
        >
          ➤
        </motion.button>
      </form>
    </div>
  );
}

export default DrMatrixScreen;