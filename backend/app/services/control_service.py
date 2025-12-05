from datetime import datetime, timezone
from threading import Lock
from typing import Dict, Optional

from app.schemas.motor_schemas import MotorStatus, VibrationMetrics, ControlCommand
from app.utils.logger import get_logger

logger = get_logger("control-service")


class ControlService:
    """
    In-memory store for latest sensor values and last control command.
    Thread-safe with a simple lock.
    """

    def __init__(self) -> None:
        self._lock = Lock()
        self._motor_status: Optional[MotorStatus] = None
        self._vibration_metrics: Optional[VibrationMetrics] = None
        self._last_control: Optional[ControlCommand] = None
        self._timestamp: Optional[str] = None

    def update_motor_status(self, data: MotorStatus) -> None:
        with self._lock:
            self._motor_status = data
            self._timestamp = datetime.now(timezone.utc).isoformat()
        # 使用 DEBUG 级别，避免频繁输出到控制台影响性能
        logger.debug(f"Motor status updated: {data.model_dump()}")

    def update_vibration_metrics(self, data: VibrationMetrics) -> None:
        with self._lock:
            self._vibration_metrics = data
            self._timestamp = datetime.now(timezone.utc).isoformat()
        # 使用 DEBUG 级别，避免频繁输出到控制台影响性能
        logger.debug(f"Vibration metrics updated: {data.model_dump()}")

    def set_parameters(self, cmd: ControlCommand) -> Dict:
        """
        设置控制参数
        如果启用 ModbusRTU，会实际发送到驱动器
        """
        from app.core.config import settings
        from app.services.modbus_service import modbus_service
        
        with self._lock:
            self._last_control = cmd
        
        logger.info(f"Control command received: {cmd.model_dump()}")
        
        applied = {
            "rpm": None,
            "torque": None,
        }
        
        # 如果启用 ModbusRTU，实际发送控制命令
        if settings.USE_MODBUS:
            try:
                # 停止命令：同时设置转速和电流都为0，无论当前模式如何都能停止
                if (cmd.target_rpm is not None and cmd.target_rpm == 0 and 
                    cmd.target_torque is not None and cmd.target_torque == 0):
                    # 停止电机：设置转速为0，电流为0
                    rpm_success = modbus_service.set_rpm(0)
                    current_success = modbus_service.set_current(0)
                    
                    if rpm_success and current_success:
                        # 切换到转速模式（转速为0）
                        modbus_service.set_mode(1, use_empty_mode=True)
                        applied["rpm"] = 0
                        applied["torque"] = 0
                        logger.info("停止电机：转速和电流已设置为0")
                    else:
                        logger.error(f"停止电机失败：转速设置={rpm_success}, 电流设置={current_success}")
                
                elif cmd.mode == "speed" and cmd.target_rpm is not None:
                    # 转速控制模式（模式1）
                    success = modbus_service.set_rpm(cmd.target_rpm)
                    if success:
                        modbus_service.set_mode(1, use_empty_mode=True)  # 切换到转速模式
                        applied["rpm"] = cmd.target_rpm
                        logger.info(f"设置转速: {cmd.target_rpm} rpm")
                    else:
                        logger.error("设置转速失败")
                        
                elif cmd.mode == "torque" and cmd.target_torque is not None:
                    # 电流控制模式（模式0，恒扭矩）
                    # 将转矩转换为电流
                    # 电机参数：每安培 400 mN·m = 0.4 N·m/A
                    # 所以：电流(A) = 转矩(Nm) / 0.4 = 转矩(Nm) × 2.5
                    current_amps = cmd.target_torque * 2.5
                    success = modbus_service.set_current(current_amps)
                    if success:
                        modbus_service.set_mode(0, use_empty_mode=True)  # 切换到电流模式
                        applied["torque"] = cmd.target_torque
                        logger.info(f"设置转矩: {cmd.target_torque} Nm (电流: {current_amps:.3f} A)")
                    else:
                        logger.error("设置转矩失败")
                        
            except Exception as e:
                logger.error(f"ModbusRTU 控制失败: {e}", exc_info=True)
                return {
                    "status": "error",
                    "message": f"控制失败: {str(e)}",
                    "mode": cmd.mode,
                    "applied_values": applied
                }
        
        return {
            "status": "received",
            "message": "Control parameters logged" if not settings.USE_MODBUS else "Control parameters sent to driver",
            "mode": cmd.mode,
            "applied_values": applied
        }

    def latest(self) -> Optional[Dict]:
        with self._lock:
            if not (self._motor_status and self._vibration_metrics and self._timestamp):
                return None
            return {
                "motor_status": self._motor_status.model_dump(),
                "vibration_metrics": self._vibration_metrics.model_dump(),
                "timestamp": self._timestamp,
            }


control_service = ControlService()


