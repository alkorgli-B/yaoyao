import GameScene from "@/components/GameScene";

export default function Home() {
  return (
    <main className="bg-black w-screen h-screen">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-white font-bold text-2xl animate-pulse">
        YAOYAO RUN 🐾
      </div>
      <GameScene />
    </main>
  );
}
