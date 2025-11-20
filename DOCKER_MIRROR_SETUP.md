# Docker 镜像加速器手动配置指南

## 问题说明

如果遇到网络连接问题，需要配置 Docker Desktop 的镜像加速器。这是**最可靠**的解决方案。

## Windows Docker Desktop 配置步骤

### 方法一：通过图形界面配置（推荐）

1. **打开 Docker Desktop**
   - 确保 Docker Desktop 正在运行

2. **打开设置**
   - 右键点击系统托盘中的 Docker 图标（鲸鱼图标）
   - 选择 **"Settings"** 或 **"设置"**

3. **进入 Docker Engine 配置**
   - 在左侧菜单中找到 **"Docker Engine"** 或 **"Docker 引擎"**
   - 点击进入

4. **编辑 JSON 配置**
   - 在右侧的 JSON 编辑器中，找到或添加 `registry-mirrors` 配置
   - 确保配置格式如下：

```json
{
  "builder": {
    "gc": {
      "defaultKeepStorage": "20GB",
      "enabled": true
    }
  },
  "experimental": false,
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ]
}
```

5. **应用并重启**
   - 点击右上角的 **"Apply & Restart"** 或 **"应用并重启"**
   - 等待 Docker Desktop 重启完成（可能需要 1-2 分钟）

6. **验证配置**
   - 打开 PowerShell，运行：
   ```powershell
   docker info | Select-String "Registry Mirrors"
   ```
   - 应该能看到配置的镜像源列表

### 方法二：直接编辑配置文件

如果图形界面无法使用，可以直接编辑配置文件：

1. **找到配置文件位置**
   ```
   C:\Users\你的用户名\.docker\daemon.json
   ```

2. **编辑配置文件**
   - 如果文件不存在，创建新文件
   - 如果文件已存在，备份后编辑
   - 确保内容如下：

```json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ]
}
```

3. **重启 Docker Desktop**
   - 完全退出 Docker Desktop
   - 重新启动 Docker Desktop

4. **验证配置**
   ```powershell
   docker info | Select-String "Registry Mirrors"
   ```

## 常用镜像源列表

### 推荐镜像源（按优先级）

1. **中科大镜像**（推荐）
   ```
   https://docker.mirrors.ustc.edu.cn
   ```

2. **网易镜像**
   ```
   https://hub-mirror.c.163.com
   ```

3. **百度云镜像**
   ```
   https://mirror.baidubce.com
   ```

4. **阿里云镜像**（需要登录获取专属地址）
   - 登录阿里云容器镜像服务
   - 获取专属加速地址
   - 格式：`https://你的ID.mirror.aliyuncs.com`

### 配置多个镜像源

可以同时配置多个镜像源，Docker 会按顺序尝试：

```json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ]
}
```

## 验证配置是否生效

### 方法一：查看 Docker 信息

```powershell
docker info
```

在输出中查找 `Registry Mirrors:` 部分，应该能看到配置的镜像源。

### 方法二：测试拉取镜像

```powershell
# 测试拉取一个小镜像
docker pull hello-world

# 如果成功，说明配置生效
```

### 方法三：查看拉取日志

```powershell
# 拉取镜像时观察日志
docker pull python:3.11-slim

# 如果看到镜像源地址（不是 registry-1.docker.io），说明配置生效
```

## 常见问题

### Q1: 配置后仍然无法连接

**可能原因：**
- Docker Desktop 未重启
- 配置文件格式错误
- 镜像源本身不可用

**解决方案：**
1. 完全退出并重启 Docker Desktop
2. 检查 JSON 格式是否正确（可以使用 JSON 验证工具）
3. 尝试其他镜像源

### Q2: 如何知道使用了哪个镜像源？

在拉取镜像时，Docker 会显示实际使用的镜像源。如果配置成功，应该看到类似：
```
Pulling from library/python
```

而不是：
```
Pulling from registry-1.docker.io/library/python
```

### Q3: 配置后速度仍然很慢

**可能原因：**
- 网络环境限制
- 镜像源负载高
- 需要配置代理

**解决方案：**
1. 尝试不同的镜像源
2. 配置 VPN 或代理
3. 使用企业内网镜像源（如果有）

## 配置代理（如果需要）

如果您的网络环境需要通过代理访问：

1. **在 Docker Desktop 中配置代理**
   - Settings → Resources → Proxies
   - 配置 HTTP/HTTPS 代理地址

2. **或在 daemon.json 中配置**
```json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn"
  ],
  "proxies": {
    "http-proxy": "http://proxy.example.com:8080",
    "https-proxy": "http://proxy.example.com:8080"
  }
}
```

## 下一步

配置完成后，回到项目根目录，运行：

```powershell
docker-compose up -d --build
```

应该能够正常构建镜像了。

