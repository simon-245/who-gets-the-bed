export default class StartScene extends Phaser.Scene {
    constructor() {
        super("StartScene");
    }

    create() {
        this.cameras.main.setBackgroundColor("#ffffff");

        this.add.text(90, 200, "Doctor On Duty", {
            fontSize: "24px",
            color: "#000"
        });

        const startBtn = this.add.text(120, 300, "Start Shift", {
            backgroundColor: "#0f0",
            color: "#000",
            padding: { x: 10, y: 5 }
        }).setInteractive();

        startBtn.on("pointerdown", () => {
            this.scene.start("GameScene");
        });
    }
}