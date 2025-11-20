# 安装指南

## 重要提示

安装脚本 `install.bat` **必须在解压后的发布包目录中运行**，不能从其他位置运行。

## 正确安装步骤

### 1. 解压发布包

将 `XMotor-Industrial-OPS-v1.0.0-Windows.zip` 解压到**任意目录**，例如：
- `C:\Users\YourName\Downloads\XMotor-OPS\`
- `D:\Software\XMotor-OPS\`

### 2. 进入解压目录

打开解压后的目录，您应该看到以下文件：
```
XMotor-OPS\
├── docker-compose.yml
├── install.bat          ← 这个文件
├── start.bat
├── stop.bat
├── backend\
├── my-ui-vite\
└── ...
```

### 3. 以管理员身份运行安装

1. **右键点击** `install.bat`
2. 选择 **"以管理员身份运行"**
3. 等待安装完成

## 常见错误

### 错误 1: "找不到文件"

**原因**: 不在解压后的目录中运行安装脚本

**解决方案**:
1. 确保已解压发布包
2. 进入解压后的目录
3. 在该目录中运行 `install.bat`

### 错误 2: "no configuration file provided"

**原因**: Docker Compose 找不到配置文件或目录结构不完整

**解决方案**:
1. 检查解压是否完整
2. 确保 `backend` 和 `my-ui-vite` 目录存在
3. 重新解压发布包
4. 在解压目录中运行安装脚本

### 错误 3: "Docker 镜像构建失败"

**可能原因**:
- 网络连接问题
- Docker Desktop 未运行
- 磁盘空间不足

**解决方案**:
1. 检查 Docker Desktop 是否运行
2. 检查网络连接
3. 确保有足够的磁盘空间（至少 10GB）
4. 配置 Docker 镜像加速器（参考 DOCKER_NETWORK_FIX.md）

## 验证安装

安装成功后，检查以下目录：

1. **程序目录**: `C:\Program Files\XMotor-OPS\`
   - 应包含 `docker-compose.yml`
   - 应包含 `backend\` 目录
   - 应包含 `my-ui-vite\` 目录

2. **数据目录**: `C:\ProgramData\XMotor-OPS\`
   - 应包含 `config\.env` 文件
   - 应包含 `logs\` 目录

3. **桌面快捷方式**: "XMotor OPS"

## 下一步

安装完成后：
1. 运行 `start.bat` 或双击桌面快捷方式启动服务
2. 访问 http://localhost 查看前端界面
3. 访问 http://localhost:8000/api/docs 查看 API 文档

