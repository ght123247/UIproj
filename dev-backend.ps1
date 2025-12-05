# ==========================================
# 启动后端开发服务器
# ==========================================

Write-Host "启动后端开发服务器..." -ForegroundColor Cyan
Write-Host ""

$backendDir = "backend"

if (-not (Test-Path $backendDir)) {
    Write-Host "错误: 后端目录不存在: $backendDir" -ForegroundColor Red
    exit 1
}

Push-Location $backendDir

# 检查是否安装了依赖
try {
    python -c "import fastapi" 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "警告: 后端依赖可能未安装" -ForegroundColor Yellow
        Write-Host "请先运行 setup-dev-env.ps1 安装依赖" -ForegroundColor Yellow
        Pop-Location
        exit 1
    }
} catch {
    Write-Host "错误: 无法检查 Python 依赖" -ForegroundColor Red
    Pop-Location
    exit 1
}

Write-Host "后端服务将在 http://localhost:8000 启动" -ForegroundColor Green
Write-Host "API 文档: http://localhost:8000/api/docs" -ForegroundColor Green
Write-Host "按 Ctrl+C 停止服务" -ForegroundColor Yellow
Write-Host ""

# 启动 FastAPI 服务器
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

Pop-Location

