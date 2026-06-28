import { useState, useRef, useEffect } from 'react';
import { motion, useDragControls } from 'motion/react';
import { Sparkles, X, Minimize2, Send, Bot } from 'lucide-react';

export function SocraticChatPanel() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const dragControls = useDragControls();
  const constraintsRef = useRef(null);

  // Auto-scroll logic could go here
  
  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      initial={{ x: 600, y: 100, opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1, height: isMinimized ? 'auto' : 500 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`fixed z-50 flex flex-col glass-panel-heavy overflow-hidden rounded-xl ${
        isMinimized ? 'w-[300px]' : 'w-[400px]'
      }`}
      style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
    >
      {/* Header / Drag Handle */}
      <div 
        className="flex items-center justify-between px-4 py-3 border-b border-white/10 cursor-grab active:cursor-grabbing bg-white/[0.02]"
        onPointerDown={(e) => dragControls.start(e)}
      >
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-primary" />
          <span className="text-sm font-medium text-white/90">苏格拉底导师</span>
        </div>
        <div className="flex items-center gap-2 text-white/40">
          <button onClick={() => setIsMinimized(!isMinimized)} className="hover:text-white transition-colors">
            <Minimize2 size={14} />
          </button>
          <button className="hover:text-white transition-colors">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar">
            {/* AI Message */}
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                <Bot size={12} className="text-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-[13px] leading-relaxed text-white/80 bg-white/5 p-3 rounded-2xl rounded-tl-sm">
                  在我们进入变压器的等效电路之前，你还记得在磁路中，当铁芯饱和时，励磁电流的波形会发生什么变化吗？<sup className="text-primary ml-1 cursor-pointer hover:underline">[1]</sup>
                </div>
                <span className="text-[10px] text-white/30 ml-1">10:42 AM</span>
              </div>
            </div>

            {/* User Message */}
            <div className="flex gap-3 flex-row-reverse">
              <div className="flex flex-col gap-1 items-end">
                <div className="text-[13px] leading-relaxed text-white bg-accent/20 p-3 rounded-2xl rounded-tr-sm border border-accent/20">
                  会变成尖顶波？因为磁导率下降了？
                </div>
              </div>
            </div>
            
            {/* AI Message */}
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                <Bot size={12} className="text-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-[13px] leading-relaxed text-white/80 bg-white/5 p-3 rounded-2xl rounded-tl-sm">
                  回答得很棒。既然你提到了磁导率下降，那么在这种情况下，如果强行用线性电路的思维去画变压器的等效模型，你觉得会忽略掉什么关键损耗？
                </div>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-white/10 bg-black/20">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="继续推演..." 
                className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors"
              />
              <button className="absolute right-2 p-1.5 bg-primary rounded-full text-white hover:bg-primary/80 transition-colors">
                <Send size={14} />
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
