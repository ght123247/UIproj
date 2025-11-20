@echo off
REM ==========================================
REM  XMotor Industrial OPS 卸载脚本
REM ==========================================

setlocal

set INSTALL_DIR=%ProgramFiles%\XMotor-OPS
set DATA_DIR=%ProgramData%\XMotor-OPS
set DESKTOP=%USERPROFILE%\Desktop
set SHORTCUT=%DESKTOP%\XMotor OPS.lnk

echo.
echo ==========================================
echo   XMotor Industrial OPS 卸载程序
echo ==========================================
echo.
echo 警告: 此操作将删除所有程序文件和数据
echo.
set /p CONFIRM="确认卸载? (Y/N): "
if /i not "%CONFIRM%"=="Y" (
    echo 取消卸载
    pause
    exit /b 0
)

REM 检查管理员权限
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 需要管理员权限运行此卸载程序
    echo 请右键点击此文件，选择"以管理员身份运行"
    pause
    exit /b 1
)

REM 停止服务
echo [1/4] 停止服务...
if exist "%INSTALL_DIR%\docker-compose.yml" (
    cd /d "%INSTALL_DIR%"
    docker compose down >nul 2>&1
    echo [OK] 服务已停止
) else (
    echo [信息] 未找到服务，跳过
)

REM 删除 Docker 镜像（可选）
echo [2/4] 删除 Docker 镜像...
set /p DELETE_IMAGES="是否删除 Docker 镜像? (Y/N): "
if /i "%DELETE_IMAGES%"=="Y" (
    docker rmi xmotor-backend xmotor-frontend >nul 2>&1
    echo [OK] Docker 镜像已删除
) else (
    echo [信息] 保留 Docker 镜像
)

REM 删除快捷方式
echo [3/4] 删除快捷方式...
if exist "%SHORTCUT%" (
    del "%SHORTCUT%" >nul 2>&1
    echo [OK] 桌面快捷方式已删除
)

REM 删除文件
echo [4/4] 删除程序文件...
if exist "%INSTALL_DIR%" (
    rd /s /q "%INSTALL_DIR%" >nul 2>&1
    echo [OK] 安装目录已删除: %INSTALL_DIR%
)

REM 询问是否删除数据
echo.
set /p DELETE_DATA="是否删除所有数据（包括配置和日志）? (Y/N): "
if /i "%DELETE_DATA%"=="Y" (
    if exist "%DATA_DIR%" (
        rd /s /q "%DATA_DIR%" >nul 2>&1
        echo [OK] 数据目录已删除: %DATA_DIR%
    )
) else (
    echo [信息] 保留数据目录: %DATA_DIR%
    echo 您可以稍后手动删除
)

echo.
echo ==========================================
echo   卸载完成！
echo ==========================================
echo.
pause

