export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    preload() {
        this.load.image("icu", "images/Icu_room.png");
	this.load.image("short", "images/shortcut.png");
        this.load.image("doctor", "images/doctor.png");

        this.load.image("anna", "images/child.png");
        this.load.image("john", "images/old_man.png");
        this.load.image("maria", "images/girl.png");
        this.load.image("old_woman", "images/old_woman.png");
        this.load.image("fever_child", "images/fever child.png");
        this.load.image("woman", "images/woman.png");
        this.load.image("curtain", "images/curton.jpeg");

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
            this.scale.width * 0.86,
            this.scale.height * 0.78,
            "doctor"
        );

        this.doctor.setScale(0.35);
        this.doctor.setDepth(20);

        // =====================
        // STATE
        // =====================
        this.totalBeds = 3;
        this.occupiedBeds = 0;
        this.selected = null;
        this.results = [];

        this.patients = [
            {
                name: "Anna",
                age: 23,
                survival: 0.8,
                sprite: "anna",
                health: 20,
                status: "queued",
                mainSlot: 0,
                disease: "Guillain Barré Syndrome (Zika related)",
                outcomeReason: "",
                symptoms: "• Progressive weakness starting in legs\n• Ascending paralysis\n• Mild respiratory compromise\n• Reflexes diminished\n• Recent fever and rash 2 weeks ago\n• Difficulty walking",
                briefing: "GBS is an autoimmune disorder where the immune system attacks the peripheral nervous system. The progressive weakness and ascending paralysis are hallmark signs. Despite severity, early ICU admission with respiratory support offers good recovery prospects in younger patients.",
                vitals: "BP 120/75 · HR 92 · RR 18 · GCS 15",
                questions: [
                    {
                        prompt: "Which treatment is most appropriate for Anna's Guillain Barré Syndrome?",
                        choices: [
                            { text: "IVIG or plasmapheresis", correct: true },
                            { text: "Oral antibiotics", correct: false },
                            { text: "Diuretic therapy", correct: false },
                            { text: "Topical steroids", correct: false }
                        ]
                    },
                    {
                        prompt: "What is the priority medication for her mild respiratory compromise?",
                        choices: [
                            { text: "Oxygen and respiratory support", correct: true },
                            { text: "High-dose insulin", correct: false },
                            { text: "Oral antihistamines", correct: false },
                            { text: "Oral analgesics", correct: false }
                        ]
                    },
                    {
                        prompt: "Which drug is least helpful for her ascending paralysis?",
                        choices: [
                            { text: "Antibiotics", correct: true },
                            { text: "IVIG", correct: false },
                            { text: "Plasmapheresis", correct: false },
                            { text: "Respiratory support", correct: false }
                        ]
                    },
                    {
                        prompt: "For reflex and nerve recovery, what is the best approach?",
                        choices: [
                            { text: "Immune modulation with IVIG or plasmapheresis", correct: true },
                            { text: "Beta blockers", correct: false },
                            { text: "Antidepressants", correct: false },
                            { text: "Antacids", correct: false }
                        ]
                    },
                    {
                        prompt: "What is the right prescription decision for Anna?",
                        choices: [
                            { text: "Give IVIG/plasmapheresis and respiratory support", correct: true },
                            { text: "Give antibiotics and stop monitoring", correct: false },
                            { text: "Delay treatment until discharge", correct: false },
                            { text: "Prescribe only painkillers", correct: false }
                        ]
                    }
                ]
            },
            {
                name: "John",
                age: 67,
                survival: 0.4,
                sprite: "john",
                health: 45,
                status: "queued",
                mainSlot: 1,
                disease: "Severe Guillain Barré Syndrome (Zika related)",
                symptoms: "• Rapidly progressing paralysis\n• Severe respiratory failure\n• Requires intubation\n• Complete loss of leg mobility\n• Weakness in upper extremities\n• CSF protein elevated\n• EMG shows demyelination",
                briefing: "This is a critical case with respiratory muscles paralyzed. Mechanical ventilation is essential. Age and rapid progression indicate higher mortality risk. Demyelination on EMG confirms axonal damage. ICU management with immunotherapy is standard care.",
                vitals: "BP 88/52 · HR 118 · RR 28 (ventilated) · GCS 8",
                questions: [
                    {
                        prompt: "Which medication is most important for John's severe GBS?",
                        choices: [
                            { text: "IVIG or plasmapheresis", correct: true },
                            { text: "Oral antibiotics", correct: false },
                            { text: "NSAIDs", correct: false },
                            { text: "Antacids", correct: false }
                        ]
                    },
                    {
                        prompt: "For his respiratory failure, what is the correct treatment step?",
                        choices: [
                            { text: "Continue mechanical ventilation and support", correct: true },
                            { text: "Switch to oral medications only", correct: false },
                            { text: "Stop respiratory monitoring", correct: false },
                            { text: "Give only sedatives", correct: false }
                        ]
                    },
                    {
                        prompt: "Which therapy is inappropriate for his case?",
                        choices: [
                            { text: "Giving only painkillers and no immunotherapy", correct: true },
                            { text: "Using IVIG", correct: false },
                            { text: "Using plasmapheresis", correct: false },
                            { text: "Providing respiratory support", correct: false }
                        ]
                    },
                    {
                        prompt: "What should be used to treat his immune-mediated nerve damage?",
                        choices: [
                            { text: "Immunotherapy with IVIG or plasmapheresis", correct: true },
                            { text: "Antihypertensive pills", correct: false },
                            { text: "Diuretics", correct: false },
                            { text: "Proton pump inhibitors", correct: false }
                        ]
                    },
                    {
                        prompt: "If the prescription is correct for John, his health will: ",
                        choices: [
                            { text: "Improve and the patient begins recovery", correct: true },
                            { text: "Stay the same without change", correct: false },
                            { text: "Get worse because medication was too strong", correct: false },
                            { text: "Cause instant discharge", correct: false }
                        ]
                    }
                ]
            },
            {
                name: "Maria",
                age: 35,
                survival: 0.6,
                sprite: "maria",
                health: 25,
                status: "queued",
                mainSlot: 2,
                disease: "Guillain Barré Syndrome with Autonomic Dysfunction (Zika related)",
                symptoms: "• Moderate ascending paralysis\n• Facial weakness\n• Dysarthria\n• Autonomic instability\n• Fluctuating BP and HR\n• History of Zika infection 3 weeks ago\n• Respiratory function declining",
                briefing: "Autonomic dysfunction complicates her GBS, causing blood pressure and heart rate fluctuations. This requires careful hemodynamic monitoring. Facial weakness and dysarthria indicate cranial nerve involvement. Close respiratory monitoring needed as function is still declining.",
                vitals: "BP 105/62 · HR 112 · RR 22 · GCS 13",
                questions: [
                    {
                        prompt: "Which medicine is best for her autonomic instability and GBS?",
                        choices: [
                            { text: "IVIG or plasmapheresis and close hemodynamic support", correct: true },
                            { text: "Oral insulin", correct: false },
                            { text: "Topical antibiotics", correct: false },
                            { text: "Oral antihistamines", correct: false }
                        ]
                    },
                    {
                        prompt: "What is the correct medication strategy for her cranial nerve involvement?",
                        choices: [
                            { text: "Maintain airway support and use immunotherapy", correct: true },
                            { text: "Start only blood pressure pills", correct: false },
                            { text: "Give only sleeping pills", correct: false },
                            { text: "Use diuretics alone", correct: false }
                        ]
                    },
                    {
                        prompt: "Which prescription is wrong for her case?",
                        choices: [
                            { text: "Antibiotics instead of IVIG/plasmapheresis", correct: true },
                            { text: "Using plasmapheresis", correct: false },
                            { text: "Using IVIG", correct: false },
                            { text: "Supporting breathing and hemodynamics", correct: false }
                        ]
                    },
                    {
                        prompt: "If she does not receive the correct treatment, what happens?",
                        choices: [
                            { text: "Health declines and she needs another attempt", correct: true },
                            { text: "She recovers faster", correct: false },
                            { text: "She is immediately discharged", correct: false },
                            { text: "No change occurs", correct: false }
                        ]
                    },
                    {
                        prompt: "The best medicine for this patient is: ",
                        choices: [
                            { text: "IVIG or plasmapheresis plus ICU support", correct: true },
                            { text: "Painkillers only", correct: false },
                            { text: "Antibiotics only", correct: false },
                            { text: "No treatment", correct: false }
                        ]
                    }
                ]
            },
            {
                name: "Old Woman",
                age: 75,
                survival: 0.3,
                sprite: "old_woman",
                health: 30,
                status: "queued",
                disease: "Severe Guillain-Barré Syndrome with Respiratory Failure",
                symptoms: "• Severe muscle weakness and paralysis\n• Complete respiratory failure requiring ventilation\n• Advanced age with comorbidities\n• Rapid deterioration\n• History of recent infection\n• Elevated CSF protein levels",
                briefing: "This elderly patient has severe GBS with complete respiratory paralysis. Age significantly reduces survival chances. Requires immediate intubation and ventilatory support. Immunotherapy may be less effective due to age. High risk of complications.",
                vitals: "BP 90/55 · HR 110 · RR 0 (ventilated) · GCS 6",
                questions: [
                    {
                        prompt: "What is the most critical intervention for this elderly patient?",
                        choices: [
                            { text: "Immediate intubation and mechanical ventilation", correct: true },
                            { text: "Oral antibiotics", correct: false },
                            { text: "Pain medication only", correct: false },
                            { text: "Fluid restriction", correct: false }
                        ]
                    },
                    {
                        prompt: "Given her age, what is the expected response to IVIG?",
                        choices: [
                            { text: "Reduced effectiveness due to age", correct: true },
                            { text: "Same as younger patients", correct: false },
                            { text: "Better response", correct: false },
                            { text: "No response at all", correct: false }
                        ]
                    },
                    {
                        prompt: "What complication is she most at risk for?",
                        choices: [
                            { text: "Ventilator-associated pneumonia", correct: true },
                            { text: "Hyperglycemia", correct: false },
                            { text: "Hypertension", correct: false },
                            { text: "Anemia", correct: false }
                        ]
                    },
                    {
                        prompt: "What is the priority in her management?",
                        choices: [
                            { text: "Supportive care with ventilation and immunotherapy", correct: true },
                            { text: "Early discharge", correct: false },
                            { text: "Surgery", correct: false },
                            { text: "Physical therapy alone", correct: false }
                        ]
                    },
                    {
                        prompt: "If treatment is successful, what is her prognosis?",
                        choices: [
                            { text: "Guarded due to age and severity", correct: true },
                            { text: "Full recovery expected", correct: false },
                            { text: "Immediate death", correct: false },
                            { text: "No change", correct: false }
                        ]
                    }
                ]
            },
            {
                name: "Fever Child",
                age: 7,
                survival: 0.5,
                sprite: "fever_child",
                health: 10,
                status: "queued",
                disease: "High fever with weakness",
                symptoms: "• High fever\n• Chills\n• Lethargy\n• Poor appetite\n• Generalized weakness",
                briefing: "This child is waiting at the door with a high fever and signs of dehydration. Prompt evaluation and supportive care are needed.",
                vitals: "BP 100/65 · HR 110 · RR 24 · GCS 15",
                questions: [
                    {
                        prompt: "What is the most appropriate first step for this child?",
                        choices: [
                            { text: "Give fluids and monitor vital signs", correct: true },
                            { text: "Start antibiotics immediately", correct: false },
                            { text: "Give diuretics", correct: false },
                            { text: "Send home with rest", correct: false }
                        ]
                    },
                    {
                        prompt: "What is the best next step to support this patient's condition?",
                        choices: [
                            { text: "Provide supportive care and reassess", correct: true },
                            { text: "Administer only painkillers", correct: false },
                            { text: "Withhold fluids", correct: false },
                            { text: "Use oxygen only", correct: false }
                        ]
                    },
                    {
                        prompt: "What medication is most appropriate for managing this child's high fever?",
                        choices: [
                            { text: "Paracetamol (acetaminophen)", correct: true },
                            { text: "Antibiotics", correct: false },
                            { text: "NSAIDs", correct: false },
                            { text: "Steroids", correct: false }
                        ]
                    },
                    {
                        prompt: "What should be avoided when treating fever in children?",
                        choices: [
                            { text: "Aspirin due to risk of Reye's syndrome", correct: true },
                            { text: "Paracetamol", correct: false },
                            { text: "Fluids", correct: false },
                            { text: "Rest", correct: false }
                        ]
                    },
                    {
                        prompt: "What is the priority in managing this child's condition?",
                        choices: [
                            { text: "Monitor for dehydration and provide supportive care", correct: true },
                            { text: "Start IV antibiotics immediately", correct: false },
                            { text: "Give sedatives for lethargy", correct: false },
                            { text: "Restrict all fluids", correct: false }
                        ]
                    },
                ]
            },
            {
                name: "Woman",
                age: 45,
                survival: 0.5,
                sprite: "woman",
                health: 26,
                status: "queued",
                disease: "Guillain-Barré Syndrome with Mild Respiratory Involvement",
                symptoms: "• Progressive weakness in legs and arms\n• Mild difficulty breathing\n• Facial weakness\n• Reduced reflexes\n• Recent viral illness\n• CSF analysis pending",
                briefing: "Moderate GBS with early respiratory involvement. Requires close monitoring for respiratory deterioration. Standard immunotherapy should be initiated promptly. Good potential for recovery with early intervention.",
                vitals: "BP 110/70 · HR 95 · RR 20 · GCS 14",
                questions: [
                    {
                        prompt: "What is the appropriate initial treatment?",
                        choices: [
                            { text: "IVIG or plasmapheresis", correct: true },
                            { text: "Oral steroids", correct: false },
                            { text: "Antibiotics", correct: false },
                            { text: "Diuretics", correct: false }
                        ]
                    },
                    {
                        prompt: "How should her respiratory status be monitored?",
                        choices: [
                            { text: "Close observation and vital capacity measurements", correct: true },
                            { text: "No monitoring needed", correct: false },
                            { text: "Only heart rate monitoring", correct: false },
                            { text: "Blood pressure only", correct: false }
                        ]
                    },
                    {
                        prompt: "What is the significance of facial weakness?",
                        choices: [
                            { text: "Indicates cranial nerve involvement", correct: true },
                            { text: "Not significant", correct: false },
                            { text: "Cardiac involvement", correct: false },
                            { text: "Liver failure", correct: false }
                        ]
                    },
                    {
                        prompt: "What is the expected time course for improvement?",
                        choices: [
                            { text: "Gradual improvement over weeks to months", correct: true },
                            { text: "Immediate recovery", correct: false },
                            { text: "No improvement", correct: false },
                            { text: "Rapid deterioration", correct: false }
                        ]
                    },
                    {
                        prompt: "If untreated, what is likely to happen?",
                        choices: [
                            { text: "Progression to severe respiratory failure", correct: true },
                            { text: "Spontaneous recovery", correct: false },
                            { text: "Improvement", correct: false },
                            { text: "No change", correct: false }
                        ]
                    }
                ]
            }
        ];

        this.curtains = new Array(this.patients.length);
        this.healthDisplays = new Array(this.patients.length);
        this.healthDrainEvents = new Array(this.patients.length);
        this.treatmentEvents = new Array(this.patients.length);
        this.patientDecisionEvents = new Array(this.patients.length);

        // =====================
        // UI
        // =====================

this.uiText = this.add.text(20, 20, "Select patient", {
    fontSize: "20px",
    color: "#000",
    backgroundColor: "#fff",
    padding: { x: 5, y: 5 }
}).setDepth(20);
this.uiText.setVisible(true);
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
        // BRIEFING BACKGROUND (Right side)
        // =====================
        this.briefingBackground = this.add.rectangle(
            this.scale.width - 20,
            this.scale.height / 3.5,
            340,
            460,
            0x1a3a52
        );

        this.briefingBackground.setOrigin(1, 0.5);
        this.briefingBackground.setDepth(55);
        this.briefingBackground.setVisible(false);

        // =====================
        // BRIEFING TEXT (Right side)
        // =====================
        this.briefingText = this.add.text(
            this.scale.width - 40,
            this.scale.height / 3.5 - 80,
            "",
            {
                fontSize: "16px",
                color: "#ffffff",
                align: "left",
                wordWrap: { width: 260 },
                padding: { x: 15, y: 15 }
            }
        );

        this.briefingText.setOrigin(1, 0);
        this.briefingText.setDepth(56);
        this.briefingText.setVisible(false);

        // =====================
        // MEDICAL REFERENCE (Right side)
        // =====================
        this.medicalReference = this.add.text(
            this.scale.width - 40,
            this.scale.height / 3.5 + 100,
            "VITAL SIGNS GUIDE:\n• BP: Blood Pressure\n• HR: Heart Rate (bpm)\n• RR: Respiratory Rate\n• Temp: Temperature\n• SpO2: Oxygen Level (%)\n• GCS: Consciousness Level",
            {
                fontSize: "13px",
                color: "#ffeb3b",
                align: "left",
                wordWrap: { width: 220 },
                padding: { x: 15, y: 10 }
            }
        );

        this.medicalReference.setOrigin(1, 0);
        this.medicalReference.setDepth(56);
        this.medicalReference.setVisible(false);

        // =====================
        // TIMER DISPLAY
        // =====================
        this.timerText = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2 - 300,
            "Take your time",
            {
                fontSize: "30px",
                color: "#fff",
                backgroundColor: "#1f4f8b",
                padding: { x: 15, y: 10 }
            }
        );

        this.timerText.setOrigin(0.5);
        this.timerText.setDepth(42);
        this.timerText.setVisible(false);

        // =====================
        // PATIENTS
        // =====================
        this.cards = new Array(this.patients.length);

        const doorX = 80;
        const doorY = this.scale.height * 0.3;

        this.patients.forEach((patient, i) => {
            const curtain = this.add.image(doorX, this.scale.height * 0.44, "curtain")
                .setOrigin(0.5, 0)
                .setScale(0.45)
                .setDepth(12)
                .setVisible(false);
            this.curtains[i] = curtain;

            const card = this.add.image(doorX, doorY, patient.sprite)
                .setScale(0.28)
                .setDepth(15)
                .setVisible(false)
                .setInteractive({ useHandCursor: true });

            card.on("pointerdown", () => {
                const current = this.patients[i];
                if (!current || current.status !== "atDoor") return;
                this.selected = i;
                this.updateUI();
                this.showPatientReport(i);
            });

            this.cards[i] = card;

            const bg = this.add.rectangle(doorX - 60, doorY, 140, 18, 0x222222)
                .setOrigin(0, 0.5)
                .setDepth(16)
                .setVisible(false);
            const fill = this.add.rectangle(doorX - 60, doorY, 140, 18, 0x4caf50)
                .setOrigin(0, 0.5)
                .setDepth(17)
                .setVisible(false);
            const label = this.add.text(doorX, doorY, `Health: ${patient.health}%`, {
                fontSize: "14px",
                color: "#ffffff"
            })
            .setOrigin(0.5)
            .setDepth(18)
            .setVisible(false);

            this.healthDisplays[i] = { bg, fill, label };
            this.updateHealthDisplay(i);
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
        .setDepth(50);
        this.giveBtn.setVisible(false);

        this.skipBtn = this.add.text(this.scale.width - 180, this.scale.height - 100, "SKIP", {
            fontSize: "24px",
            backgroundColor: "#D32F2F",
            color: "#fff",
            padding: { x: 12, y: 8 }
        })
        .setInteractive()
        .setDepth(50);
        this.skipBtn.setVisible(false);

        this.giveBtn.on("pointerdown", () => this.decide(true));
        this.skipBtn.on("pointerdown", () => this.decide(false));

        this.scheduleNextPatient(1000);
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
            this.uiText.setText(`Beds occupied: ${this.occupiedBeds}/${this.totalBeds}`);
            return;
        }

        const p = this.patients[this.selected];

        if (!p) {
            this.uiText.setText(`Beds occupied: ${this.occupiedBeds}/${this.totalBeds}`);
            return;
        }

        this.uiText.setText(
`Patient: ${p.name}
Age: ${p.age}
Health: ${Math.round(p.health)}%
Status: ${p.status}
Beds occupied: ${this.occupiedBeds}/${this.totalBeds}`
        );
    }

    showPatientReport(index) {
        const patient = this.patients[index];
        if (!patient) return;

        this.hideReportPanel();
        this.diagnosisImage.setVisible(true);
        this.symptomText.setVisible(true);
        this.briefingBackground.setVisible(true);
        this.briefingText.setVisible(true);
        this.medicalReference.setVisible(true);
        this.timerText.setVisible(true);
        this.giveBtn.setVisible(true);
        this.skipBtn.setVisible(true);

        this.symptomText.setText(
`${patient.name}

${patient.disease}

${patient.symptoms}

${patient.vitals}`
        );
        this.briefingText.setText(patient.briefing);
        this.timerText.setText("Take your time");
    }

    scheduleNextPatient(delayMs = 10000) {
        if (this.nextPatientEvent) {
            this.nextPatientEvent.remove(false);
        }
        const hasQueuedPatient = this.patients.some(p => p && p.status === "queued");
        if (!hasQueuedPatient) return;
        this.nextPatientEvent = this.time.delayedCall(delayMs, () => this.spawnNextPatient());
    }

    spawnNextPatient() {
        const nextIndex = this.patients.findIndex(p => p && p.status === "queued");
        if (nextIndex === -1) {
            this.checkForEnd();
            return;
        }

        const patient = this.patients[nextIndex];
        patient.status = "atDoor";
        this.selected = null;
        this.updateUI();

        const card = this.cards[nextIndex];
        if (card) {
            card.setPosition(80, this.scale.height * 0.3);
            card.setVisible(true);
        }

        const display = this.healthDisplays[nextIndex];
        if (display) {
            display.bg.setVisible(true);
            display.fill.setVisible(true);
            display.label.setVisible(true);
        }
        this.updateHealthDisplay(nextIndex);
        this.refreshDoorPositions();

        if (this.patientDecisionEvents[nextIndex]) {
            this.patientDecisionEvents[nextIndex].remove(false);
            this.patientDecisionEvents[nextIndex] = null;
        }
        this.patientDecisionEvents[nextIndex] = this.time.delayedCall(30000, () => {
            const current = this.patients[nextIndex];
            if (!current || current.status !== "atDoor") return;
            current.wasSkipped = true;
            this.removePatient(nextIndex, false, 0);
        });

        this.scheduleNextPatient(10000);
    }

    startHealthDrain(index, drainRate = 5) {
        const patient = this.patients[index];
        if (!patient || patient.status !== "waiting") return;
        if (this.healthDrainEvents[index]) {
            this.healthDrainEvents[index].remove(false);
            this.healthDrainEvents[index] = null;
        }

        this.healthDrainEvents[index] = this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                const current = this.patients[index];
                if (!current || current.status !== "waiting") {
                    this.healthDrainEvents[index].remove(false);
                    this.healthDrainEvents[index] = null;
                    return;
                }

                current.health = Math.max(0, current.health - drainRate);
                this.updateHealthDisplay(index);

                if (current.health <= 0) {
                    this.healthDrainEvents[index].remove(false);
                    this.healthDrainEvents[index] = null;
                    this.removePatient(index, false);
                }
            }
        });
    }

    startTreatment(index) {
        const patient = this.patients[index];
        if (!patient || patient.status !== "inTreatment") return;
        if (this.treatmentEvents[index]) return;

        if (this.healthDrainEvents[index]) {
            this.healthDrainEvents[index].remove(false);
            this.healthDrainEvents[index] = null;
        }

        this.treatmentEvents[index] = this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                const current = this.patients[index];
                if (!current || current.status !== "inTreatment") {
                    this.treatmentEvents[index].remove(false);
                    this.treatmentEvents[index] = null;
                    return;
                }

                current.health = Math.min(100, current.health + 1);
                this.updateHealthDisplay(index);
                this.updateUI();

                if (current.health >= 100) {
                    this.treatmentEvents[index].remove(false);
                    this.treatmentEvents[index] = null;
                    this.removePatient(index, true);
                }
            }
        });
    }

    updateHealthDisplay(index) {
        const patient = this.patients[index];
        const display = this.healthDisplays[index];
        if (!patient || !display) return;

        const percent = Phaser.Math.Clamp(patient.health, 0, 100);
        display.fill.width = 140 * (percent / 100);
        display.fill.fillColor = percent > 60 ? 0x4caf50 : percent > 30 ? 0xffc107 : 0xd32f2f;
        display.label.setText(`Health: ${Math.round(percent)}%`);
    }

    closeReport() {}

    showCurtain(index) {
        const patient = this.patients[index];
        const curtain = this.curtains[index];
        const card = this.cards[index];
        if (curtain) {
            if (patient && patient.status === "inTreatment") {
                const spacing = this.scale.width / 4;
                const bedX = patient.mainSlot != null ? spacing * (patient.mainSlot + 1) : card ? card.x : curtain.x;
                curtain.setPosition(bedX + 130, this.scale.height * 0.44);
            }
            curtain.setVisible(true);
        }
        if (card) {
            card.setVisible(false);
        }
    }

    getDoorSlot(doorIndex) {
        const doorX = 80;
        const doorY = this.scale.height * 0.3;
        const doorSpacing = 80;
        return {
            x: doorX,
            y: doorY + doorIndex * doorSpacing
        };
    }

    getWaitingSlot(waitingIndex) {
        const spacing = this.scale.width / 4;
        return {
            x: spacing * (waitingIndex + 1),
            y: this.scale.height * 0.48
        };
    }

    findFreeMainSlot() {
        for (let slot = 0; slot < 3; slot++) {
            const occupied = this.patients.some(p => p && p.mainSlot === slot && p.status === "inTreatment");
            if (!occupied) {
                return slot;
            }
        }
        return null;
    }

    updatePatientPosition(index) {
        const patient = this.patients[index];
        const card = this.cards[index];
        const curtain = this.curtains[index];
        const display = this.healthDisplays[index];
        if (!patient || !card || !curtain || !display) return;

        if (patient.status === "atDoor") {
            const doorPatients = this.patients.filter(p => p && p.status === "atDoor");
            const doorIndex = doorPatients.indexOf(patient);
            const { x, y } = this.getDoorSlot(doorIndex);
            card.setPosition(x, y);
            card.setScale(0.28);
            curtain.setPosition(x + 65, this.scale.height * 0.44);
            display.bg.setX(x - 60);
            display.bg.setY(y);
            display.fill.setX(x - 60);
            display.fill.setY(y);
            display.label.setX(x);
            display.label.setY(y);
        } else if (patient.status === "waiting" || patient.status === "inTreatment") {
            const spacing = this.scale.width / 4;
            let x;
            const patientIndex = this.patients.indexOf(patient);
            if (patient.mainSlot != null) {
                x = spacing * (patient.mainSlot + 1);
            } else if (patientIndex >= 0 && patientIndex < 3) {
                x = spacing * (patientIndex + 1);
            } else {
                const waitingPatients = this.patients.filter(p => p && (p.status === "waiting" || p.status === "inTreatment") && p.mainSlot == null);
                const waitingIndex = waitingPatients.indexOf(patient);
                const slot = this.getWaitingSlot(waitingIndex);
                x = slot.x;
            }
            const y = this.scale.height * 0.48;
            card.setPosition(x, y);
            card.setScale(0.22);
            curtain.setPosition(x, this.scale.height * 0.44);
            display.bg.setX(x - 60);
            display.bg.setY(this.scale.height * 0.66);
            display.fill.setX(x - 60);
            display.fill.setY(this.scale.height * 0.66);
            display.label.setX(x);
            display.label.setY(this.scale.height * 0.66);
        }
    }

    refreshDoorPositions() {
        this.patients.forEach((patient, index) => {
            if (patient && patient.status === "atDoor") {
                this.updatePatientPosition(index);
            }
        });
    }

    refreshWaitingPositions() {
        this.patients.forEach((patient, index) => {
            if (patient && (patient.status === "waiting" || patient.status === "inTreatment")) {
                this.updatePatientPosition(index);
            }
        });
    }

    hideCurtain(index) {
        const curtain = this.curtains[index];
        const card = this.cards[index];
        if (curtain) {
            curtain.setVisible(false);
        }
        if (card) {
            card.setVisible(true);
        }
    }

    hideReportPanel() {
        this.diagnosisImage.setVisible(false);
        this.symptomText.setVisible(false);
        this.briefingBackground.setVisible(false);
        this.briefingText.setVisible(false);
        this.medicalReference.setVisible(false);
        this.timerText.setVisible(false);
        this.giveBtn.setVisible(false);
        this.skipBtn.setVisible(false);

        if (this.diagnosisTimer) {
            this.diagnosisTimer.remove(false);
            this.diagnosisTimer = null;
        }

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    removePatient(index, survived, nextDelay = null) {
        const patient = this.patients[index];
        if (!patient) return;

        if (this.healthDrainEvents[index]) {
            this.healthDrainEvents[index].remove(false);
            this.healthDrainEvents[index] = null;
        }

        if (this.treatmentEvents[index]) {
            this.treatmentEvents[index].remove(false);
            this.treatmentEvents[index] = null;
        }

        // Move door patient to the removed patient's position if it's Anna, John, or Maria

        if (patient.status === "inTreatment" && survived) {
            this.occupiedBeds = Math.max(0, this.occupiedBeds - 1);
            this.hideCurtain(index);
        }

        let outcomeText;
if (survived) {
    outcomeText = `Doctor treated the patient in time. ICU care and monitoring led to recovery.`;
} else if (patient.wasSkipped) {
    outcomeText = `Doctor ignored the patient. No treatment was prescribed — patient deteriorated without care.`;
} else {
    outcomeText = `Patient received no treatment in time and deteriorated while waiting.`;
}

this.results.push({
    name: patient.name,
    age: patient.age,
    disease: patient.disease,
    survived: survived,
    wasSkipped: patient.wasSkipped || false,
    outcome: outcomeText
});

        patient.status = survived ? "treated" : "dead";

        if (this.cards[index]) {
            this.cards[index].destroy();
            this.cards[index] = null;
        }

        const display = this.healthDisplays[index];
        if (display) {
            display.bg.destroy();
            display.fill.destroy();
            display.label.destroy();
            this.healthDisplays[index] = null;
        }

        this.patients[index] = null;

        if (this.selected === index) {
            this.selected = null;
            this.hideReportPanel();
        }

        if (this.patientDecisionEvents[index]) {
            this.patientDecisionEvents[index].remove(false);
            this.patientDecisionEvents[index] = null;
        }

        this.updateUI();
        if (typeof nextDelay === "number") {
            this.scheduleNextPatient(nextDelay);
        }
        this.checkForEnd();
    }

    checkForEnd() {
        const remaining = this.patients.filter(p => p !== null).length;
        if (remaining === 0) {
            this.time.delayedCall(500, () => {
                this.scene.start("ResultScene", {
                    results: this.results,
                    bedsLeft: this.totalBeds - this.occupiedBeds
                });
            });
        }
    }

    // =====================
    // DECISION LOGIC
    // =====================
    decide(give) {

        this.diagnosisImage.setVisible(false);
        this.symptomText.setVisible(false);
        this.briefingBackground.setVisible(false);
        this.briefingText.setVisible(false);
        this.medicalReference.setVisible(false);
        this.timerText.setVisible(false);
        this.giveBtn.setVisible(false);
        this.skipBtn.setVisible(false);

        if (this.selected === null) return;

        const p = this.patients[this.selected];
        if (!p) return;
        if (p.status !== "atDoor") return;

        const freeSlot = this.findFreeMainSlot();
        const giveBed = give && this.occupiedBeds < this.totalBeds && freeSlot !== null;

        if (giveBed) {
            this.occupiedBeds++;
            p.status = "inTreatment";
            p.mainSlot = freeSlot;
            p.health = Math.max(p.health, 40);
            this.updatePatientPosition(this.selected);
            this.updateHealthDisplay(this.selected);
            this.showCurtain(this.selected);
            this.updateUI();
            this.hideReportPanel();
            this.startTreatment(this.selected);
            return;
        }

        if (give && (this.occupiedBeds >= this.totalBeds || freeSlot === null)) {
            this.uiText.setText(`No beds available — ${this.occupiedBeds}/${this.totalBeds} occupied`);
            return;
        }

        p.wasSkipped = true;
        this.hideReportPanel();
        this.removePatient(this.selected, false, null);
    }
}