# XMotor Industrial OPS v1.0.0

## 产品简介

XMotor Industrial OPS 是一款专业的工业抛光系统操作平台，提供实时监控、数据分析和设备控制功能。

### 主要功能

- ✅ **实时监控**: 电机状态、振动数据实时显示
- ✅ **数据分析**: 历史数据图表和趋势分析
- ✅ **设备控制**: 支持转速和转矩模式控制
- ✅ **ModbusRTU 通信**: 支持与工业设备直接通信
- ✅ **模拟数据模式**: 无需硬件即可测试和演示

## 系统要求

### 最低要求

- **操作系统**: Windows 10 (64-bit) 或 Windows 11
- **CPU**: 2 核心
- **内存**: 4GB RAM
- **磁盘空间**: 10GB 可用空间
- **网络**: 本地网络访问

### 必需软件

- **Docker Desktop 20.10.0+**
  - 下载地址: https://www.docker.com/products/docker-desktop
  - 安装后需要重启计算机

## 快速开始

### 1. 安装

1. 解压安装包到任意目录
2. **以管理员身份运行** `install.bat`
3. 等待安装完成（首次安装需要构建 Docker 镜像，可能需要 5-10 分钟）

### 2. 配置

1. 打开配置文件: `%ProgramData%\XMotor-OPS\config\.env`
2. 根据实际情况修改配置（详见"配置说明"章节）
3. 保存文件

### 3. 启动

1. 双击桌面快捷方式 "XMotor OPS"，或
2. 运行 `%ProgramFiles%\XMotor-OPS\start.bat`

### 4. 访问

- **前端界面**: http://localhost
- **后端 API 文档**: http://localhost:8000/api/docs
- **健康检查**: http://localhost:8000/api/health

## 配置说明

### 基本配置

编辑配置文件: `%ProgramData%\XMotor-OPS\config\.env`

#### 数据源模式

**模拟数据模式（默认）**:
```env
XMOTOR_USE_MODBUS=false
```
适用于：测试、演示、开发

**真实设备模式**:
```env
XMOTOR_USE_MODBUS=true
XMOTOR_MODBUS_PORT=COM5
XMOTOR_MODBUS_BAUDRATE=38400
XMOTOR_MODBUS_SLAVE_ID=1
```
适用于：生产环境，需要连接真实 ModbusRTU 设备

#### 串口配置（Windows）

1. 打开"设备管理器"
2. 查看"端口(COM 和 LPT)"
3. 找到您的串口设备，记下 COM 端口号（如 COM5）
4. 在配置文件中设置 `XMOTOR_MODBUS_PORT=COM5`

#### 网络配置

**开发环境**（允许所有来源）:
```env
XMOTOR_ALLOW_ORIGINS=["*"]
```

**生产环境**（限制访问来源）:
```env
XMOTOR_ALLOW_ORIGINS=["http://localhost", "http://192.168.1.100"]
```

### 高级配置

详细配置说明请参考配置文件中的注释，或查看 `docs/CONFIGURATION.md`

## 使用指南

### 启动服务

- **方式 1**: 双击桌面快捷方式
- **方式 2**: 运行 `start.bat`
- **方式 3**: 在安装目录运行 `docker compose up -d`

### 停止服务

- **方式 1**: 运行 `stop.bat`
- **方式 2**: 在安装目录运行 `docker compose down`

### 查看日志

```batch
cd %ProgramFiles%\XMotor-OPS
docker compose logs -f
```

查看特定服务日志:
```batch
docker compose logs -f backend
docker compose logs -f frontend
```

### 更新程序

1. 运行 `update.bat`
2. 等待更新完成
3. 服务会自动重启

## 目录结构

安装后的目录结构:

```
%ProgramFiles%\XMotor-OPS\          # 程序文件
├── docker-compose.yml               # Docker 配置
├── backend\                         # 后端代码
├── my-ui-vite\                      # 前端代码
├── start.bat                        # 启动脚本
├── stop.bat                         # 停止脚本
└── update.bat                       # 更新脚本

%ProgramData%\XMotor-OPS\            # 数据目录
├── config\
│   └── .env                         # 配置文件
└── logs\                            # 日志文件
    └── control_backend.log
```

## 常见问题

### Q1: 启动时提示 "Docker Desktop 未运行"

**解决方案**:
1. 启动 Docker Desktop
2. 等待 Docker Desktop 完全启动（系统托盘图标不再闪烁）
3. 重新运行启动脚本

### Q2: 无法访问前端界面

**检查步骤**:
1. 确认服务已启动: `docker compose ps`
2. 检查端口是否被占用: `netstat -ano | findstr :80`
3. 查看前端日志: `docker compose logs frontend`
4. 尝试访问: http://127.0.0.1

### Q3: ModbusRTU 连接失败

**检查步骤**:
1. 确认串口设备已连接
2. 检查串口配置是否正确（端口号、波特率）
3. 确认串口未被其他程序占用
4. 查看后端日志: `docker compose logs backend`

### Q4: 如何修改端口

编辑 `docker-compose.yml`:
```yaml
services:
  frontend:
    ports:
      - "8080:80"  # 改为 8080
  backend:
    ports:
      - "8001:8000"  # 改为 8001
```

然后重启服务。

### Q5: 如何备份数据

备份以下目录:
- `%ProgramData%\XMotor-OPS\config\.env` - 配置文件
- `%ProgramData%\XMotor-OPS\logs\` - 日志文件

## 卸载

1. 运行 `uninstall.bat`
2. 确认卸载（会删除程序文件）
3. 选择是否删除数据文件

## 技术支持

- **文档**: 查看 `docs/` 目录下的详细文档
- **日志**: 查看 `%ProgramData%\XMotor-OPS\logs\` 目录
- **API 文档**: http://localhost:8000/api/docs

## 版本信息

- **产品版本**: 1.0.0
- **后端版本**: 1.0.0
- **前端版本**: 1.0.0
- **发布日期**: 2025-01-17

## 许可证

专有软件 - 版权所有 © 2025 XMotor Technology

