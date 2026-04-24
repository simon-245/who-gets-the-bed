export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    preload() {
        this.load.image("icu", "images/icu_room.png");
	this.load.image("short", "images/shortcut.png");
        this.load.image("doctor", "images/doctor.png");

        this.load.image("anna", "images/child.png");
        this.load.image("john", "images/old_man.png");
        this.load.image("maria", "images/girl.png");

        this.load.image("report", "images/patient_report.png");
    }

    create() {

        // =====================
        // BACKGROUND
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
        // STATE
        // =====================
        this.beds = 2;
        this.selected = null;
        this.results = [];

        this.patients = [
            {
                name: "Anna",
                age: 23,
                survival: 0.8,
                sprite: "anna",
                disease: "Acute severe asthma exacerbation",
                symptoms: "Diffuse wheeze, SpO2 91% on room air, RR 28, accessory muscle use. Peak flow 45% predicted. No fever.",
                vitals: "BP 118/72 · HR 104 · Temp 36.8°C · GCS 15"
            },
            {
                name: "John",
                age: 67,
                survival: 0.4,
                sprite: "john",
                disease: "NSTEMI with acute on chronic HF",
                symptoms: "Substernal pressure 6/10 since AM, bilateral crackles, JVD 2 cm. Troponin rising, BNP 980 pg/mL.",
                vitals: "BP 96/58 · HR 112 · SpO2 93% on 2L NC · GCS 15"
            },
            {
                name: "Maria",
                age: 35,
                survival: 0.6,
                sprite: "maria",
                disease: "Suspected urosepsis",
                symptoms: "Rigors, dysuria x2 days, temp 39.1°C, WBC 18.4. UA positive nitrites, lactate 2.8 mmol/L.",
                vitals: "BP 92/54 · HR 118 · RR 24 · GCS 15"
            }
        ];

        // =====================
        // UI
        // =====================

this.uiText = this.add.text(20, 20, "Select patient", {
    fontSize: "20px",
    color: "#000",
    backgroundColor: "#fff",
    padding: { x: 5, y: 5 }
}).setDepth(20);
this.uiText.setVisible(false);

        this.shortcutUI = this.add.image(20, 20, "short")
    .setOrigin(0, 0)
    .setDepth(50)
    .setScale(0.1);

        // =====================
        // DIAGNOSIS PANEL
        // =====================
        this.diagnosisImage = this.add.image(
            this.scale.width / 2,
            this.scale.height / 2,
            "report"
        );

        this.diagnosisImage.setDepth(40);
        this.diagnosisImage.setVisible(false);
        this.diagnosisImage.setScale(1.5);

        this.symptomText = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2,
            "",
            {
                fontSize: "22px",
                color: "#000",
                align: "center",
                wordWrap: { width: 420 }
            }
        );

        this.symptomText.setOrigin(0.5);
        this.symptomText.setDepth(41);
        this.symptomText.setVisible(false);

        // =====================
        // PATIENTS
        // =====================
        this.cards = [];

        const spacing = this.scale.width / 4;

        this.patients.forEach((p, i) => {

            const card = this.add.image(
                spacing * (i + 1),
                this.scale.height * 0.48,
                p.sprite
            )
                .setScale(0.22)
                .setInteractive({ useHandCursor: true })
                .setDepth(15);

            card.on("pointerdown", () => {

                this.selected = i;
                this.updateUI();

                const patient = this.patients[i];

                // reset old
                this.diagnosisImage.setVisible(false);
                this.symptomText.setVisible(false);

                if (this.diagnosisTimer) {
                    this.diagnosisTimer.remove(false);
                }

                // show new
                this.diagnosisImage.setVisible(true);
                this.symptomText.setVisible(true);

                this.symptomText.setText(
`${patient.name}

${patient.disease}

${patient.symptoms}

${patient.vitals}`
                );

                // auto close
                this.diagnosisTimer = this.time.delayedCall(10000, () => {
                    this.diagnosisImage.setVisible(false);
                    this.symptomText.setVisible(false);
                });
            });

            this.cards.push(card);
        });

        // =====================
        // BUTTONS
        // =====================
        this.giveBtn = this.add.text(60, this.scale.height - 100, "GIVE BED", {
            fontSize: "24px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            padding: { x: 12, y: 8 }
        })
        .setInteractive()
        .setDepth(30);

        this.skipBtn = this.add.text(this.scale.width - 180, this.scale.height - 100, "SKIP", {
            fontSize: "24px",
            backgroundColor: "#D32F2F",
            color: "#fff",
            padding: { x: 12, y: 8 }
        })
        .setInteractive()
        .setDepth(30);

        this.giveBtn.on("pointerdown", () => this.decide(true));
        this.skipBtn.on("pointerdown", () => this.decide(false));
    }
	}

    // =====================
    // BACKGROUND SCALE
    // =====================
    fitBackground() {
        const scale = Math.max(
            this.scale.width / this.bg.width,
            this.scale.height / this.bg.height
        );

        this.bg.setScale(scale);
    }

    // =====================
    // UI UPDATE
    // =====================
    updateUI() {

        if (this.selected === null) {
            this.uiText.setText(`Beds Left: ${this.beds}`);
            return;
        }

        const p = this.patients[this.selected];

        this.uiText.setText(
`Patient: ${p.name}
Age: ${p.age}
Survival: ${Math.floor(p.survival * 100)}%
Beds: ${this.beds}`
        );
    }

    // =====================
    // DECISION LOGIC
    // =====================
    decide(give) {

        this.diagnosisImage.setVisible(false);
        this.symptomText.setVisible(false);

        if (this.diagnosisTimer) {
            this.diagnosisTimer.remove(false);
        }

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

        this.updateUI();

        const remaining = this.patients.filter(p => p !== null).length;

        if (remaining === 0) {
            this.time.delayedCall(500, () => {
                this.scene.start("ResultScene", {
                    results: this.results,
                    bedsLeft: this.beds
                });
            });
        }
    }
}