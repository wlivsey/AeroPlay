# Crystal Session Launch Guide

## 🚀 Sessions to Start Now

### 1. Backend Services Session
- **Name in Crystal**: "Backend Services"
- **Location**: `worktrees/backend-services`
- **What it will build**:
  - ContentCache.ts - SQLite route pack storage
  - NotificationService.ts - Landmark alerts
  - TTSService.ts - Text-to-speech narration
  - DriftManager.ts - Timeline adjustments

### 2. Games Development Session
- **Name in Crystal**: "Games Development"
- **Location**: `worktrees/games-development`
- **What it will build**:
  - LiveryMatcher.tsx - Airline logo matching game
  - StateShapeQuiz.tsx - Geography quiz game
  - CloudSpotter.tsx - Cloud identification game
  - Game state management and scoring

### 3. Testing & QA Session
- **Name in Crystal**: "Testing & QA"
- **Location**: `worktrees/testing-qa`
- **What it will build**:
  - Expanded RouteEngine tests
  - Integration test suite
  - Test utilities and fixtures
  - Performance benchmarks

## 📱 How to Start in Crystal

1. **Crystal should now be in focus**
2. Look for the **AeroPlay project** in the sidebar
3. Find these three sessions:
   - "Backend Services"
   - "Games Development"
   - "Testing & QA"
4. **For each session**:
   - Click on the session name
   - Click the **▶️ Start** or **Run** button
   - Claude will begin working immediately

## ⚡ Quick Start All Three

You can start all three sessions rapidly:
1. Click "Backend Services" → Click Start
2. Click "Games Development" → Click Start
3. Click "Testing & QA" → Click Start

They will all run in parallel without conflicts!

## 📊 Expected Results

### Backend Services will create:
```
src/services/
├── ContentCache.ts
├── NotificationService.ts
├── TTSService.ts
└── DriftManager.ts
```

### Games Development will create:
```
src/components/games/
├── LiveryMatcher.tsx
├── StateShapeQuiz.tsx
├── CloudSpotter.tsx
└── GameState.ts
```

### Testing & QA will create:
```
__tests__/
├── RouteEngine.test.ts (expanded)
├── integration/
│   ├── FlightTimeline.test.ts
│   ├── NotificationScheduling.test.ts
│   └── CacheExpiration.test.ts
└── fixtures/
    ├── flightData.ts
    └── landmarks.ts
```

## 🔄 After Sessions Complete

Once all sessions finish (status shows "stopped"):

1. Check the Diff tab in each session to review changes
2. Verify no errors in the output
3. We'll merge all branches back to main

## ⏱️ Estimated Time

- Each session should take 5-10 minutes
- All three can run simultaneously
- Total time: ~10-15 minutes for everything

---

**Ready to start!** Just click Start on each session in Crystal.