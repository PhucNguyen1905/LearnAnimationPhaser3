export interface IBulletConstructor {
  scene: Phaser.Scene;
  rotation: number;
  x: number;
  y: number;
  texture: string;
  damage?: number;
}
