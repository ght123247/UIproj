from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List


class Settings(BaseSettings):
    ALLOW_ORIGINS: List[str] = Field(default_factory=lambda: ["*"])
    LOG_FILE: str = "logs/control_backend.log"
    LOG_MAX_BYTES: int = 2 * 1024 * 1024  # 2MB
    LOG_BACKUP_COUNT: int = 5
    LOG_LEVEL: str = Field(default="INFO", description="日志级别: DEBUG, INFO, WARNING, ERROR")
    LOG_TO_CONSOLE: bool = Field(default=True, description="是否输出日志到控制台，False 则只输出到文件")
    
    # 数据源配置
    USE_MODBUS: bool = Field(default=True, description="是否使用 ModbusRTU 读取真实数据，False 则使用模拟数据")
    
    # ModbusRTU 配置（根据 RS485.md）
    MODBUS_PORT: str = Field(default="COM5", description="串口名称，Windows: COM1-COM256, Linux: /dev/ttyUSB0")
    MODBUS_BAUDRATE: int = Field(default=38400, description="波特率，默认115200 bps")
    MODBUS_TIMEOUT: float = Field(default=1.0, description="读取超时时间（秒）")
    MODBUS_SLAVE_ID: int = Field(default=1, description="从站地址（1-247），默认1")
    MODBUS_PARITY: str = Field(default="N", description="校验位: N(无), E(偶), O(奇)，默认N")
    MODBUS_STOPBITS: int = Field(default=1, description="停止位: 1 或 2，默认1")
    MODBUS_BYTESIZE: int = Field(default=8, description="数据位: 7 或 8，默认8")
    
    # 心跳配置
    HEARTBEAT_INTERVAL: float = Field(default=0.5, description="心跳更新间隔（秒），建议小于超时时间的一半")
    
    # 电机参数（用于转速转换）
    MOTOR_POLE_PAIRS: int = Field(default=4, description="电机极对数，用于 erpm 转 rpm：rpm = erpm / 极对数")
    
    # 转矩计算参数（从电流转换为转矩的系数）
    # 电机参数：每安培 400 mN·m = 0.4 N·m/A
    # 转矩(mNm) = 电流(A) × 400
    # 或者：转矩(Nm) = 电流(A) × 0.4
    # 注意：后端返回单位为 N·m，前端显示时转换为 mN·m（乘以1000）
    TORQUE_CURRENT_RATIO: float = Field(default=0.4, description="转矩转换系数：转矩(Nm) = 电流(A) × 此系数。默认0.4对应每安培400mN·m")
    
    # 输入寄存器地址（功能码 0x04，只读）
    # 注意：地址是实际寄存器地址，不是从0开始
    REG_INPUT_FAULT: int = Field(default=5000, description="故障信息")
    REG_INPUT_RPM: int = Field(default=5001, description="实时转速（erpm），2个寄存器，int")
    REG_INPUT_DUTY: int = Field(default=5003, description="实时占空比，short")
    REG_INPUT_POWER: int = Field(default=5004, description="实时功率，short，单位W")
    REG_INPUT_VOLTAGE: int = Field(default=5005, description="实时输入电压，short，单位V")
    REG_INPUT_MOTOR_CURRENT: int = Field(default=5006, description="实时电机电流，short，单位10mA")
    REG_INPUT_BUS_CURRENT: int = Field(default=5007, description="实时总线电流，short，单位10mA")
    REG_INPUT_TEMPERATURE: int = Field(default=5008, description="实时温度，short，单位℃")
    REG_INPUT_ANGLE: int = Field(default=5009, description="实时角度，uint16_t，单位0.01°")
    REG_INPUT_POSITION: int = Field(default=5010, description="实时位置，2个寄存器，int，单位0.01°")
    
    # 保持寄存器地址（功能码 0x03/0x06/0x10，读写）
    REG_HOLDING_HEARTBEAT: int = Field(default=6000, description="心跳包，uint16_t，必须周期更新")
    REG_HOLDING_MODE: int = Field(default=6001, description="控制模式，uint16_t")
    REG_HOLDING_CURRENT: int = Field(default=6002, description="设定电流，short，单位10mA")
    REG_HOLDING_RPM: int = Field(default=6003, description="设定转速（erpm），2个寄存器，int")
    REG_HOLDING_DUTY: int = Field(default=6005, description="设定占空比，short，范围-1000~1000")
    REG_HOLDING_ABSOLUTE_POSITION: int = Field(default=6006, description="设定绝对位置，2个寄存器，int，单位0.01°")
    REG_HOLDING_RELATIVE_POSITION_LAST: int = Field(default=6008, description="设定相对位置（上次目标），2个寄存器，int")
    REG_HOLDING_RELATIVE_POSITION_CURRENT: int = Field(default=6010, description="设定相对位置（当前位置），2个寄存器，int")
    REG_HOLDING_SET_POSITION: int = Field(default=6012, description="设定当前位置，2个寄存器，int，设0为零点")
    REG_HOLDING_BRAKE_CURRENT: int = Field(default=6014, description="设定刹车电流，short，单位10mA")
    REG_HOLDING_HANDBRAKE_CURRENT: int = Field(default=6015, description="设定手刹电流，short，单位10mA")
    REG_HOLDING_ACCELERATION: int = Field(default=6016, description="设置速度环加速度，2个寄存器，int，单位erpm/s")
    REG_HOLDING_MAX_SPEED: int = Field(default=6018, description="设置轨迹最大速度，2个寄存器，int，erpm")
    REG_HOLDING_MAX_ACCEL: int = Field(default=6020, description="设置轨迹最大加速度，2个寄存器，int")
    REG_HOLDING_MAX_DECEL: int = Field(default=6022, description="设置轨迹最大减速度，2个寄存器，int")
    REG_HOLDING_DECELERATION: int = Field(default=6025, description="设置速度环减速度，2个寄存器，int，单位erpm/s")

    class Config:
        env_prefix = "XMOTOR_"
        case_sensitive = False


settings = Settings()


