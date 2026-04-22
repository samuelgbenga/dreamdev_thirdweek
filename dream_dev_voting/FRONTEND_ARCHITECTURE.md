# Frontend Architecture Map — Dream Dev Voting System

**Stack Recommendation:** React 18 + JavaScript + React Router v6 + Context API + Tailwind CSS  
**API Base URL:** `http://localhost:8080/api/v1`

---

## 1. Route Map

```
/                           → Landing Page (public)
/register                   → Voter Registration (public)
/vote                       → Voting Portal (voter)
│   /vote/confirm?token=... → Vote Confirmation (voter, JWT-gated)
/results                    → Public Election Results (public)
/admin/login                → Electorate Login (public)
/admin                      → Admin Dashboard (electorate, guards localStorage)
│   /admin/elections        → Manage Elections
│   /admin/candidates       → Manage Candidates
│   /admin/voters           → Manage Voters
│   /admin/electorates      → Manage Electorates
│   /admin/permissions      → Assign / Revoke Permissions
│   /admin/votes            → View All Votes (paginated)
/not-found                  → 404 Fallback
```

---

## 2. Page & Component Tree

```
App
├── Layout
│   ├── Navbar
│   │   ├── NavLinks (Landing | Results | Admin Login)
│   │   └── ActiveUserBadge (shows electorateId when logged in)
│   └── Footer
│
├── Pages
│   │
│   ├── LandingPage
│   │   ├── HeroSection
│   │   │   ├── ElectionCountdownBanner
│   │   │   └── CTAButtons (Register to Vote | View Results)
│   │   ├── UpcomingElectionsSection
│   │   │   ├── StatePicker (State enum dropdown)
│   │   │   ├── DateFilter (date input)
│   │   │   └── ElectionCard[]
│   │   │       ├── ElectionBadge (PRESIDENTIAL | GUBERNATORIAL …)
│   │   │       ├── StateLabel
│   │   │       └── ElectionTimeWindow
│   │   └── HowItWorksSection
│   │       └── StepCard[] (Register → Approve → Vote → Confirm)
│   │
│   ├── VoterRegistrationPage          POST /voters/register
│   │   ├── RegistrationForm
│   │   │   ├── FirstNameInput
│   │   │   ├── LastNameInput
│   │   │   ├── DateOfBirthInput
│   │   │   ├── StateOfResidenceSelect (State enum)
│   │   │   ├── CitizenshipTypeSelect  (CitizenshipType enum)
│   │   │   └── SubmitButton
│   │   ├── SuccessCard
│   │   │   ├── VoterIdDisplay  (NIG-XX-timestamp)
│   │   │   └── CopyToClipboardButton
│   │   └── PendingApprovalNotice
│   │
│   ├── VotingPortalPage               POST /voters/vote
│   │   ├── VoterIdInput
│   │   ├── ElectionSelector
│   │   │   ├── StatePicker
│   │   │   ├── ElectionList            GET /elections/getbystateanddate
│   │   │   └── ElectionCard (selectable)
│   │   ├── CandidateGrid               GET /candidates/getbyelectionId
│   │   │   └── CandidateCard[]
│   │   │       ├── CandidateName
│   │   │       ├── CandidateId
│   │   │       └── SelectCandidateButton
│   │   ├── VoteSummaryModal
│   │   │   ├── SelectedCandidatePreview
│   │   │   ├── ElectionSummary
│   │   │   └── ConfirmVoteButton
│   │   └── VoteInitiatedCard
│   │       ├── JwtTokenInstruction
│   │       └── ConfirmLinkDisplay
│   │
│   ├── VoteConfirmationPage           PUT /voters/complete_vote?token=...
│   │   ├── TokenValidator (reads ?token from URL)
│   │   ├── ConfirmingSpinner
│   │   ├── SuccessBanner
│   │   │   ├── VoteIdDisplay
│   │   │   └── ElectionResultsLink
│   │   └── ExpiredTokenError
│   │
│   ├── PublicResultsPage               GET /votes/candidates-summary
│   │   ├── ElectionPicker
│   │   │   ├── StatePicker (State enum)
│   │   │   ├── ElectionList
│   │   │   └── CategoryBadge
│   │   ├── ResultsTable
│   │   │   ├── CandidateResultRow[]
│   │   │   │   ├── CandidateId
│   │   │   │   ├── CandidateName
│   │   │   │   ├── VoteCount
│   │   │   │   └── VoteBar (visual progress)
│   │   │   └── TotalVotesFooter
│   │   └── ResultsBarChart (recharts / chart.js)
│   │
│   └── Admin Section (requires electorateId in localStorage)
│       │
│       ├── AdminLoginPage              POST /electorates/login
│       │   ├── ElectorateIdInput
│       │   ├── LoginButton
│       │   └── OnSuccess → save electorateId to localStorage → redirect /admin
│       │
│       ├── AdminDashboardPage
│       │   ├── SummaryCards
│       │   │   ├── TotalVotersCard     GET /voters/all
│       │   │   ├── TotalElectionsCard  GET /elections
│       │   │   ├── TotalCandidatesCard GET /candidates
│       │   │   └── TotalVotesCard      GET /votes/all
│       │   └── QuickLinks (Elections | Candidates | Voters | Votes)
│       │
│       ├── AdminElectionsPage          GET /elections
│       │   ├── ElectionTable
│       │   │   └── ElectionRow[] (electionId, category, state, date, time window)
│       │   ├── UploadElectionsPanel    POST /elections/upload
│       │   │   ├── CsvDropzone
│       │   │   ├── CsvPreviewTable
│       │   │   └── UploadButton
│       │   └── ElectionFilterBar (state, date)
│       │
│       ├── AdminCandidatesPage         GET /candidates
│       │   ├── CandidateTable
│       │   │   └── CandidateRow[] (candidateId, name, electionId, votes)
│       │   ├── ElectionIdFilter        GET /candidates/getbyelectionId
│       │   └── UploadCandidatesPanel   POST /candidates/upload
│       │       ├── CsvDropzone
│       │       ├── CsvPreviewTable
│       │       └── UploadButton
│       │
│       ├── AdminVotersPage
│       │   ├── StatusFilterTabs (All | Pending | Approved)
│       │   │   ├── All tab          → GET /voters/all
│       │   │   ├── Pending tab      → GET /electorates/voters?status=PENDING
│       │   │   └── Approved tab     → GET /electorates/voters?status=APPROVED
│       │   ├── VoterTable
│       │   │   └── VoterRow[]
│       │   │       ├── VoterIdDisplay
│       │   │       ├── FullName
│       │   │       ├── State
│       │   │       ├── StatusBadge (PENDING | APPROVED)
│       │   │       └── ApproveButton  POST /electorates/approve-voter
│       │   │           (hidden when status is already APPROVED)
│       │   └── VoterSearchBar (client-side filter by voterId / name)
│       │
│       ├── AdminElectoratesPage        GET /electorates
│       │   ├── ElectorateTable
│       │   │   └── ElectorateRow[] (electorateId, name, permissions[])
│       │   └── CreateElectoratePanel   POST /electorates
│       │       ├── ElectorateForm
│       │       │   ├── FirstNameInput
│       │       │   ├── LastNameInput
│       │       │   ├── DateOfBirthInput
│       │       │   ├── CitizenshipTypeSelect
│       │       │   └── NewElectorateIdInput
│       │       │   (assignerElectorateId auto-injected from localStorage)
│       │       └── SubmitButton
│       │
│       ├── AdminPermissionsPage
│       │   ├── AssignPermissionForm    POST /electorates/assign-permission
│       │   │   ├── UserIdInput (voterId or electorateId)
│       │   │   ├── PermissionSelect (Permission enum)
│       │   │   └── AssignButton
│       │   └── RemovePermissionForm    POST /electorates/remove-permission
│       │       ├── UserIdInput
│       │       ├── PermissionSelect
│       │       └── RemoveButton
│       │
│       └── AdminVotesPage              GET /votes/all
│           ├── PaginationControls
│           ├── VoteTable
│           │   └── VoteRow[]
│           │       ├── ElectionId
│           │       ├── CandidateId
│           │       ├── HashedVoterId (truncated)
│           │       ├── VoteStatusBadge (DEFAULTED | VOTED)
│           │       └── Timestamps (createdAt, updatedAt)
│           └── ElectionSummaryPanel   GET /votes/candidates-summary
```

---

## 3. State Management (React Context + useReducer)

```
context/
├── AdminContext.jsx
│   ├── state: { electorateId }   ← seeded from localStorage on mount
│   ├── login(electorateId)       → POST /electorates/login, then localStorage.setItem
│   ├── logout()                  → localStorage.removeItem, redirect /admin/login
│   └── AdminProvider wraps /admin routes
│
├── ElectionContext.jsx
│   ├── state: { elections, selectedElection, selectedState, selectedDate }
│   ├── actions: SET_ELECTIONS, SET_SELECTED_ELECTION, SET_FILTERS
│   └── ElectionProvider wraps voting + results pages
│
└── VotingContext.jsx
    ├── state: { voterId, selectedCandidate, voteToken }
    ├── actions: SET_VOTER_ID, SET_CANDIDATE, SET_TOKEN, CLEAR_SESSION
    └── VotingProvider wraps /vote pages

Local component state (useState) used for:
- Form field values
- Loading / error flags
- Modal open/close
- Pagination page number
```

---

## 4. API Service Layer

```
services/
├── voterService.js
│   ├── registerVoter(voterData)             → POST /voters/register
│   ├── initiateVote(voteData)               → POST /voters/vote
│   ├── confirmVote(token)                   → PUT  /voters/complete_vote?token=
│   └── getAllVoters(electorateId)           → GET  /voters/all
│
├── electionService.js
│   ├── getAllElections()                     → GET  /elections
│   ├── getElectionsByState(state)            → GET  /elections/getbystate
│   ├── getElectionsByStateAndDate(s, d)      → GET  /elections/getbystateanddate
│   └── uploadElections(electorateId, file)  → POST /elections/upload
│
├── candidateService.js
│   ├── getAllCandidates()                    → GET  /candidates
│   ├── getCandidatesByElectionId(id)        → GET  /candidates/getbyelectionId
│   └── uploadCandidates(electorateId, file) → POST /candidates/upload
│
├── voteService.js
│   ├── getAllVotes(electorateId, page, size) → GET  /votes/all
│   ├── getCandidatesSummary(electionId)     → GET  /votes/candidates-summary
│   └── getCandidateSummary(candidateId)     → GET  /votes/candidate-summary
│
└── electorateService.js
    ├── loginElectorate(electorateId)              → POST /electorates/login
    ├── getAllElectorates(electorateId)             → GET  /electorates
    ├── getVotersByStatus(electorateId, status)    → GET  /electorates/voters?status=
    ├── createElectorate(data, assignerId)         → POST /electorates
    ├── approveVoter(voterId, electorateId)        → POST /electorates/approve-voter
    ├── assignPermission(data)                     → POST /electorates/assign-permission
    └── removePermission(data)                    → POST /electorates/remove-permission
```

---

## 5. Shared / Reusable Components

```
components/
├── ui/
│   ├── Button.jsx          (primary | secondary | danger variants)
│   ├── Input.jsx
│   ├── Select.jsx          (wraps State, Category, CitizenshipType constants)
│   ├── Badge.jsx           (status badges: PENDING, APPROVED, VOTED …)
│   ├── Modal.jsx
│   ├── Spinner.jsx
│   ├── ErrorAlert.jsx
│   ├── SuccessAlert.jsx
│   ├── Table.jsx           (sortable, generic)
│   └── Pagination.jsx
│
├── forms/
│   ├── CsvDropzone.jsx     (file input, validates .csv type)
│   └── CsvPreviewTable.jsx (renders first N rows before upload)
│
├── charts/
│   └── VoteBarChart.jsx    (horizontal bar per candidate)
│
└── guards/
    └── AdminGuard.jsx      (redirects to /admin if electorateId not set)
```

---

## 6. User Role Flows

### Public Visitor
```
Landing → View upcoming elections (filter by state/date) → View results
```

### Voter (APPROVED)
```
Landing
  → Register (/register) — submit form, receive voterId, status=PENDING
  → [Wait for Electorate approval]
  → Vote Portal (/vote)
       → Enter voterId
       → Select election (filtered by state/date)
       → Browse candidates for that election
       → Select candidate → confirm in modal → POST /voters/vote
       → Receive JWT link
       → Click link → GET /vote/confirm?token=...
       → PUT /voters/complete_vote → Success screen
  → Results (/results) — view live vote counts
```

### Electorate (Admin)
```
Admin Login (/admin/login)
  → Enter electorateId (e.g. ELECTORATE-001)
  → POST /electorates/login — validates electorateId exists
  → On success: save electorateId to localStorage → redirect to /admin
  → On fail: show "Electorate not found" error

Admin Dashboard (/admin) — electorateId read from localStorage for all requests
  → Elections (/admin/elections)
       → View all elections
       → Upload elections CSV  (electorateId auto-sent from localStorage)
  → Candidates (/admin/candidates)
       → View all candidates (filter by electionId)
       → Upload candidates CSV (electorateId auto-sent from localStorage)
  → Voters (/admin/voters)
       → All tab: GET /voters/all
       → Pending tab: GET /electorates/voters?status=PENDING  (electorateId auto-sent)
       → Approved tab: GET /electorates/voters?status=APPROVED (electorateId auto-sent)
       → Approve voter → POST /electorates/approve-voter (electorateId auto-sent)
  → Electorates (/admin/electorates)
       → View all electorates
       → Create new electorate → POST /electorates
         (assignerElectorateId auto-sent from localStorage — no manual input)
  → Permissions (/admin/permissions)
       → Assign / remove permission to any user
         (assignerElectorateId auto-sent from localStorage)
  → Votes (/admin/votes)
       → Paginated vote log
       → Candidate vote summary per election
  → Logout: clear electorateId from localStorage → redirect to /admin/login
```

---

## 7. Constants Reference (for Select options)

```javascript
// maps directly to backend enums — stored in src/constants/enums.js

export const STATE = [
  'ABIA', 'ADAMAWA', 'AKWA_IBOM', 'ANAMBRA', 'BAUCHI', 'BAYELSA', 'BENUE', 'BORNO',
  'CROSS_RIVER', 'DELTA', 'EBONYI', 'EDO', 'EKITI', 'ENUGU', 'GOMBE', 'IMO',
  'JIGAWA', 'KADUNA', 'KANO', 'KATSINA', 'KEBBI', 'KOGI', 'KWARA', 'LAGOS',
  'NASARAWA', 'NIGER', 'OGUN', 'ONDO', 'OSUN', 'OYO', 'PLATEAU', 'RIVERS',
  'SOKOTO', 'TARABA', 'YOBE', 'ZAMFARA', 'FCT', 'NATIONAL'
];

export const CATEGORY = [
  'PRESIDENTIAL', 'GUBERNATORIAL', 'SENATORIAL',
  'STATE_REPRESENTATIVE', 'STATE_ASSEMBLY', 'LOCAL_COUNSELOR'
];

export const CITIZENSHIP_TYPE = [
  'NATURALIZATION', 'REGISTRATION', 'DUAL_CITIZENSHIP', 'HONORARY'
];

export const PERMISSION = [
  'CAN_VOTE', 'CAN_UPLOAD_FILE', 'CAN_APPROVE_VOTER',
  'CAN_VIEW_METRICS', 'CAN_VIEW_ELECTORATE', 'CAN_VIEW_VOTE',
  'CAN_UPDATE_ELECTORATE'
  // dynamic entries: 'CAN_VOTE_[STATE]'
];
```

---

## 8. Directory Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── main.jsx
│   ├── App.jsx                  (router setup)
│   ├── constants/
│   │   └── enums.js             (STATE, CATEGORY, CITIZENSHIP_TYPE, PERMISSION arrays)
│   ├── services/                (API calls — section 4)
│   ├── context/                 (React Context providers — section 3)
│   ├── pages/                   (one file per route — section 2)
│   │   ├── LandingPage.jsx
│   │   ├── VoterRegistrationPage.jsx
│   │   ├── VotingPortalPage.jsx
│   │   ├── VoteConfirmationPage.jsx
│   │   ├── PublicResultsPage.jsx
│   │   └── admin/
│   │       ├── AdminLoginPage.jsx
│   │       ├── AdminDashboardPage.jsx
│   │       ├── AdminElectionsPage.jsx
│   │       ├── AdminCandidatesPage.jsx
│   │       ├── AdminVotersPage.jsx
│   │       ├── AdminElectoratesPage.jsx
│   │       ├── AdminPermissionsPage.jsx
│   │       └── AdminVotesPage.jsx
│   ├── components/              (shared components — section 5)
│   ├── hooks/                   (custom hooks wrapping service calls + useState)
│   │   ├── useVoters.js
│   │   ├── useElections.js
│   │   ├── useCandidates.js
│   │   ├── useVotes.js
│   │   └── useElectorates.js
│   └── utils/
│       ├── formatDate.js
│       ├── formatVoterId.js
│       └── apiClient.js         (axios instance with base URL & error handling)
├── tailwind.config.js
└── vite.config.js
```

---

## 9. Key UX Constraints

| Constraint | Where it surfaces |
|---|---|
| Voter must be APPROVED before voting | VotingPortalPage shows "pending approval" if POST /voters/vote returns 403 |
| Voting is two-step (initiate → confirm) | VoteConfirmationPage reads `?token` from URL; expired token shows error |
| Voter can only vote in their state's elections | CandidateGrid filtered by elections matching voter's state |
| One vote per voter per election | Second POST /voters/vote returns 409; UI shows "already voted" |
| Election times must be respected | CandidateGrid disabled outside election time window |
| Electorate ID required for all admin actions | AdminGuard redirects unauthorized users; electorateId sent as query param |
| CSV upload only (no manual entry for elections/candidates) | Upload panels enforce .csv MIME type via CsvDropzone |
