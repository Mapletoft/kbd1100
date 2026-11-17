// Decision Making Module - Randomized scenarios with priority determination

const decisionMakingModule = {
    name: "Decision Making",
    selectedScenarios: [],
    currentScenario: 0,
    results: {
        correct: 0,
        total: 0,
        details: []
    },
    // Set to true by js/test-engine.js for the graded test - see
    // js/modules/audio-data-entry.js for the fuller explanation.
    testMode: false,
    // Real CritiCall fires decision-making prompts as ~15-second interrupts
    // while you're busy with something else - a hard deadline with zero
    // credit if you miss it, not an untimed page you can sit on. This is
    // the closest a standalone module (no cross-module interrupt engine)
    // can get to that pressure: the same hard per-scenario countdown.
    secondsPerScenario: 15,
    timerInterval: null,

    init(questionCount) {
        // Get random scenarios from question bank
        this.selectedScenarios = getRandomQuestions(QuestionBank.decisionMaking, questionCount);
        this.currentScenario = 0;
        this.results = {
            correct: 0,
            total: questionCount,
            details: []
        };
    },

    render(container, questionCount, onComplete) {
        // Safety check: ensure getRandomQuestions is available
        if (typeof getRandomQuestions === 'undefined') {
            console.warn('⚠️ Decision Making waiting for question bank to load...');
            setTimeout(() => this.render(container, questionCount, onComplete), 50);
            return;
        }
        
        this.init(questionCount);
        this.onComplete = onComplete;
        this.container = container;
        this.showScenario();
    },

    showScenario() {
        if (this.currentScenario >= this.selectedScenarios.length) {
            this.finish();
            return;
        }

        const scenario = this.selectedScenarios[this.currentScenario];
        const scenarioNum = this.currentScenario + 1;
        const total = this.selectedScenarios.length;

        this.container.innerHTML = `
            <div class="decision-making-module">
                <div class="progress-indicator">
                    <p>Scenario ${scenarioNum} of ${total}
                        <span id="dmCountdown" style="float: right; font-weight: bold; color: #dc3545;">⏱ ${this.secondsPerScenario}s</span>
                    </p>
                    <div class="progress-bar-slim">
                        <div class="progress-fill" style="width: ${(scenarioNum / total) * 100}%"></div>
                    </div>
                </div>

                <div class="scenario-box">
                    <h3>Emergency Scenario</h3>
                    <p class="scenario-text">${scenario.scenario}</p>
                </div>

                <div class="decision-form">
                    <h4>Which service(s) should respond?</h4>
                    <div class="service-checkboxes">
                        <label class="service-option">
                            <input type="checkbox" value="Police" class="service-check">
                            <span>🚔 Police</span>
                        </label>
                        <label class="service-option">
                            <input type="checkbox" value="Fire" class="service-check">
                            <span>🚒 Fire</span>
                        </label>
                        <label class="service-option">
                            <input type="checkbox" value="EMS" class="service-check">
                            <span>🚑 EMS</span>
                        </label>
                        <label class="service-option">
                            <input type="checkbox" value="Utility" class="service-check">
                            <span>⚡ Utility</span>
                        </label>
                    </div>

                    <h4 style="margin-top: 25px;">Priority Level</h4>
                    <div class="priority-buttons">
                        <button onclick="decisionMakingModule.selectPriority('High')" class="priority-btn" data-priority="High">
                            ⚠️ High
                        </button>
                        <button onclick="decisionMakingModule.selectPriority('Medium')" class="priority-btn" data-priority="Medium">
                            📋 Medium
                        </button>
                        <button onclick="decisionMakingModule.selectPriority('Low')" class="priority-btn" data-priority="Low">
                            📝 Low
                        </button>
                    </div>
                </div>

                <div class="module-actions">
                    <button onclick="decisionMakingModule.submitDecision()" class="primary-btn">
                        Submit Decision
                    </button>
                </div>
            </div>

            <style>
                .scenario-box {
                    background: #f8f9fa;
                    padding: 25px;
                    border-radius: 10px;
                    margin: 20px 0;
                    border-left: 5px solid #667eea;
                }
                .scenario-text {
                    font-size: 18px;
                    line-height: 1.6;
                    color: #2c3e50;
                }
                .service-checkboxes {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                    margin: 15px 0;
                }
                .service-option {
                    background: white;
                    padding: 15px;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transition: all 0.2s;
                }
                .service-option:hover {
                    border-color: #667eea;
                    background: #f8f9fa;
                }
                .service-option input[type="checkbox"] {
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                }
                .service-option span {
                    font-size: 16px;
                    font-weight: 500;
                }
                .priority-buttons {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 15px;
                }
                .priority-btn {
                    padding: 15px;
                    border: 2px solid #e0e0e0;
                    background: white;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 14px;
                    font-weight: 500;
                }
                .priority-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                .priority-btn.selected {
                    border-color: #667eea;
                    background: #667eea;
                    color: white;
                    font-weight: bold;
                }
            </style>
        `;

        this.selectedPriorityValue = null;
        this.startScenarioTimer();
    },

    startScenarioTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);

        let secondsLeft = this.secondsPerScenario;
        this.timerInterval = setInterval(() => {
            secondsLeft--;
            const el = this.container.querySelector('#dmCountdown');
            if (el) el.textContent = `⏱ ${Math.max(0, secondsLeft)}s`;

            if (secondsLeft <= 0) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
                this.handleTimeExpired();
            }
        }, 1000);
    },

    // Missing the deadline gets zero credit, same as the real test - no
    // partial credit, no "it's fine, try again" for an interrupt you didn't
    // answer in time.
    handleTimeExpired() {
        const scenario = this.selectedScenarios[this.currentScenario];
        const checkboxes = this.container.querySelectorAll('.service-check:checked');
        const selectedServices = Array.from(checkboxes).map(cb => cb.value);

        this.results.details.push({
            scenario: scenario.scenario,
            userServices: selectedServices,
            correctServices: scenario.services,
            userPriority: this.selectedPriorityValue,
            correctPriority: scenario.priority,
            correct: false,
            timedOut: true,
            explanation: scenario.explanation
        });

        this.showFeedback(false, scenario, selectedServices, true);
    },

    selectPriority(priority) {
        this.selectedPriorityValue = priority;
        
        // Update button styles
        const buttons = this.container.querySelectorAll('.priority-btn');
        buttons.forEach(btn => {
            if (btn.dataset.priority === priority) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });
    },

    submitDecision() {
        // Get selected services
        const checkboxes = this.container.querySelectorAll('.service-check:checked');
        const selectedServices = Array.from(checkboxes).map(cb => cb.value);

        // Validate
        if (selectedServices.length === 0) {
            alert('Please select at least one service.');
            return;
        }
        if (!this.selectedPriorityValue) {
            alert('Please select a priority level.');
            return;
        }

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        const scenario = this.selectedScenarios[this.currentScenario];

        // Check correctness
        const servicesCorrect = this.arraysEqual(
            selectedServices.sort(),
            scenario.services.sort()
        );
        const priorityCorrect = this.selectedPriorityValue === scenario.priority;
        const fullyCorrect = servicesCorrect && priorityCorrect;

        if (fullyCorrect) {
            this.results.correct++;
        }

        this.results.details.push({
            scenario: scenario.scenario,
            userServices: selectedServices,
            correctServices: scenario.services,
            userPriority: this.selectedPriorityValue,
            correctPriority: scenario.priority,
            correct: fullyCorrect,
            explanation: scenario.explanation
        });

        this.showFeedback(fullyCorrect, scenario, selectedServices);
    },

    arraysEqual(a, b) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    },

    showFeedback(correct, scenario, selectedServices, timedOut) {
        const statusClass = correct ? 'success' : 'warning';
        const statusIcon = correct ? '✓' : '!';
        const servicesMatch = this.arraysEqual(selectedServices.sort(), scenario.services.sort());
        const priorityMatch = this.selectedPriorityValue === scenario.priority;

        this.container.innerHTML = `
            <div class="scenario-feedback ${statusClass}">
                <div class="feedback-header">
                    <h2>${timedOut ? '⏱ Time Expired' : (statusIcon + ' ' + (correct ? 'Correct!' : 'Review Your Answer'))}</h2>
                    ${timedOut ? '<p>No response in time counts as incorrect - same as the real test.</p>' : ''}
                </div>

                <div class="feedback-details">
                    <div class="feedback-section">
                        <h4>Services:</h4>
                        <p><strong>${servicesMatch ? '✓ Correct' : '✗ Incorrect'}</strong></p>
                        ${!servicesMatch && !this.testMode ?
                            `<p>Correct answer: ${scenario.services.join(', ')}</p><p class="your-answer">Your answer: ${selectedServices.length ? selectedServices.join(', ') : '(none selected)'}</p>` : ''}
                    </div>

                    <div class="feedback-section">
                        <h4>Priority:</h4>
                        <p><strong>${priorityMatch ? '✓ Correct' : '✗ Incorrect'}</strong></p>
                        ${!priorityMatch && !this.testMode ?
                            `<p>Correct answer: ${scenario.priority}</p><p class="your-answer">Your answer: ${this.selectedPriorityValue || '(none selected)'}</p>` : ''}
                    </div>

                    ${!this.testMode ? `
                        <div class="feedback-section explanation">
                            <h4>Explanation:</h4>
                            <p>${scenario.explanation}</p>
                        </div>
                    ` : ''}
                </div>

                <div class="module-actions">
                    <button onclick="decisionMakingModule.nextScenario()" class="primary-btn">
                        Continue to Next Scenario →
                    </button>
                </div>
            </div>

            <style>
                .feedback-details {
                    background: white;
                    padding: 25px;
                    border-radius: 10px;
                    margin: 20px 0;
                }
                .feedback-section {
                    margin: 20px 0;
                    padding: 15px;
                    background: #f8f9fa;
                    border-radius: 8px;
                }
                .feedback-section h4 {
                    color: #2c3e50;
                    margin-bottom: 10px;
                }
                .your-answer {
                    color: #dc3545;
                    font-style: italic;
                    margin-top: 5px;
                }
                .explanation {
                    background: #e8f4f8;
                    border-left: 4px solid #17a2b8;
                }
            </style>
        `;
    },

    nextScenario() {
        this.currentScenario++;
        this.showScenario();
    },

    finish() {
        const accuracy = (this.results.correct / this.results.total) * 100;

        const finalResults = {
            moduleId: 'decisionMaking',
            accuracy: accuracy,
            correctAnswers: this.results.correct,
            totalQuestions: this.results.total,
            score: accuracy,
            details: this.results.details
        };

        if (this.onComplete) {
            this.onComplete(finalResults);
        }
    }
};

window.decisionMakingModule = decisionMakingModule;
