@echo off
REM ==========================================
REM  XMotor Industrial OPS 停止脚本
REM ==========================================

setlocal

set INSTALL_DIR=%ProgramFiles%\XMotor-OPS

REM 检查是否已安装
if not exist "%INSTALL_DIR%\docker-compose.yml" (
    echo [错误] 未找到安装目录
    pause
    exit /b 1
)

echo.
echo ==========================================
echo   停止 XMotor Industrial OPS
echo ==========================================
echo.

cd /d "%INSTALL_DIR%"

REM 停止服务
echo [信息] 正在停止服务...
docker compose down

if %errorlevel% neq 0 (
    echo [警告] 停止服务时出现错误
) else (
    echo [OK] 服务已停止
)

echo.
pause

