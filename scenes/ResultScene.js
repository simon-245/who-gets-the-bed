export default class ResultScene extends Phaser.Scene {
  constructor() {
    super("ResultScene");
  }

  init(data) {
    this.results = data.results;
    this.bedsLeft = data.bedsLeft;
  }

  create() {
    this.add.rectangle(200, 300, 400, 600, 0xffffff);

    this.add.text(140, 20, "RESULTS", {
      fontSize: "24px",
      color: "#000"
    });

    let y = 80;
    let saved = 0;

    this.results.forEach(r => {
      if (r.survived) saved++;

      this.add.text(40, y, `${r.name} → ${r.survived ? "SURVIVED" : "DIED"}`, {
        color: r.survived ? "#00aa00" : "#ff0000"
      });

      y += 30;
    });

    this.add.text(40, y + 40, `Saved: ${saved}`, { color: "#000" });
    this.add.text(40, y + 70, `Beds left: ${this.bedsLeft}`, { color: "#000" });

    const restart = this.add.text(140, y + 120, "RESTART", {
      backgroundColor: "#00ff00",
      color: "#000",
      padding: { x: 10, y: 5 }
    }).setInteractive();

    restart.on("pointerdown", () => {
      this.scene.start("StartScene");
    });
  }
}