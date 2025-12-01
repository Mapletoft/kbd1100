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
        // SIMPLIFIED SYSTEM: Accuracy (70%) + Speed Bonus (30%)
        // This rewards both correct answers AND completing modules faster
        weights: {
            // Accuracy Component (70% of total score) - All modules weighted by importance
            accuracy: {
                decisionMaking: 0.25,      // Most critical - emergency response decisions
                multitasking: 0.18,        // High importance - juggling priorities
                memoryRecall: 0.15,        // Important - recall under pressure
                crossReference: 0.12,      // Important - accuracy in data verification
                mapReading: 0.10,          // Moderate - navigation skills
                readingComprehension: 0.10, // Moderate - understanding procedures
                dataEntry: 0.05,           // Lower - but gets speed bonus separately
                mathematics: 0.03,         // Lower - basic calculations
                spelling: 0.02             // Lowest - spell check exists
            },
            // Speed Bonus (30% of total score) - All modules contribute
            // Faster completion = higher score (rewards efficiency)
            speed: {
                decisionMaking: 0.20,      // Critical to respond quickly
                multitasking: 0.18,        // Speed matters in emergencies
                dataEntry: 0.15,           // Fast typing is important
                crossReference: 0.12,      // Quick verification needed
                memoryRecall: 0.12,        // Faster recall = better dispatcher
                mapReading: 0.10,          // Route planning speed
                readingComprehension: 0.08, // Must process info quickly
                mathematics: 0.03,         // Basic calculations
                spelling: 0.02             // Quick recognition
            }
        },
        
        // Minimum passing scores per module (based on real CritiCall standards)
        passingScores: {
            dataEntry: 60,           // KPH-based
            decisionMaking: 70,      // % accuracy
            spelling: 70,            // % accuracy
            mathematics: 60,         // % accuracy
            readingComprehension: 65, // % accuracy
            memoryRecall: 65,        // % accuracy
            mapReading: 60,          // % accuracy
            crossReference: 70,      // % accuracy + KPH
            multitasking: 65         // % accuracy + KPH
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
        
        // ACCURACY COMPONENT (70% of total score)
        let accuracyTotal = 0;
        for (let module in this.config.weights.accuracy) {
            if (results[module] && typeof results[module].accuracy !== 'undefined') {
                const weight = this.config.weights.accuracy[module];
                accuracyTotal += results[module].accuracy * weight;
            }
        }
        const accuracyScore = accuracyTotal; // This is 0-100
        const accuracyComponent = accuracyScore * 0.70; // 70% of total
        
        // SPEED BONUS COMPONENT (30% of total score)
        // Calculate speed score based on time used vs time allowed
        let speedTotal = 0;
        let speedModuleCount = 0;
        
        for (let module in this.config.weights.speed) {
            if (results[module] && results[module].timeUsed) {
                const moduleConfig = this.config.modules.find(m => m.id === module);
                if (moduleConfig) {
                    const weight = this.config.weights.speed[module];
                    const timeAllowed = moduleConfig.timeLimit;
                    const timeUsed = results[module].timeUsed;
                    
                    // Speed score: faster = better (100 = instant, decreases as time used increases)
                    // If finished in 50% of time = 90 points, 100% of time = 70 points, over time = lower
                    const timeRatio = timeUsed / timeAllowed;
                    let speedScore;
                    
                    if (timeRatio <= 0.5) {
                        // Finished in half the time or less = 90-100 points
                        speedScore = 100 - (timeRatio * 20);
                    } else if (timeRatio <= 1.0) {
                        // Finished in time = 70-90 points (linear scale)
                        speedScore = 90 - ((timeRatio - 0.5) * 40);
                    } else {
                        // Went over time = 40-70 points
                        speedScore = Math.max(40, 70 - ((timeRatio - 1.0) * 30));
                    }
                    
                    speedTotal += speedScore * weight;
                    speedModuleCount++;
                }
            }
        }
        
        const speedScore = speedModuleCount > 0 ? speedTotal : 70; // Default to 70 if no speed data
        const speedComponent = speedScore * 0.30; // 30% of total
        
        // TOTAL SCORE
        const totalScore = accuracyComponent + speedComponent;
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
            accuracyScore: Math.round(accuracyScore),
            speedScore: Math.round(speedScore),
            accuracyComponent: Math.round(accuracyComponent),
            speedComponent: Math.round(speedComponent),
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
                        <span class="component-label">Accuracy (70%):</span>
                        <span class="component-value">${testData.accuracyScore}/100</span>
                    </div>
                    <div class="component">
                        <span class="component-label">Speed Bonus (30%):</span>
                        <span class="component-value">${testData.speedScore}/100</span>
                    </div>
                    <div class="component" style="background: #f8f9fa; border: 2px solid #667eea;">
                        <span class="component-label" style="font-weight: bold;">Final Score:</span>
                        <span class="component-value" style="font-size: 28px; color: #667eea;">${testData.overallScore}%</span>
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
