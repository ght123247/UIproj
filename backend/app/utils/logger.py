import logging
import os
import sys
from logging.handlers import RotatingFileHandler
from app.core.config import settings


class WindowsRotatingFileHandler(RotatingFileHandler):
    """
    Windows兼容的日志轮转处理器
    解决Windows上文件被占用时无法重命名的问题
    """
    def doRollover(self):
        """
        重写轮转方法，在Windows上先关闭文件再重命名
        """
        # 对于非Windows系统，直接使用父类的默认行为
        if sys.platform != 'win32':
            super().doRollover()
            return
        
        # Windows特殊处理：必须先关闭文件才能重命名
        if self.stream:
            self.stream.close()
            self.stream = None
        
        # 处理主日志文件轮转
        if os.path.exists(self.baseFilename):
            try:
                # 删除最旧的备份文件（如果存在）
                oldest_backup = self.baseFilename + "." + str(self.backupCount)
                if os.path.exists(oldest_backup):
                    try:
                        os.remove(oldest_backup)
                    except (OSError, PermissionError):
                        pass
                
                # 轮转备份文件：.N -> .N+1
                for i in range(self.backupCount - 1, 0, -1):
                    sfn = self.baseFilename + "." + str(i)
                    dfn = self.baseFilename + "." + str(i + 1)
                    if os.path.exists(sfn):
                        if os.path.exists(dfn):
                            try:
                                os.remove(dfn)
                            except (OSError, PermissionError):
                                pass
                        try:
                            os.rename(sfn, dfn)
                        except (OSError, PermissionError):
                            pass
                
                # 将当前日志文件重命名为 .1
                dfn = self.baseFilename + ".1"
                if os.path.exists(dfn):
                    try:
                        os.remove(dfn)
                    except (OSError, PermissionError):
                        pass
                
                os.rename(self.baseFilename, dfn)
            except (OSError, PermissionError) as e:
                # 如果重命名失败（文件仍被占用），记录错误但继续
                # 下次日志写入时会继续尝试轮转
                if self.stream is None:
                    # 确保即使轮转失败，也要重新打开文件流
                    if not self.delay:
                        self.stream = self._open()
                return
        
        # 重新打开文件流
        if not self.delay:
            self.stream = self._open()


def get_logger(name: str = "control-backend") -> logging.Logger:
    logger = logging.getLogger(name)
    if logger.handlers:
        return logger

    # 设置日志级别
    log_level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)
    logger.setLevel(log_level)
    
    os.makedirs(os.path.dirname(settings.LOG_FILE), exist_ok=True)

    # 文件处理器（始终启用）
    # 使用Windows兼容的轮转处理器
    file_handler = WindowsRotatingFileHandler(
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
        # 控制台显示 INFO 及以上级别，便于调试
        stream_handler.setLevel(logging.INFO)
        logger.addHandler(stream_handler)

    return logger


