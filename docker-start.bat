@echo off
REM Docker 启动脚本 (Windows)

echo ==========================================
echo   XMotor Industrial OPS - Docker 部署
echo ==========================================
echo.

REM 检查 Docker 是否安装
where docker >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未找到 Docker，请先安装 Docker Desktop
    pause
    exit /b 1
)

echo [OK] Docker 环境检查通过
echo.

REM 构建并启动服务
echo [信息] 正在构建并启动服务...
docker compose up -d --build

if %errorlevel% equ 0 (
    echo.
    echo [成功] 服务启动成功！
    echo.
    echo [访问地址]
    echo   前端界面: http://localhost
    echo   后端 API: http://localhost:8000/api/docs
    echo.
    echo [常用命令]
    echo   查看日志: docker compose logs -f
    echo   停止服务: docker compose down
    echo   重启服务: docker compose restart
    echo.
) else (
    echo.
    echo [错误] 服务启动失败，请查看错误信息
    pause
    exit /b 1
)

pause

