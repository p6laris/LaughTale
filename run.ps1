# ==============================================================================
# SoftMax.LaughTale: Master Launch Script (Showcase & Docs)
# ==============================================================================

Write-Host "[SoftMax.LaughTale] Starting all services..." -ForegroundColor Cyan

# 1. Stop any existing instances
Write-Host "Stopping any previously running instances..." -ForegroundColor Yellow
Stop-Process -Name "SoftMax.LaughTale.Showcase","SoftMax.LaughTale.Docs" -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 500

# 2. Launch Documentation Portal on Port 5001
Write-Host "Launching Docs Portal on http://localhost:5001..." -ForegroundColor Green
Start-Process dotnet -ArgumentList "run --project SoftMax.LaughTale.Docs/SoftMax.LaughTale.Docs.csproj --urls http://localhost:5001"

# 3. Launch Showcase Portal on Port 5000
Write-Host "Launching Enterprise Showcase on http://localhost:5000..." -ForegroundColor Green
Start-Process dotnet -ArgumentList "run --project SoftMax.LaughTale.Showcase/SoftMax.LaughTale.Showcase.csproj --urls http://localhost:5000"

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Services are up and running!" -ForegroundColor White
Write-Host "Docs Portal:       http://localhost:5001" -ForegroundColor Yellow
Write-Host "Enterprise Hub:    http://localhost:5000/enterprise" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan
