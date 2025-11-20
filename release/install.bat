@echo off
REM ==========================================
REM  XMotor Industrial OPS v1.0.0 安装脚本
REM ==========================================

setlocal enabledelayedexpansion

set VERSION=1.0.0
set PRODUCT_NAME=XMotor Industrial OPS
set INSTALL_DIR=%ProgramFiles%\XMotor-OPS
set DATA_DIR=%ProgramData%\XMotor-OPS
set CONFIG_DIR=%ProgramData%\XMotor-OPS\config
set LOG_DIR=%ProgramData%\XMotor-OPS\logs

echo.
echo ==========================================
echo   %PRODUCT_NAME% v%VERSION% 安装程序
echo ==========================================
echo.

REM 检查管理员权限
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 需要管理员权限运行此安装程序
    echo 请右键点击此文件，选择"以管理员身份运行"
    pause
    exit /b 1
)

REM 检查 Docker
echo [1/6] 检查 Docker 环境...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未找到 Docker Desktop
    echo 请先安装 Docker Desktop: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

docker compose version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] Docker Compose 未安装或版本过低
    echo 请更新 Docker Desktop 到最新版本
    pause
    exit /b 1
)

echo [OK] Docker 环境检查通过
echo.

REM 检查 Docker 是否运行
echo [2/6] 检查 Docker 服务状态...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [警告] Docker Desktop 未运行
    echo 正在启动 Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo 请等待 Docker Desktop 完全启动后，重新运行此安装程序
    pause
    exit /b 1
)

echo [OK] Docker 服务正在运行
echo.

REM 创建安装目录
echo [3/6] 创建安装目录...
if not exist "%INSTALL_DIR%" (
    mkdir "%INSTALL_DIR%"
    echo [OK] 创建安装目录: %INSTALL_DIR%
) else (
    echo [信息] 安装目录已存在: %INSTALL_DIR%
)

REM 创建数据目录
if not exist "%DATA_DIR%" mkdir "%DATA_DIR%"
if not exist "%CONFIG_DIR%" mkdir "%CONFIG_DIR%"
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"
echo [OK] 创建数据目录: %DATA_DIR%
echo.

REM 复制文件
echo [4/6] 复制程序文件...

REM 获取当前脚本所在目录
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

REM 检查必需文件是否存在
if not exist "docker-compose.yml" (
    echo [错误] 未找到 docker-compose.yml
    echo 请确保在解压后的发布包目录中运行此安装程序
    pause
    exit /b 1
)

REM 复制文件（使用相对路径）
xcopy /E /I /Y "docker-compose.yml" "%INSTALL_DIR%\" >nul 2>&1
if exist "backend" xcopy /E /I /Y "backend" "%INSTALL_DIR%\backend\" >nul 2>&1
if exist "my-ui-vite" xcopy /E /I /Y "my-ui-vite" "%INSTALL_DIR%\my-ui-vite\" >nul 2>&1
if exist "start.bat" copy /Y "start.bat" "%INSTALL_DIR%\" >nul 2>&1
if exist "stop.bat" copy /Y "stop.bat" "%INSTALL_DIR%\" >nul 2>&1
if exist "update.bat" copy /Y "update.bat" "%INSTALL_DIR%\" >nul 2>&1
if exist "uninstall.bat" copy /Y "uninstall.bat" "%INSTALL_DIR%\" >nul 2>&1
if exist "README.md" copy /Y "README.md" "%INSTALL_DIR%\" >nul 2>&1
if exist "product-config.yml" copy /Y "product-config.yml" "%INSTALL_DIR%\" >nul 2>&1

REM 复制配置文件模板
if not exist "%CONFIG_DIR%\.env" (
    if exist "env.example.txt" (
        copy "env.example.txt" "%CONFIG_DIR%\.env" >nul
    ) else if exist ".env.example" (
        copy ".env.example" "%CONFIG_DIR%\.env" >nul
    )
    echo [OK] 创建配置文件模板: %CONFIG_DIR%\.env
) else (
    echo [信息] 配置文件已存在，跳过
)

echo [OK] 文件复制完成
echo.

REM 创建快捷方式
echo [5/6] 创建桌面快捷方式...
set DESKTOP=%USERPROFILE%\Desktop
set SHORTCUT=%DESKTOP%\XMotor OPS.lnk

powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%SHORTCUT%'); $Shortcut.TargetPath = '%INSTALL_DIR%\start.bat'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.Description = '%PRODUCT_NAME%'; $Shortcut.Save()" >nul 2>&1

if exist "%SHORTCUT%" (
    echo [OK] 桌面快捷方式已创建
) else (
    echo [警告] 无法创建桌面快捷方式（可能需要手动创建）
)
echo.

REM 构建 Docker 镜像
echo [6/6] 构建 Docker 镜像（这可能需要几分钟）...
cd /d "%INSTALL_DIR%"

REM 检查 docker-compose.yml 是否存在
if not exist "docker-compose.yml" (
    echo [错误] 未找到 docker-compose.yml
    echo 安装目录: %INSTALL_DIR%
    pause
    exit /b 1
)

REM 检查 backend 和 my-ui-vite 目录是否存在
if not exist "backend" (
    echo [错误] 未找到 backend 目录
    pause
    exit /b 1
)

if not exist "my-ui-vite" (
    echo [错误] 未找到 my-ui-vite 目录
    pause
    exit /b 1
)

docker compose build

if %errorlevel% neq 0 (
    echo [错误] Docker 镜像构建失败
    echo 请检查网络连接和 Docker 配置
    pause
    exit /b 1
)

echo [OK] Docker 镜像构建完成
echo.

REM 完成
echo ==========================================
echo   安装完成！
echo ==========================================
echo.
echo 安装目录: %INSTALL_DIR%
echo 数据目录: %DATA_DIR%
echo 配置文件: %CONFIG_DIR%\.env
echo.
echo 下一步:
echo 1. 编辑配置文件: %CONFIG_DIR%\.env
echo 2. 运行启动脚本: %INSTALL_DIR%\start.bat
echo 3. 访问前端界面: http://localhost
echo.
pause

