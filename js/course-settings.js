// Course Settings - controls which sections of the course are visible to students.
// Toggled from the Course Access panel on teacher.html; read by every student-facing page.
// Stored at Firestore doc courseSettings/KBD1100.

const COURSE_SETTINGS_COLLECTION = 'courseSettings';
const COURSE_SETTINGS_DOC_ID = 'KBD1100';

// One flag per practice module card on criticall.html. These only matter
// once criticallPracticeUnlocked is true (the hub-level master switch) -
// they control which individual module cards are clickable within it.
const CRITICALL_MODULE_IDS = [
    'dataEntry', 'callSummarization', 'memoryRecall', 'mapReading',
    'readingComprehension', 'spelling', 'sentenceClarity', 'mathematics',
    'splitAttention', 'listeningSkills', 'vinLicense', 'crossReference',
    'multitasking', 'decisionMaking'
];

const DEFAULT_COURSE_SETTINGS = {
    fundamentalsUnlocked: false,
    programSpecificUnlocked: false,
    officeUnlocked: false,
    timedTestsUnlocked: false,
    criticallPracticeUnlocked: false,
    criticallTestUnlocked: false,
    criticallModules: Object.fromEntries(CRITICALL_MODULE_IDS.map(id => [id, false]))
};

// Fails safe: if the settings doc is missing or the read errors out, everything
// stays locked rather than accidentally opening early.
async function getCourseSettings() {
    try {
        const snap = await db.collection(COURSE_SETTINGS_COLLECTION).doc(COURSE_SETTINGS_DOC_ID).get();
        if (!snap.exists) return { ...DEFAULT_COURSE_SETTINGS };

        const data = snap.data();
        return {
            ...DEFAULT_COURSE_SETTINGS,
            ...data,
            // Merge one level deeper so a partially-saved criticallModules
            // map still defaults any missing module to locked, instead of
            // the shallow spread above replacing the whole map.
            criticallModules: {
                ...DEFAULT_COURSE_SETTINGS.criticallModules,
                ...(data.criticallModules || {})
            }
        };
    } catch (err) {
        console.error('Could not load course settings, defaulting to locked:', err);
        return { ...DEFAULT_COURSE_SETTINGS };
    }
}

window.getCourseSettings = getCourseSettings;
window.DEFAULT_COURSE_SETTINGS = DEFAULT_COURSE_SETTINGS;
window.CRITICALL_MODULE_IDS = CRITICALL_MODULE_IDS;
