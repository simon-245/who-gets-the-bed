export default class StartScene extends Phaser.Scene {
  constructor() {
    super("StartScene");
  }

  preload() {
    this.load.image("short", "images/shortcut.png");
  }

  create() {
    this.input.setDefaultCursor('pointer');

    this.add.rectangle(200, 300, 400, 600, 0x000000);

    this.add.text(120, 200, "WHO GETS THE BED", {
      fontSize: "28px",
      color: "#fff"
    });

    const btn = this.add.rectangle(200, 320, 180, 50, 0x00ff00)
      .setInteractive({ useHandCursor: true });

    this.add.text(200, 320, "START", {
      color: "#000"
    }).setOrigin(0.5);

    btn.on("pointerdown", () => {
      this.scene.start("StoryScene");
    });

    // Add shortcut image on the right side
    this.add.image(this.scale.width - 40, 40, "short")
      .setOrigin(1, 0)
      .setDepth(50)
      .setScale(0.5);
  }
}