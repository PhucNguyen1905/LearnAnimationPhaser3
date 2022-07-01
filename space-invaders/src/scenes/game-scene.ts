import { Enemy } from '../objects/enemy';
import { Player } from '../objects/player';
import { Bullet } from '../objects/bullet';

export class GameScene extends Phaser.Scene {
  private enemies: Phaser.GameObjects.Group;
  private player: Player;

  private fireEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private touchEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor() {
    super({
      key: 'GameScene'
    });
  }

  init(): void {
    this.enemies = this.add.group({ runChildUpdate: true });
  }

  create(): void {

    this.createPlayer();

    this.createEnemies();

    this.createParticles();
  }

  createPlayer() {
    this.player = new Player({
      scene: this,
      x: this.sys.canvas.width / 2,
      y: this.sys.canvas.height - 40,
      texture: 'player'
    });
  }

  createEnemies() {
    // if you want to make it random:
    // let enemyTypes = ["octopus", "crab", "squid"];
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 10; x++) {
        let type;
        if (y === 0) {
          type = 'squid';
        } else if (y === 1 || y === 2) {
          type = 'crab';
        } else {
          type = 'octopus';
        }
        // if you want to make it random:
        // let type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        this.enemies.add(
          new Enemy({
            scene: this,
            x: 20 + x * 15,
            y: 50 + y * 15,
            texture: type
          })
        );
      }
    }
  }

  createParticles() {
    this.fireEmitter = this.add.particles('fire').createEmitter({
      // alpha: { start: 1, end: 0 },
      scale: { start: 0.05, end: 0.25 },
      speed: 20,
      accelerationY: 300,
      angle: { min: -85, max: -95 },
      rotate: { min: -180, max: 180 },
      lifespan: { min: 300, max: 400 },
      blendMode: 'ADD',
      frequency: 50,
      follow: this.player,
      followOffset: { x: 0.3, y: 7 }
    });

    this.touchEmitter = this.add.particles('flares').createEmitter({
      x: -100,
      y: -100,
      frame: 'red',
      speed: { min: -200, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.05, end: 0 },
      blendMode: 'ADD',
      lifespan: 500,
      gravityY: 800
    });

  }

  update(): void {
    if (this.player.active) {
      this.player.update();

      this.enemies.children.each((enemy: Enemy) => {
        enemy.update();
        if (enemy.getBullets().getLength() > 0) {
          this.physics.overlap(
            enemy.getBullets(),
            this.player,
            this.bulletHitPlayer,
            null,
            this
          );
        }
      }, this);

      this.checkCollisions();
    }

    if (this.registry.get('lives') < 0 || this.enemies.getLength() === 0) {
      this.scene.start('MenuScene');
      this.scene.stop('HUDScene');
    }
  }

  private checkCollisions(): void {
    this.physics.overlap(
      this.player.getBullets(),
      this.enemies,
      this.bulletHitEnemy,
      null,
      this
    );
  }

  private bulletHitEnemy(bullet: Bullet, enemy: Enemy): void {
    this.touchEmitter.explode(5, enemy.x, enemy.y)
    bullet.destroy();
    enemy.gotHurt();
    let scoreText = this.add.text(
      this.player.x,
      this.player.y,
      enemy.valueKill.toString(),
      { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', fontSize: '10px' }
    )
    this.tweens.add(
      {
        targets: scoreText,
        props: { y: scoreText.y - 25 },
        duration: 800,
        ease: 'Power0',
        yoyo: false,
        onComplete: () => {
          scoreText.destroy();
        }
      }
    )
  }

  private bulletHitPlayer(bullet: Bullet, player: Player): void {
    if (this.player.alpha == 1) {
      bullet.destroy();
      player.gotHurt();
    }
  }
}
