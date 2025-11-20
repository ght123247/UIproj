# Docker 网络连接问题解决方案

## 问题描述

构建 Docker 镜像时出现以下错误：
```
failed to resolve source metadata for docker.io/library/python:3.11-slim
dial tcp: connectex: A connection attempt failed
```

这通常是因为无法访问 Docker Hub（registry-1.docker.io）。

## 解决方案

### 方案一：配置 Docker 镜像加速器（推荐）

#### Windows Docker Desktop

1. **打开 Docker Desktop 设置**
   - 右键点击系统托盘中的 Docker 图标
   - 选择 "Settings" 或 "设置"

2. **配置镜像加速器**
   - 进入 "Docker Engine" 或 "Docker 引擎"
   - 在 JSON 配置中添加以下内容：

```json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ]
}
```

3. **应用并重启**
   - 点击 "Apply & Restart"
   - 等待 Docker 重启完成

#### 常用国内镜像源

- **中科大镜像**: `https://docker.mirrors.ustc.edu.cn`
- **网易镜像**: `https://hub-mirror.c.163.com`
- **百度云镜像**: `https://mirror.baidubce.com`
- **阿里云镜像**: 需要登录阿里云获取专属加速地址

#### 验证配置

```powershell
docker info | Select-String "Registry Mirrors"
```

应该能看到配置的镜像源。

### 方案二：使用国内镜像源（修改 Dockerfile）

如果方案一不行，可以直接修改 Dockerfile 使用国内镜像。

#### 修改后端 Dockerfile

编辑 `backend/Dockerfile`：

```dockerfile
# 使用阿里云镜像
FROM registry.cn-hangzhou.aliyuncs.com/acs/python:3.11-slim

# 或者使用中科大镜像
# FROM docker.mirrors.ustc.edu.cn/library/python:3.11-slim

WORKDIR /app
# ... 其余内容保持不变
```

#### 修改前端 Dockerfile

编辑 `my-ui-vite/Dockerfile`：

```dockerfile
# 构建阶段 - 使用国内镜像
FROM registry.cn-hangzhou.aliyuncs.com/acs/node:20-alpine AS builder

# 或者使用中科大镜像
# FROM docker.mirrors.ustc.edu.cn/library/node:20-alpine AS builder

WORKDIR /app
# ... 其余内容保持不变

# 生产阶段
FROM registry.cn-hangzhou.aliyuncs.com/acs/nginx:alpine
# 或者
# FROM docker.mirrors.ustc.edu.cn/library/nginx:alpine

# ... 其余内容保持不变
```

### 方案三：使用代理

如果您有可用的代理：

1. **配置 Docker Desktop 代理**
   - Settings → Resources → Proxies
   - 配置 HTTP/HTTPS 代理

2. **或使用环境变量**
```powershell
$env:HTTP_PROXY="http://proxy.example.com:8080"
$env:HTTPS_PROXY="http://proxy.example.com:8080"
docker-compose up -d --build
```

## 快速修复脚本

创建一个 PowerShell 脚本来配置镜像加速器：

```powershell
# 配置 Docker 镜像加速器
$configPath = "$env:USERPROFILE\.docker\daemon.json"

# 创建配置目录
if (-not (Test-Path (Split-Path $configPath))) {
    New-Item -ItemType Directory -Path (Split-Path $configPath) -Force
}

# 读取现有配置或创建新配置
if (Test-Path $configPath) {
    $config = Get-Content $configPath | ConvertFrom-Json
} else {
    $config = @{}
}

# 添加镜像源
$config.registry-mirrors = @(
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
)

# 保存配置
$config | ConvertTo-Json -Depth 10 | Set-Content $configPath

Write-Host "✅ Docker 镜像加速器配置完成！" -ForegroundColor Green
Write-Host "请重启 Docker Desktop 使配置生效" -ForegroundColor Yellow
```

## 验证修复

配置完成后，重新尝试构建：

```powershell
docker-compose up -d --build
```

如果仍然失败，可以尝试：

```powershell
# 手动拉取镜像测试
docker pull python:3.11-slim
docker pull node:20-alpine
docker pull nginx:alpine
```

## 其他注意事项

1. **防火墙设置**：确保防火墙允许 Docker 访问网络
2. **VPN/代理**：如果使用 VPN，可能需要配置代理
3. **网络环境**：某些企业网络可能限制 Docker Hub 访问

## 如果所有方案都失败

可以考虑：
1. 使用预构建的镜像（如果有）
2. 在能访问 Docker Hub 的环境中构建镜像，然后导出导入
3. 使用云服务器构建镜像

