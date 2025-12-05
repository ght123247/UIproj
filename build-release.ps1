# ==========================================
# XMotor Industrial OPS 打包脚本 (PowerShell)
# ==========================================

$VERSION = "1.0.0"
$PRODUCT_NAME = "XMotor-Industrial-OPS"
$RELEASE_DIR = "release"
$PACKAGE_NAME = "$PRODUCT_NAME-v$VERSION-Windows"

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  XMotor Industrial OPS 打包工具" -ForegroundColor Cyan
Write-Host "  版本: $VERSION" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 清理旧的发布目录
if (Test-Path $RELEASE_DIR) {
    Write-Host "[信息] 清理旧的发布目录..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $RELEASE_DIR
}

# 创建发布目录结构
Write-Host "[1/7] 创建发布目录结构..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path $RELEASE_DIR -Force | Out-Null
New-Item -ItemType Directory -Path "$RELEASE_DIR\docs" -Force | Out-Null
Write-Host "[OK] 目录创建完成" -ForegroundColor Green
Write-Host ""

# 检查必需文件
Write-Host "[2/7] 检查必需文件..." -ForegroundColor Yellow
$missingFiles = @()

$requiredFiles = @(
    "docker-compose.yml",
    "install.bat",
    "start.bat",
    "stop.bat",
    "PRODUCT_README.md"
)

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        Write-Host "[错误] 未找到 $file" -ForegroundColor Red
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "[错误] 缺少必需文件，打包中止" -ForegroundColor Red
    pause
    exit 1
}

Write-Host "[OK] 文件检查通过" -ForegroundColor Green
Write-Host ""

# 复制必需文件
Write-Host "[3/7] 复制程序文件..." -ForegroundColor Yellow

$filesToCopy = @(
    "docker-compose.yml",
    "install.bat",
    "start.bat",
    "stop.bat",
    "update.bat",
    "uninstall.bat",
    "product-config.yml"
)

foreach ($file in $filesToCopy) {
    if (Test-Path $file) {
        Copy-Item $file $RELEASE_DIR -Force
    }
}

# 复制配置文件模板
if (Test-Path ".env.example") {
    Copy-Item ".env.example" "$RELEASE_DIR\.env.example" -Force
} elseif (Test-Path "env.example.txt") {
    Copy-Item "env.example.txt" "$RELEASE_DIR\.env.example" -Force
}

# 复制 README
if (Test-Path "PRODUCT_README.md") {
    Copy-Item "PRODUCT_README.md" "$RELEASE_DIR\README.md" -Force
}

# 复制后端目录
Write-Host "[信息] 复制后端文件..." -ForegroundColor Gray
if (Test-Path "backend") {
    Copy-Item -Path "backend" -Destination "$RELEASE_DIR\backend" -Recurse -Force
    
    # 删除开发文件
    $devPaths = @(
        "$RELEASE_DIR\backend\__pycache__",
        "$RELEASE_DIR\backend\*.pyc",
        "$RELEASE_DIR\backend\*.log"
    )
    
    foreach ($path in $devPaths) {
        if (Test-Path $path) {
            Remove-Item -Path $path -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
}

# 复制前端目录
Write-Host "[信息] 复制前端文件..." -ForegroundColor Gray
if (Test-Path "my-ui-vite") {
    Copy-Item -Path "my-ui-vite" -Destination "$RELEASE_DIR\my-ui-vite" -Recurse -Force
    
    # 删除开发文件
    $devPaths = @(
        "$RELEASE_DIR\my-ui-vite\node_modules",
        "$RELEASE_DIR\my-ui-vite\dist"
    )
    
    foreach ($path in $devPaths) {
        if (Test-Path $path) {
            Remove-Item -Path $path -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
}

# 复制文档
if (Test-Path "docs") {
    Write-Host "[信息] 复制文档..." -ForegroundColor Gray
    Copy-Item -Path "docs" -Destination "$RELEASE_DIR\docs" -Recurse -Force
}

Write-Host "[OK] 文件复制完成" -ForegroundColor Green
Write-Host ""

# 创建版本信息文件
Write-Host "[4/7] 创建版本信息..." -ForegroundColor Yellow
$buildDate = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$versionContent = "XMotor Industrial OPS`r`n" +
                  "Version: $VERSION`r`n" +
                  "Build Date: $buildDate`r`n`r`n" +
                  "Build Information:`r`n" +
                  "- Product: XMotor Industrial OPS`r`n" +
                  "- Version: $VERSION`r`n" +
                  "- Platform: Windows`r`n" +
                  "- Build Date: $buildDate"

$versionContent | Out-File -FilePath "$RELEASE_DIR\VERSION.txt" -Encoding UTF8
Write-Host "[OK] 版本信息已创建" -ForegroundColor Green
Write-Host ""

# 创建安装说明
Write-Host "[5/7] 创建安装说明..." -ForegroundColor Yellow
$installContent = "==========================================`r`n" +
                  "  XMotor Industrial OPS 安装说明`r`n" +
                  "==========================================`r`n`r`n" +
                  "1. 解压此压缩包到任意目录`r`n`r`n" +
                  "2. 以管理员身份运行 install.bat`r`n" +
                  "   - 右键点击 install.bat`r`n" +
                  "   - 选择`"以管理员身份运行`"`r`n`r`n" +
                  "3. 等待安装完成（首次安装需要构建 Docker 镜像）`r`n`r`n" +
                  "4. 配置系统（可选）`r`n" +
                  "   - 编辑配置文件: %ProgramData%\XMotor-OPS\config\.env`r`n`r`n" +
                  "5. 启动服务`r`n" +
                  "   - 双击桌面快捷方式，或`r`n" +
                  "   - 运行 start.bat`r`n`r`n" +
                  "6. 访问系统`r`n" +
                  "   - 前端界面: http://localhost`r`n" +
                  "   - 后端 API: http://localhost:8000/api/docs`r`n`r`n" +
                  "详细文档请查看 README.md`r`n`r`n"

$installContent | Out-File -FilePath "$RELEASE_DIR\INSTALL.txt" -Encoding UTF8
Write-Host "[OK] 安装说明已创建" -ForegroundColor Green
Write-Host ""

# 创建 .gitignore
Write-Host "[6/7] 创建 .gitignore..." -ForegroundColor Yellow
$gitignoreContent = "# 运行时文件`r`n" +
                    ".env`r`n" +
                    "*.log`r`n" +
                    "logs/`r`n`r`n" +
                    "# Docker`r`n" +
                    ".docker/`r`n"

$gitignoreContent | Out-File -FilePath "$RELEASE_DIR\.gitignore" -Encoding UTF8
Write-Host "[OK] .gitignore 已创建" -ForegroundColor Green
Write-Host ""

# 创建压缩包
Write-Host "[7/7] 创建压缩包..." -ForegroundColor Yellow
if (Test-Path "$PACKAGE_NAME.zip") {
    Remove-Item "$PACKAGE_NAME.zip" -Force
}

try {
    Compress-Archive -Path "$RELEASE_DIR\*" -DestinationPath "$PACKAGE_NAME.zip" -Force
    
    if (Test-Path "$PACKAGE_NAME.zip") {
        $fileSize = (Get-Item "$PACKAGE_NAME.zip").Length
        $fileSizeMB = [math]::Round($fileSize / 1MB, 2)
        
        Write-Host "[OK] 压缩包已创建: $PACKAGE_NAME.zip" -ForegroundColor Green
        Write-Host "[信息] 文件大小: $fileSizeMB MB" -ForegroundColor Cyan
    } else {
        Write-Host "[错误] 压缩包创建失败" -ForegroundColor Red
        Write-Host "[提示] 请手动压缩 $RELEASE_DIR 目录" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[错误] 压缩包创建失败: $_" -ForegroundColor Red
    Write-Host "[提示] 请手动压缩 $RELEASE_DIR 目录" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  打包完成！" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "发布包位置: $PACKAGE_NAME.zip" -ForegroundColor Cyan
Write-Host "发布目录: $RELEASE_DIR\" -ForegroundColor Cyan
Write-Host ""
Write-Host "下一步:" -ForegroundColor Yellow
Write-Host "1. 测试发布包（解压并安装）"
Write-Host "2. 验证所有功能正常"
Write-Host "3. 分发发布包"
Write-Host ""
pause

