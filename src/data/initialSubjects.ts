import { Subject, Lecture } from '../types';

export const CORE_SUBJECTS: Subject[] = [
  {
    id: 'economy',
    name: 'Economy',
    category: 'GS3',
    totalLectures: 60,
    description: 'Macroeconomics, Fiscal Policy, Monetary System, Banking, Agriculture & Infrastructure.',
    territoryName: 'Treasury of Corinth',
    icon: 'Coins'
  },
  {
    id: 'sci_tech',
    name: 'Science & Technology',
    category: 'GS3',
    totalLectures: 19,
    description: 'Biotechnology, Space Exploration, Nano-tech, Defence Technology & AI.',
    territoryName: 'Forge of Hephaestus',
    icon: 'Cpu'
  },
  {
    id: 'environment',
    name: 'Environment',
    category: 'GS3',
    totalLectures: 19,
    description: 'Ecology, Biodiversity, Climate Protocols, Protected Areas & Conservation Acts.',
    territoryName: 'Sacred Grove of Arcadia',
    icon: 'Trees'
  },
  {
    id: 'disaster_mgmt',
    name: 'Disaster Management',
    category: 'GS3',
    totalLectures: 19,
    description: 'Hazard Vulnerability, NDMA Guidelines, Sendai Framework & Mitigation Strategies.',
    territoryName: 'Ramparts of Troy',
    icon: 'ShieldAlert'
  },
  {
    id: 'internal_security',
    name: 'Internal Security',
    category: 'GS3',
    totalLectures: 19,
    description: 'Border Management, Cyber Warfare, Counter-Terrorism, Coastal Defence & LWE.',
    territoryName: 'Gates of Thermopylae',
    icon: 'Shield'
  },
  {
    id: 'ancient_history',
    name: 'Ancient History',
    category: 'GS1',
    totalLectures: 23,
    description: 'Indus Valley, Vedic Age, Mahajanapadas, Mauryan Empire, Sangam Age & Guptas.',
    territoryName: 'Cradle of Mycenae',
    icon: 'Hourglass'
  },
  {
    id: 'medieval_history',
    name: 'Medieval History',
    category: 'GS1',
    totalLectures: 13,
    description: 'Delhi Sultanate, Vijayanagara Empire, Bhakti-Sufi Movements & Mughal Administration.',
    territoryName: 'Byzantine Fortress',
    icon: 'Castle'
  },
  {
    id: 'modern_history',
    name: 'Modern History',
    category: 'GS1',
    totalLectures: 40,
    description: '1857 Revolt, Freedom Struggle, Gandhian Movements, Revolutionary Phases & Partition.',
    territoryName: 'Spartan Phalanx Plains',
    icon: 'Flame'
  },
  {
    id: 'art_culture',
    name: 'Art & Culture',
    category: 'GS1',
    totalLectures: 19,
    description: 'Temple Architecture, Classical Dances, Sculpture, Paintings, Music & Literature.',
    territoryName: 'Athenian Acropolis',
    icon: 'Crown'
  },
  {
    id: 'world_history',
    name: 'World History',
    category: 'GS1',
    totalLectures: 13,
    description: 'Enlightenment, American & French Revolutions, Industrial Revolution, World Wars & Decolonization.',
    territoryName: 'Shores of Salamis',
    icon: 'Globe'
  },
  {
    id: 'post_independence',
    name: 'Post-Independence History',
    category: 'GS1',
    totalLectures: 6,
    description: 'Reorganization of States, Land Reforms, Green Revolution, Foreign Policy & Emergency Era.',
    territoryName: 'Bastion of Aegina',
    icon: 'BookOpen'
  },
  {
    id: 'geography',
    name: 'Geography',
    category: 'GS1',
    totalLectures: 44,
    description: 'Geomorphology, Climatology, Oceanography, Indian Physical & Economic Geography.',
    territoryName: 'Peaks of Taygetus',
    icon: 'Mountain'
  },
  {
    id: 'society',
    name: 'Society & Social Justice',
    category: 'GS1',
    totalLectures: 19,
    description: 'Indian Society, Women Empowerment, Vulnerable Sections, Health & Education Welfare.',
    territoryName: 'Agora of Delos',
    icon: 'Users'
  },
  {
    id: 'polity',
    name: 'Polity',
    category: 'GS2',
    totalLectures: 63,
    description: 'Preamble, Fundamental Rights, Parliament, Supreme Court, Federalism & Constitutional Bodies.',
    territoryName: 'Council of the Gerousia',
    icon: 'Landmark'
  },
  {
    id: 'ir',
    name: 'International Relations',
    category: 'GS2',
    totalLectures: 25,
    description: 'India-Neighborhood, Bilateral Ties, Multilateral Treaties, Indo-Pacific & Geopolitics.',
    territoryName: 'Alliance of Delphi',
    icon: 'Compass'
  },
  {
    id: 'governance',
    name: 'Governance',
    category: 'GS2',
    totalLectures: 33,
    description: 'RTI, Citizen Charters, Civil Services Reform, E-Governance & Transparency.',
    territoryName: 'Seat of Archons',
    icon: 'FileCheck'
  },
  {
    id: 'ethics',
    name: 'Ethics',
    category: 'GS4',
    totalLectures: 70,
    description: 'Ethics in Human Interface, Attitude, Emotional Intelligence, Thinkers & Case Studies.',
    territoryName: 'Sanctuary of Apollo',
    icon: 'Award'
  },
  {
    id: 'anthropology',
    name: 'Anthropology',
    category: 'OPTIONAL',
    totalLectures: 141,
    description: 'Physical & Cultural Anthropology, Human Evolution, Genetics, Indian Society & Tribal Studies.',
    territoryName: 'Citadel of Spartan Kings',
    icon: 'Scroll'
  },
  {
    id: 'csat',
    name: 'CSAT',
    category: 'CSAT',
    totalLectures: 100,
    description: 'Reading Comprehension, Quantitative Aptitude, Logical Reasoning & Data Interpretation.',
    territoryName: 'Labyrinth of Knossos',
    icon: 'Target'
  }
];

export const EXTENSION_SUBJECTS: Subject[] = [
  {
    id: 'essay',
    name: 'Essay Strategy & Enrichment',
    category: 'ESSAY',
    totalLectures: 34,
    description: 'Philosophical Essays, Multi-dimensional Analysis, Quotes & Thematic Frameworks.',
    territoryName: 'Oracles of Olympus',
    icon: 'Feather'
  },
  {
    id: 'current_affairs',
    name: 'Current Affairs & Test Discussions',
    category: 'GS3',
    totalLectures: 200,
    description: 'Monthly Current Affairs Roundup, Economic Survey, Budget & Prelims Test Series Reviews.',
    territoryName: 'War Council of Sparta',
    icon: 'Crosshair'
  }
];

// Topic templates for rich realistic lecture generation
const TOPIC_TEMPLATES: Record<string, string[]> = {
  economy: [
    'National Income Accounting & GDP Concepts',
    'Inflation Types, CPI & WPI Indices',
    'Monetary Policy Framework & RBI Operations',
    'Banking Structure, NPAs & Insolvency Code',
    'Fiscal Policy, Budget Concepts & Deficits',
    'Taxation Reforms & GST Structure',
    'External Sector & Balance of Payments',
    'Foreign Trade & Exchange Rate Systems',
    'Capital Markets & Stock Exchanges',
    'Agriculture: MSP, Procurement & PDS',
    'Food Processing Sector in India',
    'Land Reforms & Agricultural Credit',
    'Infrastructure: Railways, Ports & Energy',
    'Manufacturing Sector & PLI Schemes',
    'Services Sector & Digital Economy'
  ],
  polity: [
    'Historical Underpinnings & Constituent Assembly',
    'Preamble & Salient Features of Constitution',
    'Union and Its Territory & Citizenship',
    'Fundamental Rights: Articles 12-18 (Equality)',
    'Fundamental Rights: Articles 19-22 (Freedoms)',
    'Fundamental Rights: Articles 23-32 & Writs',
    'Directive Principles of State Policy',
    'Fundamental Duties & Amendment Procedure',
    'Basic Structure Doctrine & Judicial Review',
    'President of India: Powers & Functions',
    'Prime Minister & Council of Ministers',
    'Parliament: Organization & Parliamentary Privileges',
    'Legislative Procedure & Financial Bills',
    'Supreme Court: Jurisdiction & Judicial Activism',
    'High Courts & Subordinate Judiciary',
    'Federal Relations: Legislative, Admin & Financial',
    'Emergency Provisions & Implications',
    'Election Commission & Electoral Reforms',
    'CAG, Attorney General & Finance Commission',
    'Panchayati Raj & Urban Local Bodies'
  ],
  geography: [
    'Origin of Earth & Continental Drift Theory',
    'Plate Tectonics, Earthquakes & Volcanism',
    'Rocks, Minerals & Weathering Processes',
    'Atmospheric Layers & Heat Budget',
    'Pressure Belts & Planetary Winds',
    'Monsoons: Mechanism & Theories',
    'Cyclones: Tropical & Temperate',
    'Ocean Relief & Ocean Currents',
    'Tides & Waves Dynamics',
    'Physiographic Divisions of India: Himalayas',
    'Peninsular Plateau & Coastal Plains',
    'Drainage Systems: Himalayan vs Peninsular',
    'Indian Climate & Rainfall Distribution',
    'Soils of India: Classification & Degradation',
    'Natural Vegetation & Forest Resources'
  ],
  modern_history: [
    'Decline of Mughals & Rise of Regional States',
    'Advent of Europeans & British Conquest',
    'Revolt of 1857: Causes, Nature & Impact',
    'Socio-Religious Reform Movements',
    'Rise of Indian Nationalism & INC Formation',
    'Moderate Phase vs Extremist Phase',
    'Swadeshi Movement & Surat Split',
    'Home Rule Movement & Lucknow Pact',
    'Gandhian Phase: Champaran to Non-Cooperation',
    'Swarajists & Revolutionary Activities',
    'Civil Disobedience Movement & Round Table Conferences',
    'Government of India Act 1935',
    'Quit India Movement & INA',
    'Post-War Negotiations & Cabinet Mission',
    'Mountbatten Plan & Partition of India'
  ],
  ethics: [
    'Dimensions of Ethics & Moral Values',
    'Ethics in Public and Private Relationships',
    'Human Values: Lessons from Leaders & Reformers',
    'Attitude: Content, Structure & Behavioral Functions',
    'Moral & Political Attitudes in Society',
    'Emotional Intelligence: Concepts & Utilities',
    'Contributions of Moral Thinkers: Western Philosophy',
    'Contributions of Moral Thinkers: Indian Tradition',
    'Public Service Values & Ethical Dilemmas',
    'Laws, Rules & Conscience as Ethical Guides',
    'Accountability & Ethical Governance',
    'Probity in Governance: Philosophical Basis',
    'Citizen Charters & Work Culture',
    'Case Studies: Conflict of Interest & Bribery',
    'Case Studies: Administrative Discretion & Integrity'
  ],
  anthropology: [
    'Meaning, Scope and Development of Anthropology',
    'Relationships with other Disciplines',
    'Main Branches: Biological, Social-Cultural, Archaeological',
    'Human Evolution and Emergence of Man',
    'Phylogenetic Status of Australopithecus & Homo erectus',
    'Neanderthal Man and Rhodesian Man',
    'Biological Basis of Life: DNA, RNA & Protein Synthesis',
    'Principles of Prehistoric Archaeology',
    'Marriage, Family and Kinship Systems',
    'Economic and Political Organization in Simple Societies',
    'Religion, Magic and Science in Tribal Societies',
    'Anthropological Theories: Evolutionism, Functionalism',
    'Research Methods in Anthropology',
    'Race, Racism and Genetic Polymorphism',
    'Concept of Health, Disease and Aging',
    'Indian Social System: Varna, Jati and Ashrama',
    'Tribal Situation in India: Distribution & Problems',
    'Tribal Administration: 5th & 6th Schedules',
    'Anthropology and Rural Development'
  ]
};

export function generateLecturesForSubject(subject: Subject): Lecture[] {
  const lectures: Lecture[] = [];
  const templates = TOPIC_TEMPLATES[subject.id] || [];

  for (let i = 1; i <= subject.totalLectures; i++) {
    let title = `${subject.name} - Lecture ${i}`;
    if (templates.length > 0) {
      const templateIdx = (i - 1) % templates.length;
      const part = Math.floor((i - 1) / templates.length) + 1;
      title = part > 1 
        ? `${templates[templateIdx]} (Part ${part})`
        : templates[templateIdx];
    }

    lectures.push({
      id: `${subject.id}_lec_${i}`,
      subjectId: subject.id,
      lectureNumber: i,
      title,
      status: 'not_started',
      durationMinutes: 150, // 2h 30m standard
      notesStatus: 'not_started',
      remarks: ''
    });
  }

  return lectures;
}

export function generateAllInitialLectures(subjects: Subject[]): Record<string, Lecture[]> {
  const map: Record<string, Lecture[]> = {};
  for (const s of subjects) {
    map[s.id] = generateLecturesForSubject(s);
  }
  return map;
}
