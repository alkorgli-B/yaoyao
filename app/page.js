"use client";
import React, { useEffect, useRef, useState } from 'react';

export default function YaoyaoGame() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("phaser").then((Phaser) => {
      const config = {
        type: Phaser.AUTO,
        parent: "game-container",
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: "#050510",
        physics: {
          default: "arcade",
          arcade: { debug: false }, // ألغينا الجاذبية الثابتة لنجعل الحركة حرة (تجول)
        },
        scene: { preload, create, update },
      };

      const game = new Phaser.Game(config);

      let player;
      let crystals;
      let score = 0;
      let scoreText;
      let particles;

      function preload() {
        // تحميل الأصول
        this.load.image('cat', 'https://labs.phaser.io/assets/sprites/orange-cat1.png');
        this.load.image('crystal', 'https://labs.phaser.io/assets/sprites/gem.png');
        this.load.image('particle', 'https://labs.phaser.io/assets/particles/blue.png');
      }

      function create() {
        // 1. نظام الجزيئات (Particles) لإعطاء حيوية
        particles = this.add.particles(0, 0, 'particle', {
          speed: 100,
          scale: { start: 0.2, end: 0 },
          blendMode: 'ADD',
          emitting: false
        });

        // 2. القطة Yaoyao مع تحسين المظهر
        player = this.physics.add.sprite(window.innerWidth / 2, window.innerHeight / 2, 'cat').setScale(1.2);
        player.setCollideWorldBounds(true);
        player.setDrag(1000); // تعطي شعور بالنعومة عند التوقف

        // 3. الأهداف (كريستالات)
        crystals = this.physics.add.group();
        spawnCrystal.call(this);

        // 4. نظام الحركة باللمس (المتابعة)
        this.input.on('pointermove', (pointer) => {
          if (pointer.isDown) {
            // القطة تتحرك باتجاه الإصبع بسلاسة
            this.physics.moveToObject(player, pointer, 400);
            particles.emitParticleAt(player.x, player.y);
          }
        });

        // 5. تفاعل الجمع
        this.physics.add.overlap(player, crystals, collectCrystal, null, this);

        // 6. واجهة المستخدم
        scoreText = this.add.text(20, 20, 'Crystals: 0/10', { 
          fontSize: '24px', 
          fill: '#00ffff',
          fontStyle: 'bold'
        }).setScrollFactor(0);
      }

      function spawnCrystal() {
        const x = Phaser.Math.Between(50, window.innerWidth - 50);
        const y = Phaser.Math.Between(50, window.innerHeight - 50);
        const crystal = crystals.create(x, y, 'crystal').setScale(0.8);
        crystal.setTint(0x00ffcc);
        
        // تأثير نبض للكريستال
        this.tweens.add({
          targets: crystal,
          scale: 1.1,
          duration: 800,
          yoyo: true,
          loop: -1
        });
      }

      function collectCrystal(player, crystal) {
        crystal.destroy();
        score += 1;
        scoreText.setText(`Crystals: ${score}/10`);
        
        // تأثير بصري عند الجمع
        this.cameras.main.shake(100, 0.01);
        
        if (score < 10) {
          spawnCrystal.call(this);
        } else {
          showWinMessage.call(this);
        }
      }

      function showWinMessage() {
        this.add.text(window.innerWidth/2, window.innerHeight/2, 'YAOYAO IS HOME! 🐾\nMission Complete', {
          fontSize: '32px',
          fill: '#00ffcc',
          align: 'center',
          backgroundColor: '#000000aa'
        }).setOrigin(0.5);
        this.physics.pause();
      }

      function update() {
        // دوران بسيط للقطة باتجاه الحركة
        if (player.body.velocity.x !== 0) {
            player.flipX = player.body.velocity.x < 0;
        }
      }

      setLoading(false);
      return () => game.destroy(true);
    });
  }, []);

  return (
    <main className="fixed inset-0 bg-[#050510] overflow-hidden touch-none">
      {loading && (
        <div className="flex flex-col items-center justify-center h-full text-cyan-400 font-mono">
          <div className="w-16 h-16 border-4 border-t-transparent border-cyan-400 rounded-full animate-spin mb-4"></div>
          INITIALIZING YAOYAO WORLD...
        </div>
      )}
      <div id="game-container" className="w-full h-full" />
      <div className="absolute bottom-10 w-full text-center text-white/50 text-sm pointer-events-none">
        إلمس الشاشة وحرك إصبعك لتقود Yaoyao
      </div>
    </main>
  );
}
