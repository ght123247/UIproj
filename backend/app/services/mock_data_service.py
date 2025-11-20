import asyncio
import random
from datetime import datetime, timezone
from typing import Optional

from app.core.config import settings
from app.schemas.motor_schemas import MotorStatus, VibrationMetrics
from app.services.control_service import control_service
from app.services.modbus_service import modbus_service
from app.utils.logger import get_logger

logger = get_logger("data-service")


async def generate_data():
    """
    Background task that periodically reads sensor data (from ModbusRTU or generates mock data)
    and updates the control service.
    """
    if settings.USE_MODBUS:
        logger.info("Starting ModbusRTU data reader...")
    else:
        logger.info("Starting mock data generator...")
    
    while True:
        try:
            if settings.USE_MODBUS:
                # 从 ModbusRTU 读取真实数据（优化：减少寄存器读取）
                motor_data = modbus_service.read_motor_status()
                
                if motor_data is None:
                    logger.warning("ModbusRTU 读取失败，尝试重连...")
                    # 尝试重连
                    try:
                        modbus_service.reconnect()
                    except Exception as e:
                        logger.error(f"ModbusRTU 重连失败: {e}")
                    await asyncio.sleep(0.1)  # 10Hz = 100ms
                    continue
                
                # 优化：复用已读取的rpm值，避免重复读取寄存器
                vibration_data = modbus_service.read_vibration_metrics(rpm=motor_data["rpm"])
                
                if vibration_data is None:
                    logger.warning("ModbusRTU 读取振动数据失败")
                    await asyncio.sleep(0.1)  # 10Hz = 100ms
                    continue
                
                # 创建数据模型
                motor_status = MotorStatus(
                    rpm=motor_data["rpm"],
                    torque=motor_data["torque"],
                    load=motor_data["load"],
                    temperature=motor_data["temperature"],
                    power=motor_data.get("power", 0.0)
                )
                
                vibration_metrics = VibrationMetrics(
                    main_freq=vibration_data["main_freq"],
                    amplitude=vibration_data["amplitude"],
                    rms=vibration_data["rms"],
                    impulse_count=vibration_data["impulse_count"],
                    health_index=vibration_data.get("health_index", 100.0),
                    tool_wear=vibration_data.get("tool_wear", 0.0)
                )
                
                logger.debug(
                    f"ModbusRTU 读取数据 - RPM: {motor_status.rpm:.1f}, "
                    f"Torque: {motor_status.torque:.2f}, "
                    f"Temp: {motor_status.temperature:.1f}°C"
                )
            else:
                # 生成模拟数据
                motor_status = MotorStatus(
                    rpm=random.randint(0, 8000),
                    torque=random.uniform(0, 1000),
                    load=random.uniform(60, 85),
                    temperature=random.uniform(35, 48),
                    power=random.uniform(0, 1000)
                )
                
                # 生成基础频率值，然后添加 ±0.60Hz 的小幅波动
                base_freq = random.uniform(200, 300)
                main_freq = round(base_freq + random.uniform(-0.60, 0.60), 2)
                
                vibration_metrics = VibrationMetrics(
                    main_freq=main_freq,
                    amplitude=random.uniform(0.2, 0.4),
                    rms=random.uniform(0.1, 0.25),
                    impulse_count=random.randint(2, 8),
                    health_index=random.uniform(70, 100),
                    tool_wear=random.uniform(0, 30)
                )
                
                logger.debug(
                    f"Generated mock data - RPM: {motor_status.rpm:.1f}, "
                    f"Torque: {motor_status.torque:.2f}, "
                    f"Temp: {motor_status.temperature:.1f}°C"
                )
            
            # Update the control service with new data
            control_service.update_motor_status(motor_status)
            control_service.update_vibration_metrics(vibration_metrics)
            
            # Wait 100ms before next update (10Hz = 10 times per second = 100ms interval)
            await asyncio.sleep(0.1)
            
        except Exception as e:
            logger.error(f"Error in data service: {e}", exc_info=True)
            await asyncio.sleep(0.1)  # 10Hz = 100ms


# 保持向后兼容的别名
generate_mock_data = generate_data

