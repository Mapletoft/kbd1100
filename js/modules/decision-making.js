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
                    <p>Scenario ${scenarioNum} of ${total}</p>
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
                        <button onclick="decisionMakingModule.selectPriority('Critical')" class="priority-btn" data-priority="Critical">
                            🚨 Critical
                        </button>
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

    showFeedback(correct, scenario, selectedServices) {
        const statusClass = correct ? 'success' : 'warning';
        const statusIcon = correct ? '✓' : '!';

        this.container.innerHTML = `
            <div class="scenario-feedback ${statusClass}">
                <div class="feedback-header">
                    <h2>${statusIcon} ${correct ? 'Correct!' : 'Review Your Answer'}</h2>
                </div>

                <div class="feedback-details">
                    <div class="feedback-section">
                        <h4>Correct Services:</h4>
                        <p><strong>${scenario.services.join(', ')}</strong></p>
                        ${!this.arraysEqual(selectedServices.sort(), scenario.services.sort()) ? 
                            `<p class="your-answer">Your answer: ${selectedServices.join(', ')}</p>` : ''}
                    </div>

                    <div class="feedback-section">
                        <h4>Correct Priority:</h4>
                        <p><strong>${scenario.priority}</strong></p>
                        ${this.selectedPriorityValue !== scenario.priority ? 
                            `<p class="your-answer">Your answer: ${this.selectedPriorityValue}</p>` : ''}
                    </div>

                    <div class="feedback-section explanation">
                        <h4>Explanation:</h4>
                        <p>${scenario.explanation}</p>
                    </div>
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
