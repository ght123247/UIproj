# Install Project Dependencies Script
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Install Project Dependencies" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
try {
    node --version | Out-Null
} catch {
    Write-Host "[ERROR] Node.js not installed, please install Node.js first" -ForegroundColor Red
    exit 1
}

# Check Python
try {
    python --version | Out-Null
} catch {
    Write-Host "[ERROR] Python not installed, please install Python first" -ForegroundColor Red
    exit 1
}

# Install frontend dependencies
Write-Host "1. Installing frontend dependencies..." -ForegroundColor Green
if (Test-Path "my-ui-vite") {
    Push-Location "my-ui-vite"
    if (-not (Test-Path "node_modules")) {
        Write-Host "   Running npm install..." -ForegroundColor Cyan
        npm install
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   [OK] Frontend dependencies installed" -ForegroundColor Green
        } else {
            Write-Host "   [X] Frontend dependencies installation failed" -ForegroundColor Red
            Pop-Location
            exit 1
        }
    } else {
        Write-Host "   [OK] Frontend dependencies already exist, skipping" -ForegroundColor Green
    }
    Pop-Location
} else {
    Write-Host "   [X] Frontend directory not found" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Install backend dependencies
Write-Host "2. Installing backend dependencies..." -ForegroundColor Green
if (Test-Path "backend") {
    Push-Location "backend"
    Write-Host "   Running pip install..." -ForegroundColor Cyan
    python -m pip install --upgrade pip
    python -m pip install -r requirements.txt
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   [OK] Backend dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "   [X] Backend dependencies installation failed" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    Pop-Location
} else {
    Write-Host "   [X] Backend directory not found" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Create environment config file
Write-Host "3. Checking environment config file..." -ForegroundColor Green
if (-not (Test-Path "backend\.env")) {
    if (Test-Path "env.example.txt") {
        Copy-Item "env.example.txt" -Destination "backend\.env"
        Write-Host "   [OK] Created backend\.env" -ForegroundColor Green
    } else {
        Write-Host "   [!] env.example.txt not found" -ForegroundColor Yellow
    }
} else {
    Write-Host "   [OK] Environment config file already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Dependencies installation completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Start development servers:" -ForegroundColor Yellow
Write-Host "  Backend: .\dev-backend.ps1" -ForegroundColor White
Write-Host "  Frontend: .\dev-frontend.ps1" -ForegroundColor White
Write-Host ""

