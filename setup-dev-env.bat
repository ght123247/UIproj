@echo off
chcp 65001 >nul
echo ==========================================
echo 开发环境搭建脚本
echo ==========================================
echo.

REM 检查 PowerShell 是否可用
powershell -Command "Get-Command powershell" >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 无法运行 PowerShell
    pause
    exit /b 1
)

REM 运行 PowerShell 脚本
powershell -ExecutionPolicy Bypass -File "%~dp0setup-dev-env.ps1"

if %errorlevel% neq 0 (
    echo.
    echo 脚本执行失败，请检查错误信息
    pause
    exit /b 1
)

pause

