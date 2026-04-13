# ============================================
# AI Resume Analyzer - PowerShell Startup Script
# ============================================

Write-Host ""
Write-Host "╔════════════════════════════════════════════════────────════════╗"
Write-Host "║   AI RESUME ANALYZER - STARTING SERVERS                        ║"
Write-Host "║   Frontend: http://localhost:8888                             ║"
Write-Host "║   Backend API: http://localhost:8000                          ║"
Write-Host "║   API Docs: http://localhost:8000/docs                        ║"
Write-Host "╚════════════════════════════════════════════════════════════════╝"
Write-Host ""

# Get the directory of this script
$scriptDir = Split-Path -Parent (Resolve-Path $MyInvocation.MyCommand.Path)
Set-Location $scriptDir

Write-Host "[1/2] Starting FastAPI Backend Server..."
$backendCmd = "&`"$scriptDir\.venv\Scripts\python.exe`" backend/main.py"
Start-Process powershell -ArgumentList "-NoExit", "-Command $backendCmd" -WindowStyle Normal

Write-Host "[2/2] Starting Frontend Web Server..."
Start-Sleep -Seconds 2
$frontendCmd = "&`"$scriptDir\.venv\Scripts\python.exe`" -m http.server 8888 --directory frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command $frontendCmd" -WindowStyle Normal

Write-Host ""
Write-Host "✓ Both servers are starting..."
Write-Host ""
Start-Sleep -Seconds 2

Write-Host "Opening Frontend in Browser..."
Start-Process "http://localhost:8888"

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════"
Write-Host "✓ AI Resume Analyzer is ready!"
Write-Host ""
Write-Host "Frontend:    http://localhost:8888"
Write-Host "Backend API: http://localhost:8000"
Write-Host "API Docs:    http://localhost:8000/docs"
Write-Host ""
Write-Host  "Press Ctrl+C in each terminal window to stop the servers"
Write-Host "════════════════════════════════════════════════════════════════"
Write-Host ""

# Keep the window open
Read-Host -Prompt "Press Enter to continue"
