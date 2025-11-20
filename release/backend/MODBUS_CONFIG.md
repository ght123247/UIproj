# ModbusRTU 配置说明

## 概述

本系统支持通过 ModbusRTU 协议读取驱动器数据。配置需要根据 **RS485编程手册 24-26 页** 的寄存器列表进行调整。

## 快速开始

### 1. 安装依赖

```bash
cd backend
pip install -r requirements.txt
```

### 2. 配置 ModbusRTU 参数

有两种配置方式：

#### 方式 1：环境变量（推荐）

创建 `.env` 文件在 `backend` 目录下：

```env
# 启用 ModbusRTU（设置为 true 使用真实数据，false 使用模拟数据）
XMOTOR_USE_MODBUS=true

# 串口配置
XMOTOR_MODBUS_PORT=COM3
XMOTOR_MODBUS_BAUDRATE=9600
XMOTOR_MODBUS_SLAVE_ID=1

# 串口参数
XMOTOR_MODBUS_PARITY=N
XMOTOR_MODBUS_STOPBITS=1
XMOTOR_MODBUS_BYTESIZE=8
XMOTOR_MODBUS_TIMEOUT=1.0

# 寄存器地址（根据 RS485编程手册 24-26 页调整）
XMOTOR_REG_RPM=1
XMOTOR_REG_TORQUE=2
XMOTOR_REG_LOAD=3
XMOTOR_REG_TEMPERATURE=4
XMOTOR_REG_MAIN_FREQ=5
XMOTOR_REG_AMPLITUDE=6
XMOTOR_REG_RMS=7
XMOTOR_REG_IMPULSE_COUNT=8

# 数据缩放系数（根据手册调整）
XMOTOR_RPM_SCALE=1.0
XMOTOR_TORQUE_SCALE=0.01
XMOTOR_TEMP_SCALE=0.1
XMOTOR_FREQ_SCALE=0.1
```

#### 方式 2：直接修改代码

编辑 `backend/app/core/config.py` 文件，修改默认值。

### 3. 根据手册调整寄存器地址

**重要**：请参考 **RS485编程手册 24-26 页** 的寄存器列表，调整以下配置：

1. **寄存器地址**：在 `.env` 或 `config.py` 中设置正确的寄存器地址
   - `REG_RPM`：转速寄存器地址
   - `REG_TORQUE`：转矩寄存器地址
   - `REG_LOAD`：负载寄存器地址
   - `REG_TEMPERATURE`：温度寄存器地址
   - `REG_MAIN_FREQ`：主频率寄存器地址
   - `REG_AMPLITUDE`：振幅寄存器地址
   - `REG_RMS`：RMS寄存器地址
   - `REG_IMPULSE_COUNT`：脉冲计数寄存器地址

2. **缩放系数**：根据手册中的数据格式调整
   - `RPM_SCALE`：转速缩放系数（例如：如果寄存器值是 0.1 RPM 单位，则设置为 0.1）
   - `TORQUE_SCALE`：转矩缩放系数
   - `TEMP_SCALE`：温度缩放系数
   - `FREQ_SCALE`：频率缩放系数

3. **寄存器类型**：如果某些寄存器是输入寄存器（3x）而不是保持寄存器（4x），需要修改 `modbus_service.py` 中的读取方法。

### 4. 运行服务器

```bash
cd backend
python app/main.py
```

或使用 uvicorn：

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

## 寄存器地址说明

### 寄存器地址格式

- **保持寄存器（4x）**：使用功能码 03 读取
- **输入寄存器（3x）**：使用功能码 04 读取

寄存器地址在代码中从 **0 开始**，例如：
- 手册中的地址 `40001` → 代码中设置为 `0`
- 手册中的地址 `40002` → 代码中设置为 `1`
- 手册中的地址 `40100` → 代码中设置为 `99`

### 数据格式

根据手册，寄存器可能存储：
- **16位无符号整数**：直接读取
- **16位有符号整数**：需要处理符号位
- **32位整数/浮点数**：需要读取两个连续寄存器

如果手册中使用 32 位数据，需要修改 `modbus_service.py` 中的读取方法。

## 常见问题

### 1. 连接失败

- 检查串口名称是否正确（Windows: `COM1-COM256`，Linux: `/dev/ttyUSB0`）
- 检查串口是否被其他程序占用
- 检查波特率、校验位、停止位等参数是否与驱动器一致

### 2. 读取数据为 None

- 检查从站地址（SLAVE_ID）是否正确
- 检查寄存器地址是否正确
- 检查驱动器是否在线
- 查看日志文件 `logs/control_backend.log` 获取详细错误信息

### 3. 数据值不正确

- 检查缩放系数是否正确
- 检查数据格式（有符号/无符号，16位/32位）
- 参考手册确认寄存器存储的数据类型

## 测试

### 测试 ModbusRTU 连接

可以创建一个测试脚本：

```python
from app.services.modbus_service import modbus_service

# 测试读取电机状态
motor_data = modbus_service.read_motor_status()
print("Motor Status:", motor_data)

# 测试读取振动指标
vibration_data = modbus_service.read_vibration_metrics()
print("Vibration Metrics:", vibration_data)

# 关闭连接
modbus_service.close()
```

## 日志

所有 ModbusRTU 操作都会记录在 `logs/control_backend.log` 文件中，包括：
- 连接状态
- 读取操作
- 错误信息

查看日志可以帮助诊断问题。

