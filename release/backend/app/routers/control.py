from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.schemas.motor_schemas import (
    MotorStatus,
    VibrationMetrics,
    ControlCommand,
)
from app.services.control_service import control_service
from app.core.config import settings
from app.services.modbus_service import modbus_service

router = APIRouter()


@router.post("/motor-status")
def post_motor_status(payload: MotorStatus):
    control_service.update_motor_status(payload)
    return {"status": "ok", "message": "Motor status updated"}


@router.post("/vibration-metrics")
def post_vibration_metrics(payload: VibrationMetrics):
    control_service.update_vibration_metrics(payload)
    return {"status": "ok", "message": "Vibration metrics updated"}


@router.post("/set-parameters")
def post_set_parameters(payload: ControlCommand):
    """
    Receive control panel data from frontend.
    如果启用 ModbusRTU，会实际发送控制命令到驱动器。
    """
    # Basic semantic validation
    if payload.mode == "speed" and payload.target_rpm is None:
        raise HTTPException(status_code=400, detail="target_rpm is required for speed mode")
    if payload.mode == "torque" and payload.target_torque is None:
        raise HTTPException(status_code=400, detail="target_torque is required for torque mode")

    result = control_service.set_parameters(payload)
    return result


@router.get("/latest")
def get_latest():
    latest = control_service.latest()
    if latest is None:
        raise HTTPException(status_code=404, detail="No data available yet")
    return latest


# ========== ModbusRTU 专用端点 ==========

@router.get("/fault")
def get_fault():
    """读取故障信息"""
    if not settings.USE_MODBUS:
        raise HTTPException(status_code=400, detail="ModbusRTU is not enabled")
    
    fault = modbus_service.read_fault_info()
    if fault is None:
        raise HTTPException(status_code=500, detail="Failed to read fault info")
    
    return {"fault_code": fault, "fault_message": "无故障" if fault == 0 else f"故障代码: {fault}"}


@router.get("/status/detailed")
def get_detailed_status():
    """读取详细状态信息（转速、温度、电流、电压、功率等）"""
    if not settings.USE_MODBUS:
        raise HTTPException(status_code=400, detail="ModbusRTU is not enabled")
    
    try:
        rpm = modbus_service.read_rpm()
        temperature = modbus_service.read_temperature()
        motor_current = modbus_service.read_motor_current()
        voltage = modbus_service.read_voltage()
        power = modbus_service.read_power()
        position = modbus_service.read_position()
        duty_cycle = modbus_service.read_duty_cycle()
        
        return {
            "rpm": rpm,
            "temperature": temperature,
            "motor_current": motor_current,
            "voltage": voltage,
            "power": power,
            "position": position,
            "duty_cycle": duty_cycle,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read status: {str(e)}")


class PositionControlRequest(BaseModel):
    position_degrees: float
    max_speed_erpm: Optional[int] = None
    max_accel: Optional[int] = None
    max_decel: Optional[int] = None


@router.post("/control/position")
def set_position(request: PositionControlRequest):
    """设置绝对位置控制"""
    if not settings.USE_MODBUS:
        raise HTTPException(status_code=400, detail="ModbusRTU is not enabled")
    
    try:
        # 设置位置参数
        if request.max_speed_erpm:
            modbus_service.set_max_speed(request.max_speed_erpm)
        if request.max_accel:
            modbus_service.set_max_acceleration(request.max_accel)
        if request.max_decel:
            modbus_service.set_max_deceleration(request.max_decel)
        
        # 设置目标位置
        success = modbus_service.set_absolute_position(request.position_degrees)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to set position")
        
        # 切换到绝对位置模式（模式3）
        modbus_service.set_mode(3, use_empty_mode=True)
        
        return {
            "status": "ok",
            "message": f"Position set to {request.position_degrees} degrees",
            "position": request.position_degrees
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to set position: {str(e)}")


@router.post("/control/stop")
def stop_motor():
    """停止电机（切换到空模式）"""
    if not settings.USE_MODBUS:
        raise HTTPException(status_code=400, detail="ModbusRTU is not enabled")
    
    try:
        success = modbus_service.set_mode(0xFFFF, use_empty_mode=False)  # 空模式
        if not success:
            raise HTTPException(status_code=500, detail="Failed to stop motor")
        
        return {"status": "ok", "message": "Motor stopped"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to stop motor: {str(e)}")


