#!/bin/bash

# Start remaining Crystal sessions for AeroPlay development

CRYSTAL_DB="$HOME/.crystal/sessions.db"

echo "Starting Backend Services session..."
sqlite3 "$CRYSTAL_DB" <<EOF
UPDATE sessions
SET status = 'initializing',
    updated_at = datetime('now'),
    run_started_at = datetime('now')
WHERE id = '85a3598e-0421-418e-9b65-e6dac3613512';
EOF

echo "Starting Games Development session..."
sqlite3 "$CRYSTAL_DB" <<EOF
UPDATE sessions
SET status = 'initializing',
    updated_at = datetime('now'),
    run_started_at = datetime('now')
WHERE id = 'c317262f-9b27-413a-a855-f93a0bf57853';
EOF

echo "Starting Testing & QA session..."
sqlite3 "$CRYSTAL_DB" <<EOF
UPDATE sessions
SET status = 'initializing',
    updated_at = datetime('now'),
    run_started_at = datetime('now')
WHERE id = '94f33e1a-abff-4225-9747-89e124a030e3';
EOF

echo "✅ Sessions marked for starting!"
echo ""
echo "Note: You need to click 'Start' on each session in the Crystal UI to actually launch them."
echo "Crystal will pick up the status changes and show them as ready to run."