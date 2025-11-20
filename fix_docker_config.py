#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Docker daemon.json 修复脚本
修复 JSON 编码问题
"""

import json
import os
from pathlib import Path

def main():
    # 配置文件路径
    config_dir = Path.home() / ".docker"
    config_path = config_dir / "daemon.json"
    
    print("==========================================")
    print("  Docker 配置文件修复工具")
    print("==========================================")
    print()
    
    # 创建配置目录
    config_dir.mkdir(exist_ok=True)
    print(f"[信息] 配置目录: {config_dir}")
    
    # 备份现有配置
    if config_path.exists():
        from datetime import datetime
        backup_path = config_path.with_suffix(f".backup.{datetime.now().strftime('%Y%m%d%H%M%S')}")
        import shutil
        shutil.copy2(config_path, backup_path)
        print(f"[信息] 已备份现有配置到: {backup_path}")
    
    # 创建正确的配置（使用更稳定的镜像源顺序）
    config = {
        "registry-mirrors": [
            "https://hub-mirror.c.163.com",  # 网易镜像（更稳定）
            "https://mirror.baidubce.com",    # 百度云镜像
            "https://docker.mirrors.ustc.edu.cn"  # 中科大镜像（备用）
        ]
    }
    
    # 保存为 UTF-8 无 BOM 格式
    print("[1/3] 创建正确的配置文件...")
    with open(config_path, 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=2, ensure_ascii=False)
    
    print(f"[OK] 配置文件已创建: {config_path}")
    print()
    
    # 验证 JSON 格式
    print("[2/3] 验证 JSON 格式...")
    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            test_config = json.load(f)
        print("[OK] JSON 格式正确")
        print()
        print("配置内容:")
        with open(config_path, 'r', encoding='utf-8') as f:
            print(f.read())
    except json.JSONDecodeError as e:
        print(f"[错误] JSON 格式验证失败: {e}")
        return 1
    
    print()
    print("[3/3] 完成修复")
    print()
    print("==========================================")
    print("  重要: 请重启 Docker Desktop")
    print("==========================================")
    print()
    print("下一步:")
    print("1. 完全退出 Docker Desktop")
    print("2. 重新启动 Docker Desktop")
    print("3. 等待 Docker Desktop 完全启动")
    print("4. 验证配置: docker info | Select-String 'Registry Mirrors'")
    print()
    
    return 0

if __name__ == "__main__":
    exit(main())

