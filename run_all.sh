#!/bin/bash

echo "Cleaning up existing processes on ports 3000, 5001, 5002, 4200..."
lsof -ti :3000,5001,5002,4200 | xargs kill -9 2>/dev/null

# Get the directory where the script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Starting Backend Gateway Service (Port 3000)..."
cd "$DIR/backend/gateway-service" || exit
npm run dev &

echo "Starting User Service (Port 5001)..."
cd "$DIR/backend/user-service" || exit
npm run dev &

echo "Starting Auth Service (Port 5002)..."
cd "$DIR/backend/auth-service" || exit
npm run start &

echo "Starting Angular Frontend (Port 4200)..."
cd "$DIR/frontend" || exit
npm run start &

echo "All services are starting up..."
echo "Press Ctrl+C to stop all services."

# Wait for all background jobs to finish (which is never unless killed)
wait
