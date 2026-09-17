import { useEffect, useRef } from 'react';

export default function PreviewView({ currentNode, chatHistory, onAnswer, onRestart }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const isEnd = !currentNode?.options || currentNode.options.length === 0;
  if (!currentNode) return null;


  return (

    <div className="h-full w-full flex items-center justify-center p-6">
   
      <div className="w-[520px] max-h-full flex flex-col bg-card border border-connector-label-bg rounded-3xl shadow-[0_0_40px_rgba(139,92,246,0.15)] overflow-hidden">

        {/* ---------- HEADER ---------- */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-connector-label-bg shrink-0">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-border-selected to-border-question flex items-center justify-center font-bold text-white text-lg">
            S
          </div>
          <div>
            <p className="text-sm font-bold text-text-primary">SupportFlow Bot</p>
            <p className="text-[11px] text-text-muted">
              {isEnd ? 'Conversation ended' : 'Online'}
            </p>
          </div>
        </div>

        {/* ---------- MESSAGES ---------- */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5 flex flex-col gap-3">
          {chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'bot'
                    ? 'bg-connector-label-bg text-text-primary rounded-bl-sm'
                    : 'bg-border-selected text-white rounded-br-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* ---------- FOOTER ---------- */}
        <div className="p-4 border-t border-connector-label-bg shrink-0">
          {isEnd ? (
            <div className="flex flex-col items-center gap-3">
              <p className="text-[11px] text-text-muted tracking-wider uppercase">
                End of conversation
              </p>
              <button
                onClick={onRestart}
                className="w-full bg-gradient-to-r from-border-selected to-border-question hover:opacity-90 text-white text-sm font-medium py-3 rounded-xl transition-opacity"
              >
                ↻ Restart conversation
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {currentNode.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => onAnswer(option.nextId, option.label)}
                  className="w-full text-left bg-canvas hover:bg-connector-label-bg border border-connector-label-bg text-text-primary text-sm px-4 py-3 rounded-xl transition-colors flex items-center justify-between"
                >
                  <span>{option.label}</span>
                  <span className="text-text-muted">→</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}