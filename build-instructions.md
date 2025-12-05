# 产品打包说明

## 打包流程

### 1. 准备环境

确保以下工具已安装：
- Windows 10/11
- Git（可选，用于版本控制）
- PowerShell 5.0+（Windows 自带）

### 2. 运行打包脚本

```batch
build-release.bat
```

### 3. 打包输出

打包完成后会生成：
- `XMotor-Industrial-OPS-v1.0.0-Windows.zip` - 发布包
- `release/` - 发布目录（用于验证）

### 4. 验证发布包

1. 解压 `XMotor-Industrial-OPS-v1.0.0-Windows.zip` 到临时目录
2. 以管理员身份运行 `install.bat`
3. 验证安装和启动是否正常
4. 测试所有功能

### 5. 分发

将 `XMotor-Industrial-OPS-v1.0.0-Windows.zip` 分发给用户。

## 发布包内容

```
XMotor-Industrial-OPS-v1.0.0-Windows.zip
├── docker-compose.yml          # Docker 配置
├── install.bat                  # 安装脚本
├── start.bat                    # 启动脚本
├── stop.bat                     # 停止脚本
├── update.bat                   # 更新脚本
├── uninstall.bat                # 卸载脚本
├── .env.example                 # 配置模板
├── product-config.yml           # 产品配置
├── README.md                    # 用户手册
├── INSTALL.txt                  # 安装说明
├── VERSION.txt                  # 版本信息
├── backend/                     # 后端代码
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
├── my-ui-vite/                  # 前端代码
│   ├── Dockerfile
│   ├── package.json
│   └── src/
└── docs/                        # 文档（如果有）
```

## 版本管理

### 更新版本号

1. 修改 `product-config.yml` 中的版本号
2. 修改 `build-release.bat` 中的 `VERSION` 变量
3. 修改 `PRODUCT_README.md` 中的版本信息
4. 重新打包

### 版本命名规则

- 格式: `XMotor-Industrial-OPS-v{版本号}-Windows.zip`
- 示例: `XMotor-Industrial-OPS-v1.0.0-Windows.zip`
- 版本号格式: `主版本号.次版本号.修订号`

## 注意事项

1. **不要包含敏感信息**
   - 确保 `.env` 文件不在发布包中
   - 只包含 `.env.example` 模板

2. **排除开发文件**
   - `node_modules/`
   - `__pycache__/`
   - `*.pyc`
   - `*.log`
   - `.git/`

3. **测试安装**
   - 在干净的 Windows 系统上测试安装
   - 验证所有功能正常

4. **文档完整性**
   - 确保 README.md 包含所有必要信息
   - 检查配置说明是否准确

## 自动化打包（可选）

可以集成到 CI/CD 流程中：

```yaml
# GitHub Actions 示例
name: Build Release
on:
  release:
    types: [created]

jobs:
  build:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build Release Package
        run: build-release.bat
      - name: Upload Release
        uses: actions/upload-artifact@v2
        with:
          name: release-package
          path: XMotor-Industrial-OPS-*.zip
```

