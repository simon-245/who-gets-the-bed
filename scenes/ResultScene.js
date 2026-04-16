export default class ResultScene extends Phaser.Scene {
    constructor() {
        super("ResultScene");
    }

    init(data) {
        this.results = data.results;
    }

    create() {
        this.add.text(20, 20, "RESULTS", { fontSize: "24px", color: "#000" });

        let y = 80;

        this.results.forEach(r => {
            let text = `${r.name} → ${r.survived ? "Survived" : "Died"}`;
            this.add.text(20, y, text, { color: "#000" });
            y += 30;
        });
    }
}