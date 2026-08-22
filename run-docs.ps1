# ==============================================================================
# SoftMax.LaughTale: Documentation Portal Launcher
# ==============================================================================

Write-Host "[SoftMax.LaughTale.Docs] Starting Docs Portal on http://localhost:5001..." -ForegroundColor Cyan

Stop-Process -Name "SoftMax.LaughTale.Docs" -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 300

dotnet run --project SoftMax.LaughTale.Docs/SoftMax.LaughTale.Docs.csproj --urls "http://localhost:5001"
