# ==========================================
# Docker daemon.json 修复脚本
# 修复 JSON 编码问题
# ==========================================

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Docker 配置文件修复工具" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$configPath = "$env:USERPROFILE\.docker\daemon.json"
$configDir = Split-Path $configPath

# 创建配置目录（如果不存在）
if (-not (Test-Path $configDir)) {
    New-Item -ItemType Directory -Path $configDir -Force | Out-Null
    Write-Host "[信息] 创建配置目录: $configDir" -ForegroundColor Yellow
}

# 备份现有配置（如果存在）
if (Test-Path $configPath) {
    $backupPath = "$configPath.backup.$(Get-Date -Format 'yyyyMMddHHmmss')"
    Copy-Item $configPath $backupPath -Force
    Write-Host "[信息] 已备份现有配置到: $backupPath" -ForegroundColor Yellow
}

# 创建正确的 JSON 配置
Write-Host "[1/3] 创建正确的配置文件..." -ForegroundColor Yellow

$config = @{
    registry-mirrors = @(
        "https://docker.mirrors.ustc.edu.cn",
        "https://hub-mirror.c.163.com",
        "https://mirror.baidubce.com"
    )
}

# 转换为 JSON
$json = $config | ConvertTo-Json -Depth 10

# 保存为 UTF-8 无 BOM 格式
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($configPath, $json, $utf8NoBom)

Write-Host "[OK] 配置文件已创建: $configPath" -ForegroundColor Green
Write-Host ""

# 验证 JSON 格式
Write-Host "[2/3] 验证 JSON 格式..." -ForegroundColor Yellow
try {
    $testConfig = Get-Content $configPath -Raw | ConvertFrom-Json
    Write-Host "[OK] JSON 格式正确" -ForegroundColor Green
    Write-Host ""
    Write-Host "配置内容:" -ForegroundColor Cyan
    Get-Content $configPath | Write-Host
} catch {
    Write-Host "[错误] JSON 格式验证失败: $_" -ForegroundColor Red
    Write-Host "[提示] 请手动检查配置文件" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "[3/3] 完成修复" -ForegroundColor Yellow
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  重要: 请重启 Docker Desktop" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "下一步:" -ForegroundColor Yellow
Write-Host "1. 完全退出 Docker Desktop" -ForegroundColor White
Write-Host "2. 重新启动 Docker Desktop" -ForegroundColor White
Write-Host "3. 等待 Docker Desktop 完全启动" -ForegroundColor White
Write-Host "4. 验证配置: docker info | Select-String 'Registry Mirrors'" -ForegroundColor White
Write-Host ""

