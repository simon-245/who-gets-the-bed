export default class StoryScene extends Phaser.Scene {
  constructor() {
    super("StoryScene");
  }

  create() {
    // Background
    this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x000000)
      .setDepth(0);

    this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      "2016. Zika outbreak. A virus spread by a single mosquito bite. Most survive without even knowing they were infected. But some aren't so lucky. A rare complication Guillain Barré Syndrome turns the immune system against the body's own nerves. Paralysis sets in. Breathing stops. The ICU becomes their only hope. Your job? Check them.",
      {
        fontSize: "24px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: this.scale.width - 100 },
        padding: { x: 50, y: 50 }
      }
    ).setOrigin(0.5).setDepth(10);

    this.time.delayedCall(10000, () => {
      this.scene.start("GameScene");
    });
  }
}

