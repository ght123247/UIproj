# Docker Mirror Configuration Script
# Fix Docker Hub connection issues

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Docker Mirror Configuration Tool" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
try {
    docker info | Out-Null
    Write-Host "[OK] Docker is running" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Docker Desktop config file path
$dockerConfigPath = "$env:USERPROFILE\.docker\daemon.json"
$dockerConfigDir = Split-Path $dockerConfigPath

# Create config directory if not exists
if (-not (Test-Path $dockerConfigDir)) {
    New-Item -ItemType Directory -Path $dockerConfigDir -Force | Out-Null
    Write-Host "[INFO] Created config directory: $dockerConfigDir" -ForegroundColor Yellow
}

# Mirror list
$mirrors = @(
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
)

# Read existing config
$config = @{}
if (Test-Path $dockerConfigPath) {
    try {
        $content = Get-Content $dockerConfigPath -Raw -Encoding UTF8
        $jsonObj = $content | ConvertFrom-Json
        if ($jsonObj.PSObject.Properties) {
            foreach ($prop in $jsonObj.PSObject.Properties) {
                $config[$prop.Name] = $prop.Value
            }
        }
        Write-Host "[INFO] Read existing config" -ForegroundColor Yellow
    } catch {
        Write-Host "[WARN] Config file format error, will create new config" -ForegroundColor Yellow
        $config = @{}
    }
}

# Add registry-mirrors
if (-not $config.ContainsKey("registry-mirrors")) {
    $config["registry-mirrors"] = @()
} else {
    if ($config["registry-mirrors"] -isnot [Array]) {
        $config["registry-mirrors"] = @($config["registry-mirrors"])
    }
}

# Add mirrors (avoid duplicates)
$existingMirrors = @()
if ($config["registry-mirrors"]) {
    $existingMirrors = $config["registry-mirrors"]
}

foreach ($mirror in $mirrors) {
    if ($existingMirrors -notcontains $mirror) {
        $existingMirrors += $mirror
        Write-Host "[ADD] $mirror" -ForegroundColor Green
    } else {
        Write-Host "[SKIP] $mirror (already exists)" -ForegroundColor Gray
    }
}

$config["registry-mirrors"] = $existingMirrors

# Save config
try {
    $jsonConfig = @{
        "registry-mirrors" = $config["registry-mirrors"]
    }
    
    foreach ($key in $config.Keys) {
        if ($key -ne "registry-mirrors") {
            $jsonConfig[$key] = $config[$key]
        }
    }
    
    $jsonConfig | ConvertTo-Json -Depth 10 | Set-Content $dockerConfigPath -Encoding UTF8
    
    Write-Host ""
    Write-Host "[SUCCESS] Config saved to: $dockerConfigPath" -ForegroundColor Green
    Write-Host ""
    Write-Host "Config content:" -ForegroundColor Cyan
    Get-Content $dockerConfigPath | Write-Host
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "  IMPORTANT: Please restart Docker Desktop" -ForegroundColor Yellow
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "After restart, verify with:" -ForegroundColor Yellow
    Write-Host "  docker info | Select-String 'Registry Mirrors'" -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host "[ERROR] Failed to save config: $_" -ForegroundColor Red
    Write-Host "Error details: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
