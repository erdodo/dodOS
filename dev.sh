#!/bin/bash

# Check if the script is run with superuser privileges
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 
   exit 1
fi

# Start Gunicorn with 4 workers, binding to 0.0.0.0:5000
gunicorn -w 4 -b 0.0.0.0:5000 main:app &
GUNICORN_PID=$!

# Navigate to the frontend directory and start the Next.js development server
cd ./frontend/dev || exit
npm run dev &
NEXT_PID=$!

# Navigate back to the root directory and start the terminal script
cd - || exit
python3 terminal.py &
TERMINAL_PID=$!

# Function to stop all processes
function stop_processes {
   echo "Stopping Gunicorn, Next.js, and terminal.py..."
   kill $GUNICORN_PID
   kill $NEXT_PID
   kill $TERMINAL_PID
   exit 0
}

# Trap SIGINT and SIGTERM to stop processes cleanly
trap stop_processes SIGINT SIGTERM

# Wait for all processes to complete
wait $GUNICORN_PID
wait $NEXT_PID
wait $TERMINAL_PID
