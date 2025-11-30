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

        // Generate wrong answers for multiple choice
        const options = this.generateOptions(problem.answer);

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

                    <div class="answer-options">
                        ${options.map((option, index) => `
                            <button onclick="mathematicsModule.selectAnswer('${option}')" class="math-option">
                                ${option}
                            </button>
                        `).join('')}
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
                .answer-options {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                    max-width: 600px;
                    margin: 30px auto;
                }
                .math-option {
                    padding: 20px;
                    font-size: 20px;
                    font-weight: 500;
                    background: white;
                    border: 3px solid #e0e0e0;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .math-option:hover {
                    border-color: #667eea;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
            </style>
        `;
    },

    generateOptions(correctAnswer) {
        // Generate 3 plausible wrong answers based on the correct answer
        const correct = Number(correctAnswer);
        const wrongAnswers = [];
        
        if (isNaN(correct)) {
            // If answer is a string (like time), create variations
            wrongAnswers.push(
                this.modifyTimeAnswer(correctAnswer, 1),
                this.modifyTimeAnswer(correctAnswer, 2),
                this.modifyTimeAnswer(correctAnswer, 3)
            );
        } else {
            // For numbers, create plausible alternatives
            const magnitude = Math.abs(correct);
            
            if (magnitude > 100) {
                wrongAnswers.push(
                    Math.round(correct * 0.8),
                    Math.round(correct * 1.2),
                    Math.round(correct * 0.5)
                );
            } else if (magnitude > 10) {
                wrongAnswers.push(
                    correct + 5,
                    correct - 5,
                    Math.round(correct * 1.5)
                );
            } else {
                wrongAnswers.push(
                    correct + 2,
                    correct - 2,
                    correct + 4
                );
            }
        }
        
        // Combine correct answer with wrong answers and shuffle
        const allOptions = [String(correctAnswer), ...wrongAnswers.map(String)];
        return this.shuffleArray(allOptions);
    },

    modifyTimeAnswer(timeStr, variant) {
        // For time-based answers, create plausible wrong times
        if (timeStr.includes(':')) {
            const parts = timeStr.split(':');
            const hours = parseInt(parts[0]);
            const mins = parseInt(parts[1].replace(/[^0-9]/g, ''));
            
            if (variant === 1) {
                return `${hours}:${String(mins + 15).padStart(2, '0')}${timeStr.includes('AM') ? ' AM' : timeStr.includes('PM') ? ' PM' : ''}`;
            } else if (variant === 2) {
                return `${hours + 1}:${String(mins).padStart(2, '0')}${timeStr.includes('AM') ? ' AM' : timeStr.includes('PM') ? ' PM' : ''}`;
            } else {
                return `${hours}:${String(Math.max(0, mins - 10)).padStart(2, '0')}${timeStr.includes('AM') ? ' AM' : timeStr.includes('PM') ? ' PM' : ''}`;
            }
        }
        return timeStr + ' (wrong)';
    },

    selectAnswer(selectedAnswer) {
        const problem = this.selectedProblems[this.currentProblem];
        const correct = this.checkAnswer(selectedAnswer, problem.answer);

        if (correct) {
            this.results.correct++;
        }

        this.showFeedback(correct, problem.answer, selectedAnswer);
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

    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
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
