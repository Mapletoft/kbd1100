// MAP READING MODULE - Questions always match the displayed map!
const mapReadingModule = {
    name: "Map Reading",
    allMaps: [],
    currentMapIndex: 0,
    currentQuestionOnMap: 0,
    totalQuestionsAsked: 0,
    totalQuestionsNeeded: 0,
    questionsPerMap: 5,
    results: {
        correct: 0,
        total: 0,
        startTime: null
    },

    // Building types with colors
    buildingTypes: [
        { name: 'Hospital', color: '#ff6b6b', icon: 'H' },
        { name: 'Police', color: '#4dabf7', icon: 'P' },
        { name: 'Fire Station', color: '#ff8787', icon: 'F' },
        { name: 'School', color: '#ffd43b', icon: 'S' },
        { name: 'Mall', color: '#69db7c', icon: 'M' },
        { name: 'Library', color: '#da77f2', icon: 'L' },
        { name: 'Park', color: '#8ce99a', icon: 'PK' }
    ],

    init(questionCount) {
        this.totalQuestionsNeeded = questionCount;
        this.totalQuestionsAsked = 0;
        this.currentMapIndex = 0;
        this.currentQuestionOnMap = 0;
        
        // Calculate how many maps we need
        const mapsNeeded = Math.ceil(questionCount / this.questionsPerMap);
        
        // Generate all maps upfront with matching questions
        this.allMaps = [];
        for (let i = 0; i < mapsNeeded; i++) {
            this.allMaps.push(this.generateMapWithQuestions());
        }
        
        this.results = {
            correct: 0,
            total: questionCount,
            startTime: Date.now()
        };
    },

    render(container, questionCount, onComplete) {
        this.init(questionCount);
        this.onComplete = onComplete;
        this.container = container;
        this.showScenario();
    },

    generateMapWithQuestions() {
        // Generate map first
        const streetNames = ['Main St', 'Oak St', 'Elm St', 'Pine St'];
        const avenueNames = ['1st Ave', '2nd Ave', '3rd Ave', '4th Ave', '5th Ave', '6th Ave'];
        
        // Create random building positions
        const possiblePositions = [];
        for (let row = 1; row <= 7; row += 2) {  // Rows 1, 3, 5, 7
            for (let col = 1; col <= 6; col++) {  // Cols 1-6
                possiblePositions.push({ row, col });
            }
        }
        
        // Shuffle positions
        for (let i = possiblePositions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [possiblePositions[i], possiblePositions[j]] = [possiblePositions[j], possiblePositions[i]];
        }
        
        // Place buildings at random positions
        const buildingPositions = {};
        this.buildingTypes.forEach((building, index) => {
            if (index < possiblePositions.length) {
                buildingPositions[building.name] = possiblePositions[index];
            }
        });
        
        // Add random one-way streets
        const oneWayStreets = [];
        if (Math.random() > 0.5) {
            oneWayStreets.push({ street: 'Oak St', direction: 'north', row: 3, col: 1 });
        }
        if (Math.random() > 0.6) {
            oneWayStreets.push({ street: 'Elm St', direction: 'east', row: 5, cols: [2, 3, 4] });
        }
        
        const mapData = {
            streets: streetNames,
            avenues: avenueNames,
            buildingPositions: buildingPositions,
            oneWayStreets: oneWayStreets
        };
        
        // NOW generate questions based on THIS specific map
        mapData.questions = this.generateQuestionsForThisMap(mapData);
        
        return mapData;
    },

    generateQuestionsForThisMap(mapData) {
        const questions = [];
        const buildingsOnMap = Object.keys(mapData.buildingPositions);
        
        // Generate 5 questions using only buildings on THIS map
        for (let i = 0; i < this.questionsPerMap; i++) {
            // Pick two different buildings that are ON THIS MAP
            const start = buildingsOnMap[Math.floor(Math.random() * buildingsOnMap.length)];
            let end = buildingsOnMap[Math.floor(Math.random() * buildingsOnMap.length)];
            while (end === start) {
                end = buildingsOnMap[Math.floor(Math.random() * buildingsOnMap.length)];
            }
            
            const emergencyTypes = ['fire', 'medical emergency', 'accident', 'emergency call', 'incident'];
            const emergency = emergencyTypes[Math.floor(Math.random() * emergencyTypes.length)];
            
            const startPos = mapData.buildingPositions[start];
            const endPos = mapData.buildingPositions[end];
            
            // Calculate correct route
            const correctRoute = this.calculateRoute(startPos, endPos, mapData);
            
            // Generate wrong options
            const options = this.generateRouteOptions(correctRoute, startPos, endPos, mapData);
            
            questions.push({
                question: `Navigate from ${start} to ${emergency} at ${end}`,
                start: start,
                end: end,
                correctRoute: correctRoute,
                options: options
            });
        }
        
        return questions;
    },

    calculateRoute(startPos, endPos, mapData) {
        const streets = mapData.streets;
        const avenues = mapData.avenues;
        let parts = [];
        
        // Vertical movement
        if (startPos.row < endPos.row) {
            const targetStreet = streets[Math.floor(endPos.row / 2)];
            parts.push(`South on ${avenues[startPos.col - 1]} to ${targetStreet}`);
        } else if (startPos.row > endPos.row) {
            const targetStreet = streets[Math.floor(endPos.row / 2)];
            parts.push(`North on ${avenues[startPos.col - 1]} to ${targetStreet}`);
        }
        
        // Horizontal movement  
        if (startPos.col < endPos.col) {
            parts.push(`East to ${avenues[endPos.col - 1]}`);
        } else if (startPos.col > endPos.col) {
            parts.push(`West to ${avenues[endPos.col - 1]}`);
        }
        
        return parts.join(", then ");
    },

    generateRouteOptions(correctRoute, startPos, endPos, mapData) {
        const options = [correctRoute];
        const streets = mapData.streets;
        const avenues = mapData.avenues;
        
        // Generate 3 plausible wrong routes
        if (startPos.col !== endPos.col) {
            if (startPos.col < endPos.col) {
                options.push(`West on ${streets[Math.floor(startPos.row / 2)]}, then South`);
            } else {
                options.push(`East on ${streets[Math.floor(startPos.row / 2)]}, then North`);
            }
        }
        
        const wrongStreet = streets[(Math.floor(startPos.row / 2) + 1) % streets.length];
        options.push(`North on ${avenues[Math.min(startPos.col, avenues.length - 1)]} to ${wrongStreet}, then East`);
        
        options.push(`South to ${streets[Math.min(2, streets.length - 1)]}, West on ${avenues[0]}`);
        
        return options.slice(0, 4);
    },

    generateMapHTML(mapData) {
        // Build 9x8 grid
        const grid = [];
        for (let i = 0; i < 9; i++) {
            grid[i] = new Array(8).fill(null);
        }
        
        // Avenue labels (top and bottom)
        for (let col = 1; col <= 6; col++) {
            grid[0][col] = { type: 'label', text: mapData.avenues[col - 1] };
            grid[8][col] = { type: 'label', text: mapData.avenues[col - 1] };
        }
        
        // Street labels (left and right)
        const streetRows = [1, 3, 5, 7];
        streetRows.forEach((row, index) => {
            if (index < mapData.streets.length) {
                grid[row][0] = { type: 'label', text: mapData.streets[index] };
                grid[row][7] = { type: 'label', text: mapData.streets[index] };
            }
        });
        
        // Horizontal streets
        for (let col = 1; col <= 6; col++) {
            [1, 3, 5, 7].forEach(row => {
                if (!grid[row][col]) grid[row][col] = { type: 'street-h' };
            });
        }
        
        // Vertical avenues
        for (let row = 1; row <= 7; row++) {
            if (!grid[row][1] || grid[row][1].type === 'street-h') {
                grid[row][1] = { type: 'street-v' };
            }
        }
        
        // One-way markers
        mapData.oneWayStreets.forEach(oneWay => {
            if (oneWay.direction === 'north') {
                grid[oneWay.row][oneWay.col] = { type: 'street-v', arrow: '↑' };
            } else if (oneWay.direction === 'east' && oneWay.cols) {
                oneWay.cols.forEach(col => {
                    grid[oneWay.row][col] = { type: 'street-h', arrow: '→' };
                });
            }
        });
        
        // Place buildings
        this.buildingTypes.forEach(building => {
            const pos = mapData.buildingPositions[building.name];
            if (pos) {
                grid[pos.row][pos.col] = {
                    type: 'building',
                    name: building.name,
                    color: building.color,
                    icon: building.icon
                };
            }
        });
        
        // Generate HTML
        let html = '<div class="map-grid-new">';
        for (let row of grid) {
            for (let cell of row) {
                if (!cell) {
                    html += `<div class="map-cell empty"></div>`;
                } else if (cell.type === 'building') {
                    html += `<div class="map-cell building" style="background: ${cell.color};">
                        <div style="color: white; font-weight: bold; font-size: 16px;">${cell.icon}</div>
                        <div style="color: white; font-size: 9px; font-weight: bold;">${cell.name}</div>
                    </div>`;
                } else if (cell.type === 'street-h' || cell.type === 'street-v') {
                    const arrow = cell.arrow || '';
                    html += `<div class="map-cell ${cell.type}"><span style="color: red; font-size: 24px; font-weight: bold;">${arrow}</span></div>`;
                } else if (cell.type === 'label') {
                    html += `<div class="map-cell label">${cell.text}</div>`;
                }
            }
        }
        html += '</div>';
        
        return html + `
            <style>
                .map-grid-new {
                    display: grid;
                    grid-template-columns: repeat(8, 70px);
                    gap: 3px;
                    background: #ccc;
                    padding: 15px;
                    border-radius: 10px;
                    margin: 20px auto;
                    justify-content: center;
                    max-width: 650px;
                }
                .map-cell {
                    width: 70px;
                    height: 70px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: #f0f0f0;
                    border: 1px solid #999;
                    font-size: 11px;
                    text-align: center;
                }
                .map-cell.empty {
                    background: #e8e8e8;
                }
                .map-cell.street-h {
                    background: #606060 !important;
                }
                .map-cell.street-v {
                    background: #606060 !important;
                }
                .map-cell.building {
                    border: 3px solid #000 !important;
                    padding: 3px;
                }
                .map-cell.label {
                    background: white !important;
                    font-weight: bold;
                    color: #333;
                    font-size: 10px;
                    border: none;
                }
            </style>
        `;
    },

    showScenario() {
        if (this.totalQuestionsAsked >= this.totalQuestionsNeeded) {
            this.finish();
            return;
        }
        
        // Get current map and question
        const currentMap = this.allMaps[this.currentMapIndex];
        const question = currentMap.questions[this.currentQuestionOnMap];
        
        const scenarioNum = this.totalQuestionsAsked + 1;
        const total = this.totalQuestionsNeeded;
        const mapNum = this.currentMapIndex + 1;
        const questionOnMap = this.currentQuestionOnMap + 1;

        // Shuffle options and track correct answer
        const shuffledOptions = this.shuffleOptions(question.options);

        this.container.innerHTML = `
            <div class="map-reading-module">
                <div class="progress-indicator">
                    <p>Question ${scenarioNum} of ${total} | Map ${mapNum} (Q${questionOnMap}/5)</p>
                    <div class="progress-bar-slim">
                        <div class="progress-fill" style="width: ${(scenarioNum / total) * 100}%"></div>
                    </div>
                </div>

                <div class="map-scenario">
                    <h3>🗺️ ${question.question}</h3>
                    
                    ${this.generateMapHTML(currentMap)}
                    
                    <div class="map-legend" style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: center; margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                        ${this.buildingTypes.map(building => `
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div style="width: 24px; height: 24px; background: ${building.color}; border: 2px solid #000; border-radius: 3px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px;">${building.icon}</div>
                                <span style="font-size: 13px; font-weight: 500;">${building.name}</span>
                            </div>
                        `).join('')}
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="color: #ff0000; font-size: 24px; font-weight: bold;">↑→</span>
                            <span style="font-size: 13px; font-weight: 500;">One-way</span>
                        </div>
                    </div>

                    <h4 style="margin-top: 25px;">Select the best route:</h4>
                    <div class="route-options">
                        ${shuffledOptions.options.map((option, index) => `
                            <button onclick="mapReadingModule.selectRoute(${index})" class="route-option">
                                ${option}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>

            <style>
                .map-scenario {
                    background: #f8f9fa;
                    padding: 30px;
                    border-radius: 10px;
                    margin: 20px 0;
                }
                .map-scenario h3 {
                    color: #2c3e50;
                    margin-bottom: 20px;
                    text-align: center;
                }
                .route-options {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-top: 15px;
                }
                .route-option {
                    padding: 15px 20px;
                    text-align: left;
                    background: white;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 15px;
                }
                .route-option:hover {
                    border-color: #667eea;
                    background: #f8f9fa;
                    transform: translateY(-2px);
                }
            </style>
        `;
        
        this.correctRouteIndex = shuffledOptions.correctIndex;
    },

    shuffleOptions(options) {
        const newOptions = [...options];
        let correctIndex = 0;
        
        for (let i = newOptions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newOptions[i], newOptions[j]] = [newOptions[j], newOptions[i]];
            
            if (i === 0 && j !== 0) {
                correctIndex = j;
            } else if (correctIndex === i) {
                correctIndex = j;
            } else if (correctIndex === j) {
                correctIndex = i;
            }
        }
        
        return { options: newOptions, correctIndex: correctIndex };
    },

    selectRoute(selectedIndex) {
        const correct = selectedIndex === this.correctRouteIndex;
        if (correct) this.results.correct++;
        this.showFeedback(correct);
    },

    showFeedback(correct) {
        this.container.innerHTML = `
            <div class="scenario-feedback ${correct ? 'success' : 'warning'}">
                <div class="feedback-header">
                    <h2>${correct ? '✓ Correct Route!' : '! Review the Route'}</h2>
                </div>
                <div class="module-actions">
                    <button onclick="mapReadingModule.nextScenario()" class="primary-btn">
                        Next Scenario →
                    </button>
                </div>
            </div>
        `;
    },

    nextScenario() {
        this.totalQuestionsAsked++;
        this.currentQuestionOnMap++;
        
        // Move to next map after 5 questions
        if (this.currentQuestionOnMap >= this.questionsPerMap) {
            this.currentMapIndex++;
            this.currentQuestionOnMap = 0;
        }
        
        this.showScenario();
    },

    finish() {
        const accuracy = (this.results.correct / this.results.total) * 100;
        const finalResults = {
            moduleId: 'mapReading',
            accuracy: accuracy,
            correctAnswers: this.results.correct,
            totalQuestions: this.results.total,
            score: accuracy
        };
        if (this.onComplete) this.onComplete(finalResults);
    }
};

// CROSS REFERENCE MODULE - Full implementation
const crossReferenceModule = {
    name: "Cross Reference",
    questionBank: [
        {
            title: "License Verification",
            callerInfo: {
                name: "John Michael Smith",
                dob: "03/15/1985",
                license: "S1234-56789-85031",
                address: "123 Oak Street",
                phone: "705-555-1234"
            },
            databaseInfo: {
                name: "John Michael Smith",
                dob: "03/15/1985",
                license: "S1234-56789-85031",
                address: "123 Oak Street",
                phone: "705-555-1235"
            },
            discrepancy: "phone",
            question: "What information does NOT match?"
        },
        {
            title: "Warrant Check",
            callerInfo: {
                name: "Sarah Elizabeth Johnson",
                dob: "07/22/1992",
                license: "J5678-12345-92722",
                address: "456 Maple Avenue"
            },
            databaseInfo: {
                name: "Sarah Elizabeth Johnson",
                dob: "07/22/1992",
                license: "J5678-12345-92722",
                address: "456 Maple Drive"
            },
            discrepancy: "address",
            question: "Which field contains a discrepancy?"
        },
        {
            title: "Vehicle Registration",
            callerInfo: {
                name: "Michael Robert Chen",
                plate: "ABCD 123",
                vin: "1HGBH41JXMN109186",
                year: "2015",
                make: "Honda"
            },
            databaseInfo: {
                name: "Michael Robert Chen",
                plate: "ABCD 123",
                vin: "1HGBH41JXMN109186",
                year: "2016",
                make: "Honda"
            },
            discrepancy: "year",
            question: "What vehicle information doesn't match?"
        },
        {
            title: "Emergency Contact",
            callerInfo: {
                name: "Emily Rose Martinez",
                dob: "11/30/1988",
                address: "789 Pine Boulevard Apt 3B",
                emergency_contact: "Carlos Martinez",
                emergency_phone: "705-555-9876"
            },
            databaseInfo: {
                name: "Emily Rose Martinez",
                dob: "11/03/1988",
                address: "789 Pine Boulevard Apt 3B",
                emergency_contact: "Carlos Martinez",
                emergency_phone: "705-555-9876"
            },
            discrepancy: "dob",
            question: "Which piece of information is inconsistent?"
        },
        {
            title: "Perfect Match",
            callerInfo: {
                name: "David Lee Thompson",
                dob: "05/14/1979",
                license: "T2345-67890-79514",
                address: "321 Birch Lane"
            },
            databaseInfo: {
                name: "David Lee Thompson",
                dob: "05/14/1979",
                license: "T2345-67890-79514",
                address: "321 Birch Lane"
            },
            discrepancy: "none",
            question: "Do all fields match?"
        },
        {
            title: "DL Number Mismatch",
            callerInfo: {
                name: "Jennifer Ann Williams",
                dob: "09/08/1990",
                license: "W9876-54321-90908",
                address: "555 Cedar Court",
                phone: "705-555-4567"
            },
            databaseInfo: {
                name: "Jennifer Ann Williams",
                dob: "09/08/1990",
                license: "W9876-54322-90908",
                address: "555 Cedar Court",
                phone: "705-555-4567"
            },
            discrepancy: "license",
            question: "Which field has incorrect information?"
        },
        {
            title: "Name Spelling Difference",
            callerInfo: {
                name: "Christopher Alan MacDonald",
                dob: "12/25/1987",
                plate: "XYZ 789",
                address: "100 Highland Road"
            },
            databaseInfo: {
                name: "Christopher Alan McDonald",
                dob: "12/25/1987",
                plate: "XYZ 789",
                address: "100 Highland Road"
            },
            discrepancy: "name",
            question: "What doesn't match between records?"
        },
        {
            title: "VIN Verification",
            callerInfo: {
                name: "Angela Marie Foster",
                plate: "DEF 456",
                vin: "2T3BF4DV9BW123456",
                make: "Toyota",
                model: "RAV4"
            },
            databaseInfo: {
                name: "Angela Marie Foster",
                plate: "DEF 456",
                vin: "2T3BF4DV9BW123457",
                make: "Toyota",
                model: "RAV4"
            },
            discrepancy: "vin",
            question: "Which vehicle identifier is different?"
        },
        {
            title: "Complete Match",
            callerInfo: {
                name: "Robert James Peterson",
                dob: "04/17/1983",
                phone: "705-555-2468",
                address: "987 Oakwood Terrace",
                license: "P4567-89012-83417"
            },
            databaseInfo: {
                name: "Robert James Peterson",
                dob: "04/17/1983",
                phone: "705-555-2468",
                address: "987 Oakwood Terrace",
                license: "P4567-89012-83417"
            },
            discrepancy: "none",
            question: "Are there any discrepancies?"
        },
        {
            title: "Plate Number Error",
            callerInfo: {
                name: "Lisa Michelle Anderson",
                plate: "GHI 321",
                vin: "5TDZA23C77S123456",
                year: "2019",
                color: "Silver"
            },
            databaseInfo: {
                name: "Lisa Michelle Anderson",
                plate: "GHI 322",
                vin: "5TDZA23C77S123456",
                year: "2019",
                color: "Silver"
            },
            discrepancy: "plate",
            question: "Which field doesn't match?"
        },
        {
            title: "DOB Transposition",
            callerInfo: {
                name: "Thomas Edward Sullivan",
                dob: "08/12/1975",
                license: "S7890-12345-75812",
                address: "246 Willow Way"
            },
            databaseInfo: {
                name: "Thomas Edward Sullivan",
                dob: "08/21/1975",
                license: "S7890-12345-75812",
                address: "246 Willow Way"
            },
            discrepancy: "dob",
            question: "What information is inconsistent?"
        },
        {
            title: "Address Suffix Difference",
            callerInfo: {
                name: "Patricia Louise Grant",
                dob: "06/30/1991",
                address: "802 Riverside Drive",
                phone: "705-555-7890"
            },
            databaseInfo: {
                name: "Patricia Louise Grant",
                dob: "06/30/1991",
                address: "802 Riverside Court",
                phone: "705-555-7890"
            },
            discrepancy: "address",
            question: "Which field contains an error?"
        },
        {
            title: "Make vs Model Confusion",
            callerInfo: {
                name: "Kevin Scott Harris",
                plate: "JKL 654",
                make: "Ford",
                model: "F-150",
                year: "2018"
            },
            databaseInfo: {
                name: "Kevin Scott Harris",
                plate: "JKL 654",
                make: "Ford",
                model: "F-250",
                year: "2018"
            },
            discrepancy: "model",
            question: "What vehicle information is different?"
        },
        {
            title: "Phone Number Last Digit",
            callerInfo: {
                name: "Amanda Grace Turner",
                dob: "10/05/1986",
                phone: "705-555-3456",
                address: "159 Sunset Boulevard"
            },
            databaseInfo: {
                name: "Amanda Grace Turner",
                dob: "10/05/1986",
                phone: "705-555-3457",
                address: "159 Sunset Boulevard"
            },
            discrepancy: "phone",
            question: "Which field has a discrepancy?"
        },
        {
            title: "All Fields Match",
            callerInfo: {
                name: "Daniel Frank Morrison",
                dob: "02/14/1982",
                license: "M2345-67890-82214",
                address: "753 Mountain View Lane",
                plate: "MNO 987"
            },
            databaseInfo: {
                name: "Daniel Frank Morrison",
                dob: "02/14/1982",
                license: "M2345-67890-82214",
                address: "753 Mountain View Lane",
                plate: "MNO 987"
            },
            discrepancy: "none",
            question: "Is all information accurate?"
        }
    ],
    selectedScenarios: [],
    currentScenario: 0,
    results: {
        correct: 0,
        total: 0,
        totalKeystrokes: 0,
        startTime: null
    },

    init(questionCount) {
        this.selectedScenarios = getRandomQuestions(this.questionBank, questionCount);
        this.currentScenario = 0;
        this.results = {
            correct: 0,
            total: questionCount,
            totalKeystrokes: 0,
            startTime: Date.now()
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

        // Count keystrokes for data review
        const callerText = JSON.stringify(scenario.callerInfo);
        const dbText = JSON.stringify(scenario.databaseInfo);
        this.results.totalKeystrokes += callerText.length + dbText.length;

        this.container.innerHTML = `
            <div class="cross-reference-module">
                <div class="progress-indicator">
                    <p>Scenario ${scenarioNum} of ${total}</p>
                    <div class="progress-bar-slim">
                        <div class="progress-fill" style="width: ${(scenarioNum / total) * 100}%"></div>
                    </div>
                </div>

                <h3>🔍 ${scenario.title}</h3>
                <p style="color: #666; margin-bottom: 20px;">${scenario.question}</p>

                <div class="comparison-container">
                    <div class="data-panel">
                        <h4>📞 Caller Information</h4>
                        <div class="data-fields">
                            ${Object.entries(scenario.callerInfo).map(([key, value]) => `
                                <div class="data-field">
                                    <span class="field-label">${this.formatFieldName(key)}:</span>
                                    <span class="field-value">${value}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="data-panel">
                        <h4>💾 Database Information</h4>
                        <div class="data-fields">
                            ${Object.entries(scenario.databaseInfo).map(([key, value]) => `
                                <div class="data-field">
                                    <span class="field-label">${this.formatFieldName(key)}:</span>
                                    <span class="field-value">${value}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="discrepancy-options">
                    <h4>Select the discrepancy:</h4>
                    <div class="option-buttons">
                        ${Object.keys(scenario.callerInfo).map(field => `
                            <button onclick="crossReferenceModule.selectDiscrepancy('${field}')" class="discrepancy-btn">
                                ${this.formatFieldName(field)}
                            </button>
                        `).join('')}
                        <button onclick="crossReferenceModule.selectDiscrepancy('none')" class="discrepancy-btn" style="background: #d4edda; border-color: #c3e6cb;">
                            ✓ All Match
                        </button>
                    </div>
                </div>
            </div>

            <style>
                .comparison-container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin: 20px 0;
                }
                .data-panel {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 10px;
                }
                .data-panel h4 {
                    color: #2c3e50;
                    margin-bottom: 15px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #e0e0e0;
                }
                .data-fields {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .data-field {
                    background: white;
                    padding: 12px;
                    border-radius: 5px;
                    display: flex;
                    justify-content: space-between;
                }
                .field-label {
                    font-weight: bold;
                    color: #7f8c8d;
                }
                .field-value {
                    font-family: 'Courier New', monospace;
                    color: #2c3e50;
                }
                .discrepancy-options {
                    margin-top: 30px;
                }
                .option-buttons {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 10px;
                    margin-top: 15px;
                }
                .discrepancy-btn {
                    padding: 12px;
                    background: white;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .discrepancy-btn:hover {
                    border-color: #667eea;
                    transform: translateY(-2px);
                }
            </style>
        `;
    },

    formatFieldName(key) {
        const names = {
            name: "Name",
            dob: "Date of Birth",
            license: "Driver's License",
            address: "Address",
            phone: "Phone Number",
            plate: "License Plate",
            vin: "VIN",
            year: "Year",
            make: "Make",
            model: "Model",
            color: "Color",
            emergency_contact: "Emergency Contact",
            emergency_phone: "Emergency Phone"
        };
        return names[key] || key;
    },

    selectDiscrepancy(selectedField) {
        const scenario = this.selectedScenarios[this.currentScenario];
        const correct = selectedField === scenario.discrepancy;

        if (correct) {
            this.results.correct++;
        }

        this.showFeedback(correct, scenario, selectedField);
    },

    showFeedback(correct, scenario, selectedField) {
        const statusClass = correct ? 'success' : 'warning';
        const statusIcon = correct ? '✓' : '✗';

        this.container.innerHTML = `
            <div class="scenario-feedback ${statusClass}">
                <div class="feedback-header">
                    <h2>${statusIcon} ${correct ? 'Correct!' : 'Incorrect'}</h2>
                </div>

                <div class="feedback-details">
                    <div class="feedback-section">
                        <h4>Correct Answer:</h4>
                        <p><strong>${scenario.discrepancy === 'none' ? 'All fields match' : this.formatFieldName(scenario.discrepancy)}</strong></p>
                    </div>

                    ${!correct ? `
                        <div class="feedback-section">
                            <h4>You Selected:</h4>
                            <p>${selectedField === 'none' ? 'All fields match' : this.formatFieldName(selectedField)}</p>
                        </div>
                    ` : ''}

                    ${scenario.discrepancy !== 'none' ? `
                        <div class="feedback-section explanation">
                            <h4>The Discrepancy:</h4>
                            <p>Caller: <strong>${scenario.callerInfo[scenario.discrepancy]}</strong></p>
                            <p>Database: <strong>${scenario.databaseInfo[scenario.discrepancy]}</strong></p>
                        </div>
                    ` : ''}
                </div>

                <div class="module-actions">
                    <button onclick="crossReferenceModule.nextScenario()" class="primary-btn">
                        Next Scenario →
                    </button>
                </div>
            </div>
        `;
    },

    nextScenario() {
        this.currentScenario++;
        this.showScenario();
    },

    finish() {
        const endTime = Date.now();
        const timeUsed = (endTime - this.results.startTime) / 1000;
        const accuracy = (this.results.correct / this.results.total) * 100;

        // Calculate KPH
        const kpm = Math.round((this.results.totalKeystrokes / timeUsed) * 60);
        const kph = kpm * 60;

        const finalResults = {
            moduleId: 'crossReference',
            accuracy: accuracy,
            correctAnswers: this.results.correct,
            totalQuestions: this.results.total,
            score: accuracy,
            totalKeystrokes: this.results.totalKeystrokes,
            kph: kph,
            kpm: kpm
        };

        if (this.onComplete) {
            this.onComplete(finalResults);
        }
    }
};

// MULTITASKING MODULE - Full implementation
const multitaskingModule = {
    name: "Multitasking",
    callBank: [
        { id: 1, text: "Chest pain, difficulty breathing", priority: "high", service: "EMS" },
        { id: 2, text: "Suspicious person near school", priority: "medium", service: "Police" },
        { id: 3, text: "Noise complaint from neighbor", priority: "low", service: "Police" },
        { id: 4, text: "Structure fire, flames visible", priority: "high", service: "Fire" },
        { id: 5, text: "Traffic accident, injuries reported", priority: "high", service: "All" },
        { id: 6, text: "Lost pet report", priority: "low", service: "Police" },
        { id: 7, text: "Power lines down, sparking", priority: "high", service: "Fire/Utilities" },
        { id: 8, text: "Theft report from yesterday", priority: "low", service: "Police" },
        { id: 9, text: "Unresponsive person", priority: "high", service: "EMS" },
        { id: 10, text: "Loud party after midnight", priority: "medium", service: "Police" },
        { id: 11, text: "Gas odor in building", priority: "high", service: "Fire" },
        { id: 12, text: "Vehicle blocking driveway", priority: "low", service: "Police" },
        { id: 13, text: "Domestic disturbance, yelling heard", priority: "medium", service: "Police" },
        { id: 14, text: "Child fell from playground equipment", priority: "high", service: "EMS" },
        { id: 15, text: "Parking violation", priority: "low", service: "Police" },
        { id: 16, text: "Overdose, not breathing", priority: "high", service: "EMS" },
        { id: 17, text: "Smoke alarm activation", priority: "medium", service: "Fire" },
        { id: 18, text: "Request for police report", priority: "low", service: "Police" },
        { id: 19, text: "Armed robbery in progress", priority: "high", service: "Police" },
        { id: 20, text: "Water main break", priority: "medium", service: "Utilities" },
        { id: 21, text: "Heart attack symptoms", priority: "high", service: "EMS" },
        { id: 22, text: "Barking dog complaint", priority: "low", service: "Animal Control" },
        { id: 23, text: "Chemical spill on roadway", priority: "high", service: "Fire/Hazmat" },
        { id: 24, text: "Trespassing on property", priority: "medium", service: "Police" }
    ],
    state: null,
    container: null,
    onComplete: null,

    render(container, questionCount, onComplete) {
        this.container = container;
        this.onComplete = onComplete;
        
        this.state = {
            callQueue: [],
            correctPicks: 0,
            incorrectPicks: 0,
            callsHandled: 0,
            startTime: Date.now(),
            duration: questionCount * 5, // 5 seconds per "call"
            totalKeystrokes: 0
        };

        this.showInstructions();
    },

    showInstructions() {
        this.container.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h2>🎮 Multitasking Training</h2>
                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px auto; max-width: 600px; text-align: left;">
                    <h3>Instructions:</h3>
                    <ol style="padding-left: 20px;">
                        <li>Multiple emergency calls will appear</li>
                        <li>Click on the HIGHEST priority call first</li>
                        <li>Priority levels:
                            <ul>
                                <li><span style="background: #dc3545; color: white; padding: 2px 8px; border-radius: 3px;">HIGH</span> = Life-threatening emergencies</li>
                                <li><span style="background: #ffc107; color: black; padding: 2px 8px; border-radius: 3px;">MEDIUM</span> = Urgent but not life-threatening</li>
                                <li><span style="background: #28a745; color: white; padding: 2px 8px; border-radius: 3px;">LOW</span> = Routine calls</li>
                            </ul>
                        </li>
                        <li>New calls will appear as you work</li>
                        <li>Handle calls in correct priority order!</li>
                    </ol>
                </div>
                <button onclick="multitaskingModule.startSimulation()" class="primary-btn">
                    Start Simulation
                </button>
            </div>
        `;
    },

    startSimulation() {
        // Add initial calls
        this.addRandomCalls(3);
        this.renderUI();
        
        // Add new calls periodically
        this.state.addCallsInterval = setInterval(() => {
            if (this.state.callQueue.length < 6) {
                this.addRandomCalls(1);
                this.renderUI();
            }
        }, 6000);
        
        // Timer
        this.state.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.state.startTime) / 1000);
            const remaining = this.state.duration - elapsed;
            
            if (remaining <= 0) {
                this.finishSimulation();
                return;
            }
            
            const minutes = Math.floor(remaining / 60);
            const seconds = remaining % 60;
            const timeElement = document.getElementById('multitaskingTimer');
            if (timeElement) {
                timeElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    },

    addRandomCalls(count) {
        const available = this.callBank.filter(c => 
            !this.state.callQueue.find(q => q.id === c.id)
        );
        
        for (let i = 0; i < count && available.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * available.length);
            this.state.callQueue.push({...available[randomIndex]});
            this.state.totalKeystrokes += available[randomIndex].text.length;
            available.splice(randomIndex, 1);
        }
    },

    renderUI() {
        const initialMinutes = Math.floor(this.state.duration / 60);
        const initialSeconds = this.state.duration % 60;

        this.container.innerHTML = `
            <div style="display: flex; gap: 20px; min-height: 500px;">
                <div style="flex: 1; background: white; padding: 20px; border-radius: 10px; border: 2px solid #667eea;">
                    <h3 style="margin-bottom: 15px;">📞 Incoming Calls</h3>
                    <p style="color: #666; font-size: 14px; margin-bottom: 15px;">Click on the highest priority call first</p>
                    
                    <div id="callQueueContainer">
                        ${this.state.callQueue.map(call => {
                            const priorityColor = call.priority === 'high' ? '#dc3545' : call.priority === 'medium' ? '#ffc107' : '#28a745';
                            const priorityText = call.priority.toUpperCase();
                            return `
                                <div onclick="multitaskingModule.handleCall(${call.id})" style="background: #f8f9fa; padding: 15px; margin: 10px 0; border-left: 5px solid ${priorityColor}; border-radius: 5px; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.background='#e9ecef'" onmouseout="this.style.background='#f8f9fa'">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                                        <strong>Call #${call.id}</strong>
                                        <span style="background: ${priorityColor}; color: ${call.priority === 'medium' ? 'black' : 'white'}; padding: 3px 10px; border-radius: 3px; font-size: 12px; font-weight: bold;">${priorityText}</span>
                                    </div>
                                    <p style="margin: 5px 0; font-size: 14px;">${call.text}</p>
                                </div>
                            `;
                        }).join('') || '<p style="color: #999; text-align: center; padding: 40px 0;">No calls in queue</p>'}
                    </div>
                </div>
                
                <div style="width: 250px; background: white; padding: 20px; border-radius: 10px; border: 2px solid #28a745;">
                    <h3 style="margin-bottom: 15px;">📊 Performance</h3>
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
                        <div style="font-size: 14px; color: #666;">Time Remaining</div>
                        <div id="multitaskingTimer" style="font-size: 32px; font-weight: bold; color: #007bff;">${initialMinutes}:${initialSeconds.toString().padStart(2, '0')}</div>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 10px;">
                        <div style="font-size: 14px; color: #666;">Calls Handled</div>
                        <div style="font-size: 28px; font-weight: bold; color: #007bff;">${this.state.callsHandled}</div>
                    </div>
                    
                    <div style="background: #d4edda; padding: 15px; border-radius: 5px; margin-bottom: 10px;">
                        <div style="font-size: 14px; color: #155724;">✓ Correct Priority</div>
                        <div style="font-size: 28px; font-weight: bold; color: #28a745;">${this.state.correctPicks}</div>
                    </div>
                    
                    <div style="background: #f8d7da; padding: 15px; border-radius: 5px;">
                        <div style="font-size: 14px; color: #721c24;">✗ Wrong Priority</div>
                        <div style="font-size: 28px; font-weight: bold; color: #dc3545;">${this.state.incorrectPicks}</div>
                    </div>
                </div>
            </div>
        `;
    },

    handleCall(callId) {
        const call = this.state.callQueue.find(c => c.id === callId);
        if (!call) return;
        
        // Check if this was the highest priority call
        const priorities = { high: 3, medium: 2, low: 1 };
        const callPriority = priorities[call.priority];
        const highestPriority = Math.max(...this.state.callQueue.map(c => priorities[c.priority]));
        
        const correct = callPriority === highestPriority;
        
        if (correct) {
            this.state.correctPicks++;
        } else {
            this.state.incorrectPicks++;
        }
        
        this.state.callsHandled++;
        
        // Remove call from queue
        this.state.callQueue = this.state.callQueue.filter(c => c.id !== callId);
        
        // Re-render
        this.renderUI();
    },

    finishSimulation() {
        clearInterval(this.state.addCallsInterval);
        clearInterval(this.state.timerInterval);
        
        const endTime = Date.now();
        const timeUsed = (endTime - this.state.startTime) / 1000;
        
        const totalPicks = this.state.correctPicks + this.state.incorrectPicks;
        const accuracy = totalPicks > 0 ? (this.state.correctPicks / totalPicks) * 100 : 0;
        
        // Calculate KPH
        const kpm = Math.round((this.state.totalKeystrokes / timeUsed) * 60);
        const kph = kpm * 60;
        
        const finalResults = {
            moduleId: 'multitasking',
            accuracy: accuracy,
            correctAnswers: this.state.correctPicks,
            totalQuestions: totalPicks,
            score: accuracy,
            totalKeystrokes: this.state.totalKeystrokes,
            kph: kph,
            kpm: kpm
        };
        
        if (this.onComplete) {
            this.onComplete(finalResults);
        }
    }
};

// Make modules available globally
window.mapReadingModule = mapReadingModule;
window.crossReferenceModule = crossReferenceModule;
window.multitaskingModule = multitaskingModule;
