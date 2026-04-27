import { Play, Pause, SkipForward, SkipBack, Volume2, Disc3 } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

const TRACKS = [
  {
    id: 1,
    title: 'Neon Dreams (AI Gen)',
    artist: 'Synthetic Mind',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 2,
    title: 'Cyberpunk City (AI Gen)',
    artist: 'Neural Network',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 3,
    title: 'Retro Synthwave (AI Gen)',
    artist: 'Cyber Bot 9000',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(isNaN(p) ? 0 : p);
    }
  };

  const handleTrackEnded = () => {
    playNext();
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Playlist */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Playlist / {TRACKS.length > 9 ? TRACKS.length : `0${TRACKS.length}`}</h2>
        <div className="space-y-2">
          {TRACKS.map((track, index) => {
            const isCurrent = index === currentTrackIndex;
            return (
              <div 
                key={track.id}
                onClick={() => {
                  setCurrentTrackIndex(index);
                  setIsPlaying(true);
                }}
                className={`p-3 flex flex-col cursor-pointer transition-all ${isCurrent ? 'bg-white/5 border-l-4 border-cyan-400' : 'hover:bg-white/5 opacity-60'}`}
              >
                <span className="text-sm font-bold text-white truncate">{track.title}</span>
                <span className="text-xs text-white/50 truncate uppercase tracking-widest mt-1">{track.artist}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Track Info Container */}
      <div className="border border-white/10 p-6 w-full max-w-sm bg-black/40">
        <audio
          ref={audioRef}
          src={currentTrack.url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleTrackEnded}
        />
        
        <p className="text-[10px] uppercase tracking-widest text-fuchsia-500 mb-4 font-bold flex justify-between">
          <span>Now Rendering</span>
          <span className="text-white/30">TRK.0{currentTrackIndex + 1}</span>
        </p>

        <div className="aspect-square w-full bg-gradient-to-br from-cyan-900 to-black border border-white/20 mb-4 flex items-center justify-center overflow-hidden relative">
          <div className={`w-24 h-24 border-4 border-cyan-400/20 rounded-full flex items-center justify-center ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
            <div className="w-16 h-16 border-2 border-cyan-400/40 rounded-full flex items-center justify-center">
               <div className="w-4 h-4 bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
            </div>
          </div>
          {isPlaying && (
             <div className="absolute inset-0 bg-cyan-400/5 animate-pulse mix-blend-overlay"></div>
          )}
        </div>

        <h3 className="text-xl font-black uppercase leading-tight italic truncate text-white">
          {currentTrack.title}
        </h3>
        <p className="text-xs text-white/60 mb-6 truncate uppercase tracking-widest">
          {currentTrack.artist}
        </p>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/10 mb-6 overflow-hidden">
          <div 
            className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-2">
          <button 
            onClick={playPrev}
            className="p-2 hover:text-cyan-400 text-white transition-colors"
          >
            <SkipBack className="w-6 h-6" fill="currentColor" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-14 h-14 bg-cyan-400 text-black hover:bg-cyan-300 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" fill="currentColor" />
            ) : (
              <Play className="w-6 h-6 ml-1" fill="currentColor" />
            )}
          </button>
          
          <button 
            onClick={playNext}
            className="p-2 hover:text-cyan-400 text-white transition-colors"
          >
            <SkipForward className="w-6 h-6" fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
}
