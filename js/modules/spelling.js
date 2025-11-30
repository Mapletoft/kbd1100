// Spelling Module - Randomized word selection

const spellingModule = {
    name: "Spelling",
    selectedWords: [],
    currentWord: 0,
    results: {
        correct: 0,
        total: 0
    },

    init(questionCount) {
        this.selectedWords = getRandomQuestions(QuestionBank.spelling, questionCount);
        this.currentWord = 0;
        this.results = {
            correct: 0,
            total: questionCount
        };
    },

    render(container, questionCount, onComplete) {
        this.init(questionCount);
        this.onComplete = onComplete;
        this.container = container;
        this.showWord();
    },

    showWord() {
        if (this.currentWord >= this.selectedWords.length) {
            this.finish();
            return;
        }

        const wordData = this.selectedWords[this.currentWord];
        const wordNum = this.currentWord + 1;
        const total = this.selectedWords.length;

        // Create options: 1 correct + 3 incorrect
        const options = [wordData.word, ...wordData.incorrect];
        const shuffled = this.shuffleArray(options);

        this.container.innerHTML = `
            <div class="spelling-module">
                <div class="progress-indicator">
                    <p>Word ${wordNum} of ${total}</p>
                    <div class="progress-bar-slim">
                        <div class="progress-fill" style="width: ${(wordNum / total) * 100}%"></div>
                    </div>
                </div>

                <div class="word-question">
                    <h3>Select the correctly spelled word:</h3>
                    <div class="word-options">
                        ${shuffled.map((word, index) => `
                            <button onclick="spellingModule.selectWord('${word}')" class="word-option">
                                ${word}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>

            <style>
                .word-question {
                    text-align: center;
                    padding: 40px;
                }
                .word-question h3 {
                    font-size: 24px;
                    margin-bottom: 30px;
                    color: #2c3e50;
                }
                .word-options {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 20px;
                    max-width: 600px;
                    margin: 0 auto;
                }
                .word-option {
                    padding: 20px;
                    font-size: 20px;
                    background: white;
                    border: 3px solid #e0e0e0;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .word-option:hover {
                    border-color: #667eea;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
            </style>
        `;
    },

    selectWord(selectedWord) {
        const wordData = this.selectedWords[this.currentWord];
        const correct = selectedWord === wordData.word;

        if (correct) {
            this.results.correct++;
        }

        this.showFeedback(correct, wordData.word);
    },

    showFeedback(correct, correctWord) {
        const statusClass = correct ? 'success' : 'warning';
        const statusIcon = correct ? '✓' : '✗';

        this.container.innerHTML = `
            <div class="scenario-feedback ${statusClass}">
                <div class="feedback-header">
                    <h2>${statusIcon} ${correct ? 'Correct!' : 'Incorrect'}</h2>
                    <h3>The correct spelling is: <strong>${correctWord}</strong></h3>
                </div>

                <div class="module-actions">
                    <button onclick="spellingModule.nextWord()" class="primary-btn">
                        Next Word →
                    </button>
                </div>
            </div>
        `;
    },

    nextWord() {
        this.currentWord++;
        this.showWord();
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
            moduleId: 'spelling',
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

window.spellingModule = spellingModule;
