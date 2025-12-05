# 测试 Docker 镜像源连接
Write-Host "测试 Docker 镜像源连接..." -ForegroundColor Cyan
Write-Host ""

$mirrors = @(
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com",
    "https://docker.mirrors.ustc.edu.cn"
)

foreach ($mirror in $mirrors) {
    Write-Host "测试: $mirror" -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "$mirror/v2/" -Method Head -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        Write-Host "  [OK] 连接成功" -ForegroundColor Green
    } catch {
        Write-Host "  [失败] 无法连接: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "测试完成" -ForegroundColor Cyan

