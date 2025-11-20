"""
ModbusRTU 功能测试脚本
用于测试与驱动器的 Modbus 通信功能
"""
import sys
import time
import os
import argparse
from pathlib import Path

# 添加项目根目录到 Python 路径
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from app.services.modbus_service import modbus_service
from app.core.config import settings


def print_separator():
    """打印分隔线"""
    print("\n" + "=" * 60 + "\n")


def test_connection():
    """测试 Modbus 连接"""
    print("=" * 60)
    print("测试 1: ModbusRTU 连接测试")
    print("=" * 60)
    
    print(f"\n配置信息:")
    print(f"  串口: {settings.MODBUS_PORT}")
    print(f"  波特率: {settings.MODBUS_BAUDRATE}")
    print(f"  从站地址: {settings.MODBUS_SLAVE_ID}")
    print(f"  校验位: {settings.MODBUS_PARITY}")
    print(f"  停止位: {settings.MODBUS_STOPBITS}")
    print(f"  数据位: {settings.MODBUS_BYTESIZE}")
    print(f"  超时时间: {settings.MODBUS_TIMEOUT}秒")
    print(f"  使用 Modbus: {settings.USE_MODBUS}")
    
    print("\n正在尝试连接...")
    client = modbus_service._get_client()
    
    if modbus_service._is_connected:
        print("[OK] ModbusRTU 连接成功！")
        return True
    else:
        print("[FAIL] ModbusRTU 连接失败！")
        print("  请检查:")
        print("  1. 串口是否正确（Windows: COM1-COM256, Linux: /dev/ttyUSB0）")
        print("  2. 串口是否被其他程序占用")
        print("  3. 波特率、校验位等参数是否匹配")
        print("  4. 设备是否已上电并正常工作")
        return False


def test_read_input_registers():
    """测试读取输入寄存器（只读数据）"""
    print("=" * 60)
    print("测试 2: 读取输入寄存器（实时状态数据）")
    print("=" * 60)
    
    if not modbus_service._is_connected:
        print("[FAIL] 未连接，跳过测试")
        return
    
    # 测试读取故障信息
    print("\n[1] 读取故障信息 (5000):")
    fault = modbus_service.read_fault_info()
    if fault is not None:
        print(f"  故障代码: {fault} (0x{fault:04X})")
        if fault == 0:
            print("  [OK] 无故障")
        else:
            print("  [WARN] 存在故障，请查看手册了解故障代码含义")
    else:
        print("  [FAIL] 读取失败")
    
    # 测试读取转速
    print("\n[2] 读取实时转速 (5001-5002):")
    rpm = modbus_service.read_rpm()
    if rpm is not None:
        print(f"  转速: {rpm:.2f} RPM")
    else:
        print("  [FAIL] 读取失败")
    
    # 测试读取温度
    print("\n[3] 读取实时温度 (5008):")
    temp = modbus_service.read_temperature()
    if temp is not None:
        print(f"  温度: {temp:.1f} °C")
    else:
        print("  [FAIL] 读取失败")
    
    # 测试读取电流
    print("\n[4] 读取实时电机电流 (5006):")
    current = modbus_service.read_motor_current()
    if current is not None:
        print(f"  电流: {current:.3f} A")
    else:
        print("  [FAIL] 读取失败")
    
    # 测试读取转矩（基于5006寄存器电流）
    print("\n[4.1] 读取实时转矩（基于5006寄存器电流）:")
    torque = modbus_service.read_torque()
    if torque is not None:
        print(f"  转矩: {torque:.3f} Nm")
        if current is not None:
            ratio = settings.TORQUE_CURRENT_RATIO
            print(f"  (电流: {current:.3f} A × 系数 {ratio} = {torque:.3f} Nm)")
    else:
        print("  [FAIL] 读取失败")
    
    # 测试读取电压
    print("\n[5] 读取实时输入电压 (5005):")
    voltage = modbus_service.read_voltage()
    if voltage is not None:
        print(f"  电压: {voltage:.2f} V")
    else:
        print("  [FAIL] 读取失败")
    
    # 测试读取功率
    print("\n[6] 读取实时功率 (5004):")
    power = modbus_service.read_power()
    if power is not None:
        print(f"  功率: {power:.2f} W")
    else:
        print("  [FAIL] 读取失败")
    
    # 测试读取位置
    print("\n[7] 读取实时位置 (5010-5011):")
    position = modbus_service.read_position()
    if position is not None:
        print(f"  位置: {position:.2f} °")
    else:
        print("  [FAIL] 读取失败")
    
    # 测试读取占空比
    print("\n[8] 读取实时占空比 (5003):")
    duty = modbus_service.read_duty_cycle()
    if duty is not None:
        print(f"  占空比: {duty:.0f}")
    else:
        print("  [FAIL] 读取失败")


def test_read_holding_registers():
    """测试读取保持寄存器（可读写参数）"""
    print("=" * 60)
    print("测试 3: 读取保持寄存器（控制参数）")
    print("=" * 60)
    
    if not modbus_service._is_connected:
        print("[FAIL] 未连接，跳过测试")
        return
    
    # 读取心跳寄存器
    print("\n[1] 读取心跳寄存器 (6000):")
    regs = modbus_service._read_holding_registers(settings.REG_HOLDING_HEARTBEAT, 1)
    if regs:
        print(f"  心跳值: {regs[0]}")
    else:
        print("  [FAIL] 读取失败")
    
    # 读取控制模式
    print("\n[2] 读取控制模式 (6001):")
    regs = modbus_service._read_holding_registers(settings.REG_HOLDING_MODE, 1)
    if regs:
        mode = regs[0]
        mode_names = {
            0: "电流",
            1: "转速",
            2: "占空比",
            3: "绝对位置",
            4: "相对上次目标",
            5: "相对当前位置",
            6: "刹车",
            7: "手刹",
            8: "回零",
            9: "中止回零",
            10: "电流爬升",
            0xFFFF: "空模式"
        }
        mode_name = mode_names.get(mode, f"未知模式({mode})")
        print(f"  控制模式: {mode} ({mode_name})")
    else:
        print("  [FAIL] 读取失败")


def test_write_operations():
    """测试写入操作"""
    print("=" * 60)
    print("测试 4: 写入操作测试")
    print("=" * 60)
    
    if not modbus_service._is_connected:
        print("[FAIL] 未连接，跳过测试")
        return
    
    # 测试发送心跳
    print("\n[1] 发送心跳包 (6000):")
    success = modbus_service.send_heartbeat()
    if success:
        print("  [OK] 心跳包发送成功")
    else:
        print("  [FAIL] 心跳包发送失败")
    
    time.sleep(0.1)
    
    # 测试读取心跳值确认
    regs = modbus_service._read_holding_registers(settings.REG_HOLDING_HEARTBEAT, 1)
    if regs:
        print(f"  当前心跳值: {regs[0]}")
    
    # 注意：其他写入操作（如设置模式、电流等）可能会改变驱动器状态
    # 这里只测试心跳，其他操作需要谨慎测试
    print("\n[WARN] 注意: 其他写入操作（设置模式、电流、转速等）可能会改变驱动器状态")
    print("  如需测试，请手动调用相应函数，并确保了解操作后果")


def test_motor_status():
    """测试读取电机状态（综合数据）"""
    print("=" * 60)
    print("测试 5: 读取电机状态（综合数据）")
    print("=" * 60)
    
    if not modbus_service._is_connected:
        print("[FAIL] 未连接，跳过测试")
        return
    
    status = modbus_service.read_motor_status()
    if status:
        print("\n电机状态数据:")
        print(f"  转速: {status.get('rpm', 'N/A'):.2f} RPM")
        print(f"  转矩: {status.get('torque', 'N/A'):.2f} N·m")
        print(f"  负载: {status.get('load', 'N/A'):.2f} %")
        print(f"  温度: {status.get('temperature', 'N/A'):.1f} °C")
    else:
        print("[FAIL] 读取失败")


def test_continuous_read():
    """测试连续读取（模拟实时监控）"""
    print("=" * 60)
    print("测试 6: 连续读取测试（模拟实时监控）")
    print("=" * 60)
    
    if not modbus_service._is_connected:
        print("[FAIL] 未连接，跳过测试")
        return
    
    print("\n开始连续读取，按 Ctrl+C 停止...")
    print("时间\t\t转速(RPM)\t温度(°C)\t电流(A)\t电压(V)")
    print("-" * 60)
    
    try:
        for i in range(10):  # 读取10次
            rpm = modbus_service.read_rpm()
            temp = modbus_service.read_temperature()
            current = modbus_service.read_motor_current()
            voltage = modbus_service.read_voltage()
            
            timestamp = time.strftime("%H:%M:%S")
            rpm_str = f"{rpm:.2f}" if rpm is not None else "N/A"
            temp_str = f"{temp:.1f}" if temp is not None else "N/A"
            current_str = f"{current:.3f}" if current is not None else "N/A"
            voltage_str = f"{voltage:.2f}" if voltage is not None else "N/A"
            
            print(f"{timestamp}\t{rpm_str}\t\t{temp_str}\t\t{current_str}\t{voltage_str}")
            
            time.sleep(1)  # 每秒读取一次
            
    except KeyboardInterrupt:
        print("\n\n已停止连续读取")


def main():
    """主测试函数"""
    parser = argparse.ArgumentParser(description='ModbusRTU 功能测试程序')
    parser.add_argument('--skip-warning', action='store_true', help='跳过 USE_MODBUS 警告')
    parser.add_argument('--skip-continuous', action='store_true', help='跳过连续读取测试')
    args = parser.parse_args()
    
    print("\n" + "=" * 60)
    print("ModbusRTU 功能测试程序")
    print("=" * 60)
    
    # 检查配置
    if not settings.USE_MODBUS:
        print("\n[WARN] 警告: USE_MODBUS 设置为 False")
        print("  请在 .env 文件中设置 XMOTOR_USE_MODBUS=true")
        print("  或修改 config.py 中的默认值")
        if not args.skip_warning:
            try:
                response = input("\n是否继续测试？(y/n): ")
                if response.lower() != 'y':
                    return
            except (EOFError, KeyboardInterrupt):
                print("\n跳过交互式输入，继续测试...")
    
    try:
        # 测试连接
        if not test_connection():
            print("\n连接失败，无法继续测试")
            return
        
        print_separator()
        
        # 测试读取输入寄存器
        test_read_input_registers()
        
        print_separator()
        
        # 测试读取保持寄存器
        test_read_holding_registers()
        
        print_separator()
        
        # 测试写入操作
        test_write_operations()
        
        print_separator()
        
        # 测试读取电机状态
        test_motor_status()
        
        print_separator()
        
        # 询问是否进行连续读取测试
        if not args.skip_continuous:
            try:
                response = input("是否进行连续读取测试？(y/n): ")
                if response.lower() == 'y':
                    test_continuous_read()
            except (EOFError, KeyboardInterrupt):
                print("\n跳过连续读取测试")
        
        print_separator()
        print("所有测试完成！")
        
    except KeyboardInterrupt:
        print("\n\n测试被用户中断")
    except Exception as e:
        print(f"\n[FAIL] 测试过程中发生错误: {e}")
        import traceback
        traceback.print_exc()
    finally:
        # 关闭连接
        print("\n正在关闭 Modbus 连接...")
        modbus_service.close()
        print("已关闭连接")


if __name__ == "__main__":
    main()

