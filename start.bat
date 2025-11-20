@echo off
REM ==========================================
REM  XMotor Industrial OPS 启动脚本
REM ==========================================

setlocal

set INSTALL_DIR=%ProgramFiles%\XMotor-OPS
set CONFIG_DIR=%ProgramData%\XMotor-OPS\config

REM 检查是否已安装
if not exist "%INSTALL_DIR%\docker-compose.yml" (
    echo [错误] 未找到安装目录或文件不完整
    echo 安装目录: %INSTALL_DIR%
    echo 请先运行 install.bat 进行安装
    pause
    exit /b 1
)

REM 检查必需目录
if not exist "%INSTALL_DIR%\backend" (
    echo [错误] 后端目录不存在
    echo 请重新运行 install.bat 进行安装
    pause
    exit /b 1
)

if not exist "%INSTALL_DIR%\my-ui-vite" (
    echo [错误] 前端目录不存在
    echo 请重新运行 install.bat 进行安装
    pause
    exit /b 1
)

REM 检查 Docker
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] Docker Desktop 未运行
    echo 正在启动 Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo 请等待 Docker Desktop 启动后，重新运行此脚本
    pause
    exit /b 1
)

echo.
echo ==========================================
echo   启动 XMotor Industrial OPS
echo ==========================================
echo.

cd /d "%INSTALL_DIR%"

REM 检查配置文件
if exist "%CONFIG_DIR%\.env" (
    echo [信息] 使用配置文件: %CONFIG_DIR%\.env
    copy "%CONFIG_DIR%\.env" ".env" >nul
) else (
    echo [警告] 未找到配置文件，使用默认配置
    if not exist ".env.example" (
        echo [错误] 未找到配置文件模板
        pause
        exit /b 1
    )
    copy ".env.example" ".env" >nul
)

REM 启动服务
echo [信息] 正在启动服务...
docker compose up -d

if %errorlevel% neq 0 (
    echo [错误] 服务启动失败
    echo 请检查 Docker 状态和配置文件
    pause
    exit /b 1
)

REM 等待服务启动
echo [信息] 等待服务启动（约 30 秒）...
timeout /t 5 /nobreak >nul

REM 检查服务状态
docker compose ps

echo.
echo ==========================================
echo   服务启动完成！
echo ==========================================
echo.
echo 访问地址:
echo   前端界面: http://localhost
echo   后端 API: http://localhost:8000/api/docs
echo   健康检查: http://localhost:8000/api/health
echo.
echo 查看日志: docker compose logs -f
echo 停止服务: stop.bat
echo.
pause

