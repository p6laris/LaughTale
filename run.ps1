# ==============================================================================
# LaughTale: Master Launch Script (Inline Terminal Execution)
# ==============================================================================
[CmdletBinding()]
param(
    [switch]$Build,
    [switch]$ShowcaseOnly,
    [switch]$DocsOnly,
    [int]$ShowcasePort = 5000,
    [int]$DocsPort = 5001
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " [LaughTale] Modern Islands Architecture Runner" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Cleanly stop any existing instances
Write-Host "`n[1/3] Stopping previously running instances..." -ForegroundColor Yellow
Get-Process -Name "LaughTale.Showcase","LaughTale.Docs" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 400

# 2. Optional build of client assets
if ($Build) {
    Write-Host "`n[2/3] Compiling TypeScript & Islands bundles..." -ForegroundColor Yellow
    
    Push-Location "LaughTale.Client"
    npm run build --silent
    Pop-Location

    Push-Location "LaughTale.Showcase"
    npm run build --silent
    Pop-Location

    Write-Host "Bundles compiled successfully." -ForegroundColor Green
} else {
    Write-Host "`n[2/3] Skipping build step (pass -Build to compile client assets)." -ForegroundColor DarkGray
}

# 3. Launch target application(s) inline
Write-Host "`n[3/3] Launching application(s)..." -ForegroundColor Yellow

if ($ShowcaseOnly) {
    Write-Host "Starting Enterprise Showcase inline at http://localhost:$ShowcasePort..." -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop.`n" -ForegroundColor DarkGray
    dotnet run --project LaughTale.Showcase/LaughTale.Showcase.csproj --urls "http://localhost:$ShowcasePort"
    exit
}

if ($DocsOnly) {
    Write-Host "Starting Documentation Portal inline at http://localhost:$DocsPort..." -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop.`n" -ForegroundColor DarkGray
    dotnet run --project LaughTale.Docs/LaughTale.Docs.csproj --urls "http://localhost:$DocsPort"
    exit
}

# Dual Service Mode: Docs in background hidden process, Showcase in foreground inline
Write-Host "Launching Documentation Portal in background at http://localhost:$DocsPort..." -ForegroundColor Cyan
$docsProcess = Start-Process -FilePath "dotnet" -ArgumentList "run --project LaughTale.Docs/LaughTale.Docs.csproj --urls http://localhost:$DocsPort" -WindowStyle Hidden -PassThru

Write-Host "Launching Enterprise Showcase in foreground at http://localhost:$ShowcasePort..." -ForegroundColor Green
Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Services Running:" -ForegroundColor White
Write-Host "   * Showcase:     http://localhost:$ShowcasePort/enterprise" -ForegroundColor Green
Write-Host "   * Docs Portal:  http://localhost:$DocsPort" -ForegroundColor Cyan
Write-Host " Press Ctrl+C in this terminal to shut down all services." -ForegroundColor DarkGray
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

try {
    dotnet run --project LaughTale.Showcase/LaughTale.Showcase.csproj --urls "http://localhost:$ShowcasePort"
}
finally {
    Write-Host "`nShutting down background services..." -ForegroundColor Yellow
    if ($docsProcess -and -not $docsProcess.HasExited) {
        Stop-Process -Id $docsProcess.Id -Force -ErrorAction SilentlyContinue
    }
    Get-Process -Name "LaughTale.Showcase","LaughTale.Docs" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "All services stopped." -ForegroundColor Green
}

