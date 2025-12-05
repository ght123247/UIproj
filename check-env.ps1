# ==========================================
# 开发环境检查脚本
# ==========================================

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "开发环境检查报告" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$allOk = $true

# ==========================================
# 1. 检查 Node.js
# ==========================================
Write-Host "1. Node.js 环境" -ForegroundColor Green
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "   [OK] Node.js 已安装: $nodeVersion" -ForegroundColor Green
    } else {
        throw "未找到"
    }
} catch {
    Write-Host "   [X] Node.js 未安装或未添加到 PATH" -ForegroundColor Red
    Write-Host "       请访问 https://nodejs.org/ 下载安装" -ForegroundColor Yellow
    $allOk = $false
}

# 检查 npm
try {
    $npmVersion = npm --version 2>$null
    if ($npmVersion) {
        Write-Host "   [OK] npm 已安装: v$npmVersion" -ForegroundColor Green
    } else {
        throw "未找到"
    }
} catch {
    Write-Host "   [X] npm 未找到" -ForegroundColor Red
    $allOk = $false
}

Write-Host ""

# ==========================================
# 2. 检查 Python
# ==========================================
Write-Host "2. Python 环境" -ForegroundColor Green
try {
    $pythonVersion = python --version 2>$null
    if ($pythonVersion) {
        Write-Host "   [OK] Python 已安装: $pythonVersion" -ForegroundColor Green
    } else {
        throw "未找到"
    }
} catch {
    Write-Host "   [X] Python 未安装或未添加到 PATH" -ForegroundColor Red
    Write-Host "       请访问 https://www.python.org/downloads/ 下载安装" -ForegroundColor Yellow
    Write-Host "       安装时请勾选 'Add Python to PATH'" -ForegroundColor Yellow
    $allOk = $false
}

# 检查 pip
try {
    $pipVersion = python -m pip --version 2>$null
    if ($pipVersion) {
        Write-Host "   [OK] pip 已安装" -ForegroundColor Green
    } else {
        throw "未找到"
    }
} catch {
    Write-Host "   [X] pip 未找到" -ForegroundColor Red
    $allOk = $false
}

Write-Host ""

# ==========================================
# 3. 检查前端依赖
# ==========================================
Write-Host "3. 前端依赖 (my-ui-vite)" -ForegroundColor Green
$frontendDir = "my-ui-vite"
if (Test-Path $frontendDir) {
    if (Test-Path "$frontendDir\node_modules") {
        Write-Host "   [OK] node_modules 目录存在" -ForegroundColor Green
        
        # 检查关键依赖
        $packageJson = "$frontendDir\package.json"
        if (Test-Path $packageJson) {
            Write-Host "   [OK] package.json 存在" -ForegroundColor Green
        } else {
            Write-Host "   [!] package.json 不存在" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   [X] node_modules 目录不存在" -ForegroundColor Red
        Write-Host "       请运行: cd my-ui-vite && npm install" -ForegroundColor Yellow
        $allOk = $false
    }
} else {
    Write-Host "   [X] 前端目录不存在: $frontendDir" -ForegroundColor Red
    $allOk = $false
}

Write-Host ""

# ==========================================
# 4. 检查后端依赖
# ==========================================
Write-Host "4. 后端依赖 (backend)" -ForegroundColor Green
$backendDir = "backend"
if (Test-Path $backendDir) {
    if (Test-Path "$backendDir\requirements.txt") {
        Write-Host "   [OK] requirements.txt 存在" -ForegroundColor Green
        
        # 尝试检查关键依赖
        try {
            python -c "import fastapi; import uvicorn; print('OK')" 2>$null | Out-Null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "   [OK] FastAPI 和 Uvicorn 已安装" -ForegroundColor Green
            } else {
                throw "未安装"
            }
        } catch {
            Write-Host "   [X] Python 依赖未安装" -ForegroundColor Red
            Write-Host "       请运行: cd backend && pip install -r requirements.txt" -ForegroundColor Yellow
            $allOk = $false
        }
    } else {
        Write-Host "   [X] requirements.txt 不存在" -ForegroundColor Red
        $allOk = $false
    }
} else {
    Write-Host "   [X] 后端目录不存在: $backendDir" -ForegroundColor Red
    $allOk = $false
}

Write-Host ""

# ==========================================
# 5. 检查环境配置文件
# ==========================================
Write-Host "5. 环境配置文件" -ForegroundColor Green
$envFile = "backend\.env"
$envExample = "env.example.txt"

if (Test-Path $envFile) {
    Write-Host "   [OK] .env 文件存在: $envFile" -ForegroundColor Green
} else {
    Write-Host "   [!] .env 文件不存在" -ForegroundColor Yellow
    if (Test-Path $envExample) {
        Write-Host "       可以复制 $envExample 为 $envFile" -ForegroundColor Yellow
    } else {
        Write-Host "       配置文件模板不存在" -ForegroundColor Yellow
    }
}

Write-Host ""

# ==========================================
# 总结
# ==========================================
Write-Host "==========================================" -ForegroundColor Cyan
if ($allOk) {
    Write-Host "环境检查完成 - 所有必需项已就绪！" -ForegroundColor Green
    Write-Host ""
    Write-Host "可以开始开发：" -ForegroundColor Yellow
    Write-Host "  后端: .\dev-backend.ps1" -ForegroundColor White
    Write-Host "  前端: .\dev-frontend.ps1" -ForegroundColor White
} else {
    Write-Host "环境检查完成 - 发现问题" -ForegroundColor Red
    Write-Host ""
    Write-Host "请根据上述提示修复问题，然后重新运行此脚本检查" -ForegroundColor Yellow
    Write-Host "或运行 .\setup-dev-env.ps1 自动安装依赖" -ForegroundColor Yellow
}
Write-Host "==========================================" -ForegroundColor Cyan

