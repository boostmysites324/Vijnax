#!/bin/bash

echo "Starting Career Compass Backend Setup..."

cd backend

echo "Installing dependencies..."
npm install

echo "Creating .env file..."
if [ ! -f .env ]; then
    cp env.example .env
    echo "Please update the .env file with your configuration"
fi

echo "Starting the backend server..."
npm run dev













