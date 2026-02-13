"use client";
import React, { useEffect, useRef, useState } from 'react';

export default function YaoyaoGame() {
  const gameContainerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // تحميل Phaser ديناميكياً لتجنب أخطاء SSR في Next.js
    import("phaser").then((Phaser) => {
      const config = {
        type: Phaser.AUTO,
        parent: "game-container",
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: "#0a0a0a",
        physics: {
          default: "arcade",
          arcade: { gravity: { y: 2000 }, debug: false },
        },
        scene: {
          preload: preload,
          create: create,
          update: update,
        },
      };

      const game = new Phaser.Game(config);

      function preload() {
        // شخصية القطة Yaoyao (باستخدام Sprite جاهز من Phaser للسرعة)
        this.load.image('cat', 'https://labs.phaser.io/assets/sprites/orange-cat1.png');
      }

      let player;
      let obstacles;
      let score = 0;
      let scoreText;
      let isGameOver = false;

      function create() {
        // نيون باكجراوند بسيط
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0x00ffff, 0.3);
        for (let i = 0; i < window.innerWidth; i += 40) {
          graphics.moveTo(i, 0);
          graphics.lineTo(i, window.innerHeight);
        }
        graphics.strokePath();

        // القطة Yaoyao
        player = this.physics.add.sprite(80, window.innerHeight / 2, 'cat').setScale(1.5);
        player.setCollideWorldBounds(true);
        player.setBounce(0.1);

        // التحكم باللمس للموبايل
        this.input.on("pointerdown", () => {
          if (player.body.blocked.down || player.body.touching.down) {
            player.setVelocityY(-900);
          }
        });

        // العوائق
        obstacles = this.physics.add.group();
        this.time.addEvent({
          delay: 1200,
          callback: () => {
            if (!isGameOver) {
              const obs = obstacles.create(window.innerWidth, window.innerHeight - 60, 'cat');
              obs.setTint(0xff0055);
              obs.setVelocityX(-500 - (score / 10)); // السرعة تزداد مع الوقت
              obs.setScale(1.2);
            }
          },
          loop: true
        });

        // واجهة المستخدم
        scoreText = this.add.text(20, 20, 'Yaoyao Score: 0', { 
          fontSize: '28px', 
          fill: '#00ffcc',
          fontFamily: 'Arial Black'
        });

        // نظام الاصطدام
        this.physics.add.overlap(player, obstacles, () => {
          this.physics.pause();
          isGameOver = true;
          player.setTint(0xff0000);
          
          const retryText = this.add.text(window.innerWidth/2, window.innerHeight/2, 'GAME OVER\nTap to Restart', {
            fontSize: '40px',
            fill: '#fff',
            align: 'center',
            backgroundColor: '#ff0055'
          }).setOrigin(0.5).setInteractive();

          retryText.on('pointerdown', () => {
            isGameOver = false;
            score = 0;
            this.scene.restart();
          });
        });
      }

      function update() {
        if (!isGameOver) {
          score += 1;
          scoreText.setText('Yaoyao Score: ' + Math.floor(score / 10));
        }
      }

      setLoading(false);
      return () => game.destroy(true);
    });
  }, []);

  return (
    <main className="fixed inset-0 bg-black overflow-hidden touch-none">
      {loading && (
        <div className="flex items-center justify-center h-full text-cyan-400 animate-pulse font-mono">
          LOADING YAOYAO ENGINE...
        </div>
      )}
      <div id="game-container" ref={gameContainerRef} className="w-full h-full" />
    </main>
  );
}
