"use client";
import React, { useState, useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  OrbitControls, PerspectiveCamera, Stars, MeshDistortMaterial, 
  Float, ContactShadows, Environment, Text
} from "@react-three/drei";
import * as THREE from "three";
import { Cat, Play, Terminal, Shield, Zap, Sparkles } from "lucide-react";

// --- نظام القصة (Story Engine) ---
const StoryOverlay = ({ score }) => {
  const [msg, setMsg] = useState("INITIALIZING NEON PROTOCOL...");
  
  useEffect(() => {
    if (score === 0) setMsg("Yaoyao, find the 5 Power Crystals to return home.");
    if (score === 1) setMsg("System stabilized. Energy levels rising...");
    if (score === 3) setMsg("Warning: Digital storm approaching. Stay fast!");
    if (score === 5) setMsg("PORTAL OPEN! Yaoyao is safe. Mission Accomplished.");
  }, [score]);

  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg">
      <div className="bg-black/80 border-t-2 border-cyan-400 p-4 backdrop-blur-xl rounded-t-2xl shadow-[0_-10px_30px_rgba(6,182,212,0.2)]">
        <div className="flex items-center gap-3 font-mono">
          <Terminal size={16} className="text-cyan-400 animate-pulse" />
          <p className="text-cyan-400 text-xs tracking-widest uppercase italic">Mission_Log:</p>
        </div>
        <p className="mt-2 text-white font-medium text-sm sm:text-base leading-snug animate-in fade-in slide-in-from-bottom-2">
          {msg}
        </p>
      </div>
    </div>
  );
};

// --- اللاعب (Yaoyao - 3D Entity) ---
function YaoyaoPlayer({ targetPoint }) {
  const meshRef = useRef();
  useFrame(() => {
    if (targetPoint && meshRef.current) {
      meshRef.current.position.lerp(new THREE.Vector3(targetPoint.x, 0.6, targetPoint.z), 0.15);
      meshRef.current.rotation.y += 0.05;
    }
  });

  return (
    <mesh ref={meshRef} castShadow>
      <sphereGeometry args={[0.6, 64, 64]} />
      <MeshDistortMaterial 
        color="#00f3ff" speed={5} distort={0.4} radius={1} 
        emissive="#0066ff" emissiveIntensity={1}
      />
      <pointLight intensity={2} color="#00f3ff" />
    </mesh>
  );
}

// --- الكريستالات (Collectibles) ---
function Crystal({ position, onCollect }) {
  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.y += 0.04;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
  });

  return (
    <mesh position={position} ref={ref} onClick={onCollect}>
      <octahedronGeometry args={[0.4, 0]} />
      <meshStandardMaterial color="#ff0077" emissive="#ff0077" emissiveIntensity={2} />
    </mesh>
  );
}

// --- العالم والبيئة (The Digital Void) ---
function World({ isPlaying, onCollect }) {
  const [target, setTarget] = useState(new THREE.Vector3(0, 0, 0));
  const { viewport } = useThree();

  const moveHandler = (e) => {
    if (!isPlaying) return;
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    setTarget(new THREE.Vector3(x * viewport.width / 1.5, 0, -y * viewport.height / 1.5));
  };

  useEffect(() => {
    window.addEventListener('pointermove', moveHandler);
    return () => window.removeEventListener('pointermove', moveHandler);
  }, [isPlaying]);

  return (
    <>
      <Stars radius={100} depth={50} count={7000} factor={4} saturation={1} fade speed={2} />
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} castShadow />
      
      {isPlaying && (
        <Suspense fallback={null}>
          <YaoyaoPlayer targetPoint={target} />
          <Crystal position={[4, 0.6, -4]} onCollect={onCollect} />
          <Crystal position={[-5, 0.6, 3]} onCollect={onCollect} />
          <Crystal position={[0, 0.6, -7]} onCollect={onCollect} />
          <gridHelper args={[40, 40, "#111", "#00f3ff"]} />
          <ContactShadows opacity={0.5} scale={20} blur={2.4} />
        </Suspense>
      )}
    </>
  );
}

// --- الواجهة الكلية (Main UI) ---
export default function YaoyaoGrandProject() {
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);

  return (
    <div className="relative w-full h-screen bg-[#020208] text-white select-none overflow-hidden font-sans">
      {/* Branded Watermark */}
      <div className="absolute top-4 right-6 z-50 flex items-center gap-2 opacity-40">
        <Zap size={12} className="text-cyan-400" />
        <p className="font-mono text-[9px] tracking-[0.2em] uppercase">Made by alkorgli</p>
      </div>

      {gameState === 'menu' && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-black/0 via-black/80 to-black">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-20 animate-pulse" />
            <Cat size={100} className="text-cyan-400 relative z-10" />
          </div>
          <h1 className="text-8xl font-black tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-400 to-fuchsia-500">
            YAOYAO
          </h1>
          <p className="text-cyan-500 font-mono tracking-[0.5em] mb-12 text-xs uppercase">Neon Survival Protocol</p>
          
          <button 
            onClick={() => setGameState('playing')}
            className="group relative px-16 py-5 bg-white text-black font-black text-xl rounded-full transition-transform hover:scale-110 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            <div className="flex items-center gap-3">
              <Play fill="black" /> START MISSION
            </div>
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <>
          <div className="absolute top-10 left-10 z-40 space-y-4">
            <div className="bg-black/60 border-l-4 border-fuchsia-500 p-4 backdrop-blur-md">
              <p className="text-[10px] text-fuchsia-500 font-bold uppercase tracking-widest">Energy Gained</p>
              <p className="text-4xl font-black italic">{score * 20}%</p>
            </div>
          </div>
          <StoryOverlay score={score} />
        </>
      )}

      <div className="w-full h-full">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 12, 15]} fov={45} />
          <World isPlaying={gameState === 'playing'} onCollect={() => setScore(s => Math.min(s + 1, 5))} />
          <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2.2} />
        </Canvas>
      </div>
    </div>
  );
}
