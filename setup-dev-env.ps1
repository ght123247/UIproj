# ==========================================
# 开发环境搭建脚本
# ==========================================
# 此脚本用于在 Windows 上搭建开发环境
# 包括：Node.js、Python、前端依赖、后端依赖

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "开发环境搭建脚本" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 检查管理员权限
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "提示: 某些操作可能需要管理员权限" -ForegroundColor Yellow
}

# ==========================================
# 1. 检查 Node.js
# ==========================================
Write-Host "1. 检查 Node.js 安装..." -ForegroundColor Green
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "   ✓ Node.js 已安装: $nodeVersion" -ForegroundColor Green
    } else {
        throw "Node.js 未找到"
    }
} catch {
    Write-Host "   ✗ Node.js 未安装" -ForegroundColor Red
    Write-Host "   请访问 https://nodejs.org/ 下载并安装 Node.js (推荐 LTS 版本)" -ForegroundColor Yellow
    Write-Host "   安装完成后，请重新运行此脚本" -ForegroundColor Yellow
    exit 1
}

# 检查 npm
try {
    $npmVersion = npm --version 2>$null
    if ($npmVersion) {
        Write-Host "   ✓ npm 已安装: $npmVersion" -ForegroundColor Green
    } else {
        throw "npm 未找到"
    }
} catch {
    Write-Host "   ✗ npm 未找到" -ForegroundColor Red
    exit 1
}

Write-Host ""

# ==========================================
# 2. 检查 Python
# ==========================================
Write-Host "2. 检查 Python 安装..." -ForegroundColor Green
try {
    $pythonVersion = python --version 2>$null
    if ($pythonVersion) {
        Write-Host "   ✓ Python 已安装: $pythonVersion" -ForegroundColor Green
    } else {
        throw "Python 未找到"
    }
} catch {
    Write-Host "   ✗ Python 未安装" -ForegroundColor Red
    Write-Host "   请访问 https://www.python.org/downloads/ 下载并安装 Python 3.8+ " -ForegroundColor Yellow
    Write-Host "   安装时请勾选 'Add Python to PATH' 选项" -ForegroundColor Yellow
    Write-Host "   安装完成后，请重新运行此脚本" -ForegroundColor Yellow
    exit 1
}

# 检查 pip
try {
    $pipVersion = python -m pip --version 2>$null
    if ($pipVersion) {
        Write-Host "   ✓ pip 已安装" -ForegroundColor Green
    } else {
        throw "pip 未找到"
    }
} catch {
    Write-Host "   ✗ pip 未找到，正在尝试安装..." -ForegroundColor Yellow
    python -m ensurepip --upgrade
}

Write-Host ""

# ==========================================
# 3. 安装前端依赖
# ==========================================
Write-Host "3. 安装前端依赖..." -ForegroundColor Green
$frontendDir = "my-ui-vite"
if (Test-Path $frontendDir) {
    Write-Host "   进入前端目录: $frontendDir" -ForegroundColor Cyan
    Push-Location $frontendDir
    
    if (Test-Path "node_modules") {
        Write-Host "   node_modules 已存在，跳过安装" -ForegroundColor Yellow
        Write-Host "   如需重新安装，请删除 node_modules 目录后重新运行此脚本" -ForegroundColor Yellow
    } else {
        Write-Host "   正在安装依赖（这可能需要几分钟）..." -ForegroundColor Cyan
        npm install
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✓ 前端依赖安装完成" -ForegroundColor Green
        } else {
            Write-Host "   ✗ 前端依赖安装失败" -ForegroundColor Red
            Pop-Location
            exit 1
        }
    }
    
    Pop-Location
} else {
    Write-Host "   ✗ 前端目录不存在: $frontendDir" -ForegroundColor Red
    exit 1
}

Write-Host ""

# ==========================================
# 4. 安装后端依赖
# ==========================================
Write-Host "4. 安装后端依赖..." -ForegroundColor Green
$backendDir = "backend"
if (Test-Path $backendDir) {
    Write-Host "   进入后端目录: $backendDir" -ForegroundColor Cyan
    Push-Location $backendDir
    
    if (Test-Path "requirements.txt") {
        Write-Host "   正在安装 Python 依赖..." -ForegroundColor Cyan
        python -m pip install --upgrade pip
        python -m pip install -r requirements.txt
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✓ 后端依赖安装完成" -ForegroundColor Green
        } else {
            Write-Host "   ✗ 后端依赖安装失败" -ForegroundColor Red
            Pop-Location
            exit 1
        }
    } else {
        Write-Host "   ✗ requirements.txt 不存在" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    
    Pop-Location
} else {
    Write-Host "   ✗ 后端目录不存在: $backendDir" -ForegroundColor Red
    exit 1
}

Write-Host ""

# ==========================================
# 5. 创建环境配置文件
# ==========================================
Write-Host "5. 检查环境配置文件..." -ForegroundColor Green
$envFile = "backend\.env"
$envExample = "env.example.txt"

if (-not (Test-Path $envFile)) {
    if (Test-Path $envExample) {
        Write-Host "   创建 .env 配置文件..." -ForegroundColor Cyan
        Copy-Item $envExample -Destination $envFile
        Write-Host "   ✓ 已创建 $envFile（基于 $envExample）" -ForegroundColor Green
        Write-Host "   请根据需要编辑 $envFile" -ForegroundColor Yellow
    } else {
        Write-Host "   ⚠ 未找到 $envExample，跳过配置文件创建" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ✓ 环境配置文件已存在: $envFile" -ForegroundColor Green
}

Write-Host ""

# ==========================================
# 完成
# ==========================================
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "开发环境搭建完成！" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "下一步：" -ForegroundColor Yellow
Write-Host "1. 启动后端服务: 运行 dev-backend.ps1 或 dev-backend.bat" -ForegroundColor White
Write-Host "2. 启动前端服务: 运行 dev-frontend.ps1 或 dev-frontend.bat" -ForegroundColor White
Write-Host "3. 访问前端: http://localhost:5173" -ForegroundColor White
Write-Host "4. 访问后端 API 文档: http://localhost:8000/api/docs" -ForegroundColor White
Write-Host ""

