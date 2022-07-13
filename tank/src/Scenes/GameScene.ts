import { Player } from '../Objects/Player';
import { Enemy } from '../Objects/Enemy';
import { Obstacle } from '../Objects/Obstacles/Obstacle';
import { Bullet } from '../Objects/Bullet/Bullet';
import { Button } from '../Objects/Buttons/Button';

export class GameScene extends Phaser.Scene {
    private map: Phaser.Tilemaps.Tilemap;
    private tileset: Phaser.Tilemaps.Tileset;
    private layer: Phaser.Tilemaps.TilemapLayer;
    private playSound: Phaser.Sound.BaseSound;

    private player: Player;
    private enemies: Phaser.GameObjects.Group;
    private obstacles: Phaser.GameObjects.Group;

    private pauseBtn: Button;
    private pauseClick: boolean = false;
    private fireAble: boolean = true;
    private countDownText: Phaser.GameObjects.Text;
    private countTimeEvent: Phaser.Time.TimerEvent;
    private eventPause: Phaser.Events.EventEmitter;
    private countDown: number = 3;

    private scoreText: Phaser.GameObjects.Text;
    private lastScore: number;

    private zone: Phaser.GameObjects.Zone;

    constructor() {
        super({
            key: 'GameScene'
        });
    }

    init(): void {
        this.registry.set('score', 0);
        this.registry.set('status', 'lose');
    }

    create(): void {
        this.createTilemap();

        this.createZone();

        this.createSounds();

        this.createGameObjects();

        this.loadObjectsTilemap();

        this.createColliders();

        this.createCamera();

        this.createButtons();


        this.listenEvents();

        this.createScoreText();

        this.createPauseVariables();

        this.inputHandler();

    }

    update(): void {
        this.player.update();

        this.updateScore();

        this.updateEnemies();
    }


    private createTilemap() {
        // create tilemap from tiled JSON
        this.map = this.make.tilemap({ key: 'levelMap' });

        this.tileset = this.map.addTilesetImage('tiles');
        this.layer = this.map.createLayer('tileLayer', this.tileset, 0, 0);
        this.layer.setCollisionByProperty({ collide: true });
    }

    private createZone() {
        this.zone = this.add
            .zone(0, 0, this.sys.canvas.width, this.sys.canvas.height)
            .setOrigin(0, 0);
    }

    private createSounds() {
        this.playSound = this.sound.add('playsound', { volume: 0.4, loop: true });
        this.playSound.play();
    }

    private createPauseVariables() {
        this.pauseClick = false;
        this.fireAble = true;
        this.countDownText = null;
        this.countDown = 3;
        this.countTimeEvent = null;

    }

    private createButtons() {
        this.pauseBtn = new Button({ scene: this, x: 0, y: 0, texture: 'pauseBtn' })

        Phaser.Display.Align.In.BottomRight(this.pauseBtn, this.zone)

        // Fixed to camera view
        this.pauseBtn.setScrollFactor(0);

        this.pauseBtn.on('pointerout', () => {
            this.fireAble = true;
        });

        this.pauseBtn.on('pointerdown', () => {
            this.fireAble = false;
        })

        this.pauseBtn.onClick(this.pauseFunction);

    }

    private pauseFunction = () => {
        this.time.delayedCall(10, () => {
            this.pauseBtn.setScale(1)
        })
        this.input.disable(this.pauseBtn);
        this.pauseClick = true;
        this.time.delayedCall(10, () => {
            this.sound.play('click');
            this.playSound.pause();
            this.physics.pause();
            this.tweens.pauseAll();
            this.scene.pause();
            this.scene.launch('PauseMenu');
        })
    }

    private inputHandler() {
        this.input.keyboard.on('keydown-SPACE', this.playerShoot, this);
        this.input.on('pointerdown', this.playerShoot, this);
    }

    private playerShoot() {
        if (this.isFireable()) {
            this.player.shoot();
        }
    }

    private isFireable() {
        return !this.pauseClick && this.fireAble
    }

    private listenEvents() {
        if (this.eventPause) return;
        this.eventPause = this.events.on('resume', () => {
            // Disable pause menu
            this.input.disable(this.pauseBtn);
            this.input.keyboard.enabled = false;

            this.countDown = 3;
            this.countDownText = this.add.text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                'Continue in ' + this.countDown,
                { fontSize: '60px', fontFamily: 'Revalia', align: 'center', stroke: '#000000', strokeThickness: 2 })
                .setOrigin(0.5)
                .setDepth(5)
            this.countTimeEvent = this.time.addEvent({
                delay: 1000,
                callback: this.countDownTime,
                callbackScope: this,
                loop: true
            })

        })
    }

    private countDownTime() {
        this.countDown -= 1;
        this.countDownText.setText('Continue in ' + this.countDown);
        if (this.countDown <= 0) {
            // Enable pause menu
            this.input.enable(this.pauseBtn)
            this.input.keyboard.enabled = true;

            this.countDownText.setText('');
            this.playSound.resume();
            this.physics.resume();
            this.tweens.resumeAll();
            this.pauseClick = false;
            this.countTimeEvent.remove();
        }
    }

    private createScoreText() {
        this.lastScore = 0;
        this.scoreText = this.add.text(10, 10, 'Score: 0').setScrollFactor(0);
        this.scoreText.setFontSize(60);
        this.scoreText.setFontFamily('Revalia')
        this.scoreText.setAlign('center');
        this.scoreText.setStroke('#000000', 2);
        this.scoreText.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
    }

    private createGameObjects() {
        this.obstacles = this.add.group({
            /*classType: Obstacle,*/
            runChildUpdate: true
        });

        this.enemies = this.add.group({
            /*classType: Enemy*/
        });
    }

    private createColliders() {
        // collider layer and obstacles
        this.physics.add.collider(this.player, this.layer);
        this.physics.add.collider(this.player, this.obstacles);

        // collider for bullets
        this.physics.add.collider(
            this.player.getBullets(),
            this.layer,
            this.bulletHitLayer,
            null,
            this
        );

        this.physics.add.collider(
            this.player.getBullets(),
            this.obstacles,
            this.bulletHitObstacles,
            null,
            this
        );

        this.enemies.children.each((enemy: Enemy) => {
            this.physics.add.overlap(
                this.player.getBullets(),
                enemy,
                this.playerBulletHitEnemy,
                null,
                this
            );
            this.physics.add.overlap(
                enemy.getBullets(),
                this.player,
                this.enemyBulletHitPlayer,
                null
            );

            this.physics.add.collider(
                enemy.getBullets(),
                this.obstacles,
                this.bulletHitObstacles,
                null
            );
            this.physics.add.collider(
                enemy.getBullets(),
                this.layer,
                this.bulletHitLayer,
                null
            );
        }, this);

    }

    private createCamera() {
        this.cameras.main.setBounds(
            0,
            0,
            this.map.widthInPixels,
            this.map.heightInPixels
        );
        this.cameras.main.startFollow(this.player);
    }

    private updateScore() {
        if (this.lastScore == this.registry.get('score')) return;
        let lastScore = this.lastScore;
        let curScore = this.registry.get('score');
        this.tweens.add({
            targets: this.scoreText,
            scaleX: 1.2,
            scaleY: 1.2,
            yoyo: true,
            duration: 400
        })
        this.lastScore = curScore;
        this.tweens.addCounter({
            from: lastScore,
            to: curScore,
            duration: 700,
            onUpdate: (tween) => {
                this.scoreText.setText('Score: ' + Math.floor(tween.getValue()));
            }
        })
    }

    private updateEnemies() {
        if (this.enemies.countActive() == 0) {
            this.registry.set('status', 'win');
            let highScore = this.registry.get('highScore');
            let score = this.registry.get('score');
            if (!highScore || score > highScore) {
                this.registry.set('highScore', score)
            }
            this.scene.pause();
            this.playSound.stop();
            this.scene.launch('OverMenu')
        }
        this.enemies.children.each((enemy: Enemy) => {
            if (!this.pauseClick && this.player.active)
                enemy.update(this.player.body.x, this.player.body.y);
        }, this);
    }

    private loadObjectsTilemap(): void {
        const objects = this.map.getObjectLayer('objects').objects as any[];

        objects.forEach((object) => {
            switch (object.type) {
                case 'player': {
                    this.addPlayer(object.x, object.y)
                    break;
                }
                case 'enemy': {
                    this.addEnemy(object.x, object.y)
                    break;
                }
                default: {
                    this.addObstacle(object.x, object.y, object.type)
                    break;
                }
            }
        });
    }

    private addPlayer(x: number, y: number) {
        this.player = new Player({
            scene: this,
            x: x,
            y: y,
            texture: 'tankBlue'
        });
    }

    private addEnemy(x: number, y: number) {
        let enemy = new Enemy({
            scene: this,
            x: x,
            y: y,
            texture: 'tankRed'
        });

        this.enemies.add(enemy);
    }

    private addObstacle(x: number, y: number, type: string) {
        let obstacle = new Obstacle({
            scene: this,
            x: x,
            y: y - 40,
            texture: type
        });

        this.obstacles.add(obstacle);
    }

    private bulletHitLayer(bullet: Bullet): void {
        bullet.explodeEmitter(2);
    }

    private bulletHitObstacles(bullet: Bullet, obstacle: Obstacle): void {
        bullet.explodeEmitter(2);
    }

    private enemyBulletHitPlayer(bullet: Bullet, player: Player): void {
        bullet.explodeEmitter(5);
        player.updateHealth(bullet.getDamage());
    }

    private playerBulletHitEnemy(bullet: Bullet, enemy: Enemy): void {
        bullet.explodeEmitter(3);
        enemy.updateHealth(bullet.getDamage());
    }
}
