# 检查网络连接
Write-Host "检查网络连接..." -ForegroundColor Cyan
Write-Host ""

# 测试 DNS 解析
Write-Host "1. 测试 DNS 解析..." -ForegroundColor Yellow
$hosts = @(
    "hub-mirror.c.163.com",
    "mirror.baidubce.com",
    "docker.mirrors.ustc.edu.cn",
    "registry-1.docker.io"
)

foreach ($h in $hosts) {
    try {
        $result = Resolve-DnsName $h -ErrorAction Stop
        Write-Host "  [OK] $h -> $($result[0].IPAddress)" -ForegroundColor Green
    } catch {
        Write-Host "  [失败] $h - DNS 解析失败" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "2. 测试 HTTPS 连接..." -ForegroundColor Yellow

foreach ($h in $hosts) {
    try {
        $test = Test-NetConnection -ComputerName $h -Port 443 -WarningAction SilentlyContinue
        if ($test.TcpTestSucceeded) {
            Write-Host "  [OK] $h:443 连接成功" -ForegroundColor Green
        } else {
            Write-Host "  [失败] $h:443 连接失败" -ForegroundColor Red
        }
    } catch {
        Write-Host "  [失败] $h:443 - $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "3. 检查代理设置..." -ForegroundColor Yellow
$proxy = [System.Net.WebRequest]::GetSystemWebProxy()
$proxyUrl = $proxy.GetProxy("https://registry-1.docker.io")
if ($proxyUrl -eq "https://registry-1.docker.io") {
    Write-Host "  [信息] 未检测到系统代理" -ForegroundColor Yellow
} else {
    Write-Host "  [信息] 检测到代理: $proxyUrl" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Check completed" -ForegroundColor Cyan

