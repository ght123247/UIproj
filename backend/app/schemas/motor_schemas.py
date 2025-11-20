from pydantic import BaseModel, Field
from typing import Literal, Optional


class MotorStatus(BaseModel):
    rpm: float = Field(..., ge=0)
    torque: float = Field(..., ge=0)
    load: float = Field(..., ge=0, le=100)
    temperature: float = Field(..., ge=-50, le=200)
    power: float = Field(..., ge=0, description="功率，单位W")


class VibrationMetrics(BaseModel):
    main_freq: float = Field(..., ge=0)
    amplitude: float = Field(..., ge=0)
    rms: float = Field(..., ge=0)
    impulse_count: int = Field(..., ge=0)
    health_index: float = Field(..., ge=0, le=100, description="健康指数，单位%")
    tool_wear: float = Field(..., ge=0, le=100, description="刀具磨损，单位%")


class ControlCommand(BaseModel):
    mode: Literal["speed", "torque"]
    target_rpm: Optional[float] = Field(None, ge=0)
    target_torque: Optional[float] = Field(None, ge=0)


class LatestSnapshot(BaseModel):
    motor_status: MotorStatus
    vibration_metrics: VibrationMetrics
    timestamp: str


