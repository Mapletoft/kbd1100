// PLACEHOLDER MODULES - These use simplified logic
// You'll need to add your actual content (audio files, maps, etc.)

// ===== CALL SUMMARIZATION MODULE =====
const callSummarizationModule = {
    name: "Call Summarization",
    
    render(container, questionCount, onComplete) {
        this.onComplete = onComplete;
        
        // Simplified version - in production, use your audio files
        const finalResults = {
            moduleId: 'callSummarization',
            accuracy: 75, // Placeholder
            correctAnswers: Math.floor(questionCount * 0.75),
            totalQuestions: questionCount,
            score: 75,
            wpm: 35
        };
        
        container.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h2>Call Summarization Module</h2>
                <p>This module needs your audio files integrated.</p>
                <p>Simulating completion...</p>
            </div>
        `;
        
        setTimeout(() => {
            if (this.onComplete) {
                this.onComplete(finalResults);
            }
        }, 2000);
    }
};

// ===== MAP READING MODULE =====
const mapReadingModule = {
    name: "Map Reading",
    
    render(container, questionCount, onComplete) {
        this.onComplete = onComplete;
        
        const finalResults = {
            moduleId: 'mapReading',
            accuracy: 70,
            correctAnswers: Math.floor(questionCount * 0.70),
            totalQuestions: questionCount,
            score: 70
        };
        
        container.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h2>Map Reading Module</h2>
                <p>This module needs your map scenarios integrated.</p>
                <p>Simulating completion...</p>
            </div>
        `;
        
        setTimeout(() => {
            if (this.onComplete) {
                this.onComplete(finalResults);
            }
        }, 2000);
    }
};

// ===== READING COMPREHENSION MODULE =====
const readingComprehensionModule = {
    name: "Reading Comprehension",
    selectedPassages: [],
    currentPassage: 0,
    results: {
        correct: 0,
        total: 0
    },

    init(questionCount) {
        this.selectedPassages = getRandomQuestions(QuestionBankPart2.readingComprehension, questionCount);
        this.currentPassage = 0;
        this.results = {
            correct: 0,
            total: 0 // Will count total questions across all passages
        };
    },

    render(container, questionCount, onComplete) {
        this.init(questionCount);
        this.onComplete = onComplete;
        this.container = container;
        this.showPassage();
    },

    showPassage() {
        if (this.currentPassage >= this.selectedPassages.length) {
            this.finish();
            return;
        }

        const passage = this.selectedPassages[this.currentPassage];
        this.currentQuestion = 0;
        this.passageResults = [];

        this.showQuestion();
    },

    showQuestion() {
        const passage = this.selectedPassages[this.currentPassage];
        
        if (this.currentQuestion >= passage.questions.length) {
            // Move to next passage
            this.currentPassage++;
            this.showPassage();
            return;
        }

        const question = passage.questions[this.currentQuestion];
        const questionNum = this.currentQuestion + 1;
        const total = passage.questions.length;

        this.container.innerHTML = `
            <div class="reading-module">
                <div class="passage-display">
                    <h3>${passage.title}</h3>
                    <div class="passage-text">
                        ${passage.passage}
                    </div>
                </div>

                <div class="question-section">
                    <h4>Question ${questionNum} of ${total}</h4>
                    <p class="question-text">${question.question}</p>
                    
                    <div class="options-list">
                        ${question.options.map((option, index) => `
                            <button onclick="readingComprehensionModule.selectAnswer(${index})" class="option-btn">
                                ${option}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>

            <style>
                .passage-display {
                    background: #f8f9fa;
                    padding: 25px;
                    border-radius: 10px;
                    margin-bottom: 25px;
                }
                .passage-display h3 {
                    color: #2c3e50;
                    margin-bottom: 15px;
                }
                .passage-text {
                    line-height: 1.8;
                    color: #34495e;
                    font-size: 16px;
                    max-height: 300px;
                    overflow-y: auto;
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                }
                .question-section {
                    background: white;
                    padding: 25px;
                    border-radius: 10px;
                    border: 2px solid #667eea;
                }
                .question-text {
                    font-size: 18px;
                    font-weight: 500;
                    margin: 15px 0 20px 0;
                    color: #2c3e50;
                }
                .options-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .option-btn {
                    padding: 15px 20px;
                    text-align: left;
                    background: #f8f9fa;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .option-btn:hover {
                    border-color: #667eea;
                    background: white;
                }
            </style>
        `;
    },

    selectAnswer(selectedIndex) {
        const passage = this.selectedPassages[this.currentPassage];
        const question = passage.questions[this.currentQuestion];
        const correct = selectedIndex === question.correct;

        this.results.total++;
        if (correct) {
            this.results.correct++;
        }

        this.passageResults.push({
            question: question.question,
            correct: correct
        });

        this.currentQuestion++;
        
        setTimeout(() => {
            this.showQuestion();
        }, 500);
    },

    finish() {
        const accuracy = this.results.total > 0 ? (this.results.correct / this.results.total) * 100 : 0;

        const finalResults = {
            moduleId: 'readingComprehension',
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

// ===== MEMORY RECALL MODULE =====
const memoryRecallModule = {
    name: "Memory Recall",
    
    render(container, questionCount, onComplete) {
        this.onComplete = onComplete;
        
        const finalResults = {
            moduleId: 'memoryRecall',
            accuracy: 72,
            correctAnswers: Math.floor(questionCount * 0.72),
            totalQuestions: questionCount,
            score: 72
        };
        
        container.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h2>Memory Recall Module</h2>
                <p>This module needs enhanced with timed display logic.</p>
                <p>Simulating completion...</p>
            </div>
        `;
        
        setTimeout(() => {
            if (this.onComplete) {
                this.onComplete(finalResults);
            }
        }, 2000);
    }
};

// ===== CROSS REFERENCE MODULE =====
const crossReferenceModule = {
    name: "Cross Reference",
    
    render(container, questionCount, onComplete) {
        this.onComplete = onComplete;
        
        const finalResults = {
            moduleId: 'crossReference',
            accuracy: 78,
            correctAnswers: Math.floor(questionCount * 0.78),
            totalQuestions: questionCount,
            score: 78,
            kph: 4500,
            kpm: 75
        };
        
        container.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h2>Cross Reference Module</h2>
                <p>This module needs your cross-reference scenarios integrated.</p>
                <p>Simulating completion...</p>
            </div>
        `;
        
        setTimeout(() => {
            if (this.onComplete) {
                this.onComplete(finalResults);
            }
        }, 2000);
    }
};

// ===== MULTITASKING MODULE =====
const multitaskingModule = {
    name: "Multitasking",
    
    render(container, questionCount, onComplete) {
        this.onComplete = onComplete;
        
        const finalResults = {
            moduleId: 'multitasking',
            accuracy: 68,
            correctAnswers: Math.floor(questionCount * 0.68),
            totalQuestions: questionCount,
            score: 68,
            kph: 3800,
            kpm: 63
        };
        
        container.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h2>Multitasking Module</h2>
                <p>This module needs your multitasking logic integrated.</p>
                <p>Simulating completion...</p>
            </div>
        `;
        
        setTimeout(() => {
            if (this.onComplete) {
                this.onComplete(finalResults);
            }
        }, 2000);
    }
};

// Make all modules available globally
window.callSummarizationModule = callSummarizationModule;
window.mapReadingModule = mapReadingModule;
window.readingComprehensionModule = readingComprehensionModule;
window.memoryRecallModule = memoryRecallModule;
window.crossReferenceModule = crossReferenceModule;
window.multitaskingModule = multitaskingModule;
