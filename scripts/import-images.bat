@echo off
REM ==========================================
REM  导入 Docker 镜像并启动服务（离线部署）
REM  在目标电脑上运行
REM ==========================================

setlocal

set INSTALL_DIR=%~dp0..
set IMAGE_DIR=%INSTALL_DIR%\offline-images

echo.
echo ==========================================
echo   导入 Docker 镜像并启动服务
echo ==========================================
echo.

REM 检查镜像文件
if not exist "%IMAGE_DIR%\xmotor-backend.tar" (
    echo [错误] 未找到 %IMAGE_DIR%\xmotor-backend.tar
    pause
    exit /b 1
)
if not exist "%IMAGE_DIR%\xmotor-frontend.tar" (
    echo [错误] 未找到 %IMAGE_DIR%\xmotor-frontend.tar
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

REM 导入镜像
echo [1/3] 导入后端镜像...
docker load -i "%IMAGE_DIR%\xmotor-backend.tar"
if %errorlevel% neq 0 (
    echo [错误] 导入后端镜像失败
    pause
    exit /b 1
)

echo [2/3] 导入前端镜像...
docker load -i "%IMAGE_DIR%\xmotor-frontend.tar"
if %errorlevel% neq 0 (
    echo [错误] 导入前端镜像失败
    pause
    exit /b 1
)

REM 启动服务
echo [3/3] 启动 Docker Compose...
cd /d "%INSTALL_DIR%"
docker compose up -d
if %errorlevel% neq 0 (
    echo [错误] 启动服务失败
    pause
    exit /b 1
)

echo.
echo ==========================================
echo   服务已启动！
echo ==========================================
echo.
echo 前端: http://localhost
echo 后端: http://localhost:8000/api/docs
echo.
pause

