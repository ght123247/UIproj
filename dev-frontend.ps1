# ==========================================
# 启动前端开发服务器
# ==========================================

Write-Host "启动前端开发服务器..." -ForegroundColor Cyan
Write-Host ""

$frontendDir = "my-ui-vite"

if (-not (Test-Path $frontendDir)) {
    Write-Host "错误: 前端目录不存在: $frontendDir" -ForegroundColor Red
    exit 1
}

Push-Location $frontendDir

# 检查 node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "警告: node_modules 不存在" -ForegroundColor Yellow
    Write-Host "请先运行 setup-dev-env.ps1 安装依赖" -ForegroundColor Yellow
    Pop-Location
    exit 1
}

Write-Host "前端服务将在 http://localhost:5173 启动" -ForegroundColor Green
Write-Host "按 Ctrl+C 停止服务" -ForegroundColor Yellow
Write-Host ""

# 启动 Vite 开发服务器
npm run dev

Pop-Location

