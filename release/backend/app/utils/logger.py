import logging
import os
from logging.handlers import RotatingFileHandler
from app.core.config import settings


def get_logger(name: str = "control-backend") -> logging.Logger:
    logger = logging.getLogger(name)
    if logger.handlers:
        return logger

    # 设置日志级别
    log_level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)
    logger.setLevel(log_level)
    
    os.makedirs(os.path.dirname(settings.LOG_FILE), exist_ok=True)

    # 文件处理器（始终启用）
    file_handler = RotatingFileHandler(
        settings.LOG_FILE,
        maxBytes=settings.LOG_MAX_BYTES,
        backupCount=settings.LOG_BACKUP_COUNT,
        encoding="utf-8",
    )
    formatter = logging.Formatter(
        "%(asctime)s | %(levelname)s | %(name)s | %(message)s"
    )
    file_handler.setFormatter(formatter)
    file_handler.setLevel(log_level)
    logger.addHandler(file_handler)

    # 控制台处理器（可选）
    if settings.LOG_TO_CONSOLE:
        stream_handler = logging.StreamHandler()
        stream_handler.setFormatter(formatter)
        # 控制台只显示 WARNING 及以上级别，减少输出
        stream_handler.setLevel(logging.WARNING)
        logger.addHandler(stream_handler)

    return logger


