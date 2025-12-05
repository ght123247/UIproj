# Docker 部署指南

本文档说明如何使用 Docker 部署 XMotor Industrial OPS 项目。

## 前置要求

- Docker Engine 20.10+ 或 Docker Desktop
- Docker Compose 2.0+

## ⚠️ 网络连接问题

如果遇到无法连接 Docker Hub 的错误（`failed to resolve source metadata for docker.io`），请先解决网络问题：

### 快速修复（推荐）

运行配置脚本：
```powershell
.\fix-docker-mirror.ps1
```

然后**重启 Docker Desktop**，再继续部署。

### 详细解决方案

请查看 [DOCKER_NETWORK_FIX.md](./DOCKER_NETWORK_FIX.md) 获取完整的网络问题解决方案。

### 备用方案：使用国内镜像源

如果配置镜像加速器后仍然无法连接，可以使用备用配置：

```powershell
# 使用国内镜像源的 Dockerfile
docker-compose -f docker-compose.cn.yml up -d --build
```

## 快速开始

### 1. 构建并启动服务

```bash
# 在项目根目录执行
docker-compose up -d
```

这将启动两个服务：
- **后端服务** (backend): 运行在 `http://localhost:8000`
- **前端服务** (frontend): 运行在 `http://localhost:80`

### 2. 访问应用

- 前端界面: http://localhost
- 后端 API 文档: http://localhost:8000/api/docs
- 后端健康检查: http://localhost:8000/api/health

### 3. 查看日志

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 4. 停止服务

```bash
docker-compose down
```

## 配置说明

### 环境变量配置

在 `docker-compose.yml` 中可以配置以下环境变量：

#### 后端配置

- `XMOTOR_USE_MODBUS`: 是否使用 ModbusRTU（`true`/`false`），默认 `false`（使用模拟数据）
- `XMOTOR_MODBUS_PORT`: 串口设备路径（Linux: `/dev/ttyUSB0`, Windows: `COM5`）
- `XMOTOR_MODBUS_BAUDRATE`: 波特率，默认 `38400`
- `XMOTOR_MODBUS_SLAVE_ID`: 从站地址，默认 `1`
- `XMOTOR_ALLOW_ORIGINS`: CORS 允许的来源，默认 `["*"]`
- `XMOTOR_LOG_LEVEL`: 日志级别（`DEBUG`, `INFO`, `WARNING`, `ERROR`），默认 `INFO`

#### 前端配置

前端通过环境变量 `VITE_API_BASE_URL` 配置 API 地址：
- 开发环境：`http://127.0.0.1:8000`
- Docker 环境：`/api`（通过 nginx 代理）

## 串口访问（ModbusRTU）

如果需要在 Docker 容器中访问串口设备（Linux）：

1. 在 `docker-compose.yml` 中取消注释串口挂载：
```yaml
volumes:
  - /dev/ttyUSB0:/dev/ttyUSB0
```

2. 设置环境变量：
```yaml
environment:
  - XMOTOR_USE_MODBUS=true
  - XMOTOR_MODBUS_PORT=/dev/ttyUSB0
```

3. 确保容器有访问串口的权限：
```bash
# 将用户添加到 dialout 组（Linux）
sudo usermod -a -G dialout $USER
```

**注意**：Windows 系统上 Docker Desktop 对串口的支持有限，建议：
- 使用 WSL2 运行 Docker
- 或在宿主机上直接运行后端服务

## 开发模式

### 仅构建镜像

```bash
docker-compose build
```

### 重新构建并启动

```bash
docker-compose up -d --build
```

### 查看运行状态

```bash
docker-compose ps
```

## 生产环境部署建议

1. **使用环境变量文件**：创建 `.env` 文件管理敏感配置
2. **配置 HTTPS**：在 nginx 配置中添加 SSL 证书
3. **日志管理**：配置日志轮转和集中日志收集
4. **资源限制**：在 `docker-compose.yml` 中添加资源限制
5. **健康检查**：已配置健康检查，确保服务正常运行

## 故障排查

### 后端无法启动

1. 检查端口是否被占用：
```bash
# Linux/Mac
lsof -i :8000
# Windows
netstat -ano | findstr :8000
```

2. 查看后端日志：
```bash
docker-compose logs backend
```

### 前端无法连接后端

1. 检查 nginx 配置是否正确
2. 确认后端服务健康检查通过：
```bash
curl http://localhost:8000/api/health
```

3. 检查浏览器控制台的网络请求

### 串口访问问题

1. 确认串口设备存在：
```bash
ls -l /dev/ttyUSB*
```

2. 检查设备权限：
```bash
ls -l /dev/ttyUSB0
```

3. 查看容器日志中的错误信息

## 项目结构

```
.
├── docker-compose.yml          # Docker Compose 配置
├── backend/
│   ├── Dockerfile              # 后端 Docker 镜像
│   ├── .dockerignore           # Docker 构建忽略文件
│   └── ...
├── my-ui-vite/
│   ├── Dockerfile              # 前端 Docker 镜像
│   ├── nginx.conf              # Nginx 配置
│   ├── .dockerignore           # Docker 构建忽略文件
│   └── ...
└── DOCKER_DEPLOY.md            # 本文档
```

## 常见问题

### Q: 如何修改端口？

A: 在 `docker-compose.yml` 中修改 `ports` 配置：
```yaml
ports:
  - "8080:8000"  # 将后端映射到 8080
  - "3000:80"    # 将前端映射到 3000
```

### Q: 如何更新代码后重新部署？

A: 
```bash
# 停止服务
docker-compose down

# 重新构建并启动
docker-compose up -d --build
```

### Q: 如何查看容器内部文件？

A:
```bash
# 进入后端容器
docker-compose exec backend bash

# 进入前端容器
docker-compose exec frontend sh
```

### Q: 如何清理所有数据？

A:
```bash
# 停止并删除容器、网络
docker-compose down

# 删除镜像（可选）
docker-compose down --rmi all

# 删除卷（可选，会删除日志）
docker-compose down -v
```

