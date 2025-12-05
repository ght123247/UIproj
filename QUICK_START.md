# 快速开始指南

## 产品打包

### 1. 运行打包脚本

```batch
build-release.bat
```

### 2. 获取发布包

打包完成后会生成：
- `XMotor-Industrial-OPS-v1.0.0-Windows.zip`

## 用户安装

### 1. 解压安装包

将 `XMotor-Industrial-OPS-v1.0.0-Windows.zip` 解压到任意目录

### 2. 运行安装程序

**以管理员身份运行** `install.bat`

### 3. 配置系统（可选）

编辑配置文件: `%ProgramData%\XMotor-OPS\config\.env`

### 4. 启动服务

- 双击桌面快捷方式 "XMotor OPS"，或
- 运行 `%ProgramFiles%\XMotor-OPS\start.bat`

### 5. 访问系统

- 前端界面: http://localhost
- 后端 API: http://localhost:8000/api/docs

## 文件说明

### 安装脚本
- `install.bat` - 安装程序（需要管理员权限）
- `start.bat` - 启动服务
- `stop.bat` - 停止服务
- `update.bat` - 更新程序
- `uninstall.bat` - 卸载程序

### 配置文件
- `.env.example` 或 `env.example.txt` - 配置模板
- `product-config.yml` - 产品配置信息

### 文档
- `README.md` 或 `PRODUCT_README.md` - 用户手册
- `INSTALL.txt` - 快速安装说明

## 目录结构

安装后：
- **程序目录**: `%ProgramFiles%\XMotor-OPS\`
- **数据目录**: `%ProgramData%\XMotor-OPS\`
  - `config\.env` - 配置文件
  - `logs\` - 日志文件

## 常见问题

### 安装失败
- 确保以管理员身份运行
- 检查 Docker Desktop 是否已安装并运行

### 启动失败
- 检查 Docker Desktop 是否运行
- 查看日志: `docker compose logs`

### 无法访问
- 检查端口是否被占用
- 确认防火墙设置

详细问题请查看 `PRODUCT_README.md`

