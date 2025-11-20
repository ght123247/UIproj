@echo off
REM ==========================================
REM  构建并导出 Docker 镜像（离线部署用）
REM  在可以访问 Docker Hub 的电脑上运行
REM ==========================================

setlocal

set PROJECT_DIR=%~dp0..
set OUTPUT_DIR=%PROJECT_DIR%\offline-images
set BACKEND_IMAGE=xmotor-backend:latest
set FRONTEND_IMAGE=xmotor-frontend:latest

echo.
echo ==========================================
echo   构建并导出 Docker 镜像
echo ==========================================
echo.

REM 检查 Docker
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Docker，请先安装并启动 Docker Desktop
    pause
    exit /b 1
)

REM 创建输出目录
if not exist "%OUTPUT_DIR%" (
    mkdir "%OUTPUT_DIR%"
)

REM 构建镜像
echo [1/4] 构建镜像...
cd /d "%PROJECT_DIR%"
docker compose build
if %errorlevel% neq 0 (
    echo [错误] 构建失败
    pause
    exit /b 1
)
echo [OK] 镜像构建完成
echo.

REM 导出镜像
echo [2/4] 导出镜像文件...
docker save %BACKEND_IMAGE% -o "%OUTPUT_DIR%\xmotor-backend.tar"
if %errorlevel% neq 0 (
    echo [错误] 导出后端镜像失败
    pause
    exit /b 1
)

docker save %FRONTEND_IMAGE% -o "%OUTPUT_DIR%\xmotor-frontend.tar"
if %errorlevel% neq 0 (
    echo [错误] 导出前端镜像失败
    pause
    exit /b 1
)
echo [OK] 镜像导出完成
echo.

REM 生成校验信息
echo [3/4] 生成镜像清单...
(
    echo 镜像导出时间: %date% %time%
    echo 后端镜像: %BACKEND_IMAGE%
    docker images %BACKEND_IMAGE%
    echo 前端镜像: %FRONTEND_IMAGE%
    docker images %FRONTEND_IMAGE%
) > "%OUTPUT_DIR%\IMAGES_INFO.txt"

certutil -hashfile "%OUTPUT_DIR%\xmotor-backend.tar" SHA256 > "%OUTPUT_DIR%\xmotor-backend.sha256"
certutil -hashfile "%OUTPUT_DIR%\xmotor-frontend.tar" SHA256 > "%OUTPUT_DIR%\xmotor-frontend.sha256"
echo [OK] 生成校验文件完成
echo.

REM 完成
echo [4/4] 完成！
echo 存放目录: %OUTPUT_DIR%
echo.
echo 请将以下文件拷贝到目标电脑:
echo   - offline-images\xmotor-backend.tar
echo   - offline-images\xmotor-frontend.tar
echo   - offline-images\*.sha256
echo   - 项目完整目录（含 docker-compose.yml）
echo.
pause

