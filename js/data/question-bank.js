// Question Bank - Large pools for randomization
// Each test will randomly select from these pools

const QuestionBank = {
    
    // DATA ENTRY - 50 scenarios (test randomly selects 12)
    dataEntry: [
        {
            name: "Sarah Mitchell",
            phone: "905-555-0123",
            address: "145 Maple Street",
            city: "Toronto",
            postalCode: "M4B 1B3",
            emergency: "Medical - Chest Pain"
        },
        {
            name: "James Rodriguez",
            phone: "416-555-0198",
            address: "2890 Queen Street East",
            city: "Toronto",
            postalCode: "M4E 1H1",
            emergency: "Fire - Kitchen Fire"
        },
        {
            name: "Emily Chen",
            phone: "647-555-0234",
            address: "67 Bloor Street West",
            city: "Toronto",
            postalCode: "M5S 1M5",
            emergency: "Police - Break and Enter"
        },
        {
            name: "Michael Thompson",
            phone: "905-555-0445",
            address: "1234 Lakeshore Boulevard",
            city: "Mississauga",
            postalCode: "L5G 1A1",
            emergency: "Medical - Unconscious Person"
        },
        {
            name: "Patricia O'Brien",
            phone: "416-555-0567",
            address: "890 College Street",
            city: "Toronto",
            postalCode: "M6H 1A2",
            emergency: "Fire - Smoke Detector Alarm"
        },
        {
            name: "David Kim",
            phone: "647-555-0789",
            address: "445 Yonge Street",
            city: "Toronto",
            postalCode: "M5B 2H4",
            emergency: "Police - Assault in Progress"
        },
        {
            name: "Jennifer Martinez",
            phone: "905-555-0892",
            address: "3456 Dundas Street West",
            city: "Mississauga",
            postalCode: "L5B 1H6",
            emergency: "Medical - Difficulty Breathing"
        },
        {
            name: "Robert Johnson",
            phone: "416-555-0934",
            address: "778 King Street East",
            city: "Toronto",
            postalCode: "M5A 1M5",
            emergency: "Fire - Car Fire"
        },
        {
            name: "Amanda Lee",
            phone: "647-555-1023",
            address: "2234 Danforth Avenue",
            city: "Toronto",
            postalCode: "M4C 1K3",
            emergency: "Police - Domestic Disturbance"
        },
        {
            name: "Christopher Davis",
            phone: "905-555-1145",
            address: "567 Eglinton Avenue East",
            city: "Scarborough",
            postalCode: "M1J 2K8",
            emergency: "Medical - Diabetic Emergency"
        },
        {
            name: "Lisa Anderson",
            phone: "416-555-1267",
            address: "1890 St. Clair Avenue West",
            city: "Toronto",
            postalCode: "M6N 1K8",
            emergency: "Fire - Building Fire"
        },
        {
            name: "Kevin Brown",
            phone: "647-555-1389",
            address: "445 Bathurst Street",
            city: "Toronto",
            postalCode: "M5T 2S6",
            emergency: "Police - Robbery"
        },
        {
            name: "Michelle Taylor",
            phone: "905-555-1456",
            address: "6789 Kennedy Road",
            city: "Markham",
            postalCode: "L3R 9W7",
            emergency: "Medical - Stroke Symptoms"
        },
        {
            name: "Daniel Wilson",
            phone: "416-555-1578",
            address: "234 Spadina Avenue",
            city: "Toronto",
            postalCode: "M5T 2C2",
            emergency: "Fire - Gas Smell"
        },
        {
            name: "Karen Moore",
            phone: "647-555-1690",
            address: "1567 Finch Avenue East",
            city: "North York",
            postalCode: "M2J 2X5",
            emergency: "Police - Missing Child"
        },
        {
            name: "Steven Garcia",
            phone: "905-555-1734",
            address: "890 Major Mackenzie Drive",
            city: "Richmond Hill",
            postalCode: "L4S 1P3",
            emergency: "Medical - Seizure"
        },
        {
            name: "Nicole White",
            phone: "416-555-1856",
            address: "3456 Lawrence Avenue West",
            city: "Toronto",
            postalCode: "M6A 1P1",
            emergency: "Fire - Electrical Fire"
        },
        {
            name: "Brian Harris",
            phone: "647-555-1978",
            address: "678 Parliament Street",
            city: "Toronto",
            postalCode: "M4X 1P8",
            emergency: "Police - Armed Suspect"
        },
        {
            name: "Rebecca Clark",
            phone: "905-555-2012",
            address: "2345 Highway 7",
            city: "Vaughan",
            postalCode: "L4K 1W1",
            emergency: "Medical - Allergic Reaction"
        },
        {
            name: "Thomas Lewis",
            phone: "416-555-2134",
            address: "1234 Avenue Road",
            city: "Toronto",
            postalCode: "M5M 3Z5",
            emergency: "Fire - Apartment Fire"
        },
        {
            name: "Angela Robinson",
            phone: "647-555-2256",
            address: "567 Ossington Avenue",
            city: "Toronto",
            postalCode: "M6G 3T1",
            emergency: "Police - Shoplifting"
        },
        {
            name: "Joshua Walker",
            phone: "905-555-2378",
            address: "8901 McCowan Road",
            city: "Markham",
            postalCode: "L3P 3J3",
            emergency: "Medical - Heart Attack"
        },
        {
            name: "Melissa Hall",
            phone: "416-555-2490",
            address: "2345 Broadview Avenue",
            city: "Toronto",
            postalCode: "M4M 2G9",
            emergency: "Fire - Forest Fire"
        },
        {
            name: "Ryan Allen",
            phone: "647-555-2567",
            address: "789 Dovercourt Road",
            city: "Toronto",
            postalCode: "M6H 2X2",
            emergency: "Police - Vandalism"
        },
        {
            name: "Stephanie Young",
            phone: "905-555-2689",
            address: "4567 Steeles Avenue East",
            city: "Markham",
            postalCode: "L3R 2Z1",
            emergency: "Medical - Pregnancy Emergency"
        },
        {
            name: "Justin King",
            phone: "416-555-2745",
            address: "1890 Gerrard Street East",
            city: "Toronto",
            postalCode: "M4L 2C2",
            emergency: "Fire - Garage Fire"
        },
        {
            name: "Rachel Scott",
            phone: "647-555-2867",
            address: "345 Christie Street",
            city: "Toronto",
            postalCode: "M6G 3B9",
            emergency: "Police - Suspicious Person"
        },
        {
            name: "Brandon Green",
            phone: "905-555-2923",
            address: "6789 Warden Avenue",
            city: "Markham",
            postalCode: "L6G 1A7",
            emergency: "Medical - Drug Overdose"
        },
        {
            name: "Christina Adams",
            phone: "416-555-3045",
            address: "2234 Roncesvalles Avenue",
            city: "Toronto",
            postalCode: "M6R 2L3",
            emergency: "Fire - Brush Fire"
        },
        {
            name: "Eric Baker",
            phone: "647-555-3167",
            address: "890 Dufferin Street",
            city: "Toronto",
            postalCode: "M6H 4B3",
            emergency: "Police - Noise Complaint"
        },
        {
            name: "Samantha Nelson",
            phone: "905-555-3289",
            address: "3456 Highway 404",
            city: "Newmarket",
            postalCode: "L3Y 8Y8",
            emergency: "Medical - Mental Health Crisis"
        },
        {
            name: "Anthony Carter",
            phone: "416-555-3367",
            address: "1567 Woodbine Avenue",
            city: "Toronto",
            postalCode: "M4L 3W8",
            emergency: "Fire - Chimney Fire"
        },
        {
            name: "Laura Mitchell",
            phone: "647-555-3489",
            address: "678 Harbord Street",
            city: "Toronto",
            postalCode: "M6G 1H6",
            emergency: "Police - Traffic Accident"
        },
        {
            name: "Matthew Perez",
            phone: "905-555-3556",
            address: "7890 Bayview Avenue",
            city: "Richmond Hill",
            postalCode: "L4B 3M4",
            emergency: "Medical - Choking"
        },
        {
            name: "Jessica Roberts",
            phone: "416-555-3678",
            address: "2345 Bloor Street East",
            city: "Toronto",
            postalCode: "M4W 1A9",
            emergency: "Fire - Wildfire"
        },
        {
            name: "Andrew Turner",
            phone: "647-555-3790",
            address: "567 Lansdowne Avenue",
            city: "Toronto",
            postalCode: "M6H 3Y4",
            emergency: "Police - Hit and Run"
        },
        {
            name: "Sarah Phillips",
            phone: "905-555-3834",
            address: "4567 Yonge Street",
            city: "North York",
            postalCode: "M2N 6K1",
            emergency: "Medical - Burn Injury"
        },
        {
            name: "Tyler Campbell",
            phone: "416-555-3956",
            address: "1890 Queen Street West",
            city: "Toronto",
            postalCode: "M6R 1B1",
            emergency: "Fire - Warehouse Fire"
        },
        {
            name: "Megan Parker",
            phone: "647-555-4012",
            address: "789 College Street",
            city: "Toronto",
            postalCode: "M6G 1C5",
            emergency: "Police - Trespassing"
        },
        {
            name: "Jonathan Evans",
            phone: "905-555-4134",
            address: "8901 Leslie Street",
            city: "Richmond Hill",
            postalCode: "L4B 3H2",
            emergency: "Medical - Poisoning"
        },
        {
            name: "Ashley Edwards",
            phone: "416-555-4256",
            address: "3456 Danforth Avenue",
            city: "Toronto",
            postalCode: "M4C 1L7",
            emergency: "Fire - Oil Fire"
        },
        {
            name: "Nicholas Collins",
            phone: "647-555-4378",
            address: "567 Annette Street",
            city: "Toronto",
            postalCode: "M6P 1P9",
            emergency: "Police - Fraud"
        },
        {
            name: "Brittany Stewart",
            phone: "905-555-4445",
            address: "6789 Steeles Avenue West",
            city: "Vaughan",
            postalCode: "L4L 4Y6",
            emergency: "Medical - Broken Bone"
        },
        {
            name: "Zachary Sanchez",
            phone: "416-555-4567",
            address: "2234 Kingston Road",
            city: "Toronto",
            postalCode: "M1N 1T5",
            emergency: "Fire - Tire Fire"
        },
        {
            name: "Heather Morris",
            phone: "647-555-4689",
            address: "890 Dundas Street West",
            city: "Toronto",
            postalCode: "M6J 1V8",
            emergency: "Police - Harassment"
        },
        {
            name: "Jordan Rogers",
            phone: "905-555-4756",
            address: "4567 Elgin Mills Road",
            city: "Richmond Hill",
            postalCode: "L4S 0B3",
            emergency: "Medical - Bleeding"
        },
        {
            name: "Kimberly Reed",
            phone: "416-555-4878",
            address: "1567 St. Clair Avenue East",
            city: "Toronto",
            postalCode: "M4T 1N5",
            emergency: "Fire - Trash Fire"
        },
        {
            name: "Austin Cook",
            phone: "647-555-4923",
            address: "678 Pape Avenue",
            city: "Toronto",
            postalCode: "M4K 3R9",
            emergency: "Police - Theft"
        },
        {
            name: "Taylor Morgan",
            phone: "905-555-5045",
            address: "7890 Woodbine Avenue",
            city: "Markham",
            postalCode: "L3R 5G2",
            emergency: "Medical - Fainting"
        },
        {
            name: "Victoria Bell",
            phone: "416-555-5167",
            address: "2345 Sheppard Avenue East",
            city: "North York",
            postalCode: "M2J 1W8",
            emergency: "Fire - Propane Tank Fire"
        }
    ],

    // DECISION MAKING - 60 scenarios (test randomly selects 35)
    decisionMaking: [
        {
            scenario: "A woman calls reporting her neighbor's loud music at 2 AM",
            services: ["Police"],
            priority: "Low",
            explanation: "Non-emergency noise complaint"
        },
        {
            scenario: "A man reports seeing smoke coming from a residential house",
            services: ["Fire"],
            priority: "High",
            explanation: "Active fire threat to life and property"
        },
        {
            scenario: "Caller states someone is having a heart attack and is unconscious",
            services: ["EMS"],
            priority: "Critical",
            explanation: "Life-threatening medical emergency"
        },
        {
            scenario: "Report of a car accident with no injuries, blocking one lane",
            services: ["Police"],
            priority: "Medium",
            explanation: "Traffic hazard, no immediate danger"
        },
        {
            scenario: "Caller reports hearing gunshots and seeing someone running with a gun",
            services: ["Police"],
            priority: "Critical",
            explanation: "Active shooter situation, immediate threat"
        },
        {
            scenario: "Woman reports her teenage son hasn't come home and it's past curfew",
            services: ["Police"],
            priority: "Low",
            explanation: "Missing person, non-emergency follow-up"
        },
        {
            scenario: "Gas leak reported at commercial building with strong odor",
            services: ["Fire", "Utility"],
            priority: "High",
            explanation: "Explosion hazard, requires immediate response"
        },
        {
            scenario: "Elderly person fell and cannot get up, alert and talking",
            services: ["EMS"],
            priority: "Medium",
            explanation: "Medical assistance needed, not life-threatening"
        },
        {
            scenario: "Apartment building fire alarm activated, no visible smoke",
            services: ["Fire"],
            priority: "High",
            explanation: "Potential fire, must investigate immediately"
        },
        {
            scenario: "Man reports his car was stolen from parking lot overnight",
            services: ["Police"],
            priority: "Low",
            explanation: "Property crime, after-the-fact report"
        },
        {
            scenario: "Woman screaming for help, sounds of breaking glass and violent struggle",
            services: ["Police", "EMS"],
            priority: "Critical",
            explanation: "Assault in progress, immediate danger"
        },
        {
            scenario: "Child not breathing, parent performing CPR",
            services: ["EMS", "Fire"],
            priority: "Critical",
            explanation: "Pediatric cardiac arrest, all resources needed"
        },
        {
            scenario: "Power lines down across road after storm, sparking",
            services: ["Fire", "Utility", "Police"],
            priority: "High",
            explanation: "Public safety hazard, road closure needed"
        },
        {
            scenario: "Diabetic person feeling dizzy and confused",
            services: ["EMS"],
            priority: "Medium",
            explanation: "Medical emergency, not immediately life-threatening"
        },
        {
            scenario: "Shoplifter detained by security, cooperative",
            services: ["Police"],
            priority: "Low",
            explanation: "Non-violent crime, suspect contained"
        },
        {
            scenario: "Chemical spill on highway from overturned truck",
            services: ["Fire", "Police", "EMS"],
            priority: "Critical",
            explanation: "Hazmat situation, multiple casualties possible"
        },
        {
            scenario: "Smoke detector beeping in vacant apartment",
            services: ["Fire"],
            priority: "Medium",
            explanation: "Possible fire, needs investigation"
        },
        {
            scenario: "Man with chest pain, sweating, and shortness of breath",
            services: ["EMS"],
            priority: "High",
            explanation: "Possible heart attack, urgent response needed"
        },
        {
            scenario: "Dog bite victim, bleeding controlled, seeking medical advice",
            services: ["EMS"],
            priority: "Medium",
            explanation: "Medical treatment needed, stable condition"
        },
        {
            scenario: "Suspicious package left at bus station",
            services: ["Police", "Fire"],
            priority: "High",
            explanation: "Potential bomb threat, evacuation needed"
        },
        {
            scenario: "Caller reports someone broke into their garage last night",
            services: ["Police"],
            priority: "Low",
            explanation: "Past crime, no ongoing threat"
        },
        {
            scenario: "Structure fire fully engulfed, people possibly trapped inside",
            services: ["Fire", "EMS", "Police"],
            priority: "Critical",
            explanation: "Life safety emergency, all resources"
        },
        {
            scenario: "Pregnant woman in labor, contractions 5 minutes apart",
            services: ["EMS"],
            priority: "High",
            explanation: "Imminent childbirth, urgent transport needed"
        },
        {
            scenario: "Found wallet on sidewalk, wants to report it",
            services: ["Police"],
            priority: "Low",
            explanation: "Lost property, non-emergency"
        },
        {
            scenario: "Multi-vehicle collision on highway, multiple injuries reported",
            services: ["EMS", "Fire", "Police"],
            priority: "Critical",
            explanation: "Mass casualty incident, all resources"
        },
        {
            scenario: "Carbon monoxide detector alarming, family feeling sick",
            services: ["Fire", "EMS"],
            priority: "Critical",
            explanation: "CO poisoning, immediate evacuation needed"
        },
        {
            scenario: "Stray dog running in traffic",
            services: ["Police"],
            priority: "Medium",
            explanation: "Animal control, traffic hazard"
        },
        {
            scenario: "Person threatening suicide with weapon",
            services: ["Police", "EMS"],
            priority: "Critical",
            explanation: "Mental health crisis with weapon, immediate danger"
        },
        {
            scenario: "Broken fire hydrant flooding street",
            services: ["Utility"],
            priority: "Medium",
            explanation: "Property damage, water main issue"
        },
        {
            scenario: "Elderly person hasn't been seen for several days, welfare check",
            services: ["Police", "EMS"],
            priority: "Medium",
            explanation: "Welfare check, possible medical issue"
        },
        {
            scenario: "Kitchen grease fire, spreading to cabinets",
            services: ["Fire"],
            priority: "High",
            explanation: "Active fire, spreading risk"
        },
        {
            scenario: "Hit and run accident, driver fled scene, victim walking and talking",
            services: ["Police", "EMS"],
            priority: "Medium",
            explanation: "Crime scene with minor injuries"
        },
        {
            scenario: "Smell of natural gas in basement, very strong",
            services: ["Fire", "Utility"],
            priority: "High",
            explanation: "Explosion risk, evacuation needed"
        },
        {
            scenario: "Person having severe allergic reaction, throat swelling",
            services: ["EMS"],
            priority: "Critical",
            explanation: "Anaphylaxis, airway compromise"
        },
        {
            scenario: "Graffiti on business building, damage estimate $500",
            services: ["Police"],
            priority: "Low",
            explanation: "Property crime, after-the-fact"
        },
        {
            scenario: "Toddler locked in car on hot day, crying and sweating",
            services: ["Fire", "Police", "EMS"],
            priority: "Critical",
            explanation: "Child in immediate danger, heat emergency"
        },
        {
            scenario: "Tree branch fell on power line, no fire or sparks",
            services: ["Utility"],
            priority: "Medium",
            explanation: "Infrastructure damage, no immediate danger"
        },
        {
            scenario: "Person appears to be having a stroke, one-sided weakness",
            services: ["EMS"],
            priority: "Critical",
            explanation: "Stroke symptoms, time-critical emergency"
        },
        {
            scenario: "Attempted break-in, suspect fled, homeowner safe",
            services: ["Police"],
            priority: "Medium",
            explanation: "Recent crime, suspect at large"
        },
        {
            scenario: "Industrial accident, worker trapped in machinery",
            services: ["Fire", "EMS", "Police"],
            priority: "Critical",
            explanation: "Rescue needed, serious injury likely"
        },
        {
            scenario: "Psychiatric patient off medication, acting erratically but not violent",
            services: ["Police", "EMS"],
            priority: "Medium",
            explanation: "Mental health crisis, monitoring needed"
        },
        {
            scenario: "Small brush fire near residential area, wind picking up",
            services: ["Fire"],
            priority: "High",
            explanation: "Wildfire risk to structures"
        },
        {
            scenario: "Person fell from ladder, possible back injury, conscious",
            services: ["EMS", "Fire"],
            priority: "High",
            explanation: "Spinal injury risk, special handling needed"
        },
        {
            scenario: "Fraud complaint about online purchase from last week",
            services: ["Police"],
            priority: "Low",
            explanation: "Financial crime, non-emergency report"
        },
        {
            scenario: "Active shooter reported at shopping mall",
            services: ["Police", "Fire", "EMS"],
            priority: "Critical",
            explanation: "Mass casualty event, all resources"
        },
        {
            scenario: "Transformer explosion, power outage in neighborhood",
            services: ["Fire", "Utility"],
            priority: "High",
            explanation: "Fire hazard, infrastructure emergency"
        },
        {
            scenario: "Child complaining of severe stomach pain, vomiting",
            services: ["EMS"],
            priority: "Medium",
            explanation: "Pediatric medical issue, needs evaluation"
        },
        {
            scenario: "Drunk driver weaving on highway, still driving",
            services: ["Police"],
            priority: "High",
            explanation: "Immediate traffic hazard, ongoing danger"
        },
        {
            scenario: "Smoke coming from electrical outlet in wall",
            services: ["Fire"],
            priority: "High",
            explanation: "Electrical fire risk"
        },
        {
            scenario: "Person with dementia wandered from care facility",
            services: ["Police", "EMS"],
            priority: "High",
            explanation: "Vulnerable missing person, health risk"
        },
        {
            scenario: "Lightning strike started roof fire",
            services: ["Fire"],
            priority: "Critical",
            explanation: "Active structure fire"
        },
        {
            scenario: "Minor fender bender in parking lot, no injuries, insurance exchange",
            services: ["Police"],
            priority: "Low",
            explanation: "Property damage only, civil matter"
        },
        {
            scenario: "Heroin overdose, person not breathing, bystander has Narcan",
            services: ["EMS", "Fire"],
            priority: "Critical",
            explanation: "Drug overdose, respiratory arrest"
        },
        {
            scenario: "Street light out at busy intersection",
            services: ["Utility"],
            priority: "Low",
            explanation: "Infrastructure maintenance, minor hazard"
        },
        {
            scenario: "Domestic violence in progress, victim locked in bathroom",
            services: ["Police", "EMS"],
            priority: "Critical",
            explanation: "Violence in progress, victim safety"
        },
        {
            scenario: "Oil spill on roadway from vehicle leak",
            services: ["Fire", "Police"],
            priority: "Medium",
            explanation: "Roadway hazard, cleanup needed"
        },
        {
            scenario: "Elderly person fell 3 hours ago, cannot reach phone until now",
            services: ["EMS", "Fire"],
            priority: "High",
            explanation: "Delayed response injury, potential deterioration"
        },
        {
            scenario: "Teenager having panic attack at school",
            services: ["EMS"],
            priority: "Medium",
            explanation: "Mental health crisis, medical evaluation"
        },
        {
            scenario: "Armed robbery in progress at convenience store",
            services: ["Police", "EMS"],
            priority: "Critical",
            explanation: "Violent crime in progress"
        },
        {
            scenario: "Dead deer in middle of highway lane",
            services: ["Police"],
            priority: "Medium",
            explanation: "Traffic hazard, removal needed"
        }
    ],

    // SPELLING - 100 words (test randomly selects 50)
    spelling: [
        { word: "accommodate", incorrect: ["accomodate", "acommodate", "acomodate"] },
        { word: "acknowledgment", incorrect: ["acknowlegement", "acknowledgement", "aknowledgment"] },
        { word: "ambulance", incorrect: ["ambulence", "ambulanse", "amublance"] },
        { word: "apartment", incorrect: ["apartement", "appartment", "apartmint"] },
        { word: "beginning", incorrect: ["begining", "beggining", "biginning"] },
        { word: "believe", incorrect: ["beleive", "belive", "beleave"] },
        { word: "burglar", incorrect: ["burgler", "burgular", "burglur"] },
        { word: "calendar", incorrect: ["calender", "calandar", "calander"] },
        { word: "cemetery", incorrect: ["cemetary", "cematery", "cemetry"] },
        { word: "conscience", incorrect: ["concience", "consience", "conscence"] },
        { word: "definitely", incorrect: ["definately", "definetly", "definitly"] },
        { word: "description", incorrect: ["discription", "descripton", "decription"] },
        { word: "desperate", incorrect: ["desparate", "desprate", "despirate"] },
        { word: "diabetes", incorrect: ["diabetis", "diabettes", "diabeties"] },
        { word: "disappear", incorrect: ["dissapear", "disapear", "dissappear"] },
        { word: "discipline", incorrect: ["disipline", "dicipline", "disciplin"] },
        { word: "dispatch", incorrect: ["dispach", "despatch", "dispetch"] },
        { word: "embarrass", incorrect: ["embarass", "emberass", "embarras"] },
        { word: "emergency", incorrect: ["emergancy", "emengency", "emergencey"] },
        { word: "environment", incorrect: ["enviroment", "enviornment", "environmant"] },
        { word: "equipment", incorrect: ["equiptment", "equipmant", "equippment"] },
        { word: "existence", incorrect: ["existance", "existense", "exsistence"] },
        { word: "experience", incorrect: ["experiance", "experiance", "experince"] },
        { word: "facilities", incorrect: ["facilites", "facilitys", "facillities"] },
        { word: "foreign", incorrect: ["foriegn", "foregin", "forein"] },
        { word: "government", incorrect: ["goverment", "governmant", "govenment"] },
        { word: "grammar", incorrect: ["grammer", "gramar", "gramma"] },
        { word: "guarantee", incorrect: ["garentee", "garantee", "guarentee"] },
        { word: "harass", incorrect: ["harrass", "harras", "haras"] },
        { word: "hemorrhage", incorrect: ["hemorage", "hemorrage", "hemmorhage"] },
        { word: "hospital", incorrect: ["hospitol", "hospitel", "hospitle"] },
        { word: "immediately", incorrect: ["immediatly", "imediately", "immediatley"] },
        { word: "incident", incorrect: ["incedent", "incidant", "insident"] },
        { word: "independent", incorrect: ["independant", "independet", "independint"] },
        { word: "intelligence", incorrect: ["inteligence", "intelligance", "intellegence"] },
        { word: "interrupt", incorrect: ["interupt", "interubt", "interuppt"] },
        { word: "jewelry", incorrect: ["jewelery", "jewlery", "jewelrey"] },
        { word: "judgment", incorrect: ["judgement", "judgmant", "judgemint"] },
        { word: "knowledge", incorrect: ["knowlege", "knolwedge", "knowladge"] },
        { word: "license", incorrect: ["licence", "lisence", "lisense"] },
        { word: "lightning", incorrect: ["lightening", "lighning", "litening"] },
        { word: "maintenance", incorrect: ["maintainance", "maintenence", "maintainence"] },
        { word: "maneuver", incorrect: ["manuver", "maneuvor", "manoeuver"] },
        { word: "millennium", incorrect: ["millenium", "milennium", "milenium"] },
        { word: "miniature", incorrect: ["miniture", "minature", "minitur"] },
        { word: "necessary", incorrect: ["necesary", "neccessary", "nessasary"] },
        { word: "noticeable", incorrect: ["noticable", "notisable", "noticible"] },
        { word: "occasion", incorrect: ["ocasion", "occassion", "ocassion"] },
        { word: "occurred", incorrect: ["occured", "ocurred", "occurrd"] },
        { word: "occurrence", incorrect: ["occurence", "occurrance", "occurence"] },
        { word: "official", incorrect: ["offical", "oficiall", "ofisial"] },
        { word: "parallel", incorrect: ["paralel", "paralell", "parrallel"] },
        { word: "paramedic", incorrect: ["parmedic", "paramedick", "parimedic"] },
        { word: "particular", incorrect: ["perticular", "particuler", "particlar"] },
        { word: "pedestrian", incorrect: ["pedistrian", "padestrian", "pedestrain"] },
        { word: "perseverance", incorrect: ["perseverence", "perserverance", "persaverance"] },
        { word: "personnel", incorrect: ["personel", "personell", "personnell"] },
        { word: "physician", incorrect: ["physican", "physicain", "phisician"] },
        { word: "pneumonia", incorrect: ["pnumonia", "neumonia", "pneumonea"] },
        { word: "possess", incorrect: ["posess", "posses", "posses"] },
        { word: "precede", incorrect: ["preceed", "presede", "percede"] },
        { word: "prescription", incorrect: ["perscription", "presciption", "perscirption"] },
        { word: "privilege", incorrect: ["priviledge", "privilage", "privelege"] },
        { word: "procedure", incorrect: ["proceduer", "proceedure", "procedur"] },
        { word: "profession", incorrect: ["proffession", "profesion", "profision"] },
        { word: "psychology", incorrect: ["phychology", "psycology", "psichology"] },
        { word: "questionnaire", incorrect: ["questionaire", "questionairre", "questionare"] },
        { word: "receive", incorrect: ["recieve", "recive", "receave"] },
        { word: "recommend", incorrect: ["recomend", "reccommend", "recomand"] },
        { word: "reference", incorrect: ["referance", "refference", "refarence"] },
        { word: "relevant", incorrect: ["relevent", "relavent", "relevint"] },
        { word: "remember", incorrect: ["rember", "remeber", "remembar"] },
        { word: "resistance", incorrect: ["resistence", "resistanse", "resistince"] },
        { word: "restaurant", incorrect: ["restaraunt", "restraunt", "resturant"] },
        { word: "rhyme", incorrect: ["rime", "ryme", "rhime"] },
        { word: "rhythm", incorrect: ["rythm", "rythym", "rhythem"] },
        { word: "schedule", incorrect: ["scedule", "shedule", "schedual"] },
        { word: "separate", incorrect: ["seperate", "separete", "seprate"] },
        { word: "sergeant", incorrect: ["sargent", "sargeant", "sergent"] },
        { word: "sheriff", incorrect: ["sherif", "sherrif", "shariff"] },
        { word: "significance", incorrect: ["significanse", "signifigance", "significence"] },
        { word: "similar", incorrect: ["similer", "similiar", "similair"] },
        { word: "sincerely", incorrect: ["sincerly", "sincerley", "sencerely"] },
        { word: "strength", incorrect: ["strenght", "strenth", "stength"] },
        { word: "successful", incorrect: ["successfull", "succesful", "sucessful"] },
        { word: "sufficient", incorrect: ["suffiecient", "suficient", "sufficent"] },
        { word: "superintendent", incorrect: ["superintendant", "superindentent", "superintendint"] },
        { word: "surveillance", incorrect: ["survelance", "surveilance", "serveillance"] },
        { word: "technique", incorrect: ["techneque", "tecnique", "techniqe"] },
        { word: "temperature", incorrect: ["temperture", "tempreture", "temperatuer"] },
        { word: "temporarily", incorrect: ["temporarly", "temporarilly", "temporaily"] },
        { word: "thorough", incorrect: ["through", "thorogh", "thourgh"] },
        { word: "unconscious", incorrect: ["unconcious", "unconcsious", "unconsious"] },
        { word: "unnecessary", incorrect: ["unecessary", "unnecesary", "uneccessary"] },
        { word: "vehicle", incorrect: ["vehical", "vehicel", "vehcile"] },
        { word: "warehouse", incorrect: ["wherehouse", "warhouse", "warehoose"] },
        { word: "weather", incorrect: ["wether", "wheather", "wheater"] },
        { word: "Wednesday", incorrect: ["Wensday", "Wendsday", "Wednsday"] }
    ]

    // Additional question banks will continue in next file...
};

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuestionBank;
}
