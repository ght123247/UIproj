# 🚀 快速修复 Docker 网络问题

## 最简单的方法（3 步）

### 步骤 1: 配置镜像加速器

**打开 Docker Desktop → Settings → Docker Engine**

在 JSON 配置中添加：

```json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ]
}
```

点击 **"Apply & Restart"**

### 步骤 2: 等待 Docker 重启完成

等待 1-2 分钟，直到 Docker Desktop 完全启动。

### 步骤 3: 验证并构建

```powershell
# 验证配置
docker info | Select-String "Registry Mirrors"

# 构建项目
docker-compose up -d --build
```

## 如果还是不行

### 方案 A: 使用代理/VPN

如果您有可用的代理或 VPN，先连接后再尝试。

### 方案 B: 手动拉取镜像

```powershell
# 先手动拉取基础镜像
docker pull python:3.11-slim
docker pull node:20-alpine
docker pull nginx:alpine

# 然后再构建
docker-compose up -d --build
```

### 方案 C: 使用其他网络环境

- 使用手机热点
- 使用其他网络
- 在能访问 Docker Hub 的环境中构建

## 详细说明

查看 [DOCKER_MIRROR_SETUP.md](./DOCKER_MIRROR_SETUP.md) 获取详细配置说明。

