import { useEffect, useRef, useState } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 15, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const directionRef = useRef(direction);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const generateFood = () => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
      
      const { x, y } = directionRef.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, 120);
    return () => clearInterval(intervalId);
  }, [gameOver, isPaused, food]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 flex flex-row items-center justify-between w-full max-w-[400px] bg-white/5 border-l-4 border-cyan-400 p-4">
        <div className="flex flex-col">
          <h2 className="text-[10px] uppercase tracking-widest text-white/50 mb-1 font-bold">Current Score</h2>
          <span className="text-4xl font-mono font-bold leading-none text-white">{score}</span>
        </div>
        {isPaused && !gameOver && (
          <span className="text-[10px] uppercase font-bold tracking-tighter text-fuchsia-500 animate-pulse">System: Paused</span>
        )}
      </div>

      <div className="relative bg-black border-4 border-white/10 p-2 shadow-[0_0_50px_rgba(0,0,0,1)]">
        <div 
          className="relative bg-[#0c0c0c] overflow-hidden"
        style={{
          width: 'min(90vw, 400px)',
          height: 'min(90vw, 400px)',
        }}
      >
        {/* Grid lines */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #ffffff 1px, transparent 1px),
              linear-gradient(to bottom, #ffffff 1px, transparent 1px)
            `,
            backgroundSize: `calc(100% / ${GRID_SIZE}) calc(100% / ${GRID_SIZE})`
          }}
        />

        {/* Snake components */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className="absolute bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
            style={{
              left: `${(segment.x / GRID_SIZE) * 100}%`,
              top: `${(segment.y / GRID_SIZE) * 100}%`,
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              borderRadius: index === 0 ? '0px' : '0px',
              border: '1px solid #0c0c0c',
              zIndex: index === 0 ? 10 : 5,
              opacity: index === 0 ? 1 : Math.max(0.2, 1 - index * 0.1),
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute bg-fuchsia-500 shadow-[0_0_15px_#d946ef] animate-pulse rounded-full"
          style={{
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            transform: 'scale(0.8)',
          }}
        />

        {/* Game Over Screen */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            <div className="text-4xl font-black text-fuchsia-500 uppercase tracking-widest drop-shadow-[0_0_15px_#d946ef] mb-6">
              System Failure
            </div>
            <button
              onClick={resetGame}
              className="px-6 py-2 border-2 border-cyan-400 text-cyan-400 uppercase tracking-wider font-mono font-bold hover:bg-cyan-400 hover:text-black transition-all shadow-[0_0_15px_rgba(34,211,238,0.5)] hover:shadow-[0_0_25px_rgba(34,211,238,1)]"
            >
              Reboot sequence
            </button>
          </div>
        )}
        </div>
      </div>
      
      <div className="mt-6 text-[10px] text-white/30 tracking-[0.2em] uppercase font-bold text-center">
        <p>Use Arrow Keys to Navigate / Space to Pause</p>
      </div>
    </div>
  );
}
