# ==============================================================================
# LaughTale: Master Runner & Live Dev Server
# ==============================================================================
[CmdletBinding()]
param(
    [Alias("b")][switch]$Build,
    [Alias("w")][switch]$Watch,
    [Alias("s")][switch]$ShowcaseOnly,
    [Alias("d")][switch]$DocsOnly,
    [Alias("o")][switch]$Open,
    [int]$ShowcasePort = 5000,
    [int]$DocsPort = 5001
)

$ErrorActionPreference = "Stop"

# Helper: Kill any processes occupying target ports or matching assembly names
function Stop-RunningInstances {
    param([int[]]$Ports)
    foreach ($p in $Ports) {
        try {
            $conns = Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue
            if ($conns) {
                foreach ($c in $conns) {
                    if ($c.OwningProcess -and $c.OwningProcess -gt 0 -and $c.OwningProcess -ne $PID) {
                        Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue
                    }
                }
            }
        } catch { }
    }
    Get-Process -Name "LaughTale.Showcase", "LaughTale.Docs", "VBCSCompiler" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host " ==========================================================" -ForegroundColor Cyan
Write-Host "  ✨ LaughTale: Modern Islands Architecture Runner" -ForegroundColor White
Write-Host " ==========================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Clean Port Cleanup
Write-Host "[1/3] Checking ports and stopping old processes..." -ForegroundColor Yellow
Stop-RunningInstances -Ports @($ShowcasePort, $DocsPort)
Start-Sleep -Milliseconds 300

# 2. Build Check
$showcaseBundle = "LaughTale.Showcase/wwwroot/js/islands.js"
$docsBundle = "LaughTale.Docs/wwwroot/js/islands.js"
$needsClientBuild = $Build -or (-not (Test-Path $showcaseBundle)) -or (-not (Test-Path $docsBundle))

if ($needsClientBuild) {
    Write-Host "[2/3] Building TypeScript & Client Island bundles..." -ForegroundColor Yellow
    
    if (Test-Path "LaughTale.Showcase/package.json") {
        npm --prefix LaughTale.Showcase run build --silent
    }
    if (Test-Path "LaughTale.Docs/package.json") {
        npm --prefix LaughTale.Docs run build --silent
    }
    Write-Host "       Bundles generated cleanly." -ForegroundColor Green
} else {
    Write-Host "[2/3] Client bundles up-to-date (use -Build to force recompile)." -ForegroundColor DarkGray
}

# 2.1 Unified Solution Build to avoid VBCSCompiler lock races
Write-Host "       Ensuring solution binaries are compiled..." -ForegroundColor Yellow
dotnet build LaughTale.slnx --nologo --verbosity minimal
if ($LASTEXITCODE -ne 0) {
    Write-Error "Solution build failed. Please resolve compilation errors."
    exit 1
}
Write-Host "       Solution built successfully." -ForegroundColor Green

# 3. Launch Target(s)
Write-Host "[3/3] Launching application services..." -ForegroundColor Yellow

$dotnetCmd = if ($Watch) { "watch" } else { "run" }
$runArgs = if ($Watch) { "" } else { "--no-build" }

# Optional auto-open helper
function Open-UrlAsync([string]$url) {
    if ($Open) {
        Start-Job -ScriptBlock {
            param($targetUrl)
            Start-Sleep -Seconds 2
            Start-Process $targetUrl
        } -ArgumentList $url | Out-Null
    }
}

if ($ShowcaseOnly) {
    Write-Host "`n -> Enterprise Showcase: http://localhost:$ShowcasePort/enterprise" -ForegroundColor Green
    Write-Host "    Press Ctrl+C to stop.`n" -ForegroundColor DarkGray
    Open-UrlAsync "http://localhost:$ShowcasePort/enterprise"
    dotnet $dotnetCmd $runArgs --project LaughTale.Showcase/LaughTale.Showcase.csproj --urls "http://localhost:$ShowcasePort"
    exit
}

if ($DocsOnly) {
    Write-Host "`n -> Documentation Portal: http://localhost:$DocsPort" -ForegroundColor Cyan
    Write-Host "    Press Ctrl+C to stop.`n" -ForegroundColor DarkGray
    Open-UrlAsync "http://localhost:$DocsPort"
    dotnet $dotnetCmd $runArgs --project LaughTale.Docs/LaughTale.Docs.csproj --urls "http://localhost:$DocsPort"
    exit
}

# Dual Service Mode (Showcase in foreground, Docs in background)
$docsLog = [System.IO.Path]::GetTempFileName()
$docsProcess = Start-Process -FilePath "dotnet" `
    -ArgumentList "run $runArgs --project LaughTale.Docs/LaughTale.Docs.csproj --urls http://localhost:$DocsPort" `
    -RedirectStandardError $docsLog `
    -WindowStyle Hidden `
    -PassThru

Write-Host ""
Write-Host " ==========================================================" -ForegroundColor Cyan
Write-Host "  🚀 Services Active:" -ForegroundColor White
Write-Host "     * Showcase:     http://localhost:$ShowcasePort/enterprise" -ForegroundColor Green
Write-Host "     * Docs Portal:  http://localhost:$DocsPort" -ForegroundColor Cyan
Write-Host ""
Write-Host "  ⌨  Press Ctrl+C in this terminal to shut down all services." -ForegroundColor DarkGray
Write-Host " ==========================================================" -ForegroundColor Cyan
Write-Host ""

Open-UrlAsync "http://localhost:$ShowcasePort/enterprise"

try {
    dotnet $dotnetCmd $runArgs --project LaughTale.Showcase/LaughTale.Showcase.csproj --urls "http://localhost:$ShowcasePort"
}
finally {
    Write-Host "`n[!] Shutting down all LaughTale background services..." -ForegroundColor Yellow
    if ($docsProcess -and -not $docsProcess.HasExited) {
        Stop-Process -Id $docsProcess.Id -Force -ErrorAction SilentlyContinue
    }
    Stop-RunningInstances -Ports @($ShowcasePort, $DocsPort)
    if (Test-Path $docsLog) { Remove-Item $docsLog -Force -ErrorAction SilentlyContinue }
    Write-Host "All services stopped cleanly." -ForegroundColor Green
}

