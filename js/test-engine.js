// CritiCall Test Engine - Manages overall test flow, timing, and scoring

const CritiCallTestEngine = {
    // Test configuration
    config: {
        modules: [
            { id: 'dataEntry', name: 'Data Entry', timeLimit: 300, questionCount: 12 },
            { id: 'decisionMaking', name: 'Decision Making', timeLimit: 1800, questionCount: 35 },
            { id: 'spelling', name: 'Spelling', timeLimit: 600, questionCount: 50 },
            { id: 'mathematics', name: 'Mathematics', timeLimit: 900, questionCount: 25 },
            { id: 'readingComprehension', name: 'Reading Comprehension', timeLimit: 1200, questionCount: 6 },
            { id: 'memoryRecall', name: 'Memory Recall', timeLimit: 900, questionCount: 5 },
            { id: 'mapReading', name: 'Map Reading', timeLimit: 900, questionCount: 12 },
            { id: 'crossReference', name: 'Cross Reference', timeLimit: 600, questionCount: 15 },
            { id: 'multitasking', name: 'Multitasking', timeLimit: 1500, questionCount: 12 }
        ],
        
        // Module weights for overall scoring
        weights: {
            // KPH Component (40% of total score)
            kph: {
                dataEntry: 0.33,
                crossReference: 0.33,
                multitasking: 0.34
            },
            // WPM Component (20% of total score)
            wpm: {
                dataEntry: 0.50,
                callSummarization: 0.50
            },
            // Accuracy Component (40% of total score)
            accuracy: {
                decisionMaking: 0.20,
                callSummarization: 0.15,
                memoryRecall: 0.15,
                multitasking: 0.18,
                crossReference: 0.10,
                mapReading: 0.08,
                readingComprehension: 0.08,
                spelling: 0.03,
                mathematics: 0.03
            }
        },
        
        // Minimum passing scores per module
        passingScores: {
            dataEntry: 60, // KPM
            decisionMaking: 70, // %
            callSummarization: 65, // %
            mapReading: 60, // %
            readingComprehension: 65, // %
            spelling: 70, // %
            mathematics: 60, // %
            memoryRecall: 65, // %
            crossReference: 70, // %
            multitasking: 65 // %
        },
        
        overallPassingScore: 70
    },

    // Current test state
    state: {
        testId: null,
        startTime: null,
        currentModuleIndex: 0,
        moduleResults: {},
        timerInterval: null,
        timeRemaining: 0,
        testInProgress: false
    },

    // Initialize test
    init() {
        this.state.testId = this.generateTestId();
        this.state.startTime = new Date();
        this.state.currentModuleIndex = 0;
        this.state.moduleResults = {};
        this.state.testInProgress = true;
        
        console.log('Test initialized:', this.state.testId);
    },

    // Generate unique test ID
    generateTestId() {
        return 'test_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    // Start the test
    startTest() {
        this.init();
        this.loadModule(0);
        this.updateProgressBar();
    },

    // Load a specific module by index
    loadModule(index) {
        if (index >= this.config.modules.length) {
            this.completeTest();
            return;
        }

        this.state.currentModuleIndex = index;
        const module = this.config.modules[index];
        
        console.log('Loading module:', module.name);
        
        // Clear previous content
        const moduleContent = document.getElementById('moduleContent');
        if (moduleContent) {
            moduleContent.innerHTML = '';
        }

        // Show module intro screen
        this.showModuleIntro(module);
    },

    // Show intro screen before each module
    showModuleIntro(module) {
        const introHTML = `
            <div class="module-intro">
                <h2>${module.name}</h2>
                <div class="module-info">
                    <p><strong>Time Limit:</strong> ${this.formatTime(module.timeLimit)}</p>
                    <p><strong>Questions:</strong> ${module.questionCount}</p>
                    <p class="module-instructions">
                        ${this.getModuleInstructions(module.id)}
                    </p>
                </div>
                <div class="intro-buttons">
                    <button onclick="CritiCallTestEngine.beginModule()" class="primary-btn">
                        Begin Module
                    </button>
                </div>
            </div>
        `;

        document.getElementById('moduleContent').innerHTML = introHTML;
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('testContainer').style.display = 'block';
    },

    // Get instructions for specific module
    getModuleInstructions(moduleId) {
        const instructions = {
            dataEntry: 'Enter caller information accurately and quickly. You will be timed on both speed and accuracy.',
            decisionMaking: 'Read each scenario and determine which emergency services should respond and the priority level.',
            callSummarization: 'Listen to emergency calls and answer questions about key details. Audio plays only once.',
            mapReading: 'Using the map provided, determine the best route for emergency responders.',
            readingComprehension: 'Read passages about emergency procedures and answer comprehension questions.',
            spelling: 'Select the correctly spelled word from the options provided.',
            mathematics: 'Solve math problems related to emergency dispatch scenarios.',
            memoryRecall: 'Memorize information that will be shown briefly, then answer questions from memory.',
            crossReference: 'Compare information from different sources and identify discrepancies.',
            multitasking: 'Handle multiple emergency calls simultaneously while maintaining accuracy.'
        };
        return instructions[moduleId] || 'Complete the module to the best of your ability.';
    },

    // Begin the actual module (after intro)
    beginModule() {
        const module = this.config.modules[this.state.currentModuleIndex];
        
        // Start timer
        this.state.timeRemaining = module.timeLimit;
        this.startTimer();

        // Load module content based on type
        this.loadModuleContent(module);
    },

    // Load module-specific content
    loadModuleContent(module) {
        // This will call the appropriate module's render function
        const moduleId = module.id;
        
        // Modules will be loaded from separate files
        // For now, placeholder that will be replaced with actual module
        if (window[`${moduleId}Module`] && window[`${moduleId}Module`].render) {
            window[`${moduleId}Module`].render(
                document.getElementById('moduleContent'),
                module.questionCount,
                (results) => this.completeModule(results)
            );
        } else {
            console.error('Module not found:', moduleId);
        }
    },

    // Start countdown timer
    startTimer() {
        this.stopTimer(); // Clear any existing timer
        
        this.timerInterval = setInterval(() => {
            this.state.timeRemaining--;
            this.updateTimerDisplay();

            if (this.state.timeRemaining <= 0) {
                this.timeExpired();
            }
        }, 1000);
    },

    // Stop timer
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    },

    // Update timer display
    updateTimerDisplay() {
        const display = document.getElementById('timerDisplay');
        if (display) {
            const minutes = Math.floor(this.state.timeRemaining / 60);
            const seconds = this.state.timeRemaining % 60;
            
            let timerClass = '';
            if (this.state.timeRemaining <= 60) {
                timerClass = 'timer-critical';
            } else if (this.state.timeRemaining <= 300) {
                timerClass = 'timer-warning';
            }
            
            display.innerHTML = `
                <div class="timer ${timerClass}">
                    <span class="timer-label">Time Remaining:</span>
                    <span class="timer-value">${minutes}:${seconds.toString().padStart(2, '0')}</span>
                </div>
            `;
        }
    },

    // Handle time expiration
    timeExpired() {
        this.stopTimer();
        alert('Time expired for this module. Moving to next module.');
        
        // Auto-submit current module with partial results
        const currentModule = this.config.modules[this.state.currentModuleIndex];
        
        // Get partial results if module has a getResults function
        let partialResults = {
            moduleId: currentModule.id,
            timeUsed: currentModule.timeLimit,
            timeExpired: true,
            score: 0,
            accuracy: 0
        };
        
        this.completeModule(partialResults);
    },

    // Complete current module and move to next
    completeModule(results) {
        this.stopTimer();
        
        const module = this.config.modules[this.state.currentModuleIndex];
        
        // Calculate time used
        const timeUsed = module.timeLimit - this.state.timeRemaining;
        results.timeUsed = timeUsed;
        results.timeLimit = module.timeLimit;
        results.moduleId = module.id;
        results.moduleName = module.name;
        
        // Calculate KPH if applicable
        if (['dataEntry', 'crossReference', 'multitasking'].includes(module.id)) {
            if (results.totalKeystrokes) {
                results.kpm = Math.round((results.totalKeystrokes / timeUsed) * 60);
                results.kph = results.kpm * 60;
            }
        }
        
        // Calculate WPM if applicable
        if (['dataEntry', 'callSummarization'].includes(module.id)) {
            if (results.totalWords) {
                results.wpm = Math.round((results.totalWords / timeUsed) * 60);
            }
        }
        
        // Determine pass/fail for module
        const passingScore = this.config.passingScores[module.id];
        if (['dataEntry', 'crossReference', 'multitasking'].includes(module.id)) {
            results.passed = results.kpm >= passingScore;
        } else {
            results.passed = results.accuracy >= passingScore;
        }
        
        // Store results
        this.state.moduleResults[module.id] = results;
        
        console.log('Module completed:', module.name, results);
        
        // Move to next module
        this.state.currentModuleIndex++;
        this.updateProgressBar();
        
        // Short delay before loading next module
        setTimeout(() => {
            this.loadModule(this.state.currentModuleIndex);
        }, 1000);
    },

    // Update progress bar
    updateProgressBar() {
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            const totalModules = this.config.modules.length;
            const completed = this.state.currentModuleIndex;
            const percentage = (completed / totalModules) * 100;
            
            progressBar.innerHTML = `
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="progress-text">
                        Module ${completed} of ${totalModules} Complete
                    </div>
                </div>
            `;
        }
    },

    // Complete entire test
    completeTest() {
        this.state.testInProgress = false;
        const endTime = new Date();
        const totalTime = Math.floor((endTime - this.state.startTime) / 1000);
        
        // Calculate overall score
        const overallScore = this.calculateOverallScore();
        
        // Prepare test submission
        const testSubmission = {
            testId: this.state.testId,
            timestamp: firebase.firestore.Timestamp.now(),
            startTime: this.state.startTime,
            endTime: endTime,
            totalTimeSeconds: totalTime,
            ...overallScore,
            modules: this.state.moduleResults
        };
        
        // Submit to Firebase
        this.submitTestToFirebase(testSubmission);
        
        // Show results
        this.showResults(testSubmission);
    },

    // Calculate overall weighted score
    calculateOverallScore() {
        const results = this.state.moduleResults;
        
        // KPH Component (40%)
        let kphTotal = 0;
        let kphCount = 0;
        for (let module in this.config.weights.kph) {
            if (results[module] && results[module].kph) {
                const weight = this.config.weights.kph[module];
                const score = Math.min(100, (results[module].kph / 3600) * 100);
                kphTotal += score * weight;
                kphCount++;
            }
        }
        const kphScore = kphCount > 0 ? kphTotal : 0;
        const kphComponent = kphScore * 0.40;
        
        // WPM Component (20%)
        let wpmTotal = 0;
        let wpmCount = 0;
        for (let module in this.config.weights.wpm) {
            if (results[module] && results[module].wpm) {
                const weight = this.config.weights.wpm[module];
                const score = Math.min(100, (results[module].wpm / 35) * 100);
                wpmTotal += score * weight;
                wpmCount++;
            }
        }
        const wpmScore = wpmCount > 0 ? wpmTotal : 0;
        const wpmComponent = wpmScore * 0.20;
        
        // Accuracy Component (40%)
        let accuracyTotal = 0;
        for (let module in this.config.weights.accuracy) {
            if (results[module] && typeof results[module].accuracy !== 'undefined') {
                const weight = this.config.weights.accuracy[module];
                accuracyTotal += results[module].accuracy * weight;
            }
        }
        const accuracyScore = accuracyTotal;
        const accuracyComponent = accuracyScore * 0.40;
        
        // Total score
        const totalScore = kphComponent + wpmComponent + accuracyComponent;
        const passed = totalScore >= this.config.overallPassingScore;
        
        // Check if passed all individual modules
        let allModulesPassed = true;
        for (let module in results) {
            if (!results[module].passed) {
                allModulesPassed = false;
                break;
            }
        }
        
        return {
            overallScore: Math.round(totalScore),
            kphScore: Math.round(kphScore),
            wpmScore: Math.round(wpmScore),
            accuracyScore: Math.round(accuracyScore),
            passed: passed && allModulesPassed,
            allModulesPassed: allModulesPassed
        };
    },

    // Submit test to Firebase
    async submitTestToFirebase(testData) {
        try {
            const user = auth.currentUser;
            if (!user) {
                console.error('No user logged in');
                return;
            }

            // Add user info
            testData.userId = user.uid;
            testData.studentEmail = user.email;
            
            // Get attempt number
            const previousAttempts = await db.collection('testSubmissions')
                .doc(user.uid)
                .collection('tests')
                .get();
            
            testData.attemptNumber = previousAttempts.size + 1;

            // Submit to Firestore
            await db.collection('testSubmissions')
                .doc(user.uid)
                .collection('tests')
                .doc(this.state.testId)
                .set(testData);

            console.log('Test submitted successfully');
            
            // Update class statistics
            await this.updateClassStats(testData);
            
        } catch (error) {
            console.error('Error submitting test:', error);
            alert('Error submitting test. Results saved locally.');
        }
    },

    // Update class statistics
    async updateClassStats(testData) {
        try {
            const statsRef = db.collection('classStats').doc('KBD1100');
            
            await db.runTransaction(async (transaction) => {
                const statsDoc = await transaction.get(statsRef);
                
                let stats = statsDoc.exists ? statsDoc.data() : {
                    totalAttempts: 0,
                    uniqueStudents: new Set(),
                    totalScore: 0,
                    passCount: 0,
                    moduleAverages: {}
                };
                
                stats.totalAttempts++;
                stats.uniqueStudents.add(testData.userId);
                stats.totalScore += testData.overallScore;
                if (testData.passed) stats.passCount++;
                
                // Update module averages
                for (let module in testData.modules) {
                    if (!stats.moduleAverages[module]) {
                        stats.moduleAverages[module] = { total: 0, count: 0 };
                    }
                    stats.moduleAverages[module].total += testData.modules[module].accuracy || 0;
                    stats.moduleAverages[module].count++;
                }
                
                stats.lastUpdated = firebase.firestore.Timestamp.now();
                stats.uniqueStudentCount = stats.uniqueStudents.size;
                
                transaction.set(statsRef, stats);
            });
            
        } catch (error) {
            console.error('Error updating stats:', error);
        }
    },

    // Show results screen
    showResults(testData) {
        document.getElementById('testContainer').style.display = 'none';
        document.getElementById('resultsScreen').style.display = 'block';
        
        const resultsHTML = this.generateResultsHTML(testData);
        document.getElementById('resultsContent').innerHTML = resultsHTML;
    },

    // Generate results HTML
    generateResultsHTML(testData) {
        const passFailIcon = testData.passed ? '✓' : '✗';
        const passFailClass = testData.passed ? 'passed' : 'failed';
        const passFailText = testData.passed ? 'PASSED' : 'FAILED';
        
        let html = `
            <div class="results-header ${passFailClass}">
                <h1>${passFailIcon} ${passFailText}</h1>
                <h2>Overall Score: ${testData.overallScore}%</h2>
                <p>Test Date: ${new Date(testData.timestamp.toDate()).toLocaleString()}</p>
                <p>Duration: ${this.formatTime(testData.totalTimeSeconds)}</p>
                <p>Attempt #${testData.attemptNumber}</p>
            </div>
            
            <div class="score-breakdown">
                <h3>Score Components</h3>
                <div class="components">
                    <div class="component">
                        <span class="component-label">KPH (40%):</span>
                        <span class="component-value">${testData.kphScore}/100</span>
                    </div>
                    <div class="component">
                        <span class="component-label">WPM (20%):</span>
                        <span class="component-value">${testData.wpmScore}/100</span>
                    </div>
                    <div class="component">
                        <span class="component-label">Accuracy (40%):</span>
                        <span class="component-value">${testData.accuracyScore}/100</span>
                    </div>
                </div>
            </div>
            
            <div class="module-results">
                <h3>Module Performance</h3>
                <table class="results-table">
                    <thead>
                        <tr>
                            <th>Module</th>
                            <th>Score</th>
                            <th>Status</th>
                            <th>Time</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        for (let module of this.config.modules) {
            const result = testData.modules[module.id];
            if (result) {
                const statusIcon = result.passed ? '✓' : '✗';
                const statusClass = result.passed ? 'pass' : 'fail';
                
                let scoreDisplay = `${Math.round(result.accuracy)}%`;
                if (result.kpm) scoreDisplay += ` (${result.kpm} KPM)`;
                if (result.wpm) scoreDisplay += ` (${result.wpm} WPM)`;
                
                let details = '';
                if (result.correctAnswers !== undefined) {
                    details = `${result.correctAnswers}/${result.totalQuestions} correct`;
                }
                if (result.kph) {
                    details += details ? `, ${result.kph} KPH` : `${result.kph} KPH`;
                }
                
                html += `
                    <tr>
                        <td>${module.name}</td>
                        <td>${scoreDisplay}</td>
                        <td class="${statusClass}">${statusIcon}</td>
                        <td>${Math.floor(result.timeUsed / 60)}:${(result.timeUsed % 60).toString().padStart(2, '0')}</td>
                        <td>${details}</td>
                    </tr>
                `;
            }
        }
        
        html += `
                    </tbody>
                </table>
            </div>
            
            <div class="results-actions">
                <button onclick="CritiCallTestEngine.viewHistory()" class="secondary-btn">
                    View All Attempts
                </button>
                <button onclick="CritiCallTestEngine.retakeTest()" class="primary-btn">
                    Retake Test
                </button>
                <button onclick="window.location.href='index.html'" class="secondary-btn">
                    Return to Dashboard
                </button>
            </div>
        `;
        
        return html;
    },

    // Format seconds to readable time
    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m ${secs}s`;
        }
    },

    // View test history
    async viewHistory() {
        // This will show all previous attempts
        // Implementation depends on your UI preferences
        alert('Test history feature - to be implemented based on UI preferences');
    },

    // Retake test
    retakeTest() {
        if (confirm('Are you sure you want to retake the test? This will start a new attempt.')) {
            window.location.reload();
        }
    }
};

// Make available globally
window.CritiCallTestEngine = CritiCallTestEngine;
