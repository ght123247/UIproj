"""
测试转矩计算
验证从电流到转矩的转换是否正确
"""
import sys
from pathlib import Path

backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from app.services.modbus_service import modbus_service
from app.core.config import settings


def test_torque_calculation():
    """测试转矩计算"""
    print("=" * 60)
    print("转矩计算测试")
    print("=" * 60)
    
    print(f"\n配置信息:")
    print(f"  转换系数 (TORQUE_CURRENT_RATIO): {settings.TORQUE_CURRENT_RATIO}")
    print(f"  预期关系: 每安培 400 mN·m = 0.4 N·m/A")
    
    # 检查连接
    if not modbus_service._is_connected:
        print("\n[1] 尝试连接 Modbus...")
        client = modbus_service._get_client()
        if not modbus_service._is_connected:
            print("  [FAIL] 连接失败")
            return
    
    print("\n[2] 读取电流和转矩:")
    
    # 读取电流
    current = modbus_service.read_motor_current()
    if current is None:
        print("  [FAIL] 无法读取电流")
        return
    
    print(f"  电流: {current:.6f} A")
    print(f"  电流绝对值: {abs(current):.6f} A")
    
    # 读取转矩
    torque = modbus_service.read_torque()
    if torque is None:
        print("  [FAIL] 无法读取转矩")
        return
    
    print(f"  转矩: {torque:.6f} N·m")
    print(f"  转矩: {torque * 1000:.2f} mN·m")
    
    # 验证计算
    print(f"\n[3] 验证计算:")
    expected_torque = abs(current) * settings.TORQUE_CURRENT_RATIO
    print(f"  计算: {abs(current):.6f} A × {settings.TORQUE_CURRENT_RATIO} = {expected_torque:.6f} N·m")
    print(f"  实际: {torque:.6f} N·m")
    
    if abs(torque - expected_torque) < 0.0001:
        print("  [OK] 计算正确")
    else:
        print(f"  [WARN] 计算不一致，差异: {abs(torque - expected_torque):.6f} N·m")
    
    # 读取完整状态
    print(f"\n[4] 读取完整电机状态:")
    status = modbus_service.read_motor_status()
    if status:
        print(f"  转速: {status.get('rpm', 'N/A'):.2f} RPM")
        print(f"  转矩: {status.get('torque', 'N/A'):.6f} N·m = {status.get('torque', 0) * 1000:.2f} mN·m")
        print(f"  负载: {status.get('load', 'N/A'):.2f} %")
        print(f"  温度: {status.get('temperature', 'N/A'):.1f} °C")
    
    # 诊断
    print(f"\n[5] 诊断:")
    if current == 0.0:
        print("  [INFO] 电流为 0，这可能是正常的（电机未运行）")
    elif abs(current) < 0.01:
        print(f"  [INFO] 电流很小 ({current:.6f}A)，转矩也会很小")
        print(f"  当前转矩: {torque * 1000:.2f} mN·m")
    elif torque * 1000 < 1.0:
        print(f"  [WARN] 转矩值很小: {torque * 1000:.2f} mN·m")
        print(f"  如果前端显示为0，可能是显示精度问题")
    else:
        print(f"  [OK] 转矩值正常: {torque * 1000:.2f} mN·m")
    
    print("\n" + "=" * 60)
    print("测试完成")
    print("=" * 60)


if __name__ == "__main__":
    try:
        test_torque_calculation()
    except KeyboardInterrupt:
        print("\n\n测试被用户中断")
    except Exception as e:
        print(f"\n[FAIL] 测试过程中发生错误: {e}")
        import traceback
        traceback.print_exc()
    finally:
        modbus_service.close()

