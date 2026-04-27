import { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Helvetica_Neue',Arial,sans-serif] overflow-hidden flex flex-col selection:bg-cyan-400 selection:text-black">
      {/* Header */}
      <header className="p-6 border-b border-white/10 flex justify-center lg:justify-between items-center">
        <h1 className="text-4xl font-black italic tracking-tighter text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] uppercase">
          Neon Snake Synth
        </h1>
        <div className="hidden lg:flex gap-12 items-center">
           {/* Visual placeholders for theme aesthetics */}
           <div className="text-center">
             <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">System Status</p>
             <p className="text-xl font-mono font-bold leading-none text-cyan-400">ONLINE</p>
           </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col lg:flex-row flex-1 p-4 lg:p-8 gap-8 items-start justify-center">
        
        {/* Side Panel / Music Player */}
        <aside className="w-full lg:w-72 flex flex-col gap-6 order-2 lg:order-1">
          <MusicPlayer />
          
          <section className="mt-8 pb-4 border-t border-white/10 pt-6 hidden lg:block">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Diagnostics</h2>
            <div className="space-y-2 text-[10px] text-white/30 tracking-[0.2em] uppercase font-bold">
              <p>AUDIO_LINKS: ESTABLISHED</p>
              <p>NEURAL_NET: ACTIVE</p>
              <p className="text-fuchsia-500">MULTIPLIER: X12.4</p>
            </div>
          </section>
        </aside>

        {/* Game Area */}
        <section className="flex-1 flex flex-col items-center justify-center order-1 lg:order-2 w-full">
          <SnakeGame />
        </section>

      </main>

      {/* Bottom Visualizer Stripe */}
      <footer className="h-16 flex items-end px-2 gap-[2px] opacity-50 hidden lg:flex">
        {Array.from({ length: 80 }).map((_, i) => (
          <div 
            key={i} 
            className="flex-1 bg-cyan-400" 
            style={{ 
              height: `${Math.floor(Math.random() * 40) + 10}px`, 
              opacity: Math.random() * 0.5 + 0.2 
            }}
          ></div>
        ))}
      </footer>
    </div>
  );
}
