// Mathematics Module - Randomized problem selection

const mathematicsModule = {
    name: "Mathematics",
    selectedProblems: [],
    currentProblem: 0,
    results: {
        correct: 0,
        total: 0
    },

    init(questionCount) {
        this.selectedProblems = getRandomQuestions(QuestionBankPart2.mathematics, questionCount);
        this.currentProblem = 0;
        this.results = {
            correct: 0,
            total: questionCount
        };
    },

    render(container, questionCount, onComplete) {
        this.init(questionCount);
        this.onComplete = onComplete;
        this.container = container;
        this.showProblem();
    },

    showProblem() {
        if (this.currentProblem >= this.selectedProblems.length) {
            this.finish();
            return;
        }

        const problem = this.selectedProblems[this.currentProblem];
        const problemNum = this.currentProblem + 1;
        const total = this.selectedProblems.length;

        this.container.innerHTML = `
            <div class="math-module">
                <div class="progress-indicator">
                    <p>Problem ${problemNum} of ${total}</p>
                    <div class="progress-bar-slim">
                        <div class="progress-fill" style="width: ${(problemNum / total) * 100}%"></div>
                    </div>
                </div>

                <div class="math-problem">
                    <div class="problem-box">
                        <h3>Problem ${problemNum}</h3>
                        <p class="problem-text">${problem.question}</p>
                    </div>

                    <div class="answer-input">
                        <label>Your Answer:</label>
                        <input type="text" id="mathAnswer" placeholder="Enter your answer" autocomplete="off">
                        <p class="hint">No calculator allowed - show your work on paper if needed</p>
                    </div>

                    <div class="module-actions">
                        <button onclick="mathematicsModule.submitAnswer()" class="primary-btn">
                            Submit Answer
                        </button>
                    </div>
                </div>
            </div>

            <style>
                .problem-box {
                    background: #f8f9fa;
                    padding: 30px;
                    border-radius: 10px;
                    margin: 20px 0;
                    border-left: 5px solid #667eea;
                }
                .problem-text {
                    font-size: 18px;
                    line-height: 1.8;
                    color: #2c3e50;
                    margin-top: 15px;
                }
                .answer-input {
                    text-align: center;
                    margin: 30px 0;
                }
                .answer-input label {
                    display: block;
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 15px;
                    color: #2c3e50;
                }
                .answer-input input {
                    width: 300px;
                    padding: 15px;
                    font-size: 20px;
                    border: 3px solid #e0e0e0;
                    border-radius: 8px;
                    text-align: center;
                }
                .answer-input input:focus {
                    outline: none;
                    border-color: #667eea;
                }
                .hint {
                    margin-top: 10px;
                    color: #7f8c8d;
                    font-size: 14px;
                    font-style: italic;
                }
            </style>
        `;

        // Focus input
        setTimeout(() => {
            document.getElementById('mathAnswer').focus();
        }, 100);

        // Allow Enter key to submit
        document.getElementById('mathAnswer').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitAnswer();
            }
        });
    },

    submitAnswer() {
        const userAnswer = document.getElementById('mathAnswer').value.trim();
        
        if (!userAnswer) {
            alert('Please enter an answer.');
            return;
        }

        const problem = this.selectedProblems[this.currentProblem];
        const correct = this.checkAnswer(userAnswer, problem.answer);

        if (correct) {
            this.results.correct++;
        }

        this.showFeedback(correct, problem.answer, userAnswer);
    },

    checkAnswer(userAnswer, correctAnswer) {
        // Normalize both answers for comparison
        const normalize = (val) => {
            // Convert to string and remove spaces, dollar signs, commas
            return String(val).toLowerCase()
                .replace(/[\s$,]/g, '')
                .replace(/\.0+$/, ''); // Remove trailing zeros after decimal
        };

        return normalize(userAnswer) === normalize(correctAnswer);
    },

    showFeedback(correct, correctAnswer, userAnswer) {
        const statusClass = correct ? 'success' : 'warning';
        const statusIcon = correct ? '✓' : '✗';

        this.container.innerHTML = `
            <div class="scenario-feedback ${statusClass}">
                <div class="feedback-header">
                    <h2>${statusIcon} ${correct ? 'Correct!' : 'Incorrect'}</h2>
                </div>

                <div class="answer-display">
                    <div class="answer-box">
                        <h4>Correct Answer:</h4>
                        <p class="correct-answer">${correctAnswer}</p>
                    </div>
                    ${!correct ? `
                        <div class="answer-box your-answer-box">
                            <h4>Your Answer:</h4>
                            <p>${userAnswer}</p>
                        </div>
                    ` : ''}
                </div>

                <div class="module-actions">
                    <button onclick="mathematicsModule.nextProblem()" class="primary-btn">
                        Next Problem →
                    </button>
                </div>
            </div>

            <style>
                .answer-display {
                    display: flex;
                    gap: 20px;
                    justify-content: center;
                    margin: 30px 0;
                }
                .answer-box {
                    background: white;
                    padding: 20px 40px;
                    border-radius: 10px;
                    text-align: center;
                }
                .answer-box h4 {
                    color: #7f8c8d;
                    margin-bottom: 10px;
                }
                .correct-answer {
                    font-size: 32px;
                    font-weight: bold;
                    color: #27ae60;
                }
                .your-answer-box p {
                    font-size: 32px;
                    font-weight: bold;
                    color: #e74c3c;
                }
            </style>
        `;
    },

    nextProblem() {
        this.currentProblem++;
        this.showProblem();
    },

    finish() {
        const accuracy = (this.results.correct / this.results.total) * 100;

        const finalResults = {
            moduleId: 'mathematics',
            accuracy: accuracy,
            correctAnswers: this.results.correct,
            totalQuestions: this.results.total,
            score: accuracy
        };

        if (this.onComplete) {
            this.onComplete(finalResults);
        }
    }
};

window.mathematicsModule = mathematicsModule;
