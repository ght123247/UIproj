"""
转矩诊断脚本
用于诊断为什么转矩值总是0
"""
import sys
from pathlib import Path

# 添加项目根目录到 Python 路径
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from app.services.modbus_service import modbus_service
from app.core.config import settings


def diagnose_torque():
    """诊断转矩问题"""
    print("=" * 60)
    print("转矩诊断工具")
    print("=" * 60)
    
    print(f"\n配置信息:")
    print(f"  转矩转换系数 (TORQUE_CURRENT_RATIO): {settings.TORQUE_CURRENT_RATIO}")
    print(f"  电流寄存器地址 (REG_INPUT_MOTOR_CURRENT): {settings.REG_INPUT_MOTOR_CURRENT}")
    
    # 检查连接
    print(f"\n[1] 检查 Modbus 连接:")
    if not modbus_service._is_connected:
        print("  [FAIL] Modbus 未连接，尝试连接...")
        client = modbus_service._get_client()
        if not modbus_service._is_connected:
            print("  [FAIL] 连接失败，无法继续诊断")
            return
    
    print("  [OK] Modbus 已连接")
    
    # 读取原始寄存器值
    print(f"\n[2] 读取原始寄存器值 (地址 {settings.REG_INPUT_MOTOR_CURRENT}):")
    try:
        regs = modbus_service._read_input_registers(settings.REG_INPUT_MOTOR_CURRENT, 1)
        if regs:
            raw_value = regs[0]
            print(f"  原始寄存器值: {raw_value} (0x{raw_value:04X})")
            print(f"  数据类型: short (有符号16位整数)")
            
            # 处理有符号数
            if raw_value & 0x8000:  # 负数
                signed_value = raw_value - 0x10000
            else:
                signed_value = raw_value
            
            print(f"  有符号值: {signed_value}")
            print(f"  单位: 10mA")
            print(f"  转换后电流: {signed_value * 0.01:.3f} A")
        else:
            print("  [FAIL] 无法读取寄存器值")
            return
    except Exception as e:
        print(f"  [FAIL] 读取寄存器失败: {e}")
        return
    
    # 读取电流
    print(f"\n[3] 使用 read_motor_current() 读取电流:")
    current = modbus_service.read_motor_current()
    if current is not None:
        print(f"  电流值: {current:.6f} A")
        print(f"  电流绝对值: {abs(current):.6f} A")
    else:
        print("  [FAIL] 电流值为 None")
        return
    
    # 计算转矩
    print(f"\n[4] 计算转矩:")
    print(f"  公式: 转矩(Nm) = 电流(A) × 系数")
    print(f"  计算: {abs(current):.6f} A × {settings.TORQUE_CURRENT_RATIO} = {abs(current) * settings.TORQUE_CURRENT_RATIO:.6f} Nm")
    
    torque = modbus_service.read_torque()
    if torque is not None:
        print(f"  转矩值: {torque:.6f} Nm")
    else:
        print("  [FAIL] 转矩值为 None")
    
    # 诊断问题
    print(f"\n[5] 问题诊断:")
    if current == 0.0:
        print("  [问题] 电流值为 0，这可能是正常的（电机未运行）")
        print("  建议: 让电机运行后再测试")
    elif abs(current) < 0.001:
        print(f"  [问题] 电流值非常小 ({current:.6f}A)，转矩也会很小")
        print(f"  当前转矩: {torque:.6f} Nm")
        if torque < 0.0001:
            print("  [问题] 转矩值太小，可能在前端显示时被四舍五入为0")
            print(f"  建议: 增大转换系数 TORQUE_CURRENT_RATIO (当前: {settings.TORQUE_CURRENT_RATIO})")
    elif torque == 0.0:
        print(f"  [问题] 电流不为0 ({current:.6f}A) 但转矩为0")
        print(f"  这不应该发生，请检查代码逻辑")
    else:
        print(f"  [OK] 转矩计算正常: {torque:.6f} Nm")
        if torque < 0.01:
            print(f"  [注意] 转矩值较小，可能在前端显示时被四舍五入为0")
            print(f"  建议: 如果前端显示精度不够，可以增大转换系数")
    
    # 读取完整状态
    print(f"\n[6] 读取完整电机状态:")
    status = modbus_service.read_motor_status()
    if status:
        print(f"  转速: {status.get('rpm', 'N/A'):.2f} RPM")
        print(f"  转矩: {status.get('torque', 'N/A'):.6f} Nm")
        print(f"  负载: {status.get('load', 'N/A'):.2f} %")
        print(f"  温度: {status.get('temperature', 'N/A'):.1f} °C")
    else:
        print("  [FAIL] 无法读取电机状态")
    
    print("\n" + "=" * 60)
    print("诊断完成")
    print("=" * 60)


if __name__ == "__main__":
    try:
        diagnose_torque()
    except KeyboardInterrupt:
        print("\n\n诊断被用户中断")
    except Exception as e:
        print(f"\n[FAIL] 诊断过程中发生错误: {e}")
        import traceback
        traceback.print_exc()
    finally:
        modbus_service.close()

