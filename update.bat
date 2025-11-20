@echo off
REM ==========================================
REM  XMotor Industrial OPS 更新脚本
REM ==========================================

setlocal

set INSTALL_DIR=%ProgramFiles%\XMotor-OPS
set CONFIG_DIR=%ProgramData%\XMotor-OPS\config

REM 检查是否已安装
if not exist "%INSTALL_DIR%\docker-compose.yml" (
    echo [错误] 未找到安装目录
    echo 请先运行 install.bat 进行安装
    pause
    exit /b 1
)

REM 检查 Docker
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] Docker Desktop 未运行
    pause
    exit /b 1
)

echo.
echo ==========================================
echo   XMotor Industrial OPS 更新程序
echo ==========================================
echo.

REM 备份配置文件
echo [1/4] 备份配置文件...
if exist "%CONFIG_DIR%\.env" (
    copy "%CONFIG_DIR%\.env" "%CONFIG_DIR%\.env.backup" >nul
    echo [OK] 配置文件已备份
)

REM 停止服务
echo [2/4] 停止现有服务...
cd /d "%INSTALL_DIR%"
docker compose down
echo [OK] 服务已停止

REM 拉取最新代码（如果是从 Git 更新）
REM git pull

REM 重新构建镜像
echo [3/4] 重新构建 Docker 镜像...
docker compose build --no-cache

if %errorlevel% neq 0 (
    echo [错误] 镜像构建失败
    echo 正在恢复服务...
    docker compose up -d
    pause
    exit /b 1
)

echo [OK] 镜像构建完成

REM 启动服务
echo [4/4] 启动更新后的服务...
docker compose up -d

if %errorlevel% neq 0 (
    echo [错误] 服务启动失败
    pause
    exit /b 1
)

echo [OK] 服务已启动

echo.
echo ==========================================
echo   更新完成！
echo ==========================================
echo.
echo 访问地址:
echo   前端界面: http://localhost
echo   后端 API: http://localhost:8000/api/docs
echo.
pause

