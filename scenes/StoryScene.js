export default class StoryScene extends Phaser.Scene {
  constructor() {
    super("StoryScene");
  }

  create() {
    const { width, height } = this.scale;

    this.input.setDefaultCursor('pointer');

    // Background
    this.add
      .rectangle(width / 2, height / 2, width, height, 0x000000)
      .setDepth(0);

    // Story text — pushed up to leave room for button
    this.add
      .text(
        width / 2,
        height / 2 - 80,
        "2016. Zika outbreak. A virus spread by a single mosquito bite. Most survive without even knowing they were infected. But some aren't so lucky. A rare complication Guillain Barré Syndrome turns the immune system against the body's own nerves. Paralysis sets in. Breathing stops. The ICU becomes their only hope. Your job? To decide who gets a bed and who does not",
        {
          fontSize: "24px",
          color: "#ffffff",
          align: "center",
          wordWrap: { width: width - 100 },
        }
      )
      .setOrigin(0.5)
      .setDepth(10);

    // --- CONTINUE BUTTON ---
    const btnX = width / 2;
    const btnY = height - 80; // anchor to bottom of screen instead of center

    // Bright border, transparent fill so it's always visible
    const btnBg = this.add
      .rectangle(btnX, btnY, 220, 55, 0x004400)
      .setStrokeStyle(2, 0x00ff00)
      .setDepth(10)
      .setInteractive({ useHandCursor: true });

    const btnText = this.add
      .text(btnX, btnY, "► CONTINUE", {
        fontSize: "22px",
        color: "#00ff00",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(11);

    // Hover
    btnBg.on("pointerover", () => {
      btnBg.setFillStyle(0x006600);
      btnText.setColor("#ffffff");
    });

    btnBg.on("pointerout", () => {
      btnBg.setFillStyle(0x004400);
      btnText.setColor("#00ff00");
    });

    // Click
    btnBg.on("pointerdown", () => {
      this.scene.start("GameScene");
    });
  }
}