# 上传项目到 GitHub 指南

## 步骤 1: 安装 Git（如果尚未安装）

### Windows 安装方法：
1. 访问 https://git-scm.com/download/win
2. 下载并安装 Git for Windows
3. 安装完成后，重启 PowerShell 或命令提示符

### 验证安装：
```powershell
git --version
```

## 步骤 2: 配置 Git（首次使用）

```powershell
git config --global user.name "你的名字"
git config --global user.email "你的邮箱@example.com"
```

## 步骤 3: 初始化 Git 仓库

在项目根目录（C:\Exhibition\UIproj）执行：

```powershell
# 初始化 Git 仓库
git init

# 添加所有文件到暂存区
git add .

# 创建初始提交
git commit -m "Initial commit: XMotor Industrial OPS project"
```

## 步骤 4: 在 GitHub 上创建仓库

1. 登录 GitHub (https://github.com)
2. 点击右上角的 "+" 号，选择 "New repository"
3. 填写仓库信息：
   - Repository name: `UIproj` 或你喜欢的名称
   - Description: 可选，描述项目
   - 选择 Public 或 Private
   - **不要**勾选 "Initialize this repository with a README"（因为本地已有代码）
4. 点击 "Create repository"

## 步骤 5: 连接本地仓库到 GitHub

GitHub 创建仓库后会显示连接命令，类似这样：

```powershell
# 添加远程仓库（将 YOUR_USERNAME 和 REPO_NAME 替换为你的实际值）
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 或者使用 SSH（如果已配置 SSH 密钥）
# git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git

# 推送代码到 GitHub
git branch -M main
git push -u origin main
```

## 步骤 6: 验证上传

访问你的 GitHub 仓库页面，应该能看到所有文件都已上传。

## 常见问题

### 如果遇到认证问题：
- 使用 Personal Access Token 代替密码
- 在 GitHub Settings > Developer settings > Personal access tokens 创建 token
- 使用 token 作为密码

### 如果文件太大：
- 检查 `.gitignore` 是否正确配置
- 确保 `node_modules/`、`__pycache__/`、`logs/` 等目录被忽略

### 如果只想上传部分文件：
```powershell
# 只添加特定文件
git add backend/
git add my-ui-vite/
git add *.md
git commit -m "Add project files"
```

## 后续更新代码

```powershell
git add .
git commit -m "描述你的更改"
git push
```

