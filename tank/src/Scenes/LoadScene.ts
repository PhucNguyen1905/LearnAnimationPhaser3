export class LoadScene extends Phaser.Scene {
    private loadingBar: Phaser.GameObjects.Graphics;
    private progressBar: Phaser.GameObjects.Graphics;

    constructor() {
        super({
            key: 'LoadScene'
        });
    }

    preload(): void {
        // set the background, create the loading and progress bar
        this.cameras.main.setBackgroundColor(0x000000);
        this.createLoadingGraphics();

        // pass value to change the loading bar fill
        this.load.on(
            'progress',
            function (value: number) {
                this.progressBar.clear();
                this.progressBar.fillStyle(0x88e453, 1);
                this.progressBar.fillRect(
                    this.cameras.main.width / 4,
                    this.cameras.main.height / 2 - 16,
                    (this.cameras.main.width / 2) * value,
                    16
                );
            },
            this
        );

        // delete bar graphics, when loading complete
        this.load.on(
            'complete',
            function () {
                this.progressBar.destroy();
                this.loadingBar.destroy();
            },
            this
        );

        // load our package
        this.load.pack('preload', './assets/pack.json', 'preload');

        this.load.image('bg', 'assets/images/tank.png');
        this.load.image('overimg', 'assets/images/over.png');
        this.load.image('victory', 'assets/images/victory.png');
        this.load.image('congrat', 'assets/images/congrat.png');
        this.load.image('pauseimg', 'assets/images/pauseimg.png');
        this.load.image('pauseBtn', 'assets/images/pause.png');
        this.load.image('exit', 'assets/images/exit.png');
        this.load.image('continue', 'assets/images/continue.png');
        this.load.image('restart', 'assets/images/restart.png');
        this.load.image('soundfalse', 'assets/images/sound.png');
        this.load.image('soundtrue', 'assets/images/mute.png');
        this.load.image('back', 'assets/images/back.png');
        this.load.image('high', 'assets/images/high.png');
        this.load.image('score', 'assets/images/score.png');
        this.load.image('newgame', 'assets/images/newgame.png');


        this.load.audio('shoot', 'assets/sounds/shoot.mp3');
        this.load.audio('hit', 'assets/sounds/hit.mp3');
        this.load.audio('hit_enemy', 'assets/sounds/hit_enemy.mp3');
        this.load.audio('boom', 'assets/sounds/boom.mp3');
        this.load.audio('click', 'assets/sounds/click.mp3');
        this.load.audio('mouseover', 'assets/sounds/mouseover.mp3');
        this.load.audio('over', 'assets/sounds/over.mp3');
        this.load.audio('yeah', 'assets/sounds/yeah.mp3');
        this.load.audio('intro', 'assets/sounds/intro.mp3');
        this.load.audio('playsound', 'assets/sounds/playsound.mp3');


        this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');

        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

    }

    update(): void {
        this.scene.start('MenuScene');
    }

    private createLoadingGraphics(): void {
        this.loadingBar = this.add.graphics();
        this.loadingBar.fillStyle(0xffffff, 1);
        this.loadingBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this.progressBar = this.add.graphics();
    }
}
