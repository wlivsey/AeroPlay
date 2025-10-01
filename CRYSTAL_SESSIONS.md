# Crystal Session Prompts for AeroPlay Development

## Session 1: UI/UX Development
**Branch**: `feature/ui-development`
**Worktree**: `worktrees/ui-development`

### Initial Prompt:
```
You are developing the UI/UX for AeroPlay, a kids' in-flight travel companion app. Focus on:

1. Implement the main screens using React Native and Expo:
   - HomeScreen with flight setup
   - PreFlightScreen for route pack downloads
   - InFlightScreen with timeline and progress
   - GamesScreen with mini-games menu
   - ParentDashboard for settings

2. Create reusable components in src/components/:
   - SafeAreaView wrapper
   - ThemedText with kid-friendly fonts
   - LoadingSpinner with airplane animation
   - LandmarkCard with swipe gestures
   - WindowAlert with left/right indicators

3. Design considerations:
   - Large touch targets (44pt minimum)
   - High contrast for readability
   - Fun animations using Lottie
   - Accessibility support with screen readers

Use the existing RouteEngine in src/services/RouteEngine.ts for calculations.
Reference CLAUDE.md for the complete design specifications.
```

## Session 2: Backend Services
**Branch**: `feature/backend-services`
**Worktree**: `worktrees/backend-services`

### Initial Prompt:
```
You are implementing backend services for AeroPlay. Focus on:

1. Create ContentCache service using expo-sqlite:
   - Store route packs locally
   - Implement 30-day cache expiration
   - Handle offline/online detection
   - Compress data with MessagePack

2. Implement NotificationService:
   - Schedule landmark alerts (5 min before viewing)
   - "Look left/right" notifications
   - Achievement unlocks
   - Parent-configured quiet times

3. Build TTSService with expo-speech:
   - Narrate landmark descriptions
   - Read achievement badges
   - Support multiple languages
   - Adjustable speech rate for age groups

4. Create DriftManager for timeline adjustments:
   - Handle departure delays
   - Adjust for early/late arrivals
   - Recalculate landmark ETAs

Reference the RouteEngine API and CLAUDE.md specifications.
```

## Session 3: Games Development
**Branch**: `feature/games-development`
**Worktree**: `worktrees/games-development`

### Initial Prompt:
```
You are building educational mini-games for AeroPlay. Create three games:

1. LiveryMatcher game:
   - Match airline logos to tail designs
   - Progressive difficulty levels
   - Time-based challenges
   - Unlock rare liveries as rewards
   - Store high scores locally

2. StateShapeQuiz:
   - Identify states/countries from outlines
   - Use landmarks passed as hints
   - Support multiplayer with seat neighbor
   - Age-appropriate difficulty settings

3. CloudSpotter:
   - Identify cloud types from illustrations
   - Weather prediction mini-lessons
   - Achievement badges for completion
   - Parent-approved educational content

Requirements:
- Offline-only operation
- Touch-friendly for kids
- Engaging animations with Lottie
- Save progress in MMKV storage

Use React Native components and follow the game designs in CLAUDE.md.
```

## Session 4: Testing & QA
**Branch**: `feature/testing-qa`
**Worktree**: `worktrees/testing-qa`

### Initial Prompt:
```
You are the QA engineer for AeroPlay. Implement comprehensive testing:

1. Expand RouteEngine tests in __tests__/:
   - Test all major flight routes (LAX-JFK, DFW-ORD, etc.)
   - Verify landmark detection within 80km corridor
   - Test edge cases (polar routes, date line crossing)
   - Performance tests for 1000+ landmarks

2. Create integration tests:
   - Flight timeline accuracy (±5 min tolerance)
   - Notification scheduling
   - Cache expiration and cleanup
   - Offline mode functionality

3. Build test utilities:
   - Mock flight data generator
   - Landmark fixture data
   - Time manipulation helpers
   - Performance benchmarking

4. Implement QA test matrix from CLAUDE.md:
   - Flight duration scenarios
   - Time of day variations
   - Seat position testing
   - Schedule variance handling

Use Jest and React Native Testing Library. Ensure 80% code coverage.
```

## How to Use These Sessions in Crystal

1. Open Crystal application
2. Select the AeroPlay project
3. Click "Create Session"
4. For each session:
   - Use the corresponding prompt above
   - Select the appropriate worktree path
   - Name it according to the focus area
5. Run sessions in parallel for maximum productivity

## Coordination Between Sessions

- UI session creates components that backend session integrates
- Games session uses services from backend session
- Testing session validates all other sessions' work
- Use git to merge completed features back to main

## Progress Tracking

Each session should maintain its own todo list:
- [ ] Initial setup and dependencies
- [ ] Core feature implementation
- [ ] Integration with other modules
- [ ] Testing and validation
- [ ] Documentation updates
- [ ] Ready for merge