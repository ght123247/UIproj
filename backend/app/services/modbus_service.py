"""
ModbusRTU 通信服务
根据 RS485.md 实现驱动器的读取和控制功能
"""
import time
import random
from typing import Optional, Dict, Any, List
from pymodbus.client import ModbusSerialClient
from pymodbus.exceptions import ModbusException, ConnectionException
from threading import Lock
import asyncio

from app.core.config import settings
from app.utils.logger import get_logger

logger = get_logger("modbus-service")


class ModbusService:
    """
    ModbusRTU 通信服务类
    提供线程安全的 ModbusRTU 读取和控制功能
    """
    
    _FAULT_MESSAGES = {
        0: "无错误",
        1: "过压",
        2: "欠压",
        3: "绝对值超过最大电流",
        4: "MOS管过温",
        5: "MCU欠压",
        6: "看门狗触发后启动",
        7: "SPI接口驱动器错误",
        8: "FLASH损毁",
        9: "U相电流传感器偏移过大",
        10: "V相电流传感器偏移过大",
        11: "W相电流传感器偏移过大",
        12: "三相电流不平衡",
        13: "FLASH中电机配置损毁",
        14: "FLASH中应用配置损毁",
        15: "CANOPEN心跳错误",
        16: "堵转",
        17: "失速",
        18: "超差",
        19: "编码器未接到信号",
    }
    
    def __init__(self):
        self._lock = Lock()
        self._client: Optional[ModbusSerialClient] = None
        self._is_connected = False
        self._heartbeat_counter = 0
        self._heartbeat_task: Optional[asyncio.Task] = None
        self._z_signal_found: bool = False
        
    def _get_client(self) -> ModbusSerialClient:
        """获取或创建 ModbusRTU 客户端"""
        if self._client is None or not self._is_connected:
            # 如果已有客户端但未连接，先关闭旧连接
            if self._client is not None:
                try:
                    self._client.close()
                except Exception:
                    pass
                self._client = None
            
            try:
                # 创建 ModbusRTU 客户端
                self._client = ModbusSerialClient(
                    port=settings.MODBUS_PORT,
                    baudrate=settings.MODBUS_BAUDRATE,
                    timeout=settings.MODBUS_TIMEOUT,
                    parity=settings.MODBUS_PARITY,
                    stopbits=settings.MODBUS_STOPBITS,
                    bytesize=settings.MODBUS_BYTESIZE,
                )
                
                # 尝试连接
                if self._client.connect():
                    self._is_connected = True
                    logger.info(
                        f"ModbusRTU 连接成功 - 串口: {settings.MODBUS_PORT}, "
                        f"波特率: {settings.MODBUS_BAUDRATE}, 从站: {settings.MODBUS_SLAVE_ID}"
                    )
                else:
                    logger.error(f"ModbusRTU 连接失败 - 串口: {settings.MODBUS_PORT}")
                    self._is_connected = False
                    if self._client:
                        try:
                            self._client.close()
                        except Exception:
                            pass
                        self._client = None
                    
            except Exception as e:
                logger.error(f"创建 ModbusRTU 客户端失败: {e}", exc_info=True)
                self._is_connected = False
                if self._client:
                    try:
                        self._client.close()
                    except Exception:
                        pass
                self._client = None
                
        return self._client
    
    def _read_input_registers(self, address: int, count: int = 1) -> Optional[List[int]]:
        """
        读取输入寄存器（功能码 0x04）
        
        Args:
            address: 寄存器地址（实际地址，如5000）
            count: 读取的寄存器数量
            
        Returns:
            寄存器值列表，失败返回 None
        """
        with self._lock:
            try:
                client = self._get_client()
                if not client or not self._is_connected:
                    logger.warning("ModbusRTU 客户端未连接")
                    return None
                
                # 读取输入寄存器（功能码 0x04）
                result = client.read_input_registers(
                    address=address,
                    count=count,
                    device_id=settings.MODBUS_SLAVE_ID
                )
                
                if result.isError():
                    logger.error(f"读取输入寄存器失败 - 地址: {address}, 错误: {result}")
                    return None
                
                if result.registers and len(result.registers) > 0:
                    return result.registers
                return None
                
            except ModbusException as e:
                logger.error(f"Modbus 异常 - 地址: {address}, 错误: {e}")
                self._is_connected = False
                return None
            except Exception as e:
                logger.error(f"读取输入寄存器异常 - 地址: {address}, 错误: {e}", exc_info=True)
                self._is_connected = False
                return None
    
    def _read_holding_registers(self, address: int, count: int = 1) -> Optional[List[int]]:
        """
        读取保持寄存器（功能码 0x03）
        
        Args:
            address: 寄存器地址（实际地址，如6000）
            count: 读取的寄存器数量
            
        Returns:
            寄存器值列表，失败返回 None
        """
        with self._lock:
            try:
                client = self._get_client()
                if not client or not self._is_connected:
                    logger.warning("ModbusRTU 客户端未连接")
                    return None
                
                # 读取保持寄存器（功能码 0x03）
                result = client.read_holding_registers(
                    address=address,
                    count=count,
                    device_id=settings.MODBUS_SLAVE_ID
                )
                
                if result.isError():
                    logger.error(f"读取保持寄存器失败 - 地址: {address}, 错误: {result}")
                    return None
                
                if result.registers and len(result.registers) > 0:
                    return result.registers
                return None
                
            except ModbusException as e:
                logger.error(f"Modbus 异常 - 地址: {address}, 错误: {e}")
                self._is_connected = False
                return None
            except Exception as e:
                logger.error(f"读取保持寄存器异常 - 地址: {address}, 错误: {e}", exc_info=True)
                self._is_connected = False
                return None
    
    def _write_single_register(self, address: int, value: int) -> bool:
        """
        写单个寄存器（功能码 0x06）
        
        Args:
            address: 寄存器地址
            value: 要写入的值（16位）
            
        Returns:
            成功返回 True，失败返回 False
        """
        with self._lock:
            try:
                client = self._get_client()
                if not client or not self._is_connected:
                    logger.warning("ModbusRTU 客户端未连接")
                    return False
                
                result = client.write_register(
                    address=address,
                    value=value,
                    device_id=settings.MODBUS_SLAVE_ID
                )
                
                if result.isError():
                    logger.error(f"写入寄存器失败 - 地址: {address}, 值: {value}, 错误: {result}")
                    return False
                
                return True
                
            except ModbusException as e:
                logger.error(f"Modbus 异常 - 地址: {address}, 错误: {e}")
                self._is_connected = False
                return False
            except Exception as e:
                logger.error(f"写入寄存器异常 - 地址: {address}, 错误: {e}", exc_info=True)
                self._is_connected = False
                return False
    
    def _write_multiple_registers(self, address: int, values: List[int]) -> bool:
        """
        写多个寄存器（功能码 0x10）
        
        Args:
            address: 起始寄存器地址
            values: 要写入的值列表
            
        Returns:
            成功返回 True，失败返回 False
        """
        with self._lock:
            try:
                client = self._get_client()
                if not client or not self._is_connected:
                    logger.warning("ModbusRTU 客户端未连接")
                    return False
                
                result = client.write_registers(
                    address=address,
                    values=values,
                    device_id=settings.MODBUS_SLAVE_ID
                )
                
                if result.isError():
                    logger.error(f"写入多个寄存器失败 - 地址: {address}, 错误: {result}")
                    return False
                
                return True
                
            except ModbusException as e:
                logger.error(f"Modbus 异常 - 地址: {address}, 错误: {e}")
                self._is_connected = False
                return False
            except Exception as e:
                logger.error(f"写入多个寄存器异常 - 地址: {address}, 错误: {e}", exc_info=True)
                self._is_connected = False
                return False
    
    def _registers_to_int32(self, registers: List[int]) -> int:
        """
        将2个寄存器（大端序，高字在前）转换为 int32
        
        Args:
            registers: 2个寄存器的值列表 [高字, 低字]
            
        Returns:
            int32 值
        """
        if len(registers) < 2:
            return 0
        # 大端序：高字在前，低字在后
        high_word = registers[0]
        low_word = registers[1]
        # 组合成32位整数（有符号）
        value = (high_word << 16) | (low_word & 0xFFFF)
        # 处理有符号整数
        if value & 0x80000000:
            value = value - 0x100000000
        return value
    
    def _int32_to_registers(self, value: int) -> List[int]:
        """
        将 int32 转换为2个寄存器（大端序，高字在前）
        
        Args:
            value: int32 值
            
        Returns:
            [高字, 低字] 列表
        """
        # 处理有符号整数
        if value < 0:
            value = value + 0x100000000
        high_word = (value >> 16) & 0xFFFF
        low_word = value & 0xFFFF
        return [high_word, low_word]
    
    # ========== 读取功能 ==========
    
    def read_fault_info(self) -> Optional[int]:
        """读取故障信息（5000）"""
        regs = self._read_input_registers(settings.REG_INPUT_FAULT, 1)
        return regs[0] if regs else None

    def get_fault_description(self, fault_code: int) -> str:
        """根据故障码获取描述"""
        return self._FAULT_MESSAGES.get(fault_code, "未知故障")
    
    def read_rpm(self) -> Optional[float]:
        """
        读取实时转速（5001-5002）
        返回 rpm（已转换为实际转速）
        """
        regs = self._read_input_registers(settings.REG_INPUT_RPM, 2)
        if not regs:
            return None
        erpm = self._registers_to_int32(regs)
        # erpm 转 rpm：rpm = erpm / 极对数
        rpm = erpm / settings.MOTOR_POLE_PAIRS
        return float(rpm)
    
    def read_temperature(self) -> Optional[float]:
        """读取实时温度（5008），单位℃"""
        regs = self._read_input_registers(settings.REG_INPUT_TEMPERATURE, 1)
        if not regs:
            return None
        # short 类型，需要处理有符号
        temp = regs[0]
        if temp & 0x8000:  # 负数
            temp = temp - 0x10000
        return float(temp)
    
    def read_motor_current(self) -> Optional[float]:
        """读取实时电机电流（5006），单位A（已转换）"""
        regs = self._read_input_registers(settings.REG_INPUT_MOTOR_CURRENT, 1)
        if not regs:
            logger.debug(f"读取电流失败：寄存器 {settings.REG_INPUT_MOTOR_CURRENT} 返回 None")
            return None
        # short 类型，单位 10mA
        current_10ma = regs[0]
        if current_10ma & 0x8000:  # 负数
            current_10ma = current_10ma - 0x10000
        current = current_10ma * 0.01  # 转换为 A
        logger.debug(f"读取电流：寄存器值={current_10ma} (10mA单位), 转换后={current:.3f}A")
        return float(current)
    
    def read_power(self) -> Optional[float]:
        """读取实时功率（5004），单位W"""
        regs = self._read_input_registers(settings.REG_INPUT_POWER, 1)
        if not regs:
            return None
        # short 类型
        power = regs[0]
        if power & 0x8000:  # 负数
            power = power - 0x10000
        return float(power)
    
    def read_voltage(self) -> Optional[float]:
        """读取实时输入电压（5005），单位V"""
        regs = self._read_input_registers(settings.REG_INPUT_VOLTAGE, 1)
        if not regs:
            return None
        # short 类型
        voltage = regs[0]
        if voltage & 0x8000:  # 负数
            voltage = voltage - 0x10000
        return float(voltage)
    
    def read_position(self) -> Optional[float]:
        """读取实时位置（5010-5011），单位度（已转换）"""
        regs = self._read_input_registers(settings.REG_INPUT_POSITION, 2)
        if not regs:
            return None
        # int 类型，单位 0.01°
        position_001 = self._registers_to_int32(regs)
        position = position_001 * 0.01  # 转换为度
        return float(position)
    
    def read_duty_cycle(self) -> Optional[float]:
        """读取实时占空比（5003），范围 -1000 ~ 1000"""
        regs = self._read_input_registers(settings.REG_INPUT_DUTY, 1)
        if not regs:
            return None
        # short 类型
        duty = regs[0]
        if duty & 0x8000:  # 负数
            duty = duty - 0x10000
        return float(duty)
    
    def read_torque(self) -> Optional[float]:
        """
        读取实时转矩（基于 5006 寄存器的实时电机电流）
        
        转矩直接绑定到 5006 寄存器的电流值：
        转矩(Nm) = 电流(A) × TORQUE_CURRENT_RATIO
        
        Returns:
            转矩值（Nm），失败返回 None
        """
        motor_current = self.read_motor_current()
        if motor_current is None:
            logger.debug("读取转矩失败：电流值为 None")
            return None
        
        # 使用配置的转换系数计算转矩
        torque = abs(motor_current) * settings.TORQUE_CURRENT_RATIO
        
        # 如果转矩计算结果非常小（可能是浮点数精度问题），记录详细信息
        if torque < 0.0001 and abs(motor_current) > 0.0001:
            logger.warning(
                f"转矩值异常小：电流={motor_current:.6f}A, 系数={settings.TORQUE_CURRENT_RATIO}, "
                f"转矩={torque:.6f}Nm。建议检查转换系数是否合适。"
            )
        
        logger.debug(f"转矩计算：电流={motor_current:.6f}A, 系数={settings.TORQUE_CURRENT_RATIO}, 转矩={torque:.6f}Nm")
        return float(torque)
    
    def read_motor_status(self) -> Optional[Dict[str, float]]:
        """
        读取电机状态数据（优化版本，只读取必要数据）
        
        Returns:
            包含 rpm, torque, load, temperature 的字典
        
        注意：
            - torque 直接基于 5006 寄存器的实时电机电流计算
            - 转矩(Nm) = 电流(A) × TORQUE_CURRENT_RATIO
            - 优化：只读取必要寄存器，提高采集频率
        """
        try:
            # 读取必要数据：rpm, 电流(用于计算torque), 温度, 功率
            rpm = self.read_rpm()
            motor_current = self.read_motor_current()
            temperature = self.read_temperature()
            power = self.read_power()
            
            if rpm is None or temperature is None:
                return None
            
            # 计算转矩：直接基于 5006 寄存器的实时电机电流
            torque = 0.0
            if motor_current is not None:
                torque = abs(motor_current) * settings.TORQUE_CURRENT_RATIO
            
            # 功率值（从 5004 寄存器读取，单位W）
            power_value = abs(power) if power is not None else 0.0
            
            # 负载计算（基于功率，假设最大功率为某个值，需要根据实际情况调整）
            load = 0.0
            if power is not None:
                # 假设最大功率为某个值，这里需要根据实际情况调整
                # 例如：如果最大功率为 1000W，则 load = power / 10.0
                load = min(100.0, max(0.0, abs(power) / 10.0))  # 需要根据实际最大功率调整
            
            return {
                "rpm": rpm,
                "torque": torque,
                "load": load,
                "temperature": temperature,
                "power": power_value
            }
            
        except Exception as e:
            logger.error(f"读取电机状态失败: {e}", exc_info=True)
            return None
    
    def read_vibration_metrics(self, rpm: Optional[float] = None) -> Optional[Dict[str, float]]:
        """
        读取振动指标数据（优化版本，可复用已读取的rpm值）
        
        Args:
            rpm: 可选的rpm值，如果提供则避免重复读取
        
        Returns:
            包含 main_freq, amplitude, rms, impulse_count, health_index, tool_wear 的字典
        """
        try:
            # 如果未提供rpm，则读取（但通常应该从read_motor_status传入以避免重复读取）
            if rpm is None:
                rpm = self.read_rpm()
                if rpm is None:
                    return None
            
            # 从转速计算频率：频率 = 转速 / 60
            base_freq = max(0.0, rpm / 60.0)  # 确保非负
            # 添加 ±0.60Hz 的小幅波动，精确到小数点后两位
            main_freq_noise = random.uniform(-0.60, 0.60)
            # 由于 rpm 可能为 0（例如停机状态），扰动后可能出现负频率，需强制截断
            main_freq = round(max(0.0, base_freq + main_freq_noise), 2)
            
            # 其他振动指标需要根据实际硬件调整（当前返回默认值）
            # 健康指数和刀具磨损需要根据实际算法计算，这里提供基础实现
            # 健康指数：基于振动数据计算（简化算法，需要根据实际情况调整）
            # 刀具磨损：基于运行时间和振动数据计算（简化算法，需要根据实际情况调整）
            
            # 简化计算：健康指数 = 100 - (RMS * 系数)，范围 0-100
            # 这里使用默认值，实际应该从传感器读取
            rms_value = 0.0  # 需要从实际寄存器读取
            health_index = max(0.0, min(100.0, 100.0 - rms_value * 10.0))
            
            # 简化计算：刀具磨损（基于运行时间或振动数据）
            # 这里使用默认值，实际应该根据运行时间、负载等计算
            tool_wear = 0.0  # 需要根据实际算法计算
            
            return {
                "main_freq": main_freq,
                "amplitude": 0.0,  # 需要从实际寄存器读取
                "rms": rms_value,  # 需要从实际寄存器读取
                "impulse_count": 0,  # 需要从实际寄存器读取
                "health_index": health_index,
                "tool_wear": tool_wear
            }
            
        except Exception as e:
            logger.error(f"读取振动指标失败: {e}", exc_info=True)
            return None
    
    # ========== 控制功能 ==========
    
    def ensure_connection(self) -> bool:
        """
        确保 Modbus 连接已建立
        
        Returns:
            连接成功返回 True，失败返回 False
        """
        try:
            client = self._get_client()
            if client and self._is_connected:
                return True
            return False
        except Exception as e:
            logger.error(f"建立 Modbus 连接失败: {e}", exc_info=True)
            return False

    def refresh_z_signal_state(self) -> Optional[bool]:
        """
        读取编码器 Z 信号状态（5013），并更新内部标记
        
        Returns:
            True: 已找到 Z 信号
            False: 未找到 Z 信号
            None: 读取失败
        """
        regs = self._read_input_registers(settings.REG_INPUT_ENCODER_Z_STATE, 1)
        if regs is None:
            return None
        self._z_signal_found = regs[0] == 1
        return self._z_signal_found
    
    def initialize_encoder_z_signal(self) -> bool:
        """
        初始化编码器Z信号
        驱动器重新上电后，通过力矩模式让电机转几圈找到Z信号
        
        执行序列：
        1. 设置控制模式为0（电流模式）- 6001寄存器写入0
        2. 设置电流为8A（6002寄存器写入800，单位10mA）
        3. 维持1秒
        4. 停止（6002寄存器写入0）
        
        Returns:
            成功返回 True，失败返回 False
        """
        try:
            logger.info("开始初始化编码器Z信号...")
            
            # 确保Modbus连接已建立
            if not self._is_connected:
                logger.error("ModbusRTU 连接未建立，无法初始化Z信号")
                return False
            
            attempt = 0
            while True:
                attempt += 1
                logger.info(f"第 {attempt} 次 Z 信号搜索开始")
                
                # 如果已经找到 Z 信号，直接返回
                current_state = self.refresh_z_signal_state()
                if current_state:
                    logger.info("编码器Z信号已存在，无需重新初始化")
                    return True
                
                # 1. 设置控制模式为0（电流模式），允许在未找到Z信号时强制执行
                if not self.set_mode(0, use_empty_mode=True, allow_without_z=True):
                    logger.error("设置电流模式失败")
                    return False
                logger.info("已设置控制模式为电流模式")
                time.sleep(0.1)  # 短暂延时，确保模式切换完成
                
                # 2. 设置电流为8A（800 * 10mA = 8A）
                if not self.set_current(8.0):
                    logger.error("设置电流为8A失败")
                    return False
                logger.info("已设置电流为8A（800），开始旋转查找Z信号...")
                
                # 3. 维持1秒
                time.sleep(1.5)
                
                # 4. 停止（设置电流为0）
                if not self.set_current(0.0):
                    logger.error("停止电流失败")
                    return False
                logger.info("已停止电流，Z信号初始化完成")
                
                # 短暂延时，确保电机停止
                time.sleep(0.1)
                
                # 切换回空模式，防止驱动器报未找到Z信号
                if not self._write_single_register(settings.REG_HOLDING_MODE, 0xFFFF):
                    logger.warning("切换空模式失败，尝试继续")
                else:
                    logger.info("已将控制模式恢复为 0xFFFF")
                
                # 轮询5013寄存器确认Z信号
                deadline = time.time() + 5.0
                found = False
                while time.time() < deadline:
                    state = self.refresh_z_signal_state()
                    if state:
                        logger.info("成功检测到编码器Z信号")
                        found = True
                        break
                    if state is False:
                        logger.debug("编码器Z信号未就绪，继续等待...")
                    else:
                        logger.warning("读取编码器Z信号状态失败，重试中...")
                    time.sleep(0.2)
                
                if found:
                    return True
                
                logger.warning("本次搜索未检测到编码器Z信号，准备重新执行")
                
                fault_code = self.read_fault_info()
                if fault_code is not None:
                    fault_desc = self.get_fault_description(fault_code)
                    logger.warning(f"当前故障寄存器(5000) = {fault_code}，描述：{fault_desc}")
                else:
                    logger.warning("读取故障寄存器(5000)失败")
                
                self._z_signal_found = False
                time.sleep(0.5)
            
        except Exception as e:
            logger.error(f"初始化编码器Z信号失败: {e}", exc_info=True)
            # 尝试停止电机
            try:
                self.set_current(0.0)
            except:
                pass
            self._z_signal_found = False
            return False
    
    def send_heartbeat(self) -> bool:
        """
        发送心跳包（6000）
        必须周期调用，否则驱动器会停止电机
        """
        self._heartbeat_counter += 1
        # 心跳值循环递增，避免溢出
        heartbeat_value = (self._heartbeat_counter % 65535) + 1
        return self._write_single_register(settings.REG_HOLDING_HEARTBEAT, heartbeat_value)
    
    def set_mode(self, mode: int, use_empty_mode: bool = True, allow_without_z: bool = False) -> bool:
        """
        设置控制模式（6001）
        
        Args:
            mode: 控制模式
                0: 电流；1: 转速；2: 占空比；3: 绝对位置；4: 相对上次目标；
                5: 相对当前位置；6: 刹车；7: 手刹；8: 回零；9: 中止回零；10: 电流爬升；0xFFFF: 空模式
            use_empty_mode: 是否先切换到空模式（推荐）
            allow_without_z: 是否允许在尚未找到 Z 信号时强制写入（仅初始化流程使用）
        """
        try:
            if mode != 0xFFFF and not allow_without_z and not self._z_signal_found:
                logger.warning("尚未找到编码器Z信号，拒绝切换控制模式，保持 0xFFFF")
                self._write_single_register(settings.REG_HOLDING_MODE, 0xFFFF)
                return False
            
            if use_empty_mode:
                # 先切换到空模式
                if not self._write_single_register(settings.REG_HOLDING_MODE, 0xFFFF):
                    return False
                time.sleep(0.01)  # 短暂延时
            
            return self._write_single_register(settings.REG_HOLDING_MODE, mode)
        except Exception as e:
            logger.error(f"设置控制模式失败: {e}", exc_info=True)
            return False
    
    def set_current(self, current_amps: float) -> bool:
        """
        设定电流（6002）
        
        Args:
            current_amps: 电流值（A）
        """
        # 转换为 10mA 单位
        current_10ma = int(current_amps * 100)
        # 处理负数（short 类型）
        if current_10ma < 0:
            current_10ma = current_10ma + 0x10000
        return self._write_single_register(settings.REG_HOLDING_CURRENT, current_10ma)
    
    def set_rpm(self, rpm: float) -> bool:
        """
        设定转速（6003-6004）
        
        Args:
            rpm: 转速（rpm），会自动转换为 erpm
        """
        # rpm 转 erpm：erpm = rpm × 极对数
        erpm = int(rpm * settings.MOTOR_POLE_PAIRS)
        regs = self._int32_to_registers(erpm)
        return self._write_multiple_registers(settings.REG_HOLDING_RPM, regs)
    
    def set_duty_cycle(self, duty: int) -> bool:
        """
        设定占空比（6005）
        
        Args:
            duty: 占空比值，范围 -1000 ~ 1000
        """
        if duty < -1000 or duty > 1000:
            logger.error(f"占空比值超出范围: {duty}")
            return False
        # 处理负数（short 类型）
        if duty < 0:
            duty = duty + 0x10000
        return self._write_single_register(settings.REG_HOLDING_DUTY, duty)
    
    def set_absolute_position(self, position_degrees: float) -> bool:
        """
        设定绝对位置（6006-6007）
        
        Args:
            position_degrees: 位置（度），会自动转换为 0.01° 单位
        """
        # 转换为 0.01° 单位
        position_001 = int(position_degrees * 100)
        regs = self._int32_to_registers(position_001)
        return self._write_multiple_registers(settings.REG_HOLDING_ABSOLUTE_POSITION, regs)
    
    def set_relative_position_last(self, position_degrees: float) -> bool:
        """设定相对位置（上次目标）（6008-6009）"""
        position_001 = int(position_degrees * 100)
        regs = self._int32_to_registers(position_001)
        return self._write_multiple_registers(settings.REG_HOLDING_RELATIVE_POSITION_LAST, regs)
    
    def set_relative_position_current(self, position_degrees: float) -> bool:
        """设定相对位置（当前位置）（6010-6011）"""
        position_001 = int(position_degrees * 100)
        regs = self._int32_to_registers(position_001)
        return self._write_multiple_registers(settings.REG_HOLDING_RELATIVE_POSITION_CURRENT, regs)
    
    def set_acceleration(self, acceleration_erpm_per_s: int) -> bool:
        """设置速度环加速度（6016-6017），单位 erpm/s"""
        regs = self._int32_to_registers(acceleration_erpm_per_s)
        return self._write_multiple_registers(settings.REG_HOLDING_ACCELERATION, regs)
    
    def set_deceleration(self, deceleration_erpm_per_s: int) -> bool:
        """设置速度环减速度（6025-6026），单位 erpm/s"""
        regs = self._int32_to_registers(deceleration_erpm_per_s)
        return self._write_multiple_registers(settings.REG_HOLDING_DECELERATION, regs)
    
    def set_max_speed(self, max_speed_erpm: int) -> bool:
        """设置轨迹最大速度（6018-6019），单位 erpm"""
        regs = self._int32_to_registers(max_speed_erpm)
        return self._write_multiple_registers(settings.REG_HOLDING_MAX_SPEED, regs)
    
    def set_max_acceleration(self, max_accel: int) -> bool:
        """设置轨迹最大加速度（6020-6021）"""
        regs = self._int32_to_registers(max_accel)
        return self._write_multiple_registers(settings.REG_HOLDING_MAX_ACCEL, regs)
    
    def set_max_deceleration(self, max_decel: int) -> bool:
        """设置轨迹最大减速度（6022-6023）"""
        regs = self._int32_to_registers(max_decel)
        return self._write_multiple_registers(settings.REG_HOLDING_MAX_DECEL, regs)
    
    def start_heartbeat(self):
        """启动心跳任务"""
        if self._heartbeat_task is None or self._heartbeat_task.done():
            self._heartbeat_task = asyncio.create_task(self._heartbeat_loop())
            logger.info("心跳任务已启动")
    
    def stop_heartbeat(self):
        """停止心跳任务"""
        if self._heartbeat_task and not self._heartbeat_task.done():
            self._heartbeat_task.cancel()
            logger.info("心跳任务已停止")
    
    async def _heartbeat_loop(self):
        """心跳循环任务"""
        while True:
            try:
                if settings.USE_MODBUS:
                    success = self.send_heartbeat()
                    if not success:
                        logger.warning("心跳发送失败")
                await asyncio.sleep(settings.HEARTBEAT_INTERVAL)
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"心跳任务异常: {e}", exc_info=True)
                await asyncio.sleep(settings.HEARTBEAT_INTERVAL)
    
    def close(self):
        """关闭 ModbusRTU 连接"""
        self.stop_heartbeat()
        with self._lock:
            if self._client:
                try:
                    self._client.close()
                    logger.info("ModbusRTU 连接已关闭")
                except Exception as e:
                    logger.error(f"关闭 ModbusRTU 连接失败: {e}")
                finally:
                    self._client = None
                    self._is_connected = False
    
    def reconnect(self) -> bool:
        """重新连接 ModbusRTU"""
        self.close()
        time.sleep(0.5)  # 等待一段时间后重连
        client = self._get_client()
        return self._is_connected


# 创建全局 Modbus 服务实例
modbus_service = ModbusService()
