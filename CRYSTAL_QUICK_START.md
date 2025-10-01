# Crystal Quick Start Guide for AeroPlay

## ✅ Sessions Created

Crystal is now running with 4 development sessions ready to start:

### 1. 🎨 UI/UX Development
- **Location**: `worktrees/ui-development`
- **Focus**: Screens, components, animations
- **Status**: Ready to start

### 2. ⚙️ Backend Services
- **Location**: `worktrees/backend-services`
- **Focus**: Content caching, notifications, TTS
- **Status**: Ready to start

### 3. 🎮 Games Development
- **Location**: `worktrees/games-development`
- **Focus**: Educational mini-games
- **Status**: Ready to start

### 4. 🧪 Testing & QA
- **Location**: `worktrees/testing-qa`
- **Focus**: Comprehensive test suite
- **Status**: Ready to start

## 🚀 How to Start Sessions

1. **Crystal app should now show** the AeroPlay project with 4 new sessions
2. **Click on any session** to select it
3. **Click "Start Session"** button to launch Claude
4. **Claude will start** with the pre-configured prompt for that development area

## 💡 Tips for Running Sessions

### Start Order Recommendation:
1. Start **UI Development** first (creates base components)
2. Start **Backend Services** second (creates services UI needs)
3. Start **Games Development** third (uses both UI and services)
4. Start **Testing & QA** last (tests everything)

### Running in Parallel:
- You can run all 4 sessions simultaneously
- Each works in its own git branch
- No conflicts between sessions
- Crystal manages everything automatically

### Monitoring Progress:
- Each session shows status (running/waiting/stopped)
- Output appears in real-time
- Use the Diff tab to see changes
- Terminal tab for running commands

## 🔄 Workflow

1. **Start sessions** → They begin implementing their areas
2. **Monitor progress** → Watch output and diffs
3. **Sessions coordinate** → They reference shared code
4. **Merge when ready** → Each branch can be merged to main

## 📝 Session Commands

When a session needs your input:
- **To continue**: Just type your response
- **To run tests**: Ask "run the tests"
- **To see changes**: Check the Diff tab
- **To commit**: Ask "commit changes with message: [your message]"

## 🎯 First Tasks for Each Session

### UI Development will:
- Create App.tsx with navigation
- Build HomeScreen component
- Set up basic styling

### Backend Services will:
- Create ContentCache.ts
- Build NotificationService.ts
- Set up SQLite database

### Games Development will:
- Create LiveryMatcher.tsx
- Build game state management
- Add animations

### Testing & QA will:
- Expand RouteEngine tests
- Create test utilities
- Set up test coverage

---

**Crystal is ready!** Just click on any session in the Crystal app to begin development. The sessions will automatically start working on AeroPlay based on their specialized prompts.