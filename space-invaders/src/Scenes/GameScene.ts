import { Enemy } from '../Objects/Enemy';
import { Player } from '../Objects/Player';
import { Bullet } from '../Objects/Bullet';

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

    this.time.delayedCall(5000, () => {
      this.enemies.getChildren().forEach((e: Enemy) => {
        e.moveTween.remove();
      })
      this.createTweenCircle();
    })

  }

  createTweenCircle() {
    let whiteEnemy: Enemy[] = [];
    let blueEnemy: Enemy[] = [];
    let blackEnemy: Enemy[] = [];

    this.enemies.getChildren().forEach((e: Enemy) => {
      if (e.enemyType == 'octopus') {
        whiteEnemy.push(e);
      } else if (e.enemyType == 'crab') {
        blueEnemy.push(e);
      } else {
        blackEnemy.push(e);
      }
    })

    const whileXPos = [162, 159.55528599677476, 152.4602090494016, 141.40858651656876, 127.48114065285121, 112.03981633553666, 96.59459843610037, 82.65585257380704, 71.5866286365345, 64.46937009485421, 62.000063413623025, 64.42017853771544, 71.49305589380005, 82.52704898925622, 96.44315952680589, 111.88055109438592, 127.32962339845494, 141.27963390306908, 152.36643116719753, 159.50585324993892]
    const whileYPos = [95, 110.44327600494661, 124.37637628569459, 135.4368030276565, 142.5429730253235, 144.99998414659171, 142.56756881169142, 135.48358941385823, 124.44077809838976, 110.51899548360208, 95.07963264582435, 79.63248264627218, 65.68810004149863, 54.61008592831254, 47.48174335593119, 45.000142680614104, 47.40795605921571, 54.46972688838319, 65.49489476677122, 79.40532440237162]

    const blueXPos = [147, 145.28870019774232, 140.32214633458113, 132.58601056159813, 122.83679845699585, 112.02787143487566, 101.21621890527027, 91.45909680166493, 83.71064004557415, 78.72855906639796, 77.00004438953611, 78.69412497640081, 83.64513912566002, 91.36893429247935, 101.11021166876412, 111.91638576607015, 122.73073637891846, 132.49574373214836, 140.25650181703827, 145.25409727495725];
    const blueYPos = [95, 105.81029320346262, 115.56346339998622, 123.30576211935956, 128.28008111772644, 129.9999889026142, 128.297298168184, 123.33851258970074, 115.60854466887284, 105.86329683852146, 95.05574285207705, 84.24273785239052, 74.48167002904904, 66.72706014981878, 61.73722034915183, 60.00009987642987, 61.685569241451, 66.62880882186823, 74.34642633673985, 84.08372708166013];

    const blackXPos = [137, 132.2301045247008, 119.74057032642561, 104.29729921805018, 91.79331431826725, 87.00003170681151, 91.74652794690002, 104.22157976340294, 119.66481169922747, 132.18321558359875];
    const blackYPos = [95, 109.6881881428473, 118.77148651266175, 118.78378440584572, 109.72038904919488, 95.03981632291217, 80.34405002074931, 71.2408716779656, 71.20397802960785, 80.2474473833856];

    for (let i = 0; i < whiteEnemy.length; i++) {
      this.tweens.add({
        targets: whiteEnemy[i],
        x: whileXPos[i],
        y: whileYPos[i],
        ease: 'Power0',
        duration: 2500,
        onComplete: () => {
          this.createCircle(whiteEnemy, blueEnemy, blackEnemy)
        }
      })
    }
    for (let i = 0; i < blueEnemy.length; i++) {
      this.tweens.add({
        targets: blueEnemy[i],
        x: blueXPos[i],
        y: blueYPos[i],
        ease: 'Power0',
        duration: 2000
      })
    }
    for (let i = 0; i < blackEnemy.length; i++) {
      this.tweens.add({
        targets: blackEnemy[i],
        x: blackXPos[i],
        y: blackYPos[i],
        ease: 'Power0',
        duration: 1500
      })
    }



  }

  createCircle(whiteEnemy: Enemy[], blueEnemy: Enemy[], blackEnemy: Enemy[]) {
    let circle = new Phaser.Geom.Circle(this.sys.canvas.width / 2, this.sys.canvas.height / 2 - 25, 50);
    let circle1 = new Phaser.Geom.Circle(this.sys.canvas.width / 2, this.sys.canvas.height / 2 - 25, 35);
    let circle2 = new Phaser.Geom.Circle(this.sys.canvas.width / 2, this.sys.canvas.height / 2 - 25, 25);

    Phaser.Actions.PlaceOnCircle(whiteEnemy, circle);
    Phaser.Actions.PlaceOnCircle(blueEnemy, circle1);
    Phaser.Actions.PlaceOnCircle(blackEnemy, circle2);

    // Circle for white enemy
    this.tweens.add({
      targets: circle,
      radius: 80,
      ease: 'Quintic.easeInOut',
      duration: 1500,
      yoyo: true,
      repeat: -1,
      onUpdate: () => {
        Phaser.Actions.RotateAroundDistance(whiteEnemy, { x: this.sys.canvas.width / 2, y: this.sys.canvas.height / 2 - 25 }, 0.0002, circle.radius);
      }
    });

    // Circle for blue enemy
    this.tweens.add({
      targets: circle1,
      radius: 60,
      ease: 'Quintic.easeInOut',
      duration: 1500,
      yoyo: true,
      repeat: -1,
      onUpdate: () => {
        Phaser.Actions.RotateAroundDistance(blueEnemy, { x: this.sys.canvas.width / 2, y: this.sys.canvas.height / 2 - 25 }, -0.0004, circle1.radius);
      }
    });

    // Circle for black enemy
    this.tweens.add({
      targets: circle1,
      radius: 50,
      ease: 'Quintic.easeInOut',
      duration: 1500,
      yoyo: true,
      repeat: -1,
      onUpdate: () => {
        Phaser.Actions.RotateAroundDistance(blackEnemy, { x: this.sys.canvas.width / 2, y: this.sys.canvas.height / 2 - 25 }, 0.0005, circle2.radius);
      }
    });

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
      quantity: 10,
      speedX: { min: -10, max: 10 },
      speedY: { min: 20, max: 50 },
      alpha: { start: 0.5, end: 0, ease: 'Sine.easeIn' },
      scale: { start: 0.065, end: 0.002 },

      accelerationY: 350,
      angle: { min: 30, max: 110 },
      rotate: { min: -180, max: 180 },
      lifespan: { min: 100, max: 300 },
      blendMode: 'ADD',
      frequency: 15,
      follow: this.player,
      followOffset: { x: 0.2, y: 7 }
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
