# Development Environment Check Script
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Development Environment Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "1. Node.js:" -ForegroundColor Green
$nodeOk = $false
try {
    $nodeVer = node --version 2>$null
    if ($nodeVer) {
        Write-Host "   [OK] $nodeVer" -ForegroundColor Green
        $nodeOk = $true
    }
} catch {}
if (-not $nodeOk) {
    Write-Host "   [X] Not installed" -ForegroundColor Red
    Write-Host "       Download: https://nodejs.org/ (LTS recommended)" -ForegroundColor Yellow
}

# Check npm
Write-Host ""
Write-Host "2. npm:" -ForegroundColor Green
$npmOk = $false
try {
    $npmVer = npm --version 2>$null
    if ($npmVer) {
        Write-Host "   [OK] v$npmVer" -ForegroundColor Green
        $npmOk = $true
    }
} catch {}
if (-not $npmOk) {
    Write-Host "   [X] Not installed" -ForegroundColor Red
}

# Check Python
Write-Host ""
Write-Host "3. Python:" -ForegroundColor Green
$pyOk = $false
try {
    $pyVer = python --version 2>$null
    if ($pyVer) {
        Write-Host "   [OK] $pyVer" -ForegroundColor Green
        $pyOk = $true
    }
} catch {}
if (-not $pyOk) {
    Write-Host "   [X] Not installed or not in PATH" -ForegroundColor Red
    Write-Host "       Download: https://www.python.org/downloads/" -ForegroundColor Yellow
    Write-Host "       Check 'Add Python to PATH' during installation" -ForegroundColor Yellow
}

# Check frontend dependencies
Write-Host ""
Write-Host "4. Frontend dependencies:" -ForegroundColor Green
if (Test-Path "my-ui-vite\node_modules") {
    Write-Host "   [OK] node_modules installed" -ForegroundColor Green
} else {
    Write-Host "   [X] Not installed (need Node.js first)" -ForegroundColor Red
}

# Check backend dependencies
Write-Host ""
Write-Host "5. Backend dependencies:" -ForegroundColor Green
if ($pyOk) {
    try {
        python -c "import fastapi" 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   [OK] FastAPI installed" -ForegroundColor Green
        } else {
            Write-Host "   [X] Not installed" -ForegroundColor Red
        }
    } catch {
        Write-Host "   [X] Not installed" -ForegroundColor Red
    }
} else {
    Write-Host "   [X] Cannot check (Python not installed)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
if ($nodeOk -and $npmOk -and $pyOk) {
    Write-Host "Basic environment ready!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next step: Run .\install-deps.ps1 to install project dependencies" -ForegroundColor Yellow
} else {
    Write-Host "Please install missing software first" -ForegroundColor Yellow
}
Write-Host "========================================" -ForegroundColor Cyan


