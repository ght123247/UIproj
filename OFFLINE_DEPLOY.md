# 离线部署指南（方案三：预构建 Docker 镜像 + Compose）

当目标电脑无法访问 Docker Hub/镜像源时，可以使用该方案：在一台网络畅通的电脑上构建并导出镜像，然后在目标电脑导入并运行。

---

## 一、准备工作

- 一台 **在线构建机**（可访问 Docker Hub）
- 目标电脑安装了 Docker Desktop（无需联网）
- U 盘或内网共享用于拷贝文件

目录约定：
- `项目根目录`：包含 `docker-compose.yml`
- `offline-images/`：存放导出的镜像

---

## 二、在构建机上操作

1. **安装依赖**
   - Docker Desktop
   - Git / Node / Python（已经在项目里）

2. **构建并导出镜像**
   ```bash
   scripts\build-export-images.bat
   ```
   该脚本会执行：
   - `docker compose build`
   - `docker save` 生成 `offline-images\xmotor-backend.tar`
   - `docker save` 生成 `offline-images\xmotor-frontend.tar`
   - 输出镜像信息和 SHA256 校验

3. **准备离线包**
   拷贝以下内容到 U 盘/共享目录：
   - `offline-images\*.tar`
   - `offline-images\*.sha256`
   - 项目完整目录（含 `docker-compose.yml`、前后端代码、脚本）

---

## 三、在目标电脑上操作

1. **安装 Docker Desktop**（无需联网）
2. **复制项目目录**
   - 将整个项目文件夹复制到目标电脑，例如 `C:\XMotor-OPS`
3. **导入镜像并启动**
   ```bash
   scripts\import-images.bat
   ```
   该脚本会：
   - `docker load -i offline-images\xmotor-backend.tar`
   - `docker load -i offline-images\xmotor-frontend.tar`
   - `docker compose up -d`

4. **访问系统**
   - 前端：`http://localhost`
   - 后端 API：`http://localhost:8000/api/docs`

---

## 四、更新镜像

当需要更新版本时：
1. 在构建机重新运行 `scripts\build-export-images.bat`
2. 拷贝新的 `.tar` 文件和代码到目标电脑
3. 在目标电脑运行：
   ```bash
   scripts\import-images.bat
   ```
   脚本会自动覆盖旧镜像并重启服务

---

## 五、注意事项

1. **保持目录结构一致**，导出/导入脚本使用相对路径
2. **校验镜像文件**：`offline-images\*.sha256`
3. **存储空间**：每个镜像约数百 MB，确保足够磁盘空间
4. **Docker 版本一致**：构建机和目标机的 Docker 版本尽量保持一致
5. **配置文件**：目标电脑如需修改配置（例如 `.env`），仍在 `%ProgramData%\XMotor-OPS\config` 下操作

---

## 六、快速命令

```bash
# 构建机
scripts\build-export-images.bat

# 目标机
scripts\import-images.bat
```

---

如需进一步定制（例如推送到私有镜像仓库），可以在此流程基础上扩展。***

