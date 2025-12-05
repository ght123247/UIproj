@echo off
REM ==========================================
REM  手动拉取 Docker 镜像
REM  如果镜像加速器无法使用，可以手动拉取
REM ==========================================

echo.
echo ==========================================
echo   手动拉取 Docker 镜像
echo ==========================================
echo.
echo 这将尝试从不同的镜像源拉取基础镜像
echo.

REM 测试镜像源并手动拉取
echo [1/3] 尝试从网易镜像源拉取...
docker pull hub-mirror.c.163.com/library/python:3.11-slim
if %errorlevel% equ 0 (
    docker tag hub-mirror.c.163.com/library/python:3.11-slim python:3.11-slim
    echo [OK] Python 镜像拉取成功
) else (
    echo [失败] 网易镜像源不可用，尝试下一个...
)

docker pull hub-mirror.c.163.com/library/node:20-alpine
if %errorlevel% equ 0 (
    docker tag hub-mirror.c.163.com/library/node:20-alpine node:20-alpine
    echo [OK] Node 镜像拉取成功
) else (
    echo [失败] 网易镜像源不可用，尝试下一个...
)

docker pull hub-mirror.c.163.com/library/nginx:alpine
if %errorlevel% equ 0 (
    docker tag hub-mirror.c.163.com/library/nginx:alpine nginx:alpine
    echo [OK] Nginx 镜像拉取成功
) else (
    echo [失败] 网易镜像源不可用，尝试下一个...
)

echo.
echo [2/3] 如果网易镜像失败，尝试百度云镜像...
docker pull mirror.baidubce.com/library/python:3.11-slim 2>nul
docker pull mirror.baidubce.com/library/node:20-alpine 2>nul
docker pull mirror.baidubce.com/library/nginx:alpine 2>nul

echo.
echo [3/3] 验证镜像...
docker images | findstr "python.*3.11-slim"
docker images | findstr "node.*20-alpine"
docker images | findstr "nginx.*alpine"

echo.
echo ==========================================
echo   如果镜像拉取成功，可以继续构建
echo ==========================================
echo.
pause

