import StoryOverlay from "@/components/StoryOverlay";
import { GAME_CONFIG } from "@/components/GameConfig";
"use client";
import React, { useState, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Float, Text, MeshDistortMaterial, Stars } from "@react-three/drei";
import * as THREE from "three";

// كائن القطة الثلاثي الأبعاد (Yaoyao)
function Player({ targetPoint }) {
  const mesh = useRef();
  
  useFrame((state) => {
    if (targetPoint) {
      // حركة سلسة جداً باتجاه اللمس (Lerp)
      mesh.current.position.lerp(new THREE.Vector3(targetPoint.x, 0.5, targetPoint.z), 0.1);
    }
  });

  return (
    <mesh ref={mesh} position={[0, 0.5, 0]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <MeshDistortMaterial color="#00ffcc" speed={2} distort={0.4} radius={1} />
      <pointLight intensity={2} distance={5} color="#00ffcc" />
    </mesh>
  );
}

// الكريستالات المطلوب جمعها
function Crystal({ position }) {
  return (
    <Float speed={5} rotationIntensity={2} floatIntensity={2}>
      <mesh position={position}>
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color="#ff00bb" emissive="#ff00bb" emissiveIntensity={2} />
      </mesh>
    </Float>
  );
}

export default function Yaoyao3D() {
  const [gameStarted, setGameStarted] = useState(false);
  const [targetPoint, setTargetPoint] = useState(new THREE.Vector3(0, 0, 0));

  const handlePointerMove = (e) => {
    if (gameStarted) {
      // تحويل إحداثيات اللمس إلى عالم 3D
      const x = (e.clientX / window.innerWidth) * 10 - 5;
      const z = (e.clientY / window.innerHeight) * 10 - 5;
      setTargetPoint(new THREE.Vector3(x, 0, z));
    }
  };

  return (
    <div className="w-full h-screen bg-black overflow-hidden touch-none" onPointerMove={handlePointerMove}>
      {/* ملحوظة المبرمج */}
      <div className="absolute top-2 right-4 z-50 text-white/30 text-[10px] font-mono">
        Made by alkorgli
      </div>

      {!gameStarted ? (
        // القائمة الرئيسية
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-8 animate-pulse">
            YAOYAO 3D
          </h1>
          <button 
            onClick={() => setGameStarted(true)}
            className="px-10 py-4 bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300 font-bold tracking-widest text-xl rounded-full uppercase"
          >
            Start Mission
          </button>
          <p className="mt-6 text-white/50 text-sm italic">Guide the cat through the digital void</p>
        </div>
      ) : (
        // واجهة اللعبة أثناء اللعب
        <div className="absolute top-10 left-10 z-40 text-cyan-400 font-mono text-xl pointer-events-none">
          MISSION: COLLECT ENERGY
        </div>
      )}

      {/* محرك الـ 3D */}
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 10, 10]} fov={50} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        
        <Suspense fallback={null}>
          {gameStarted && (
            <>
              <Player targetPoint={targetPoint} />
              <Crystal position={[3, 0.5, -2]} />
              <Crystal position={[-4, 0.5, 3]} />
              <Crystal position={[0, 0.5, -5]} />
              
              {/* الأرضية النيون */}
              <gridHelper args={[20, 20, "#222", "#00ffcc"]} />
              <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial color="#050505" />
              </mesh>
            </>
          )}
        </Suspense>

        <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2.5} />
      </Canvas>
    </div>
  );
}
