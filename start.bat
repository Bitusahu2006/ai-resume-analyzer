@echo off
REM ============================================
REM AI Resume Analyzer - Startup Script
REM ============================================

echo.
echo ╔════════════════════════════════════════════════────────────────╗
echo ║   AI RESUME ANALYZER - STARTING SERVERS                        ║
echo ║   Frontend: http://localhost:8888                             ║
echo ║   Backend API: http://localhost:8000                          ║
echo ║   API Docs: http://localhost:8000/docs                        ║
echo ╚════════════════════════════════════════════════────────────────╝
echo.

REM Change to project directory
cd /d "%~dp0"

REM Start backend in a new window
echo [1/2] Starting FastAPI Backend Server...
start cmd /k "title Backend API Server && .venv\Scripts\python.exe backend\main.py"

REM Wait 2 seconds for backend to start
timeout /t 2 /nobreak

REM Start frontend in a new window
echo [2/2] Starting Frontend Web Server...
start cmd /k "title Frontend Web Server && .venv\Scripts\python.exe -m http.server 8888 --directory frontend"

REM Wait for servers to fully start
timeout /t 2 /nobreak

echo.
echo ✓ Both servers are starting...
echo.
echo Opening Frontend in Browser...
timeout /t 2 /nobreak

REM Open frontend in default browser
start http://localhost:8888

echo.
echo ════════════════════════════════════════════════════════════════
echo ✓ AI Resume Analyzer is ready!
echo.
echo Frontend:    http://localhost:8888
echo Backend API: http://localhost:8000
echo API Docs:    http://localhost:8000/docs
echo.
echo Press Ctrl+C in the terminal windows to stop the servers
echo ════════════════════════════════════════════════════════════════
echo.
pause
