"use client";
import { useEffect, useRef } from "react";
import * as Phaser from "phaser";

export default function GameScene() {
  const gameRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      parent: "game-container",
      width: window.innerWidth,
      height: window.innerHeight,
      physics: {
        default: "arcade",
        arcade: { gravity: { y: 1500 }, debug: false },
      },
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    };

    const game = new Phaser.Game(config);

    function preload() {
      // هنا نحمل القطة (سنستخدم رسمة برمجية مؤقتاً لضمان التشغيل الفوري)
      this.load.image('cat', 'https://labs.phaser.io/assets/sprites/cat.png');
    }

    let player;
    let obstacles;
    let score = 0;
    let scoreText;

    function create() {
      // إضافة القطة Yaoyao
      player = this.physics.add.sprite(100, 450, 'cat').setScale(0.5);
      player.setCollideWorldBounds(true);

      // نظام التحكم للموبايل (اللمس)
      this.input.on("pointerdown", () => {
        if (player.body.blocked.down || player.body.touching.down) {
          player.setVelocityY(-800);
        }
      });

      // العوائق
      obstacles = this.physics.add.group();
      this.time.addEvent({
        delay: 1500,
        callback: () => {
          const obs = obstacles.create(window.innerWidth, window.innerHeight - 50, 'cat');
          obs.setTint(0xff0000); // لون أحمر للعوائق
          obs.setVelocityX(-400);
        },
        loop: true
      });

      // نظام النقاط
      scoreText = this.add.text(20, 20, 'Score: 0', { fontSize: '32px', fill: '#00ffcc' });

      // الاصطدام
      this.physics.add.overlap(player, obstacles, () => {
        this.scene.restart();
        score = 0;
      });
    }

    function update() {
        score += 1;
        scoreText.setText('Score: ' + Math.floor(score / 10));
    }

    return () => game.destroy(true);
  }, []);

  return <div id="game-container" className="w-full h-screen overflow-hidden" />;
}
