# 开发环境搭建指南

本指南将帮助您在 Windows 上搭建项目的开发环境。

## 前置要求

### 1. Node.js 和 npm

- **下载地址**: https://nodejs.org/
- **推荐版本**: LTS 版本（长期支持版本）
- **安装时**: 确保勾选 "Add to PATH" 选项

**验证安装**:
```bash
node --version
npm --version
```

### 2. Python

- **下载地址**: https://www.python.org/downloads/
- **推荐版本**: Python 3.8 或更高版本
- **安装时**: **重要** - 必须勾选 "Add Python to PATH" 选项

**验证安装**:
```bash
python --version
python -m pip --version
```

## 快速开始

### 方法一：使用自动化脚本（推荐）

1. **运行搭建脚本**:
   ```bash
   # PowerShell
   .\setup-dev-env.ps1
   
   # 或使用批处理文件
   setup-dev-env.bat
   ```

   脚本会自动：
   - 检查 Node.js 和 Python 是否已安装
   - 安装前端依赖（npm install）
   - 安装后端依赖（pip install）
   - 创建环境配置文件

2. **启动开发服务器**:

   **启动后端**（在一个终端窗口）:
   ```bash
   # PowerShell
   .\dev-backend.ps1
   
   # 或使用批处理文件
   dev-backend.bat
   ```

   **启动前端**（在另一个终端窗口）:
   ```bash
   # PowerShell
   .\dev-frontend.ps1
   
   # 或使用批处理文件
   dev-frontend.bat
   ```

### 方法二：手动安装

#### 1. 安装前端依赖

```bash
cd my-ui-vite
npm install
```

#### 2. 安装后端依赖

```bash
cd backend
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

#### 3. 配置环境变量

```bash
# 复制环境配置文件模板
copy env.example.txt backend\.env

# 根据需要编辑 backend\.env
```

## 启动开发服务器

### 后端服务

```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- **API 地址**: http://localhost:8000
- **API 文档**: http://localhost:8000/api/docs
- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

### 前端服务

```bash
cd my-ui-vite
npm run dev
```

- **前端地址**: http://localhost:5173
- 前端会自动代理 `/api` 请求到后端 `http://localhost:8000`

## 项目结构

```
UIproj/
├── backend/                 # 后端代码（FastAPI）
│   ├── app/
│   │   ├── main.py         # 主应用入口
│   │   ├── routers/        # API 路由
│   │   ├── services/       # 业务逻辑
│   │   ├── schemas/        # 数据模型
│   │   └── core/           # 核心配置
│   └── requirements.txt    # Python 依赖
├── my-ui-vite/             # 前端代码（Vite + React）
│   ├── src/                # 源代码
│   ├── public/             # 静态资源
│   └── package.json        # Node.js 依赖
├── setup-dev-env.ps1      # 开发环境搭建脚本
├── dev-backend.ps1        # 启动后端脚本
└── dev-frontend.ps1       # 启动前端脚本
```

## 环境配置

后端配置文件位于 `backend/.env`，主要配置项：

- `XMOTOR_USE_MODBUS`: 是否使用 ModbusRTU（false = 使用模拟数据）
- `XMOTOR_MODBUS_PORT`: 串口名称（如 COM5）
- `XMOTOR_MODBUS_BAUDRATE`: 波特率（默认 38400）
- `XMOTOR_ALLOW_ORIGINS`: CORS 允许的来源（开发环境可用 ["*"]）

详细配置说明请参考 `env.example.txt`。

## 常见问题

### 1. Node.js 未找到

**问题**: 运行脚本时提示 "Node.js 未安装"

**解决方案**:
1. 访问 https://nodejs.org/ 下载并安装 Node.js
2. 安装时确保勾选 "Add to PATH"
3. 重启终端或重新打开 PowerShell
4. 重新运行搭建脚本

### 2. Python 未找到

**问题**: 运行脚本时提示 "Python 未安装"

**解决方案**:
1. 访问 https://www.python.org/downloads/ 下载并安装 Python 3.8+
2. **重要**: 安装时勾选 "Add Python to PATH"
3. 重启终端或重新打开 PowerShell
4. 重新运行搭建脚本

### 3. npm install 失败

**问题**: 前端依赖安装失败

**解决方案**:
1. 检查网络连接
2. 尝试使用国内镜像源：
   ```bash
   npm config set registry https://registry.npmmirror.com
   npm install
   ```
3. 清除 npm 缓存：
   ```bash
   npm cache clean --force
   ```

### 4. pip install 失败

**问题**: 后端依赖安装失败

**解决方案**:
1. 升级 pip：
   ```bash
   python -m pip install --upgrade pip
   ```
2. 尝试使用国内镜像源：
   ```bash
   python -m pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
   ```

### 5. 端口被占用

**问题**: 启动服务时提示端口被占用

**解决方案**:
1. 后端端口（8000）被占用：
   - 修改 `dev-backend.ps1` 中的端口号
   - 或关闭占用端口的程序
2. 前端端口（5173）被占用：
   - Vite 会自动尝试下一个可用端口
   - 或修改 `my-ui-vite/vite.config.ts` 中的端口配置

### 6. PowerShell 执行策略限制

**问题**: 无法运行 PowerShell 脚本

**解决方案**:
```powershell
# 以管理员身份运行 PowerShell，然后执行：
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 开发建议

1. **使用两个终端窗口**: 一个运行后端，一个运行前端
2. **热重载**: 前后端都支持热重载，修改代码后会自动刷新
3. **API 文档**: 开发时经常查看 http://localhost:8000/api/docs
4. **浏览器控制台**: 使用浏览器开发者工具查看前端错误和网络请求

## 下一步

- 查看 `QUICK_START.md` 了解项目快速开始
- 查看 `backend/README.md` 了解后端 API
- 查看 `my-ui-vite/README.md` 了解前端结构

