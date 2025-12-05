# Docker 网络连接问题解决方案

## 当前问题

所有 Docker 镜像源都无法连接，可能的原因：
1. 网络环境限制（防火墙/代理）
2. DNS 解析问题
3. 需要 VPN 或代理

## 解决方案

### 方案 1: 使用代理/VPN（推荐）

如果您有可用的代理或 VPN：

1. **连接代理/VPN**
   - 确保代理/VPN 正常工作

2. **配置 Docker Desktop 代理**
   - 打开 Docker Desktop → Settings → Resources → Proxies
   - 配置 HTTP/HTTPS 代理
   - 点击 "Apply & Restart"

3. **重新尝试安装**

### 方案 2: 使用手机热点

1. 开启手机热点
2. 电脑连接到手机热点
3. 重新尝试安装

### 方案 3: 预构建镜像 + Docker Compose（推荐）

适用于“构建机有网络、目标机无网络”的场景。流程：

1. 在构建机运行 `scripts\build-export-images.bat`
   - 自动 `docker compose build`
   - 导出 `offline-images\xmotor-backend.tar`
   - 导出 `offline-images\xmotor-frontend.tar`
   - 生成 SHA256 校验文件

2. 将以下内容拷贝到目标电脑
   - `offline-images\*.tar` 与 `*.sha256`
   - 项目代码（包含 `docker-compose.yml`）

3. 在目标电脑运行 `scripts\import-images.bat`
   - 自动 `docker load -i ...`
   - `docker compose up -d`

详细步骤见 `OFFLINE_DEPLOY.md`。

### 方案 4: 使用阿里云镜像（需要登录）

1. 登录阿里云容器镜像服务
2. 获取专属加速地址
3. 配置到 `daemon.json`

### 方案 5: 联系网络管理员

如果是企业网络环境，请联系网络管理员：
- 开放 Docker Hub 访问权限
- 配置企业代理
- 提供内部镜像源

## 临时解决方案

如果以上方案都不可行，可以考虑：

1. **在能访问 Docker Hub 的环境中构建镜像**
2. **导出镜像并传输到目标环境**
3. **使用预构建的镜像**

## 检查网络连接

运行以下命令检查网络：

```powershell
# 测试 DNS 解析
nslookup hub-mirror.c.163.com
nslookup registry-1.docker.io

# 测试连接
Test-NetConnection hub-mirror.c.163.com -Port 443
Test-NetConnection registry-1.docker.io -Port 443
```

## 建议

**最可行的方案**：
1. 使用手机热点或 VPN
2. 配置 Docker Desktop 代理
3. 重新运行安装脚本

