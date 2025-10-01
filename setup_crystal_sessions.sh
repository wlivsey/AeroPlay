#!/bin/bash

# Setup Crystal sessions for AeroPlay development

CRYSTAL_DB="$HOME/.crystal/sessions.db"
PROJECT_ID=2  # AeroPlay project ID

# Function to generate UUID
generate_uuid() {
    uuidgen | tr '[:upper:]' '[:lower:]'
}

# Session 1: UI/UX Development
echo "Creating UI/UX Development session..."
UI_SESSION_ID=$(generate_uuid)
sqlite3 "$CRYSTAL_DB" <<EOF
INSERT INTO sessions (
    id, name, initial_prompt, worktree_name, worktree_path,
    status, project_id, tool_type, display_order
) VALUES (
    '$UI_SESSION_ID',
    'UI/UX Development',
    'You are developing the UI/UX for AeroPlay, a kids'' in-flight travel companion app. Focus on:

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
Reference CLAUDE.md for the complete design specifications.',
    'ui-development',
    '/Users/willlivsey/Desktop/AeroPlay/worktrees/ui-development',
    'pending',
    $PROJECT_ID,
    'claude',
    1
);
EOF

# Session 2: Backend Services
echo "Creating Backend Services session..."
BACKEND_SESSION_ID=$(generate_uuid)
sqlite3 "$CRYSTAL_DB" <<EOF
INSERT INTO sessions (
    id, name, initial_prompt, worktree_name, worktree_path,
    status, project_id, tool_type, display_order
) VALUES (
    '$BACKEND_SESSION_ID',
    'Backend Services',
    'You are implementing backend services for AeroPlay. Focus on:

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

Reference the RouteEngine API and CLAUDE.md specifications.',
    'backend-services',
    '/Users/willlivsey/Desktop/AeroPlay/worktrees/backend-services',
    'pending',
    $PROJECT_ID,
    'claude',
    2
);
EOF

# Session 3: Games Development
echo "Creating Games Development session..."
GAMES_SESSION_ID=$(generate_uuid)
sqlite3 "$CRYSTAL_DB" <<EOF
INSERT INTO sessions (
    id, name, initial_prompt, worktree_name, worktree_path,
    status, project_id, tool_type, display_order
) VALUES (
    '$GAMES_SESSION_ID',
    'Games Development',
    'You are building educational mini-games for AeroPlay. Create three games:

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

Use React Native components and follow the game designs in CLAUDE.md.',
    'games-development',
    '/Users/willlivsey/Desktop/AeroPlay/worktrees/games-development',
    'pending',
    $PROJECT_ID,
    'claude',
    3
);
EOF

# Session 4: Testing & QA
echo "Creating Testing & QA session..."
QA_SESSION_ID=$(generate_uuid)
sqlite3 "$CRYSTAL_DB" <<EOF
INSERT INTO sessions (
    id, name, initial_prompt, worktree_name, worktree_path,
    status, project_id, tool_type, display_order
) VALUES (
    '$QA_SESSION_ID',
    'Testing & QA',
    'You are the QA engineer for AeroPlay. Implement comprehensive testing:

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

Use Jest and React Native Testing Library. Ensure 80% code coverage.',
    'testing-qa',
    '/Users/willlivsey/Desktop/AeroPlay/worktrees/testing-qa',
    'pending',
    $PROJECT_ID,
    'claude',
    4
);
EOF

echo "✅ All Crystal sessions created successfully!"
echo ""
echo "Sessions created:"
echo "1. UI/UX Development (ID: $UI_SESSION_ID)"
echo "2. Backend Services (ID: $BACKEND_SESSION_ID)"
echo "3. Games Development (ID: $GAMES_SESSION_ID)"
echo "4. Testing & QA (ID: $QA_SESSION_ID)"
echo ""
echo "Now refresh Crystal app to see the new sessions!"