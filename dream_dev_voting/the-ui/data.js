// Mock data + shared constants for Dream Dev Vote prototype

const STATES = [
  'ABIA', 'ADAMAWA', 'AKWA_IBOM', 'ANAMBRA', 'BAUCHI', 'BAYELSA', 'BENUE', 'BORNO',
  'CROSS_RIVER', 'DELTA', 'EBONYI', 'EDO', 'EKITI', 'ENUGU', 'GOMBE', 'IMO',
  'JIGAWA', 'KADUNA', 'KANO', 'KATSINA', 'KEBBI', 'KOGI', 'KWARA', 'LAGOS',
  'NASARAWA', 'NIGER', 'OGUN', 'ONDO', 'OSUN', 'OYO', 'PLATEAU', 'RIVERS',
  'SOKOTO', 'TARABA', 'YOBE', 'ZAMFARA', 'FCT', 'NATIONAL'
];

const CATEGORIES = [
  'PRESIDENTIAL', 'GUBERNATORIAL', 'SENATORIAL',
  'STATE_REPRESENTATIVE', 'STATE_ASSEMBLY', 'LOCAL_COUNSELOR'
];

const CITIZENSHIP_TYPES = [
  'NATURALIZATION', 'REGISTRATION', 'DUAL_CITIZENSHIP', 'HONORARY'
];

// Pretty-print an enum like LOCAL_COUNSELOR -> Local Counselor
function prettyEnum(s) {
  if (!s) return '';
  return s.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
}

function categoryLabel(c) {
  const map = {
    PRESIDENTIAL: 'Presidential',
    GUBERNATORIAL: 'Gubernatorial',
    SENATORIAL: 'Senatorial',
    STATE_REPRESENTATIVE: 'State Representative',
    STATE_ASSEMBLY: 'State Assembly',
    LOCAL_COUNSELOR: 'Local Counselor'
  };
  return map[c] || prettyEnum(c);
}

// Mock elections — seeded, deterministic
const MOCK_ELECTIONS = [
  { id: 'ELEC-001', category: 'PRESIDENTIAL', state: 'NATIONAL', date: '2026-05-18', startsAt: '08:00', endsAt: '17:00', title: '2026 Presidential Election' },
  { id: 'ELEC-002', category: 'GUBERNATORIAL', state: 'LAGOS', date: '2026-05-18', startsAt: '08:00', endsAt: '17:00', title: 'Lagos Gubernatorial' },
  { id: 'ELEC-003', category: 'GUBERNATORIAL', state: 'KANO', date: '2026-05-18', startsAt: '08:00', endsAt: '17:00', title: 'Kano Gubernatorial' },
  { id: 'ELEC-004', category: 'SENATORIAL', state: 'LAGOS', date: '2026-06-02', startsAt: '08:00', endsAt: '16:00', title: 'Lagos Senatorial' },
  { id: 'ELEC-005', category: 'STATE_ASSEMBLY', state: 'OYO', date: '2026-06-15', startsAt: '08:00', endsAt: '16:00', title: 'Oyo State Assembly' },
  { id: 'ELEC-006', category: 'LOCAL_COUNSELOR', state: 'FCT', date: '2026-07-04', startsAt: '09:00', endsAt: '15:00', title: 'FCT Local Counselor' },
  { id: 'ELEC-007', category: 'GUBERNATORIAL', state: 'RIVERS', date: '2026-05-18', startsAt: '08:00', endsAt: '17:00', title: 'Rivers Gubernatorial' },
];

// Mock candidates keyed by electionId
const MOCK_CANDIDATES = {
  'ELEC-001': [
    { id: 'CAND-P01', name: 'Adaeze Okonkwo', party: 'PDP', votes: 12483 },
    { id: 'CAND-P02', name: 'Ibrahim Musa', party: 'APC', votes: 14720 },
    { id: 'CAND-P03', name: 'Chinedu Eze', party: 'LP', votes: 9812 },
    { id: 'CAND-P04', name: 'Funmilayo Adebayo', party: 'NNPP', votes: 3204 },
  ],
  'ELEC-002': [
    { id: 'CAND-L01', name: 'Tolu Bakare', party: 'APC', votes: 2145 },
    { id: 'CAND-L02', name: 'Yetunde Oyewole', party: 'LP', votes: 1983 },
    { id: 'CAND-L03', name: 'Segun Fasola', party: 'PDP', votes: 1520 },
  ],
  'ELEC-003': [
    { id: 'CAND-K01', name: 'Aliyu Sani', party: 'NNPP', votes: 1890 },
    { id: 'CAND-K02', name: 'Hafsat Garba', party: 'APC', votes: 2011 },
  ],
  'ELEC-004': [
    { id: 'CAND-S01', name: 'Oluwaseun Adeleke', party: 'LP', votes: 812 },
    { id: 'CAND-S02', name: 'Bisi Akinola', party: 'APC', votes: 703 },
    { id: 'CAND-S03', name: 'Emeka Nwosu', party: 'PDP', votes: 611 },
  ],
  'ELEC-005': [
    { id: 'CAND-O01', name: 'Gbenga Oladipo', party: 'APC', votes: 445 },
    { id: 'CAND-O02', name: 'Folake Adeyemi', party: 'PDP', votes: 398 },
  ],
  'ELEC-006': [
    { id: 'CAND-F01', name: 'Musa Abdullahi', party: 'APC', votes: 210 },
    { id: 'CAND-F02', name: 'Ngozi Okafor', party: 'LP', votes: 189 },
  ],
  'ELEC-007': [
    { id: 'CAND-R01', name: 'Tamuno Briggs', party: 'PDP', votes: 1650 },
    { id: 'CAND-R02', name: 'Soboma West', party: 'APC', votes: 1420 },
  ],
};

function formatDate(isoDate, opts = {}) {
  const d = new Date(isoDate + 'T00:00:00');
  const { month = 'short', day = 'numeric', year, weekday } = opts;
  return d.toLocaleDateString('en-US', { month, day, year, weekday });
}

function formatDateParts(isoDate) {
  const d = new Date(isoDate + 'T00:00:00');
  return {
    day: d.getDate(),
    month: d.toLocaleString('en-US', { month: 'short' })
  };
}

// Countdown to next election
const NEXT_ELECTION_DATE = '2026-05-18T08:00:00';

// Export everything to window for cross-file use
Object.assign(window, {
  STATES,
  CATEGORIES,
  CITIZENSHIP_TYPES,
  prettyEnum,
  categoryLabel,
  MOCK_ELECTIONS,
  MOCK_CANDIDATES,
  formatDate,
  formatDateParts,
  NEXT_ELECTION_DATE,
});
