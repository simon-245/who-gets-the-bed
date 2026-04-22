export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    preload() {
        this.load.image("icu", "images/icu_room.png");
        this.load.image("doctor", "images/doctor.png");

        this.load.image("anna", "images/child.png");
        this.load.image("john", "images/old_man.png");
        this.load.image("maria", "images/girl.png");
    }

    create() {
        // =====================
        // FULLSCREEN BACKGROUND
        // =====================
        this.bg = this.add.image(
            this.scale.width / 2,
            this.scale.height / 2,
            "icu"
        );

        this.bg.setDepth(0);

        this.fitBackground();

        // =====================
        // DOCTOR
        // =====================
        this.doctor = this.add.image(
            this.scale.width * 0.5,
            this.scale.height * 0.78,
            "doctor"
        );

        this.doctor.setScale(0.35);
        this.doctor.setDepth(10);

        // =====================
        // GAME STATE
        // =====================
        this.beds = 2;
        this.selected = null;
        this.results = [];

        this.patients = [
            { name: "Anna", age: 23, survival: 0.8, sprite: "anna" },
            { name: "John", age: 67, survival: 0.4, sprite: "john" },
            { name: "Maria", age: 35, survival: 0.6, sprite: "maria" }
        ];

        // =====================
        // UI PANEL
        // =====================
        this.infoBox = this.add.rectangle(
            20,
            20,
            320,
            130,
            0xffffff,
            0.85
        )
        .setOrigin(0)
        .setDepth(20);

        this.uiText = this.add.text(35, 35, "Select patient", {
            fontSize: "20px",
            color: "#000"
        }).setDepth(21);

        // =====================
        // PATIENTS
        // =====================
        this.cards = [];

        const spacing = this.scale.width / 4;

        this.patients.forEach((p, i) => {
            const x = spacing * (i + 1);
            const y = this.scale.height * 0.48;

            const card = this.add.image(x, y, p.sprite)
                .setScale(0.22)
                .setInteractive({ useHandCursor: true })
                .setDepth(15);

            card.on("pointerdown", () => {
                this.selected = i;
                this.updateUI();
            });

            this.cards.push(card);
        });

        // =====================
        // BUTTONS
        // =====================
        this.giveBtn = this.add.text(
            60,
            this.scale.height - 100,
            "GIVE BED",
            {
                fontSize: "26px",
                backgroundColor: "#4CAF50",
                color: "#fff",
                padding: { x: 16, y: 10 }
            }
        )
        .setInteractive()
        .setDepth(30);

        this.skipBtn = this.add.text(
            this.scale.width - 180,
            this.scale.height - 100,
            "SKIP",
            {
                fontSize: "26px",
                backgroundColor: "#D32F2F",
                color: "#fff",
                padding: { x: 16, y: 10 }
            }
        )
        .setInteractive()
        .setDepth(30);

        this.giveBtn.on("pointerdown", () => this.decide(true));
        this.skipBtn.on("pointerdown", () => this.decide(false));

        this.scale.on("resize", this.resizeGame, this);
    }

    fitBackground() {
        const scaleX = this.scale.width / this.bg.width;
        const scaleY = this.scale.height / this.bg.height;

        const scale = Math.max(scaleX, scaleY);

        this.bg.setScale(scale);
    }

    resizeGame(gameSize) {
        const width = gameSize.width;
        const height = gameSize.height;

        this.bg.setPosition(width / 2, height / 2);

        const texWidth = this.bg.texture.source[0].width;
        const texHeight = this.bg.texture.source[0].height;

        const scaleX = width / texWidth;
        const scaleY = height / texHeight;

        const scale = Math.max(scaleX, scaleY);

        this.bg.setScale(scale);

        this.doctor.setPosition(width * 0.5, height * 0.78);

        this.giveBtn.setPosition(60, height - 100);
        this.skipBtn.setPosition(width - 180, height - 100);
    }

    updateUI() {
        if (this.selected === null) return;

        const p = this.patients[this.selected];

        this.uiText.setText(
`Patient: ${p.name}
Age: ${p.age}
Survival: ${Math.floor(p.survival * 100)}%
Beds Left: ${this.beds}`
        );
    }

    decide(give) {
        if (this.selected === null) return;

        const p = this.patients[this.selected];

        let survived = false;

        if (give && this.beds > 0) {
            this.beds--;
            survived = Math.random() < p.survival;
        }

        this.results.push({
            name: p.name,
            survived
        });

        this.cards[this.selected].destroy();

        this.patients[this.selected] = null;
        this.selected = null;

        this.uiText.setText("Select patient");

        const remaining = this.patients.filter(p => p !== null).length;

        if (remaining === 0) {
            this.time.delayedCall(500, () => {
                this.scene.start("ResultScene", {
                    results: this.results
                });
            });
        }
    }
}