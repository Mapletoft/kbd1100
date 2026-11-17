// VIN/License Entry Module - 3 sub-exercises under one practice menu: VIN
// entry, Ontario license number entry, and DOB/gender extraction from a
// license number's internal encoding. Ported from criticall.html's
// original inline implementation, which had 3 confirmed bugs fixed here:
//
// 1. DOB Extraction crashed immediately on open: it called .map() directly
//    on an Array iterator (Array(40).keys()), which has no .map() method -
//    only real Arrays do. Fixed by spreading the iterator into an array
//    first.
// 2. License Entry's live dash-auto-formatter inserted the second dash
//    after 10 raw characters (assuming 5-5-5 character groups), but the
//    real generated format is 5-4-6 (letter+4 digits, then 4 more digits,
//    then the 6-digit encoded DOB) - so a perfectly-typed answer, entered
//    through the formatter as intended, NEVER matched the stored answer.
//    Fixed the formatter's group sizes, and also made grading strip
//    dashes/case before comparing so a formatter bug can't silently fail
//    every attempt again in the future.
// 3. VIN practice only ever showed the first 5 of the 10 defined VINs, in
//    the same fixed order every time - the other 5 were dead content.
//    Fixed by randomly selecting from the full pool (now expanded to 15)
//    with js/audio-player.js's pickRandomScenarios, same as every other
//    module with a bigger-than-needed pool.

const vinNumbers = [
    "1HGBH41JXMN109186", "2G1WF52E059246031", "JH4KA8260MC000000",
    "WBAVM1C50EVW48592", "1FTFW1ET5DFC10312", "5YJSA1DN5CFP01785",
    "1FMCU0F70AUA27450", "3GNDA13D76S000000", "5TDZA23C88S000000",
    "1G1ZT54806F109149", "4T1BF1FK3KU123456", "2T3BF4DV9BW123457",
    "KNDJT2A24A7123456", "3FA6P0HD5ER123456", "1C4RJFAG2FC123456"
];

// Generates a license number with the DOB/gender encoded in its last 6
// digits, format: <first letter of last name><4 random digits>-<4 random
// digits>-<YYMMDD>. Gender is encoded by adding 50 to the month for females.
function generateLicenseNumber(lastName, birthYear, birthMonth, birthDay, isFemale) {
    const letter = lastName.charAt(0).toUpperCase();
    const year = birthYear.toString().slice(-2);
    const month = isFemale ? (parseInt(birthMonth) + 50).toString().padStart(2, '0') : birthMonth.padStart(2, '0');
    const day = birthDay.padStart(2, '0');
    const dob = year + month + day;

    const part1 = Math.floor(1000 + Math.random() * 9000);
    const part2 = Math.floor(1000 + Math.random() * 9000);
    const license = `${letter}${part1}-${part2}-${dob}`;

    // 00-25 = 20XX, 26-99 = 19XX
    const yearNum = parseInt(year);
    const fullYear = yearNum <= 25 ? "20" + year : "19" + year;

    return {
        license: license,
        year: fullYear,
        month: birthMonth.padStart(2, '0'),
        day: day,
        gender: isFemale ? "Female" : "Male"
    };
}

function extractDobFromLicense(license) {
    const digitsOnly = license.replace(/[^0-9]/g, '');
    const last6 = digitsOnly.slice(-6);
    if (last6.length !== 6) return null;

    const year = last6.substring(0, 2);
    const month = last6.substring(2, 4);
    const day = last6.substring(4, 6);

    const monthNum = parseInt(month);
    const isFemale = monthNum > 50;
    const actualMonth = isFemale ? monthNum - 50 : monthNum;

    const yearNum = parseInt(year);
    const fullYear = yearNum <= 25 ? "20" + year : "19" + year;

    return {
        fullDob: last6,
        year: fullYear,
        month: actualMonth.toString().padStart(2, '0'),
        day: day,
        gender: isFemale ? "Female" : "Male"
    };
}

const vinLicenseModule = {
    name: "VIN/License Entry",
    // Set to true by js/test-engine.js for the graded test - see
    // js/modules/audio-data-entry.js for the fuller explanation.
    testMode: false,

    render(container, questionCount, onComplete) {
        this.container = container;
        this.onComplete = onComplete;
        this.questionCount = questionCount || 5;
        this.showMenu();
    },

    showMenu() {
        this.container.innerHTML = `
            <h3>Select Practice Type:</h3>
            <div class="lesson-grid" style="margin: 30px 0;">
                <div class="lesson-card" onclick="vinLicenseModule.startVinPractice()">
                    <h3>VIN Entry</h3>
                    <p>Enter 17-character Vehicle Identification Numbers accurately</p>
                </div>
                <div class="lesson-card" onclick="vinLicenseModule.startLicensePractice()">
                    <h3>License Number Entry</h3>
                    <p>Enter Ontario license numbers accurately</p>
                </div>
                <div class="lesson-card" onclick="vinLicenseModule.startDobExtraction()">
                    <h3>DOB Extraction</h3>
                    <p>Extract date of birth and gender from license numbers</p>
                </div>
            </div>
        `;
    },

    // ===== VIN ENTRY =====
    startVinPractice() {
        this.mode = 'vin';
        this.current = 0;
        this.correct = 0;
        this.selectedVins = pickRandomScenarios(vinNumbers, Math.min(this.questionCount, vinNumbers.length));
        this.total = this.selectedVins.length;
        this.showVinQuestion();
    },

    showVinQuestion() {
        if (this.current >= this.total) {
            this.showResults('VIN Entry');
            return;
        }

        const vin = this.selectedVins[this.current];
        this.container.innerHTML = `
            <div class="module-progress">VIN ${this.current + 1} of ${this.total}</div>
            <div style="background: white; padding: 30px; border-radius: 10px; border: 2px solid #007bff; text-align: center;">
                <h3>Enter this VIN exactly as shown:</h3>
                <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border: 3px solid #333; display: inline-block; border-radius: 5px;">
                    <p style="font-family: monospace; font-size: 32px; letter-spacing: 3px; margin: 0; font-weight: bold;">${vin}</p>
                </div>
                <input type="text" id="vinInput" maxlength="17" placeholder="Type the VIN here" style="width: 100%; max-width: 500px; padding: 15px; font-size: 20px; font-family: monospace; letter-spacing: 2px; border: 2px solid #007bff; border-radius: 5px; text-align: center; text-transform: uppercase;">
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <button class="btn btn-success" id="vinSubmitBtn">Submit VIN</button>
            </div>
        `;

        const input = this.container.querySelector('#vinInput');
        input.focus();
        input.addEventListener('input', (e) => { e.target.value = e.target.value.toUpperCase(); });
        this.container.querySelector('#vinSubmitBtn').addEventListener('click', () => this.submitVin(vin));
    },

    submitVin(correctVin) {
        const userVin = this.container.querySelector('#vinInput').value.trim();
        if (userVin.length !== 17) {
            alert('VIN must be exactly 17 characters.');
            return;
        }

        const correct = userVin === correctVin;
        if (correct) this.correct++;

        this.container.innerHTML += `
            <div style="background: ${correct ? '#d4edda' : '#f8d7da'}; padding: 20px; border-radius: 10px; margin-top: 20px; border: 2px solid ${correct ? '#28a745' : '#dc3545'}; text-align: center;">
                <p style="font-size: 24px; margin: 0;"><strong>${correct ? '✓ Correct!' : '✗ Incorrect'}</strong></p>
                ${!correct && !this.testMode ? `<p style="margin: 10px 0 0 0; font-family: monospace; font-size: 18px;">Correct VIN: ${correctVin}</p><p style="font-family: monospace; font-size: 18px;">Your entry: ${userVin}</p>` : ''}
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <button class="btn btn-primary" id="vinContinueBtn">Continue</button>
            </div>
        `;
        this.container.querySelector('#vinSubmitBtn').style.display = 'none';
        this.container.querySelector('#vinContinueBtn').addEventListener('click', () => {
            this.current++;
            this.showVinQuestion();
        });
    },

    // ===== LICENSE ENTRY =====
    startLicensePractice() {
        this.mode = 'license';
        this.current = 0;
        this.correct = 0;
        this.total = Math.min(this.questionCount, 10);
        this.selectedLicenses = [];
        const lastNames = ['M', 'S', 'J', 'W', 'B', 'T', 'A', 'K', 'L', 'R'];
        for (let i = 0; i < this.total; i++) {
            const isFemale = Math.random() > 0.5;
            const year = (Math.floor(Math.random() * 40) + 60).toString();
            const month = (Math.floor(Math.random() * 12) + 1).toString();
            const day = (Math.floor(Math.random() * 28) + 1).toString();
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            this.selectedLicenses.push(generateLicenseNumber(lastName, year, month, day, isFemale));
        }
        this.showLicenseQuestion();
    },

    showLicenseQuestion() {
        if (this.current >= this.total) {
            this.showResults('License Entry');
            return;
        }

        const license = this.selectedLicenses[this.current].license;
        this.container.innerHTML = `
            <div class="module-progress">License ${this.current + 1} of ${this.total}</div>
            <div style="background: white; padding: 30px; border-radius: 10px; border: 2px solid #007bff; text-align: center;">
                <h3>Enter this Ontario license number exactly as shown:</h3>
                <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border: 3px solid #333; display: inline-block; border-radius: 5px;">
                    <p style="font-family: monospace; font-size: 32px; letter-spacing: 3px; margin: 0; font-weight: bold;">${license}</p>
                </div>
                <input type="text" id="licenseInput" maxlength="17" placeholder="L####-####-######" style="width: 100%; max-width: 400px; padding: 15px; font-size: 20px; font-family: monospace; letter-spacing: 2px; border: 2px solid #007bff; border-radius: 5px; text-align: center; text-transform: uppercase;">
                <p style="color: #666; font-size: 14px; margin-top: 10px;">Format: Letter + 4 digits - 4 digits - 6 digits</p>
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <button class="btn btn-success" id="licenseSubmitBtn">Submit License</button>
            </div>
        `;

        const input = this.container.querySelector('#licenseInput');
        input.focus();
        input.addEventListener('input', (e) => {
            // Raw groups are 5 (letter + 4 digits), 4, 6 - NOT 5/5/5. Getting
            // this wrong (as the original version did) means a perfectly
            // typed answer gets reformatted into the wrong dash positions
            // and can never match the stored answer.
            let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
            if (val.length > 5) val = val.slice(0, 5) + '-' + val.slice(5);
            if (val.length > 10) val = val.slice(0, 10) + '-' + val.slice(10, 16);
            e.target.value = val;
        });
        this.container.querySelector('#licenseSubmitBtn').addEventListener('click', () => this.submitLicense(license));
    },

    submitLicense(correctLicense) {
        const userLicense = this.container.querySelector('#licenseInput').value.trim();
        // Compare only the alphanumeric characters, ignoring dash placement -
        // a defense-in-depth measure so a future formatter bug can't silently
        // fail every attempt the way the original dash-position bug did.
        const normalize = s => s.toUpperCase().replace(/[^A-Z0-9]/g, '');
        const correct = normalize(userLicense) === normalize(correctLicense);
        if (correct) this.correct++;

        this.container.innerHTML += `
            <div style="background: ${correct ? '#d4edda' : '#f8d7da'}; padding: 20px; border-radius: 10px; margin-top: 20px; border: 2px solid ${correct ? '#28a745' : '#dc3545'}; text-align: center;">
                <p style="font-size: 24px; margin: 0;"><strong>${correct ? '✓ Correct!' : '✗ Incorrect'}</strong></p>
                ${!correct && !this.testMode ? `<p style="margin: 10px 0 0 0; font-family: monospace; font-size: 18px;">Correct: ${correctLicense}</p><p style="font-family: monospace; font-size: 18px;">Yours: ${userLicense}</p>` : ''}
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <button class="btn btn-primary" id="licenseContinueBtn">Continue</button>
            </div>
        `;
        this.container.querySelector('#licenseSubmitBtn').style.display = 'none';
        this.container.querySelector('#licenseContinueBtn').addEventListener('click', () => {
            this.current++;
            this.showLicenseQuestion();
        });
    },

    // ===== DOB EXTRACTION =====
    startDobExtraction() {
        this.mode = 'dob';
        this.current = 0;
        this.correct = 0;
        // Each DOB question is quicker to work through than a full VIN or
        // license entry, so (matching the original's fixed 10) this runs
        // roughly double the other two sub-modes' question count.
        this.total = Math.min(this.questionCount * 2, 10);
        this.selectedLicenses = [];
        const lastNames = ['M', 'S', 'J', 'W', 'B', 'T', 'A', 'K', 'L', 'R'];

        // Covers both century cases: 00-25 (20XX) and 60-99 (19XX). Was
        // `Array(40).keys().map(...)`, which crashes - .keys() returns an
        // iterator, and only real Arrays have .map().
        const yearRanges = [
            ...Array.from({ length: 26 }, (_, i) => i),
            ...Array.from({ length: 40 }, (_, i) => i + 60)
        ];

        for (let i = 0; i < this.total; i++) {
            const isFemale = Math.random() > 0.5;
            const year = yearRanges[Math.floor(Math.random() * yearRanges.length)].toString().padStart(2, '0');
            const month = (Math.floor(Math.random() * 12) + 1).toString();
            const day = (Math.floor(Math.random() * 28) + 1).toString();
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            this.selectedLicenses.push(generateLicenseNumber(lastName, year, month, day, isFemale));
        }
        this.showDobQuestion();
    },

    showDobQuestion() {
        if (this.current >= this.total) {
            this.showResults('DOB Extraction');
            return;
        }

        const licenseData = this.selectedLicenses[this.current];
        this.container.innerHTML = `
            <div class="module-progress">Question ${this.current + 1} of ${this.total}</div>
            <div style="background: #fff3cd; padding: 20px; border-radius: 10px; border: 2px solid #ffc107; margin-bottom: 20px;">
                <h3>📚 Structured-ID Decoding Practice:</h3>
                <p>Several jurisdictions encode birth info directly into license numbers. This exercise uses a simplified scheme (not verified against any one real jurisdiction's exact format) to build the real skill of extracting encoded data from a structured ID under this rule:</p>
                <p><strong>DOB is encoded in the last 6 digits as YYMMDD</strong></p>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li><strong>Males:</strong> Month is 01-12</li>
                    <li><strong>Females:</strong> Month is 51-62 (add 50 to actual month)</li>
                    <li><strong>Years:</strong> 00-25 = 20XX, 26-99 = 19XX</li>
                </ul>
                <p style="margin-top: 10px;"><strong>Examples:</strong></p>
                <p>• B7574-7850-830422 → 83/04/22 → 1983/04/22 (Male)</p>
                <p>• M5777-6157-855106 → 85/51/06 → 1985/01/06 (Female, 51-50=01)</p>
                <p>• A1234-5678-050212 → 05/02/12 → 2005/02/12 (Male, 05 = 20XX)</p>
            </div>
            <div style="background: white; padding: 30px; border-radius: 10px; border: 2px solid #007bff; text-align: center;">
                <h3>License Number:</h3>
                <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border: 3px solid #333; display: inline-block; border-radius: 5px;">
                    <p style="font-family: monospace; font-size: 32px; letter-spacing: 3px; margin: 0; font-weight: bold;">${licenseData.license}</p>
                </div>
                <div style="margin-top: 30px; text-align: left; max-width: 500px; margin-left: auto; margin-right: auto;">
                    <h4>Extract the following information:</h4>
                    <div style="margin: 15px 0;">
                        <label style="display: block; font-weight: bold; margin-bottom: 5px;">Date of Birth (Format: YYYY/MM/DD):</label>
                        <input type="text" id="dobInput" placeholder="YYYY/MM/DD" maxlength="10" style="width: 100%; padding: 10px; font-size: 18px; border: 2px solid #007bff; border-radius: 5px;">
                    </div>
                    <div style="margin: 15px 0;">
                        <label style="display: block; font-weight: bold; margin-bottom: 5px;">Gender:</label>
                        <select id="genderInput" style="width: 100%; padding: 10px; font-size: 18px; border: 2px solid #007bff; border-radius: 5px;">
                            <option value="">Select...</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                </div>
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <button class="btn btn-success" id="dobSubmitBtn">Submit Answer</button>
            </div>
        `;

        const dobInput = this.container.querySelector('#dobInput');
        dobInput.focus();
        dobInput.addEventListener('input', (e) => {
            let val = e.target.value.replace(/[^0-9]/g, '');
            if (val.length >= 4) val = val.slice(0, 4) + '/' + val.slice(4);
            if (val.length >= 7) val = val.slice(0, 7) + '/' + val.slice(7, 9);
            e.target.value = val;
        });
        this.container.querySelector('#dobSubmitBtn').addEventListener('click', () => this.submitDob(licenseData));
    },

    submitDob(licenseData) {
        const userDob = this.container.querySelector('#dobInput').value.trim();
        const userGender = this.container.querySelector('#genderInput').value;
        if (!userDob || !userGender) {
            alert('Please fill in both date of birth and gender.');
            return;
        }

        const parsedData = extractDobFromLicense(licenseData.license);
        const correctDob = `${parsedData.year}/${parsedData.month}/${parsedData.day}`;
        const dobCorrect = userDob === correctDob;
        const genderCorrect = userGender === parsedData.gender;
        const bothCorrect = dobCorrect && genderCorrect;
        if (bothCorrect) this.correct++;

        this.container.innerHTML += `
            <div style="background: ${bothCorrect ? '#d4edda' : '#f8d7da'}; padding: 20px; border-radius: 10px; margin-top: 20px; border: 2px solid ${bothCorrect ? '#28a745' : '#dc3545'};">
                <p style="font-size: 24px; margin: 0; text-align: center;"><strong>${bothCorrect ? '✓ Perfect!' : '✗ Incorrect'}</strong></p>
                ${!this.testMode ? `
                    <div style="margin-top: 15px;">
                        <p><strong>DOB:</strong> ${dobCorrect ? '✓ Correct' : `✗ Wrong - Correct: ${correctDob}`}</p>
                        <p><strong>Gender:</strong> ${genderCorrect ? '✓ Correct' : `✗ Wrong - Correct: ${parsedData.gender}`}</p>
                    </div>
                    <div style="background: rgba(0,0,0,0.1); padding: 15px; border-radius: 5px; margin-top: 15px;">
                        <p style="font-family: monospace;"><strong>License:</strong> ${licenseData.license}</p>
                        <p style="font-family: monospace;"><strong>Last 6 digits:</strong> ${parsedData.fullDob}</p>
                        <p><strong>Breakdown:</strong> Year=${parsedData.fullDob.substring(0, 2)} (${parsedData.year}), Month=${parsedData.fullDob.substring(2, 4)} ${parsedData.gender === 'Female' ? '(-50=' + parsedData.month + ')' : ''}, Day=${parsedData.fullDob.substring(4, 6)}</p>
                    </div>
                ` : `
                    <p style="text-align: center;"><strong>DOB:</strong> ${dobCorrect ? '✓' : '✗'} &nbsp; <strong>Gender:</strong> ${genderCorrect ? '✓' : '✗'}</p>
                `}
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <button class="btn btn-primary" id="dobContinueBtn">Continue</button>
            </div>
        `;
        this.container.querySelector('#dobSubmitBtn').style.display = 'none';
        this.container.querySelector('#dobContinueBtn').addEventListener('click', () => {
            this.current++;
            this.showDobQuestion();
        });
    },

    // ===== SHARED RESULTS =====
    // Doesn't render its own results screen - criticall.html's
    // handlePracticeModuleComplete() (the same shared results renderer
    // every other module uses) does that from the onComplete callback, so
    // rendering one here too would just get immediately overwritten by it.
    // subLabel carries the specific sub-exercise name ("VIN Entry", etc.)
    // since the stable moduleId has to stay 'vinLicense' (that's the only
    // id wired into openModule()'s switch and the course-access toggles -
    // using the sub-mode name there would break the "Practice Again"
    // button, which re-opens the module by id).
    showResults(subLabel) {
        const percentage = Math.round((this.correct / this.total) * 100);

        if (this.onComplete) {
            this.onComplete({
                moduleId: 'vinLicense',
                subLabel: subLabel,
                accuracy: percentage,
                correctAnswers: this.correct,
                totalQuestions: this.total,
                score: percentage
            });
        }
    }
};

window.vinLicenseModule = vinLicenseModule;
window.generateLicenseNumber = generateLicenseNumber;
window.extractDobFromLicense = extractDobFromLicense;
