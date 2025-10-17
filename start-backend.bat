@echo off
echo Starting Career Compass Backend Setup...

cd backend

echo Installing dependencies...
npm install

echo Creating .env file...
if not exist .env (
    copy env.example .env
    echo Please update the .env file with your configuration
)

echo Starting the backend server...
npm run dev

pause













