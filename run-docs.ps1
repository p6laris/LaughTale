# ==============================================================================
# LaughTale: Documentation Portal Launcher
# ==============================================================================

Write-Host "[LaughTale.Docs] Starting Docs Portal on http://localhost:5001..." -ForegroundColor Cyan

Stop-Process -Name "LaughTale.Docs" -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 300

dotnet run --project LaughTale.Docs/LaughTale.Docs.csproj --urls "http://localhost:5001"
