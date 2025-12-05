import asyncio
import sys
import os
from pathlib import Path

# 添加项目根目录到 Python 路径，以便可以从任何目录运行
# 获取当前文件的绝对路径
current_file = Path(__file__).resolve()
# 获取 backend 目录（main.py 的父目录的父目录）
backend_dir = current_file.parent.parent
backend_dir_str = str(backend_dir)
# 确保 backend 目录在 Python 路径中
if backend_dir_str not in sys.path:
    sys.path.insert(0, backend_dir_str)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.control import router as control_router
from app.routers.health import router as health_router
from app.core.config import settings
from app.services.mock_data_service import generate_mock_data
from app.services.modbus_service import modbus_service
from app.utils.logger import get_logger

logger = get_logger("main")


def create_app() -> FastAPI:
    app = FastAPI(
        title="XMotor Industrial OPS - Control Backend",
        version="1.0.0",
        docs_url="/api/docs",
        openapi_url="/api/openapi.json",
    )

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOW_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Routers
    app.include_router(health_router, prefix="/api")
    app.include_router(control_router, prefix="/api/control", tags=["control"])

    # Startup event: start data reader/generator
    @app.on_event("startup")
    async def startup_event():
        logger.info("Starting FastAPI application...")
        logger.info(f"Configuration - USE_MODBUS: {settings.USE_MODBUS}")
        logger.info(f"Configuration - MODBUS_PORT: {settings.MODBUS_PORT}, BAUDRATE: {settings.MODBUS_BAUDRATE}")
        
        if settings.USE_MODBUS:
            logger.info("Using ModbusRTU for data reading")
            
            # 1. 先建立 Modbus 连接
            logger.info("Establishing ModbusRTU connection...")
            try:
                connection_success = modbus_service.ensure_connection()
                if not connection_success:
                    logger.error("Failed to establish ModbusRTU connection")
                    logger.warning("Continuing startup, but ModbusRTU features may not work")
                else:
                    logger.info("ModbusRTU connection established successfully")
            except Exception as e:
                logger.error(f"Failed to establish ModbusRTU connection: {e}", exc_info=True)
                logger.warning("Continuing startup, but ModbusRTU features may not work")
            
            # 2. 等待4秒
            logger.info("Waiting 4 seconds before starting heartbeat...")
            await asyncio.sleep(4.0)
            
            # 3. 启动心跳任务（必须，否则驱动器会停止电机）
            try:
                modbus_service.start_heartbeat()
                logger.info("ModbusRTU heartbeat started")
            except Exception as e:
                logger.error(f"Failed to start heartbeat: {e}", exc_info=True)
            
            # 4. 初始化编码器Z信号（在启动心跳之后执行）
            try:
                logger.info("Initializing encoder Z signal...")
                success = modbus_service.initialize_encoder_z_signal()
                if success:
                    logger.info("Encoder Z signal initialization completed successfully")
                else:
                    logger.warning("Encoder Z signal initialization failed, but continuing startup")
            except Exception as e:
                logger.error(f"Failed to initialize encoder Z signal: {e}", exc_info=True)
                logger.warning("Continuing startup despite Z signal initialization failure")
        else:
            logger.info("Using mock data generator")
        
        # 启动数据读取/生成任务
        logger.info("Starting data service task...")
        asyncio.create_task(generate_mock_data())
        logger.info("Data service task created successfully")
    
    # Shutdown event: close ModbusRTU connection
    @app.on_event("shutdown")
    async def shutdown_event():
        logger.info("Shutting down FastAPI application...")
        if settings.USE_MODBUS:
            modbus_service.close()
            logger.info("ModbusRTU connection closed")

    return app


app = create_app()


# 直接运行此文件时启动服务器
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )


