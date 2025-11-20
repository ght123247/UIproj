#!/bin/bash

# Docker 启动脚本

echo "=========================================="
echo "  XMotor Industrial OPS - Docker 部署"
echo "=========================================="
echo ""

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ 错误: 未找到 Docker，请先安装 Docker"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ 错误: 未找到 Docker Compose，请先安装 Docker Compose"
    exit 1
fi

echo "✅ Docker 环境检查通过"
echo ""

# 构建并启动服务
echo "📦 正在构建并启动服务..."
if docker compose version &> /dev/null; then
    docker compose up -d --build
else
    docker-compose up -d --build
fi

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 服务启动成功！"
    echo ""
    echo "📍 访问地址："
    echo "   - 前端界面: http://localhost"
    echo "   - 后端 API: http://localhost:8000/api/docs"
    echo ""
    echo "📋 常用命令："
    echo "   - 查看日志: docker compose logs -f"
    echo "   - 停止服务: docker compose down"
    echo "   - 重启服务: docker compose restart"
    echo ""
else
    echo ""
    echo "❌ 服务启动失败，请查看错误信息"
    exit 1
fi

