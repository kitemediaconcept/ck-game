# COREKRAFT — Crack the Christmas Box (Sliding Puzzle Campaign)

A festive corporate holiday campaign web app featuring an authentic 15-tile sliding puzzle where players reconstruct a premium Corekraft executive gift hamper under a 90-second countdown, complete with ribbon-opening victory animations, downloadable scorecards, lead capture, and organizer analytics.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following directions have been confirmed and incorporated into the design:
> - **Visual Atmosphere**: Luxury Midnight Emerald (`#0A1D1A` / `#0E2A24`), Champagne Gold accents (`#E5C07B` / `#D4AF37`), and festive warm white typography.
> - **Audio Synthetics**: Web Audio API oscillator synthesis providing crisp wooden tile slide clicks, hint chimes, and a celebratory brass/bell victory jingle, paired with a persistent mute toggle.
> - **Admin & Analytics Access**: Discreet footer trigger protected by passkey authentication (default passcode: `corekraft2026` or customizable), keeping the main game UI clean and customer-facing.

---

### 1. Overview & Core Concept

- **What It Does**: Replaces the previous memory-matching game with an authentic, mathematically sound 4×4 sliding image puzzle (15 numbered image tiles + 1 blank slot). Players solve the scrambled Corekraft gift hamper within 90 seconds using intuitive click/tap or keyboard controls.
- **Target Audience**: Corporate clients, HR managers, executive decision-makers, and team leaders looking for bespoke corporate Christmas hampers and branded employee gifts.
- **Key Value**: Delivers high engagement through a genuinely solvable, challenging puzzle that naturally showcases Corekraft's physical gift products (bespoke debossed notebook, precision pen, insulated bottle, ceramic mug, brass keychain) and converts engaged players directly into qualified corporate gifting leads.

---

### 2. User Experience & Visual Design

#### A. Key User Flows

```
┌────────────────────────────────────────────────────────────────────────┐
│                          1. LANDING & RULES                            │
│  • Corekraft logo & holiday campaign lockup                            │
│  • Headline: "Can You Crack the Christmas Box?"                        │
│  • Subtitle: "15 tiles. 90 seconds. One perfectly packed gift."        │
│  • 5-second completed gift hamper preview + rules explanation          │
│  • Primary CTA: [Accept the Challenge]                                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Click "Accept the Challenge" / "Begin"
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          2. THE PUZZLE ARENA                           │
│  • Top HUD: 90s countdown, moves count, hints remaining (2 available)  │
│  • 4×4 Grid: Solvable scrambled state (150 legal moves, Manhattan ≥30) │
│  • Tile controls: Tap/click adjacent tile, or Arrow / WASD keys        │
│  • Hint Button: 3-second reference reveal (timer continues running)    │
│  • Audio mute toggle & high-contrast tile number toggle                │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
        Solved before 0s                             │ Timer hits 0s
                    ▼                                ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────┐
│         3A. VICTORY REVEAL           │  │      3B. TIMEOUT MODAL       │
│ • Timer stops immediately            │  │ • Board locked               │
│ • Empty tile snaps into place        │  │ • "The Christmas Box Is      │
│ • Ribbon unties & golden glow        │  │    Still Locked!"            │
│ • Time, Moves, Hints Used scorecard  │  │ • [Try Again]                │
│ • [Download Score Card] (PNG canvas) │  │ • [Practise Without a Timer] │
│ • [Copy Social Share Text]           │  │   (clearly marked practice)  │
└───────────────────┬──────────────────┘  └──────────────┬───────────────┘
                    │                                    │
                    └──────────────────┬─────────────────┘
                                       ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     4. CONVERSION LEAD WORKFLOW                        │
│  • Banner: "Looking for Christmas Gifts for Your Team?"                │
│  • CTA: [Plan My Corporate Gifts]                                      │
│  • Modal Enquiry Form: Name, Corporate Email, Company, Team Size,      │
│    Budget per Hamper, Preferred Delivery Date, Custom Notes            │
│  • Instant confirmation & download Corekraft 2026 Holiday Lookbook     │
└────────────────────────────────────────────────────────────────────────┘
```

#### B. Visual Identity & Palette (Midnight Emerald & Festive Gold)
- **Neutral Canvas (60%)**: Deep obsidian emerald (`#061614` background, `#0B221E` container surfaces) with subtle micro-snow particles and festive ambient depth.
- **Structural Surfaces (30%)**: Polished gold-rimmed gift box container (`#132E29`), card frames (`#1A3D37`), and subtle hairline borders (`rgba(229, 192, 123, 0.2)`).
- **Focal Accent (10%)**: Champagne Gold metallic gradients (`#F3E7C4` to `#D4AF37`) for primary CTAs, timer rings, and win accents; Corekraft Coral-Pink (`#FF5C5C`) on the brand wordmark crown.
- **Typography**: Clean luxury styling with bold display headings, tabular numerals for the timer/moves readouts, and accessible tile number identifiers.

---

### 3. Key Product Decisions & Trade-Offs

#### 1. Guaranteed Solvability via Inverse Simulation
- *Chosen Approach*: Never generate random board permutations (which create 50% unsolvable states in the 15-puzzle). Instead, start from the solved state (tiles 1–15 in order, empty slot at index 15) and perform **150 legal random slide moves**, rejecting immediate reversals and verifying total Manhattan distance $\ge 30$ (excluding blank).
- *Benefit*: 100% mathematically solvable, non-trivial, robust, and zero deadlocks. Configurable difficulty settings allow easy tuning.

#### 2. Deadline-Based Timer (`Date.now() + duration`)
- *Chosen Approach*: Track the deadline timestamp rather than naive `setInterval(..., 1000)`.
- *Benefit*: If a user switches browser tabs or minimizes their phone browser, the timer remains strictly accurate and cannot be cheated.

#### 3. High-Fidelity Gift Hamper Artwork
- *Chosen Approach*: Render an ultra-detailed, photorealistic luxury corporate gift hamper containing all specified items (Corekraft debossed leatherette notebook, matte black stylus pen, double-wall stainless steel bottle, ceramic mug with gold rim, and brass keychain, nestled in shredded Kraft paper and festive pinecone accents).
- *Benefit*: Each of the 16 tiles has distinctive textures, colors, and edges, avoiding confusing blank areas.

#### 4. Downloadable Branded Scorecard & Social Share
- *Chosen Approach*: An offscreen HTML5 `<canvas>` that composes the Corekraft logo, player completion time, move count, hints used, festive holiday artwork, and campaign URL into a crisp 1200×630 shareable PNG card.

#### 5. Practice Mode vs. Challenge Mode
- *Chosen Approach*: Practice mode displays an explicit badge ("Practice Mode — Untimed"), removes the countdown, and does not register as a timed challenge win in the leaderboard or analytics.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           APPLICATION STATE                             │
│                                                                         │
│  ┌───────────────────────┐  ┌───────────────────┐  ┌─────────────────┐  │
│  │     Puzzle State      │  │    Timer State    │  │ Campaign Engine │  │
│  │ • board: number[16]   │  │ • deadline: number│  │ • mode:         │  │
│  │ • emptyPos: number    │  │ • remaining: sec  │  │   challenge/    │  │
│  │ • moves: number       │  │ • isRunning: bool │  │   practice      │  │
│  │ • hintsRemaining: 2   │  │ • isHintActive    │  │ • stats:        │  │
│  │ • isSolved: boolean   │  │                   │  │   starts/wins   │  │
│  └───────────────────────┘  └───────────────────┘  └─────────────────┘  │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
         ┌───────────────────────────┴───────────────────────────┐
         ▼                                                       ▼
┌─────────────────────────────────┐             ┌─────────────────────────────────┐
│        PUZZLE CONTAINER         │             │       CAMPAIGN ENGAGEMENT       │
│ • Grid 4×4 with CSS transforms  │             │ • 5s Initial Rules & Preview    │
│ • Number overlays (1-15)        │             │ • Victory Modal & Ribbon Unfurl │
│ • Keyboard WASD/Arrow listener  │             │ • Scorecard Canvas Generator    │
│ • Hint overlay (3s modal)       │             │ • Gifting Lead Capture Modal    │
│ • Web Audio Procedural FX       │             │ • Admin Analytics Dashboard     │
└─────────────────────────────────┘             └─────────────────────────────────┘
```

#### Key Components:
1. `src/App.tsx`: Main campaign controller, view router, sound coordinator.
2. `src/components/PuzzleBoard.tsx`: 4×4 grid layout, tile slide calculations, keyboard bindings, touch gestures.
3. `src/components/VictoryModal.tsx`: Ribbon opening animation, stats display, social share, scorecard download.
4. `src/components/TimeoutModal.tsx`: Failure state, retry options, practice mode launch.
5. `src/components/EnquiryModal.tsx`: Corporate gifting enquiry form with client validation.
6. `src/components/AdminDashboard.tsx`: Passkey-protected dashboard with metrics (starts, wins, timeouts, avg moves, leads list).
7. `src/utils/puzzleEngine.ts`: 150-step legal move shuffler, Manhattan distance validator, win checker.
8. `src/utils/soundEffects.ts`: Web Audio API sound synthesizer with mute control.
9. `src/utils/scoreCardGenerator.ts`: HTML5 Canvas export for social sharing.
