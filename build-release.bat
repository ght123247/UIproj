@echo off
REM ==========================================
REM  XMotor Industrial OPS 打包脚本
REM  用于创建产品发布包
REM ==========================================

setlocal enabledelayedexpansion

set VERSION=1.0.0
set PRODUCT_NAME=XMotor-Industrial-OPS
set RELEASE_DIR=release
set PACKAGE_NAME=%PRODUCT_NAME%-v%VERSION%-Windows

echo.
echo ==========================================
echo   XMotor Industrial OPS 打包工具
echo   版本: %VERSION%
echo ==========================================
echo.

REM 清理旧的发布目录
if exist "%RELEASE_DIR%" (
    echo [信息] 清理旧的发布目录...
    rd /s /q "%RELEASE_DIR%"
)

REM 创建发布目录结构
echo [1/7] 创建发布目录结构...
mkdir "%RELEASE_DIR%"
mkdir "%RELEASE_DIR%\docs"
echo [OK] 目录创建完成
echo.

REM 检查必需文件
echo [2/7] 检查必需文件...
set MISSING_FILES=0

if not exist "docker-compose.yml" (
    echo [错误] 未找到 docker-compose.yml
    set MISSING_FILES=1
)
if not exist "install.bat" (
    echo [错误] 未找到 install.bat
    set MISSING_FILES=1
)
if not exist "start.bat" (
    echo [错误] 未找到 start.bat
    set MISSING_FILES=1
)
if not exist "stop.bat" (
    echo [错误] 未找到 stop.bat
    set MISSING_FILES=1
)
if not exist ".env.example" (
    if not exist "env.example.txt" (
        echo [警告] 未找到配置文件模板 .env.example 或 env.example.txt
    )
)
if not exist "PRODUCT_README.md" (
    echo [错误] 未找到 PRODUCT_README.md
    set MISSING_FILES=1
)

if %MISSING_FILES%==1 (
    echo [错误] 缺少必需文件，打包中止
    pause
    exit /b 1
)

echo [OK] 文件检查通过
echo.

REM 复制必需文件
echo [3/7] 复制程序文件...

REM 核心文件
copy "docker-compose.yml" "%RELEASE_DIR%\" >nul
copy "install.bat" "%RELEASE_DIR%\" >nul
copy "start.bat" "%RELEASE_DIR%\" >nul
copy "stop.bat" "%RELEASE_DIR%\" >nul
copy "update.bat" "%RELEASE_DIR%\" >nul
copy "uninstall.bat" "%RELEASE_DIR%\" >nul
if exist ".env.example" (
    copy ".env.example" "%RELEASE_DIR%\" >nul
) else if exist "env.example.txt" (
    copy "env.example.txt" "%RELEASE_DIR%\.env.example" >nul
)
copy "product-config.yml" "%RELEASE_DIR%\" >nul

REM 重命名 README
copy "PRODUCT_README.md" "%RELEASE_DIR%\README.md" >nul

REM 复制后端目录（排除不必要的文件）
echo [信息] 复制后端文件...
xcopy /E /I /Y "backend" "%RELEASE_DIR%\backend\" >nul 2>&1
REM 删除开发文件
if exist "%RELEASE_DIR%\backend\__pycache__" rd /s /q "%RELEASE_DIR%\backend\__pycache__" >nul 2>&1
if exist "%RELEASE_DIR%\backend\*.pyc" del /q "%RELEASE_DIR%\backend\*.pyc" >nul 2>&1
if exist "%RELEASE_DIR%\backend\*.log" del /q "%RELEASE_DIR%\backend\*.log" >nul 2>&1

REM 复制前端目录（排除 node_modules）
echo [信息] 复制前端文件...
xcopy /E /I /Y "my-ui-vite" "%RELEASE_DIR%\my-ui-vite\" >nul 2>&1
REM 删除开发文件
if exist "%RELEASE_DIR%\my-ui-vite\node_modules" rd /s /q "%RELEASE_DIR%\my-ui-vite\node_modules" >nul 2>&1
if exist "%RELEASE_DIR%\my-ui-vite\dist" rd /s /q "%RELEASE_DIR%\my-ui-vite\dist" >nul 2>&1

REM 复制文档（如果存在）
if exist "docs" (
    echo [信息] 复制文档...
    xcopy /E /I /Y "docs" "%RELEASE_DIR%\docs\" >nul 2>&1
)

echo [OK] 文件复制完成
echo.

REM 创建版本信息文件
echo [4/7] 创建版本信息...
(
echo XMotor Industrial OPS
echo Version: %VERSION%
echo Build Date: %date% %time%
echo.
echo Build Information:
echo - Product: XMotor Industrial OPS
echo - Version: %VERSION%
echo - Platform: Windows
echo - Build Date: %date% %time%
) > "%RELEASE_DIR%\VERSION.txt"

echo [OK] 版本信息已创建
echo.

REM 创建安装说明
echo [5/7] 创建安装说明...
(
echo ==========================================
echo   XMotor Industrial OPS 安装说明
echo ==========================================
echo.
echo 重要提示:
echo   安装脚本必须在解压后的目录中运行！
echo.
echo 安装步骤:
echo.
echo 1. 解压此压缩包到任意目录
echo    例如: C:\Users\YourName\Downloads\XMotor-OPS\
echo.
echo 2. 进入解压后的目录
echo    确保能看到 docker-compose.yml 和 install.bat 文件
echo.
echo 3. 以管理员身份运行 install.bat
echo    - 右键点击 install.bat
echo    - 选择"以管理员身份运行"
echo.
echo 4. 等待安装完成（首次安装需要构建 Docker 镜像，可能需要 5-10 分钟）
echo.
echo 5. 配置系统（可选）
echo    - 编辑配置文件: %%ProgramData%%\XMotor-OPS\config\.env
echo.
echo 6. 启动服务
echo    - 双击桌面快捷方式 "XMotor OPS"，或
echo    - 运行 %%ProgramFiles%%\XMotor-OPS\start.bat
echo.
echo 7. 访问系统
echo    - 前端界面: http://localhost
echo    - 后端 API: http://localhost:8000/api/docs
echo.
echo 常见问题:
echo   - 如果提示"找不到文件"，请确保在解压后的目录中运行 install.bat
echo   - 如果 Docker 构建失败，请检查网络连接和 Docker 配置
echo.
echo 详细文档请查看 README.md
echo.
) > "%RELEASE_DIR%\INSTALL.txt"

echo [OK] 安装说明已创建
echo.

REM 创建 .gitignore（如果发布包需要版本控制）
echo [6/7] 创建 .gitignore...
(
echo # 运行时文件
echo .env
echo *.log
echo logs/
echo.
echo # Docker
echo .docker/
echo.
) > "%RELEASE_DIR%\.gitignore"

echo [OK] .gitignore 已创建
echo.

REM 创建压缩包
echo [7/7] 创建压缩包...
if exist "%PACKAGE_NAME%.zip" del "%PACKAGE_NAME%.zip"

REM 使用 PowerShell 创建 ZIP 文件
powershell -Command "Compress-Archive -Path '%RELEASE_DIR%\*' -DestinationPath '%PACKAGE_NAME%.zip' -Force" >nul 2>&1

if exist "%PACKAGE_NAME%.zip" (
    echo [OK] 压缩包已创建: %PACKAGE_NAME%.zip
    
    REM 显示文件大小
    for %%A in ("%PACKAGE_NAME%.zip") do (
        set SIZE=%%~zA
        set /a SIZE_MB=!SIZE!/1048576
        echo [信息] 文件大小: !SIZE_MB! MB
    )
    if not defined SIZE_MB (
        echo [信息] 压缩包已创建，请手动查看文件大小
    )
) else (
    echo [错误] 压缩包创建失败
    echo [提示] 请手动压缩 %RELEASE_DIR% 目录
)

echo.
echo ==========================================
echo   打包完成！
echo ==========================================
echo.
echo 发布包位置: %PACKAGE_NAME%.zip
echo 发布目录: %RELEASE_DIR%\
echo.
echo 下一步:
echo 1. 测试发布包（解压并安装）
echo 2. 验证所有功能正常
echo 3. 分发发布包
echo.
pause

