# RS485通信协议说明文档

## 一、通信协议概述

本系统采用RS485总线进行数据传输，使用自定义帧格式封装传感器数据。

### 1.1 物理层参数
- **通信接口**: RS485 (通过UART1)
- **控制引脚**: GPIOA_PIN_12 (DE/RE控制)
- **传输间隔**: 100ms (可配置)
- **最大帧长度**: 64字节

### 1.2 帧格式定义

数据帧采用固定格式，包含以下字段：

| 字段 | 长度(字节) | 说明 | 值 |
|------|-----------|------|-----|
| 帧头(Header) | 1 | 帧起始标识 | 0xAA |
| 长度(Length) | 1 | 数据部分长度 | 0x1C (28字节) |
| 命令(Command) | 1 | 命令码 | 0xA1 (传感器数据) |
| 数据(Data) | 28 | 传感器数据载荷 | 14个uint16_t |
| 校验和(Checksum) | 1 | 异或校验和 | 计算值 |
| 帧尾(Footer) | 1 | 帧结束标识 | 0x55 |

**总帧长度**: 1 + 1 + 1 + 28 + 1 + 1 = **33字节**

### 1.3 帧结构示意图

```
┌─────────┬─────────┬─────────┬──────────────────┬─────────┬─────────┐
│ Header  │ Length  │ Command │      Data        │Checksum │ Footer  │
│  0xAA   │  0x1C   │  0xA1   │   28 bytes       │  XOR    │  0x55   │
└─────────┴─────────┴─────────┴──────────────────┴─────────┴─────────┘
```

## 二、数据内容详解

### 2.1 传感器数据载荷结构

数据部分包含14个16位数据（小端序，Little-Endian），共28字节：

| 索引 | 字段名 | 类型 | 单位/说明 | 数据来源 |
|------|--------|------|----------|----------|
| 0 | speed | uint16_t | 转速 | MT6835编码器 |
| 1 | reserved1 | uint16_t | 预留/状态 | 调试状态码 |
| 2 | att_u | int16_t | 姿态U (Roll) | LSM6DSL + 姿态滤波 |
| 3 | att_v | int16_t | 姿态V (Pitch) | LSM6DSL + 姿态滤波 |
| 4 | att_w | int16_t | 姿态W (Yaw) | LSM6DSL + 姿态滤波 |
| 5 | reserved2 | uint16_t | 预留/进度 | 校准进度/调试信息 |
| 6 | vib_freq | uint16_t | 主频 (Hz) | ICS43434 + FFT分析 |
| 7 | vib_mag | uint16_t | 峰值 (×1000 mg) | ICS43434 + FFT分析 |
| 8 | vib_rms | uint16_t | RMS (×1000 mg) | ICS43434 + FFT分析 |
| 9 | vib_ratio | uint16_t | 高频比例 (%) | ICS43434 + FFT分析 |
| 10 | vib_impulse | uint16_t | 冲击次数 | ICS43434 + FFT分析 |
| 11 | temp | int16_t | 温度 (×10 ℃) | MF52D温度传感器 |
| 12 | reserved3 | uint16_t | 预留 | - |
| 13 | reserved4 | uint16_t | 预留 | - |

### 2.2 数据字段详细说明

#### 2.2.1 转速数据 (speed)
- **传感器**: MT6835磁编码器
- **类型**: uint16_t (无符号16位)
- **单位**: 转速值
- **更新频率**: 由MT6835任务更新

#### 2.2.2 姿态数据 (att_u, att_v, att_w)
- **传感器**: LSM6DSL (加速度计 + 陀螺仪)
- **类型**: int16_t (有符号16位)
- **单位**: 角度值
- **算法**: 互补滤波融合
- **更新频率**: 由姿态任务更新

#### 2.2.3 振动数据 (vib_freq, vib_mag, vib_rms, vib_ratio, vib_impulse)
- **传感器**: ICS43434 MEMS麦克风
- **类型**: uint16_t
- **单位说明**:
  - `vib_freq`: 主频 (Hz)
  - `vib_mag`: 峰值幅度 (×1000 mg，即实际值需除以1000)
  - `vib_rms`: RMS值 (×1000 mg)
  - `vib_ratio`: 高频能量比例 (0-100%)
  - `vib_impulse`: 冲击事件计数
- **处理**: FFT频谱分析 (512点FFT，采样率1660Hz)
- **更新频率**: 由ICS43434任务更新

#### 2.2.4 温度数据 (temp)
- **传感器**: MF52D NTC热敏电阻
- **类型**: int16_t (有符号16位)
- **单位**: 温度值 ×10 (实际温度 = temp / 10.0)
- **更新频率**: 由MF52D任务更新

#### 2.2.5 预留字段
- **reserved1**: 调试状态码
  - `0x0000`: 未初始化
  - `0x0001`: 校准中
  - `0x0002`: 校准完成
  - `0x0003`: 数据未就绪
- **reserved2**: 校准进度(0-100) 或 其他调试信息
- **reserved3, reserved4**: 预留扩展

## 三、校验和计算

### 3.1 校验算法
采用**异或(XOR)校验**方式：

```c
checksum = Header XOR Length XOR Command XOR Data[0] XOR Data[1] XOR ... XOR Data[27]
```

### 3.2 校验范围
- 包含: 帧头、长度、命令、所有数据字节
- 不包含: 校验和本身、帧尾

### 3.3 校验验证
接收端需重新计算校验和，与接收到的校验和进行比较，一致则帧有效。

## 四、通信流程

### 4.1 发送流程

1. **数据采集**: 各传感器任务更新全局数据 `g_sensor_payload`
2. **数据打包**: `RS485_Pack_Sensor_Data()` 将数据打包成帧
3. **校验计算**: `RS485_Calculate_Checksum()` 计算校验和
4. **发送准备**: 
   - 启用RS485发送模式 (`RS485_DE_ENABLE()`)
   - 填充发送缓冲区
5. **数据发送**: 通过UART发送完整帧
6. **发送完成**: 
   - 等待20ms确保驱动器稳定
   - 禁用发送模式 (`RS485_DE_DISABLE()`)

### 4.2 接收流程

1. **帧同步**: 搜索帧头 `0xAA`
2. **长度检查**: 读取长度字段，验证帧完整性
3. **帧尾验证**: 检查帧尾是否为 `0x55`
4. **校验验证**: 计算校验和并验证
5. **数据解析**: 提取数据部分，按小端序解析为14个uint16_t

### 4.3 数据更新周期

- **RS485发送周期**: 500ms (2Hz)
- **传感器数据更新周期**:
  - MT6835: 由编码器任务控制
  - LSM6DSL: 由IMU任务控制
  - ICS43434: 由音频任务控制 (FFT处理)
  - MF52D: 500ms

## 五、数据示例

### 5.1 完整帧示例

假设传感器数据为：
- speed = 1000
- att_u = 45, att_v = -30, att_w = 120
- vib_freq = 50, vib_mag = 5000, vib_rms = 2000
- temp = 250 (25.0℃)

**十六进制表示** (小端序):
```
AA 1C A1 
E8 03 00 00 2D 00 E2 FF 78 00 00 00 32 00 88 13 D0 07 00 00 00 00 
FA 00 00 00 00 00 
[Checksum] 
55
```

### 5.2 数据解析示例

```python
# Python解析示例
data = bytes.fromhex("E8 03 00 00 2D 00 E2 FF 78 00 ...")
speed = int.from_bytes(data[0:2], 'little')  # 1000
att_u = int.from_bytes(data[4:6], 'little', signed=True)  # 45
att_v = int.from_bytes(data[6:8], 'little', signed=True)  # -30
```

## 六、错误处理

### 6.1 帧同步错误
- **现象**: 未找到帧头 `0xAA`
- **处理**: 继续搜索下一个字节

### 6.2 长度错误
- **现象**: 数据长度字段与实际不符
- **处理**: 丢弃该帧，重新同步

### 6.3 帧尾错误
- **现象**: 帧尾不是 `0x55`
- **处理**: 继续搜索下一个帧头

### 6.4 校验和错误
- **现象**: 计算的校验和与接收的不一致
- **处理**: 丢弃该帧，记录错误

## 七、代码接口

### 7.1 主要函数

```c
// 初始化RS485
HAL_StatusTypeDef RS485_Init(UART_HandleTypeDef *huart);

// 发送数据帧
HAL_StatusTypeDef RS485_Send_Frame(UART_HandleTypeDef *huart, RS485_Frame_t *frame);

// 打包传感器数据
void RS485_Pack_Sensor_Data(RS485_Frame_t *frame, const uint16_t payload14[14]);

// 解析接收帧
uint8_t RS485_Parse_Frame(RS485_Frame_t *frame, uint8_t *rx_buffer, uint16_t length);

// 计算校验和
uint8_t RS485_Calculate_Checksum(RS485_Frame_t *frame);
```

### 7.2 数据结构

```c
// 数据帧结构
typedef struct {
    uint8_t header;      // 0xAA
    uint8_t length;      // 数据长度
    uint8_t command;     // 命令码
    uint8_t data[64];    // 数据载荷
    uint8_t checksum;   // 校验和
    uint8_t footer;      // 0x55
} RS485_Frame_t;

// 传感器数据载荷
typedef struct __attribute__((packed)) {
    uint16_t speed;
    uint16_t reserved1;
    int16_t  att_u;
    int16_t  att_v;
    int16_t  att_w;
    uint16_t reserved2;
    uint16_t vib_freq;
    uint16_t vib_mag;
    uint16_t vib_rms;
    uint16_t vib_ratio;
    uint16_t vib_impulse;
    int16_t  temp;
    uint16_t reserved3;
    uint16_t reserved4;
} SensorPayload_t;
```

## 八、注意事项

1. **字节序**: 所有多字节数据采用**小端序(Little-Endian)**
2. **数据保护**: 使用互斥锁保护共享数据 `g_sensor_payload`
3. **发送间隔**: 发送完成后需等待20ms再切换为接收模式
4. **数据精度**: 
   - 振动数据已放大1000倍，解析时需除以1000
   - 温度数据已放大10倍，解析时需除以10
5. **帧同步**: 接收端需处理帧同步问题，可能从数据流中间开始接收

## 九、协议版本

- **当前版本**: v1.0
- **命令码**: 0xA1 (传感器数据上报)
- **扩展性**: 预留字段可用于未来扩展

---

**文档生成时间**: 2024
**适用项目**: X-motor_Encorder_G431_2

