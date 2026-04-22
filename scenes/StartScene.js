export default class StartScene extends Phaser.Scene {
  constructor() {
    super("StartScene");
  }

  create() {
    this.add.rectangle(200, 300, 400, 600, 0x000000);

    this.add.text(120, 200, "ICU SIM", {
      fontSize: "28px",
      color: "#fff"
    });

    const btn = this.add.rectangle(200, 320, 180, 50, 0x00ff00)
      .setInteractive({ useHandCursor: true });

    this.add.text(200, 320, "START", {
      color: "#000"
    }).setOrigin(0.5);

    btn.on("pointerdown", () => {
      this.scene.start("GameScene");
    });
  }
}