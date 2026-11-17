// Split Attention Module - type a passage while watching 4 corner boxes for
// target numbers, across 4 progressively harder rounds. Ported from
// criticall.html's original inline implementation.
//
// Note on scope: researched whether this corresponds to a distinct real
// CritiCall category - it doesn't. The vendor's own module list covers this
// skill (handling a task while a competing demand fights for your
// attention) under "Multitasking", which this course already has a
// dedicated, more realistic module for (js/modules/multitasking.js - a live
// call-queue simulation with real interrupts). This module is kept as a
// supplementary divided-attention drill in its own right (a genuinely
// useful, trainable skill), not as a simulation of a specific CritiCall
// section - its instructions and card description should say so rather
// than implying it's "the real test's Split Attention module."
//
// Bugs fixed from the original:
// 1. Corner state wasn't reset between rounds - starting round 2 with
//    round 1's leftover numbers still in `corners` caused the very first
//    tick of the new round to spuriously count a "missed target" against
//    round 1's numbers, which may not even be targets in the new round.
// 2. Typing accuracy was a naive position-by-position character comparison
//    with zero insertion/deletion tolerance - a single typo early in the
//    passage (one extra or missing character) shifted every character
//    after it out of alignment, cratering the accuracy score even for an
//    otherwise-perfect retype. Replaced with a Levenshtein-distance-based
//    similarity so one slip costs roughly one character, not the rest of
//    the passage.
// 3. The only numbers ever used as targets across all 4 rounds were
//    doubled-digit (22/33/44/55/66/77/88), and the filler pool excluded
//    those specific numbers - so students could learn "click any
//    doubled-digit number" as a shortcut without reading which numbers were
//    actually the current round's targets. Targets are now plain two-digit
//    numbers with no shared visual pattern, and the filler pool is
//    regenerated per round from the full 10-99 range (minus that round's
//    actual targets) so there's nothing to pattern-match against.

const splitAttentionPassages = [
    "Emergency dispatchers must maintain composure under pressure while managing multiple information streams simultaneously. This requires exceptional multitasking abilities and sustained concentration throughout extended shifts.",
    "Effective communication is critical in emergency services. Dispatchers must quickly gather accurate information, relay instructions clearly, and coordinate responses between multiple agencies and units.",
    "Modern dispatch centers utilize advanced computer-aided dispatch systems to track unit locations, manage call queues, and maintain comprehensive incident records for legal and operational purposes.",
    "Time management skills are essential for dispatchers who must prioritize incoming calls based on urgency, allocate appropriate resources, and ensure timely response to life-threatening situations.",
    "Dispatchers serve as the vital link between callers in crisis and emergency responders in the field. Their ability to remain calm and professional can significantly impact outcomes.",
    "Public safety telecommunications requires precise attention to detail when recording addresses, license plate numbers, physical descriptions, and other critical incident information.",
    "Emergency call processing involves continuous assessment of caller credibility, threat levels, and resource availability while maintaining empathetic communication with distressed individuals.",
    "Dispatchers must master geographic knowledge of their service area including street layouts, landmark locations, and jurisdictional boundaries to ensure accurate resource deployment.",
    "Radio communication protocols demand clear enunciation, proper terminology, and strategic timing to coordinate multiple units responding to complex emergency situations.",
    "Crisis intervention skills enable dispatchers to provide pre-arrival instructions for medical emergencies, de-escalate volatile situations, and maintain caller cooperation during investigations.",
    "Technology proficiency is crucial as dispatchers operate multiple computer systems simultaneously while monitoring radio traffic, telephone calls, and automated alert systems.",
    "Documentation accuracy ensures legal compliance and operational continuity. Every detail recorded during emergency calls may become evidence in subsequent legal proceedings."
];

function levenshteinDistance(a, b) {
    const m = a.length, n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;

    let prevRow = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
        const currRow = [i];
        for (let j = 1; j <= n; j++) {
            if (a[i - 1] === b[j - 1]) {
                currRow[j] = prevRow[j - 1];
            } else {
                currRow[j] = 1 + Math.min(prevRow[j - 1], prevRow[j], currRow[j - 1]);
            }
        }
        prevRow = currRow;
    }
    return prevRow[n];
}

function randomTwoDigit() {
    return Math.floor(10 + Math.random() * 90);
}

const splitAttentionModule = {
    name: "Split Attention",

    // questionCount is intentionally unused - like Multitasking, this is a
    // fixed structure (4 progressive timed rounds), not a question-count
    // driven module.
    render(container, questionCount, onComplete) {
        this.container = container;
        this.onComplete = onComplete;
        this.state = {
            currentRound: 1,
            totalRounds: 4,
            rounds: [
                { roundNumber: 1, targetNumbers: [47], interval: 5000, duration: 90, description: "Round 1: Watch for number 47" },
                { roundNumber: 2, targetNumbers: [47, 68], interval: 4000, duration: 90, description: "Round 2: Watch for numbers 47 and 68" },
                { roundNumber: 3, targetNumbers: [47, 68, 29], interval: 3000, duration: 90, description: "Round 3: Watch for numbers 47, 68, and 29" },
                { roundNumber: 4, targetNumbers: [19, 38, 52, 74], interval: 2500, duration: 120, description: "Round 4: Watch for numbers 19, 38, 52, and 74" }
            ],
            corners: [null, null, null, null],
            typingText: '',
            typedText: '',
            correctClicks: 0,
            missedTargets: 0,
            falseClicks: 0,
            roundStartTime: null,
            currentTargets: [],
            currentInterval: null,
            cycleInterval: null,
            timerInterval: null,
            roundResults: []
        };
        this.showIntro();
    },

    showIntro() {
        this.container.innerHTML = `
            <h3>Progressive Training Overview:</h3>
            <div style="background: #fff3cd; padding: 20px; border-radius: 10px; border: 2px solid #ffc107; margin-bottom: 20px;">
                <p><strong>This is a supplementary divided-attention drill - 4 progressive rounds:</strong></p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin: 15px 0;">
                    ${this.state.rounds.map(round => `
                        <div style="background: white; padding: 15px; border-radius: 8px; border: 2px solid #007bff;">
                            <h4 style="color: #007bff; margin-bottom: 8px;">Round ${round.roundNumber}</h4>
                            <p style="margin: 5px 0; font-size: 14px;"><strong>Targets:</strong> ${round.targetNumbers.join(', ')}</p>
                            <p style="margin: 5px 0; font-size: 14px;"><strong>Speed:</strong> ${round.interval / 1000}s intervals</p>
                            <p style="margin: 5px 0; font-size: 14px;"><strong>Duration:</strong> ${Math.floor(round.duration / 60)}:${(round.duration % 60).toString().padStart(2, '0')}</p>
                        </div>
                    `).join('')}
                </div>
                <div style="background: #e7f3ff; padding: 15px; border-radius: 5px; margin-top: 15px;">
                    <h4 style="margin-bottom: 10px;">Training Instructions:</h4>
                    <ol style="margin: 10px 0; padding-left: 20px;">
                        <li><strong>Type the passage</strong> shown in the center - accuracy and speed matter</li>
                        <li><strong>Watch the 4 corner boxes</strong> for target numbers (they change at different speeds each round)</li>
                        <li><strong>Click immediately</strong> when you see a target number appear</li>
                        <li><strong>Progress through rounds</strong> - each gets faster with more targets</li>
                    </ol>
                    <p style="color: #0066cc; margin-top: 10px;"><strong>💡 Tip:</strong> Focus primarily on typing, but stay alert for targets in your peripheral vision!</p>
                </div>
            </div>
            <div style="text-align: center;">
                <button class="btn btn-success" id="splitBeginBtn" style="background: #28a745; color: white; border: none; padding: 15px 30px; border-radius: 8px; font-size: 16px; cursor: pointer;">Begin Round 1</button>
            </div>
        `;
        this.container.querySelector('#splitBeginBtn').addEventListener('click', () => this.startRound(1));
    },

    startRound(roundNumber) {
        const round = this.state.rounds[roundNumber - 1];
        this.state.currentRound = roundNumber;
        this.state.currentTargets = round.targetNumbers;
        this.state.currentInterval = round.interval;
        // Fresh filler pool every round, drawn from the full 10-99 range
        // minus this round's own targets - no reserved "shape" that targets
        // always share, so there's nothing to pattern-match.
        this.state.displayNumbers = this.generateFillerPool(round.targetNumbers);
        this.state.typingText = splitAttentionPassages[Math.floor(Math.random() * splitAttentionPassages.length)];
        this.state.typedText = '';
        this.state.corners = [null, null, null, null]; // fix: was never reset between rounds
        this.state.correctClicks = 0;
        this.state.missedTargets = 0;
        this.state.falseClicks = 0;
        this.state.roundStartTime = Date.now();

        this.container.innerHTML = `
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h3>${round.description}</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-top: 10px;">
                    <div style="background: rgba(255,255,255,0.1); padding: 8px; border-radius: 5px; text-align: center;"><strong>Round ${roundNumber}/4</strong></div>
                    <div style="background: rgba(255,255,255,0.1); padding: 8px; border-radius: 5px; text-align: center;"><strong>Speed: ${round.interval / 1000}s</strong></div>
                    <div style="background: rgba(255,255,255,0.1); padding: 8px; border-radius: 5px; text-align: center;"><strong>Targets: ${round.targetNumbers.map(n => `<span style="background: #ff6b6b; padding: 2px 6px; border-radius: 3px; margin: 0 2px;">${n}</span>`).join('')}</strong></div>
                    <div style="background: rgba(255,255,255,0.1); padding: 8px; border-radius: 5px; text-align: center;"><strong>Time: <span id="splitTimeLeft">${Math.floor(round.duration / 60)}:${(round.duration % 60).toString().padStart(2, '0')}</span></strong></div>
                </div>
            </div>
            <div style="position: relative; min-height: 500px; background: #f8f9fa; padding: 40px; border-radius: 10px;">
                <div id="corner0" class="corner-box" style="position: absolute; top: 20px; left: 20px; width: 80px; height: 80px; background: white; border: 3px solid #007bff; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: bold; cursor: pointer;" onclick="splitAttentionModule.clickCorner(0)">--</div>
                <div id="corner1" class="corner-box" style="position: absolute; top: 20px; right: 20px; width: 80px; height: 80px; background: white; border: 3px solid #007bff; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: bold; cursor: pointer;" onclick="splitAttentionModule.clickCorner(1)">--</div>
                <div id="corner2" class="corner-box" style="position: absolute; bottom: 20px; left: 20px; width: 80px; height: 80px; background: white; border: 3px solid #007bff; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: bold; cursor: pointer;" onclick="splitAttentionModule.clickCorner(2)">--</div>
                <div id="corner3" class="corner-box" style="position: absolute; bottom: 20px; right: 20px; width: 80px; height: 80px; background: white; border: 3px solid #007bff; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: bold; cursor: pointer;" onclick="splitAttentionModule.clickCorner(3)">--</div>

                <div style="margin: 60px 120px; text-align: center;">
                    <div style="background: white; padding: 20px; border-radius: 10px; border: 2px solid #28a745; margin-bottom: 15px;">
                        <p style="font-size: 18px; line-height: 1.8; color: #333;">${this.state.typingText}</p>
                    </div>
                    <textarea id="splitTypingInput" style="width: 100%; height: 120px; padding: 15px; border: 2px solid #007bff; border-radius: 10px; font-size: 16px; line-height: 1.6; resize: vertical;" placeholder="Start typing the passage above..."></textarea>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 15px; text-align: center;">
                        <div style="background: #d4edda; padding: 10px; border-radius: 5px; border: 1px solid #c3e6cb;"><strong>Correct Clicks</strong><br><span id="splitCorrectClicks" style="font-size: 24px; color: #28a745;">0</span></div>
                        <div style="background: #f8d7da; padding: 10px; border-radius: 5px; border: 1px solid #f5c6cb;"><strong>Missed Targets</strong><br><span id="splitMissed" style="font-size: 24px; color: #dc3545;">0</span></div>
                        <div style="background: #fff3cd; padding: 10px; border-radius: 5px; border: 1px solid #ffeaa7;"><strong>False Clicks</strong><br><span id="splitFalse" style="font-size: 24px; color: #856404;">0</span></div>
                    </div>
                </div>
            </div>
        `;

        this.container.querySelector('#splitTypingInput').addEventListener('input', (e) => {
            this.state.typedText = e.target.value;
        });
        this.container.querySelector('#splitTypingInput').focus();

        this.cycleNumbers();
        this.updateTimer();
    },

    generateFillerPool(targets) {
        const pool = [];
        while (pool.length < 32) {
            const n = randomTwoDigit();
            if (!targets.includes(n)) pool.push(n);
        }
        return pool;
    },

    cycleNumbers() {
        if (this.state.cycleInterval) clearInterval(this.state.cycleInterval);

        this.state.cycleInterval = setInterval(() => {
            for (let i = 0; i < 4; i++) {
                const oldNumber = this.state.corners[i];
                const allNumbers = [...this.state.displayNumbers, ...this.state.currentTargets];
                const newNumber = allNumbers[Math.floor(Math.random() * allNumbers.length)];
                this.state.corners[i] = newNumber;

                const cornerElement = this.container.querySelector(`#corner${i}`);
                if (cornerElement) {
                    cornerElement.textContent = newNumber;

                    if (oldNumber && this.state.currentTargets.includes(oldNumber)) {
                        this.state.missedTargets++;
                        const missedEl = this.container.querySelector('#splitMissed');
                        if (missedEl) missedEl.textContent = this.state.missedTargets;
                    }

                    if (this.state.currentTargets.includes(newNumber)) {
                        cornerElement.style.background = '#ffebee';
                        cornerElement.style.borderColor = '#dc3545';
                    } else {
                        cornerElement.style.background = 'white';
                        cornerElement.style.borderColor = '#007bff';
                    }
                }
            }
        }, this.state.currentInterval);
    },

    clickCorner(cornerIndex) {
        const number = this.state.corners[cornerIndex];
        const cornerElement = this.container.querySelector(`#corner${cornerIndex}`);
        if (!cornerElement) return;

        if (this.state.currentTargets.includes(number)) {
            this.state.correctClicks++;
            this.container.querySelector('#splitCorrectClicks').textContent = this.state.correctClicks;
            cornerElement.style.background = '#d4edda';
            setTimeout(() => { cornerElement.style.background = 'white'; }, 300);

            const allNumbers = [...this.state.displayNumbers, ...this.state.currentTargets];
            this.state.corners[cornerIndex] = allNumbers[Math.floor(Math.random() * allNumbers.length)];
            cornerElement.textContent = this.state.corners[cornerIndex];
        } else {
            this.state.falseClicks++;
            this.container.querySelector('#splitFalse').textContent = this.state.falseClicks;
            cornerElement.style.background = '#f8d7da';
            setTimeout(() => { cornerElement.style.background = 'white'; }, 300);
        }
    },

    updateTimer() {
        if (this.state.timerInterval) clearInterval(this.state.timerInterval);

        const round = this.state.rounds[this.state.currentRound - 1];
        this.state.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.state.roundStartTime) / 1000);
            const remaining = round.duration - elapsed;

            if (remaining <= 0) {
                this.finishRound();
                return;
            }

            const minutes = Math.floor(remaining / 60);
            const seconds = remaining % 60;
            const el = this.container.querySelector('#splitTimeLeft');
            if (el) el.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    },

    finishRound() {
        clearInterval(this.state.cycleInterval);
        clearInterval(this.state.timerInterval);

        const originalText = this.state.typingText;
        const typedText = this.state.typedText;
        const distance = levenshteinDistance(typedText, originalText);
        const typingAccuracy = originalText.length > 0
            ? Math.max(0, Math.round((1 - distance / originalText.length) * 100))
            : 0;

        const totalTargets = this.state.correctClicks + this.state.missedTargets;
        const detectionRate = totalTargets > 0 ? Math.round((this.state.correctClicks / totalTargets) * 100) : 0;
        const overallScore = Math.round((typingAccuracy * 0.6) + (detectionRate * 0.4));

        this.state.roundResults.push({
            round: this.state.currentRound,
            typingAccuracy, detectionRate, overallScore,
            correctClicks: this.state.correctClicks,
            missedTargets: this.state.missedTargets,
            falseClicks: this.state.falseClicks,
            typedLength: typedText.length,
            originalLength: originalText.length
        });

        this.showRoundResults();
    },

    showRoundResults() {
        const result = this.state.roundResults[this.state.currentRound - 1];
        this.container.innerHTML = `
            <div style="background: ${result.overallScore >= 70 ? '#d4edda' : result.overallScore >= 50 ? '#fff3cd' : '#f8d7da'}; border: 2px solid ${result.overallScore >= 70 ? '#c3e6cb' : result.overallScore >= 50 ? '#ffeaa7' : '#f5c6cb'}; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
                <h3>Round ${this.state.currentRound} Complete!</h3>
                <h2>Overall Score: ${result.overallScore}%</h2>
            </div>
            <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3 style="margin-bottom: 15px;">Round ${this.state.currentRound} Performance:</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 15px 0;">
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
                        <h4>Typing Accuracy</h4>
                        <div style="color: ${result.typingAccuracy >= 70 ? '#28a745' : '#dc3545'}; font-weight: bold; font-size: 24px;">${result.typingAccuracy}%</div>
                        <small>${result.typedLength} / ${result.originalLength} characters</small>
                    </div>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
                        <h4>Target Detection</h4>
                        <div style="color: ${result.detectionRate >= 70 ? '#28a745' : '#dc3545'}; font-weight: bold; font-size: 24px;">${result.detectionRate}%</div>
                        <small>Correct: ${result.correctClicks}, Missed: ${result.missedTargets}</small>
                    </div>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
                        <h4>Accuracy</h4>
                        <div style="color: ${result.falseClicks <= 2 ? '#28a745' : '#dc3545'}; font-weight: bold; font-size: 24px;">${result.falseClicks} false clicks</div>
                        <small>Avoid clicking non-targets</small>
                    </div>
                </div>
            </div>
            <div style="text-align: center;">
                ${this.state.currentRound < this.state.totalRounds ?
                    `<button class="btn btn-primary" id="splitNextRoundBtn" style="background: #007bff; color: white; border: none; padding: 12px 25px; border-radius: 8px; font-size: 16px; cursor: pointer; margin-right: 10px;">Continue to Round ${this.state.currentRound + 1}</button>` :
                    `<button class="btn btn-success" id="splitFinalResultsBtn" style="background: #28a745; color: white; border: none; padding: 12px 25px; border-radius: 8px; font-size: 16px; cursor: pointer; margin-right: 10px;">View Final Results</button>`
                }
                <button class="btn btn-danger" onclick="closeModule()" style="background: #dc3545; color: white; border: none; padding: 12px 25px; border-radius: 8px; font-size: 16px; cursor: pointer;">Exit Training</button>
            </div>
        `;

        const nextBtn = this.container.querySelector('#splitNextRoundBtn');
        if (nextBtn) nextBtn.addEventListener('click', () => this.startRound(this.state.currentRound + 1));
        const finalBtn = this.container.querySelector('#splitFinalResultsBtn');
        if (finalBtn) finalBtn.addEventListener('click', () => this.finish());
    },

    finish() {
        const results = this.state.roundResults;
        const totalScore = Math.round(results.reduce((sum, r) => sum + r.overallScore, 0) / results.length);
        const totalCorrectClicks = results.reduce((sum, r) => sum + r.correctClicks, 0);
        const totalMissedTargets = results.reduce((sum, r) => sum + r.missedTargets, 0);
        const totalFalseClicks = results.reduce((sum, r) => sum + r.falseClicks, 0);

        const finalResults = {
            moduleId: 'splitAttention',
            accuracy: totalScore,
            correctAnswers: totalCorrectClicks,
            totalQuestions: totalCorrectClicks + totalMissedTargets,
            score: totalScore,
            roundResults: results,
            totalFalseClicks: totalFalseClicks
        };

        if (this.onComplete) {
            this.onComplete(finalResults);
        }
    }
};

window.splitAttentionModule = splitAttentionModule;
