export default class ResultScene extends Phaser.Scene {
    constructor() {
        super("ResultScene");
    }

    init(data) {
        this.results = data.results || [];
        this.bedsLeft = data.bedsLeft || 0;
        this.score = data.score || 0;
    }

    create() {
        const W = this.scale.width;
        const H = this.scale.height;

        this.cameras.main.fadeIn(600, 0, 0, 0);

        // ── Fixed background (never scrolls)
        this.add.rectangle(W / 2, H / 2, W, H, 0x0b0f1a).setDepth(0);
        this.drawGrid(W, H);

        // ── Top accent bar (fixed)
        this.add.rectangle(W / 2, 0, W, 6, 0x3b82f6).setOrigin(0.5, 0).setDepth(1);

        // ── Scrollable container — everything content goes in here
        this.scrollContainer = this.add.container(0, 0).setDepth(2);

        // ── Build all content
        this.drawHeader(W);

        const cardW = Math.min(W * 0.88, 700);
        const cardX = W / 2 - cardW / 2;
        const startY = 148;
        const cardH = 124;
        const gap = 12;

        this.results.forEach((r, idx) => {
            const y = startY + idx * (cardH + gap);
            const group = this.drawPatientCard(r, cardX, y, cardW, cardH);

            group.forEach(obj => {
                obj.setAlpha(0);
                const origX = obj.x;
                obj.x += 60;
                this.tweens.add({
                    targets: obj,
                    x: origX,
                    alpha: 1,
                    duration: 380,
                    delay: 300 + idx * 100,
                    ease: "Power2"
                });
            });
        });

        const summaryY = startY + this.results.length * (cardH + gap) + 20;
        this.drawSummary(W, cardX, cardW, summaryY);
        this.drawPlayAgainButton(W, summaryY + 130);

        // ── Scroll setup
        this.contentHeight = summaryY + 230;
        this.minScrollY = 0;
        this.maxScrollY = Math.max(0, this.contentHeight - H);
        this.scrollY = 0;
        this.isDragging = false;
        this.dragStartY = 0;
        this.dragStartScrollY = 0;

        // Mouse wheel
        this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY) => {
            this.scrollY = Phaser.Math.Clamp(
                this.scrollY + deltaY * 0.8,
                this.minScrollY,
                this.maxScrollY
            );
            this.scrollContainer.y = -this.scrollY;
            this.updateScrollbar();
        });

        // Touch / drag scroll
        this.input.on("pointerdown", (pointer) => {
            this.isDragging = true;
            this.dragStartY = pointer.y;
            this.dragStartScrollY = this.scrollY;
        });

        this.input.on("pointermove", (pointer) => {
            if (!this.isDragging) return;
            const delta = this.dragStartY - pointer.y;
            this.scrollY = Phaser.Math.Clamp(
                this.dragStartScrollY + delta,
                this.minScrollY,
                this.maxScrollY
            );
            this.scrollContainer.y = -this.scrollY;
            this.updateScrollbar();
        });

        this.input.on("pointerup", () => {
            this.isDragging = false;
        });

        // ── Scrollbar (fixed, not in container)
        this.scrollbarTrackH = H - 60;
        this.scrollbarTrack = this.add.graphics().setDepth(99);
        this.scrollbarThumb = this.add.graphics().setDepth(100);
        this.drawScrollbarTrack(W, H);
        this.updateScrollbar();

        // ── Scroll hint arrow (fades out after 2s)
        if (this.maxScrollY > 0) {
            const hint = this.add.text(W / 2, H - 28, "▼  scroll to see more  ▼", {
                fontSize: "12px",
                color: "#3b82f6",
                fontFamily: "monospace",
                letterSpacing: 2
            }).setOrigin(0.5).setDepth(99).setAlpha(0.9);

            this.tweens.add({
                targets: hint,
                alpha: 0,
                duration: 800,
                delay: 2200,
                ease: "Power2",
                onComplete: () => hint.destroy()
            });

            // Bounce animation for hint
            this.tweens.add({
                targets: hint,
                y: H - 22,
                duration: 500,
                yoyo: true,
                repeat: 3,
                ease: "Sine.easeInOut"
            });
        }
    }

    // ─────────────────────────────────────────
    // SCROLLBAR
    // ─────────────────────────────────────────
    drawScrollbarTrack(W, H) {
        this.scrollbarTrack.clear();
        this.scrollbarTrack.fillStyle(0x1f2937, 0.8);
        this.scrollbarTrack.fillRoundedRect(W - 10, 30, 5, this.scrollbarTrackH, 3);
    }

    updateScrollbar() {
        if (!this.scrollbarThumb) return;
        this.scrollbarThumb.clear();

        if (this.maxScrollY <= 0) return;

        const W = this.scale.width;
        const thumbH = Math.max(30, (this.scale.height / this.contentHeight) * this.scrollbarTrackH);
        const thumbY = 30 + (this.scrollY / this.maxScrollY) * (this.scrollbarTrackH - thumbH);

        this.scrollbarThumb.fillStyle(0x3b82f6, 0.9);
        this.scrollbarThumb.fillRoundedRect(W - 10, thumbY, 5, thumbH, 3);
    }

    // ─────────────────────────────────────────
    // BACKGROUND GRID
    // ─────────────────────────────────────────
    drawGrid(W, H) {
        const g = this.add.graphics().setDepth(0).setAlpha(0.04);
        g.lineStyle(1, 0xffffff);
        for (let x = 0; x < W; x += 40) { g.moveTo(x, 0); g.lineTo(x, H); }
        for (let y = 0; y < H; y += 40) { g.moveTo(0, y); g.lineTo(W, y); }
        g.strokePath();
    }

    // ─────────────────────────────────────────
    // HEADER
    // ─────────────────────────────────────────
    drawHeader(W) {
        const add = (obj) => { this.scrollContainer.add(obj); return obj; };

        // ECG decorative line
        const ecg = this.add.graphics();
        ecg.lineStyle(2, 0x3b82f6, 0.2);
        ecg.beginPath();
        ecg.moveTo(0, 68);
        const pts = [0,68, 60,68, 80,40, 95,96, 110,22, 125,95, 140,68, W,68];
        for (let i = 0; i < pts.length; i += 2) ecg.lineTo(pts[i], pts[i + 1]);
        ecg.strokePath();
        add(ecg);

        add(this.add.text(W / 2, 22, "END OF SHIFT", {
            fontSize: "12px",
            color: "#3b82f6",
            fontFamily: "monospace",
            letterSpacing: 6
        }).setOrigin(0.5));

        add(this.add.text(W / 2, 46, "Patient Outcome Report", {
            fontSize: "26px",
            color: "#f0f4ff",
            fontStyle: "bold",
            fontFamily: "Georgia, serif"
        }).setOrigin(0.5));

        // Thin divider under header
        const divider = this.add.graphics();
        divider.lineStyle(1, 0x1d4ed8, 0.4);
        divider.moveTo(W / 2 - 200, 90);
        divider.lineTo(W / 2 + 200, 90);
        divider.strokePath();
        add(divider);
    }

    // ─────────────────────────────────────────
    // PATIENT CARD
    // ─────────────────────────────────────────
    drawPatientCard(r, x, y, w, h) {
        const objects = [];
        const add = (obj) => {
            this.scrollContainer.add(obj);
            objects.push(obj);
            return obj;
        };

        // Theme colours
        let accentColor, bgColor, badgeText, outcomeTextColor;
        if (r.survived) {
            accentColor = 0x22c55e; bgColor = 0x0d1f14;
            badgeText = "SURVIVED"; outcomeTextColor = "#86efac";
        } else if (r.wasSkipped) {
            if (r.notZikaDecision !== undefined) {
                if (r.notZikaDecision) {
                    accentColor = 0x22c55e; bgColor = 0x0d1f14;
                    badgeText = "CORRECT"; outcomeTextColor = "#86efac";
                } else {
                    accentColor = 0xef4444; bgColor = 0x1f0a0a;
                    badgeText = "INCORRECT"; outcomeTextColor = "#fca5a5";
                }
            } else {
                accentColor = 0xf59e0b; bgColor = 0x1c1400;
                badgeText = "IGNORED"; outcomeTextColor = "#fcd34d";
            }
        } else {
            accentColor = 0x6b7280; bgColor = 0x111318;
            badgeText = "DIED WAITING"; outcomeTextColor = "#d1d5db";
        }

        // Card background
        const bg = this.add.graphics();
        bg.fillStyle(bgColor, 1);
        bg.fillRoundedRect(x, y, w, h, 10);
        bg.lineStyle(1.5, accentColor, 0.55);
        bg.strokeRoundedRect(x, y, w, h, 10);
        add(bg);

        // Left accent bar
        const bar = this.add.graphics();
        bar.fillStyle(accentColor, 1);
        bar.fillRoundedRect(x, y + 12, 4, h - 24, 2);
        add(bar);

        // Status dot
        const dot = this.add.graphics();
        dot.fillStyle(accentColor, 1);
        dot.fillCircle(x + 22, y + 22, 5);
        add(dot);

        // Patient name
        add(this.add.text(x + 36, y + 14, `${r.name},  Age ${r.age}`, {
            fontSize: "16px", color: "#f0f4ff", fontStyle: "bold"
        }));

        // Badge (top right)
        const badgeG = this.add.graphics();
        const bpad = 10;
        const bW = badgeText.length * 7.2 + bpad * 2;
        const bX = x + w - bW - 14;
        const bY = y + 10;
        badgeG.fillStyle(accentColor, 0.15);
        badgeG.lineStyle(1, accentColor, 0.7);
        badgeG.fillRoundedRect(bX, bY, bW, 24, 4);
        badgeG.strokeRoundedRect(bX, bY, bW, 24, 4);
        add(badgeG);

        add(this.add.text(bX + bW / 2, bY + 12, badgeText, {
            fontSize: "10px",
            color: outcomeTextColor,
            fontFamily: "monospace",
            fontStyle: "bold"
        }).setOrigin(0.5));

        // Disease label
        add(this.add.text(x + 36, y + 36, r.disease, {
            fontSize: "12px",
            color: "#6b7280",
            wordWrap: { width: w - 200 }
        }));

        // Zika status indicator
        if (r.isZikaPatient !== undefined) {
            const zikaBadge = this.add.graphics();
            const zikaText = r.isZikaPatient ? "ZIKA" : "NON-ZIKA";
            const zikaColor = r.isZikaPatient ? 0xef4444 : 0x22c55e;
            const zikaBadgeW = zikaText.length * 7 + 12;
            const zikaBadgeX = x + w - zikaBadgeW - 14;
            const zikaBadgeY = y + 38;
            
            zikaBadge.fillStyle(zikaColor, 0.2);
            zikaBadge.lineStyle(1, zikaColor, 0.6);
            zikaBadge.fillRoundedRect(zikaBadgeX, zikaBadgeY, zikaBadgeW, 18, 3);
            zikaBadge.strokeRoundedRect(zikaBadgeX, zikaBadgeY, zikaBadgeW, 18, 3);
            add(zikaBadge);

            add(this.add.text(zikaBadgeX + zikaBadgeW / 2, zikaBadgeY + 9, zikaText, {
                fontSize: "9px",
                color: r.isZikaPatient ? "#fca5a5" : "#86efac",
                fontFamily: "monospace",
                fontStyle: "bold"
            }).setOrigin(0.5));
        }

        // Divider
        const div = this.add.graphics();
        div.lineStyle(1, accentColor, 0.15);
        div.moveTo(x + 14, y + 60);
        div.lineTo(x + w - 14, y + 60);
        div.strokePath();
        add(div);

        // Outcome text
        add(this.add.text(x + 14, y + 66, r.outcome, {
            fontSize: "12px",
            color: outcomeTextColor,
            wordWrap: { width: w - 28 },
            lineSpacing: 3
        }));

        return objects;
    }

    // ─────────────────────────────────────────
    // SUMMARY PANEL
    // ─────────────────────────────────────────
    drawSummary(W, cardX, cardW, y) {
        const add = (obj) => { this.scrollContainer.add(obj); return obj; };

        const survived = this.results.filter(r => r.survived).length;
        const total = this.results.length;
        const rate = total > 0 ? Math.round((survived / total) * 100) : 0;

        const panelH = 95;
        const panelG = this.add.graphics();
        panelG.fillStyle(0x0f172a, 1);
        panelG.fillRoundedRect(cardX, y, cardW, panelH, 10);
        panelG.lineStyle(1.5, 0x1d4ed8, 0.5);
        panelG.strokeRoundedRect(cardX, y, cardW, panelH, 10);
        add(panelG);

        // Stat columns
        const stats = [
            { label: "PATIENTS SAVED", value: `${survived} / ${total}`, color: "#22c55e" },
            { label: "SURVIVAL RATE",  value: `${rate}%`, color: rate >= 60 ? "#22c55e" : rate >= 40 ? "#f59e0b" : "#ef4444" },
            { label: "TOTAL SCORE",    value: `${this.score}`, color: this.score >= 0 ? "#22c55e" : "#ef4444" }
        ];

        const colW = cardW / 3;
        stats.forEach((s, i) => {
            const cx = cardX + colW * i + colW / 2;

            if (i > 0) {
                const divG = this.add.graphics();
                divG.lineStyle(1, 0xffffff, 0.08);
                divG.moveTo(cardX + colW * i, y + 16);
                divG.lineTo(cardX + colW * i, y + panelH - 16);
                divG.strokePath();
                add(divG);
            }

            add(this.add.text(cx, y + 18, s.label, {
                fontSize: "9px", color: "#4b5563", fontFamily: "monospace", letterSpacing: 2
            }).setOrigin(0.5));

            add(this.add.text(cx, y + 42, s.value, {
                fontSize: "26px", color: s.color, fontStyle: "bold"
            }).setOrigin(0.5));
        });

        // Verdict text
        let verdict;
        let vColor;
        if (this.score >= 60) {
            verdict = "Excellent performance — made mostly correct decisions.";
            vColor = "#86efac";
        } else if (this.score >= 20) {
            verdict = "Good performance — room for improvement in diagnosis.";
            vColor = "#fcd34d";
        } else if (this.score >= 0) {
            verdict = "Average performance — review your decision criteria.";
            vColor = "#fcd34d";
        } else {
            verdict = "Poor performance — incorrect decisions outweighed correct ones.";
            vColor = "#fca5a5";
        }

        add(this.add.text(W / 2, y + panelH + 14, verdict, {
            fontSize: "13px", color: vColor, fontStyle: "italic", align: "center"
        }).setOrigin(0.5));
    }

    // ─────────────────────────────────────────
    // PLAY AGAIN BUTTON
    // ─────────────────────────────────────────
    drawPlayAgainButton(W, y) {
        const add = (obj) => { this.scrollContainer.add(obj); return obj; };

        const btnW = 210;
        const btnH = 46;
        const btnX = W / 2 - btnW / 2;

        const drawBtn = (color) => {
            btnG.clear();
            btnG.fillStyle(color, 1);
            btnG.fillRoundedRect(btnX, y, btnW, btnH, 8);
        };

        const btnG = this.add.graphics();
        add(btnG);
        drawBtn(0x1d4ed8);

        const btnTxt = add(this.add.text(W / 2, y + btnH / 2, "PLAY  AGAIN", {
            fontSize: "15px", color: "#ffffff",
            fontStyle: "bold", fontFamily: "monospace", letterSpacing: 4
        }).setOrigin(0.5).setInteractive({ useHandCursor: true }));

        const hitArea = add(
            this.add.rectangle(W / 2, y + btnH / 2, btnW, btnH, 0x000000, 0)
                .setInteractive({ useHandCursor: true })
        );

        const onOver  = () => drawBtn(0x2563eb);
        const onOut   = () => drawBtn(0x1d4ed8);
        const onDown  = () => {
            this.cameras.main.fadeOut(400, 0, 0, 0);
            this.time.delayedCall(420, () => this.scene.start("StartScene"));
        };

        hitArea.on("pointerover",  onOver);
        hitArea.on("pointerout",   onOut);
        hitArea.on("pointerdown",  onDown);
        btnTxt.on("pointerover",   onOver);
        btnTxt.on("pointerout",    onOut);
        btnTxt.on("pointerdown",   onDown);

        // Gentle pulse
        this.tweens.add({
            targets: btnTxt,
            alpha: 0.75,
            duration: 950,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut"
        });
    }
}