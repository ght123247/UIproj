import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { API_ENDPOINTS } from "@/lib/api"

// Motor Status Card Component
function MotorStatusCard() {
  const [data, setData] = useState({
    rpm: 0,
    torque: 0,
    load: 0,
    temperature: 0,
    power: 0,
  })
  const [isConnected, setIsConnected] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null

    const fetchData = async () => {
      // 取消之前的请求，避免请求堆积
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      
      abortControllerRef.current = new AbortController()
      
      try {
        const response = await fetch(API_ENDPOINTS.CONTROL_LATEST, {
          signal: abortControllerRef.current.signal,
        })
        if (response.ok) {
          const result = await response.json()
          if (result.motor_status) {
            // 后端返回的转矩单位是 N·m，前端显示为 mN·m（乘以1000）
            const torqueNm = result.motor_status.torque || 0
            const torqueMnm = torqueNm * 1000
            
            setData({
              rpm: result.motor_status.rpm,
              torque: torqueMnm,
              load: result.motor_status.load,
              temperature: result.motor_status.temperature,
              power: result.motor_status.power || 0,
            })
            setIsConnected(true)
          }
        } else {
          setIsConnected(false)
        }
      } catch (error: any) {
        // 忽略取消请求的错误
        if (error.name !== 'AbortError') {
          console.error("Failed to fetch motor status:", error)
          setIsConnected(false)
        }
      }
    }

    // Fetch immediately
    fetchData()

    // Then fetch every 100ms (10Hz) to match backend update frequency
    intervalId = setInterval(fetchData, 100)

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
      // 清理时取消pending请求
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const MetricRow = ({ label, value, max, unit, isOrange }: any) => (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex justify-between items-center mb-2 text-xs">
        <span className="text-neutral-400 font-medium">{label}</span>
        <span className={isOrange ? "text-orange-500 font-mono font-bold" : "text-blue-500 font-mono font-bold"}>
          {Math.round(value)} {unit}
        </span>
      </div>
      <div className="flex-1 w-full bg-neutral-800 rounded-md overflow-hidden border border-neutral-700">
        <div
          className={`h-full ${isOrange ? "bg-orange-500" : "bg-blue-500"} transition-all duration-500 flex items-center justify-end pr-2`}
          style={{ width: `${Math.min(100, Math.max(0, (value / max) * 100))}%` }}
        >
          {value > 0 && (
            <span className={`text-xs font-bold ${isOrange ? "text-orange-900" : "text-blue-900"}`}>
              {Math.round((value / max) * 100)}%
            </span>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <Card className="bg-neutral-900 border border-neutral-700 shadow-lg h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold text-white tracking-widest">MOTOR STATUS</CardTitle>
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} title={isConnected ? "Connected" : "Disconnected"}></div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3 min-h-0">
        {!isConnected && data.rpm === 0 ? (
          <div className="text-center text-neutral-500 text-xs py-8">Waiting for backend connection...</div>
        ) : (
          <>
            <MetricRow label="RPM" value={data.rpm} max={6000} unit="rpm" isOrange={true} />
            <MetricRow label="TORQUE" value={data.torque} max={6000} unit="mN·m" isOrange={false} />
            <MetricRow label="POWER" value={data.power} max={1000} unit="W" isOrange={true} />
            <MetricRow label="LOAD" value={data.load} max={100} unit="%" isOrange={false} />
            <MetricRow label="TEMPERATURE" value={data.temperature} max={100} unit="°C" isOrange={true} />
          </>
        )}
      </CardContent>
    </Card>
  )
}

// Vibration & Health Metrics Card Component
function VibrationMetricsCard() {
  const [data, setData] = useState({
    frequency: 0,
    amplitude: 0,
    rms: 0,
    impactCount: 0,
    healthIndex: 0,
    toolWear: 0,
  })
  const [isConnected, setIsConnected] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null

    const fetchData = async () => {
      // 取消之前的请求，避免请求堆积
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      
      abortControllerRef.current = new AbortController()
      
      try {
        const response = await fetch(API_ENDPOINTS.CONTROL_LATEST, {
          signal: abortControllerRef.current.signal,
        })
        if (response.ok) {
          const result = await response.json()
          if (result.vibration_metrics) {
            setData({
              frequency: result.vibration_metrics.main_freq,
              amplitude: result.vibration_metrics.amplitude,
              rms: result.vibration_metrics.rms,
              impactCount: result.vibration_metrics.impulse_count,
              healthIndex: result.vibration_metrics.health_index || 0,
              toolWear: result.vibration_metrics.tool_wear || 0,
            })
            setIsConnected(true)
          }
        } else {
          setIsConnected(false)
        }
      } catch (error: any) {
        // 忽略取消请求的错误
        if (error.name !== 'AbortError') {
          console.error("Failed to fetch vibration metrics:", error)
          setIsConnected(false)
        }
      }
    }

    // Fetch immediately
    fetchData()

    // Then fetch every 100ms (10Hz) to match backend update frequency
    intervalId = setInterval(fetchData, 100)

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
      // 清理时取消pending请求
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const MetricRow = ({ label, value, max, unit, isOrange }: any) => (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex justify-between items-center mb-2 text-xs">
        <span className="text-neutral-400 font-medium">{label}</span>
        <span className={isOrange ? "text-orange-500 font-mono font-bold" : "text-blue-500 font-mono font-bold"}>
          {typeof value === 'number' ? (unit === '%' ? value.toFixed(1) : value.toFixed(unit === 'Hz' ? 2 : 2)) : value} {unit}
        </span>
      </div>
      <div className="flex-1 w-full bg-neutral-800 rounded-md overflow-hidden border border-neutral-700">
        <div
          className={`h-full ${isOrange ? "bg-orange-500" : "bg-blue-500"} transition-all duration-500 flex items-center justify-end pr-2`}
          style={{ width: `${Math.min(100, Math.max(0, (value / max) * 100))}%` }}
        >
          {value > 0 && (
            <span className={`text-xs font-bold ${isOrange ? "text-orange-900" : "text-blue-900"}`}>
              {Math.round((value / max) * 100)}%
            </span>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <Card className="bg-neutral-900 border border-neutral-700 shadow-lg h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold text-white tracking-widest">VIBRATION & HEALTH METRICS</CardTitle>
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} title={isConnected ? "Connected" : "Disconnected"}></div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3 min-h-0">
        {!isConnected && data.frequency === 0 ? (
          <div className="text-center text-neutral-500 text-xs py-8">Waiting for backend connection...</div>
        ) : (
          <>
            <MetricRow label="Main Frequency" value={data.frequency} max={500} unit="Hz" isOrange={false} />
            <MetricRow label="Amplitude" value={data.amplitude} max={1.0} unit="" isOrange={true} />
            <MetricRow label="RMS" value={data.rms} max={1.0} unit="" isOrange={false} />
            <MetricRow label="Impact Count" value={data.impactCount} max={100} unit="" isOrange={true} />
            <MetricRow label="Health Index" value={data.healthIndex} max={100} unit="%" isOrange={false} />
            <MetricRow label="Tool Wear" value={data.toolWear} max={100} unit="%" isOrange={true} />
          </>
        )}
      </CardContent>
    </Card>
  )
}

// Control Panel Card Component
function ControlPanelCard() {
  const [speedMode, setSpeedMode] = useState(false)
  const [torqueMode, setTorqueMode] = useState(false)
  const [targetRpm, setTargetRpm] = useState(2500)
  const [targetTorque, setTargetTorque] = useState(0)
  const [selectedSerial, setSelectedSerial] = useState(1)

  // 根据序列号获取型号
  const getMotorModel = (serial: number): string => {
    if (serial >= 1 && serial <= 10) return "S350"
    if (serial >= 11 && serial <= 20) return "S525"
    if (serial >= 21 && serial <= 30) return "S550"
    return "S650"
  }

  // 格式化序列号显示
  const formatSerial = (num: number): string => {
    return `#${String(num).padStart(5, "0")}`
  }

  // 生成序列号选项（1-100）
  const serialOptions = Array.from({ length: 100 }, (_, i) => i + 1)

  const handleSet = async () => {
    // Determine mode based on which button is active
    const mode = speedMode ? "speed" : torqueMode ? "torque" : "speed" // Default to speed if neither selected
    
    // Prepare request payload
    const payload: any = {
      mode: mode,
    }
    
    if (mode === "speed") {
      payload.target_rpm = targetRpm
      payload.target_torque = null
    } else if (mode === "torque") {
      payload.target_rpm = null
      // Convert from slider range (0-6000 mN·m) to backend range (0-6 N·m)
      // 前端单位是 mN·m，后端单位是 N·m，需要除以1000
      payload.target_torque = targetTorque / 1000
    }

    try {
      const response = await fetch(API_ENDPOINTS.CONTROL_SET_PARAMETERS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        await response.json()
      } else {
        const error = await response.json()
        console.error("Failed to send control parameters:", error)
      }
    } catch (error) {
      console.error("Error sending control parameters:", error)
    }
  }

  const handleStop = async () => {
    // STOP 按钮：发送目标转速和目标电流都为0，使电机停止
    // 这样无论当前是什么模式都可以使电机停止
    const payload = {
      mode: "speed", // 使用转速模式，设置转速为0
      target_rpm: 0,
      target_torque: 0, // 同时设置转矩为0（对应电流为0）
    }

    try {
      const response = await fetch(API_ENDPOINTS.CONTROL_SET_PARAMETERS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        await response.json()
        // 重置滑块到0
        setTargetRpm(0)
        setTargetTorque(0)
      } else {
        const error = await response.json()
        console.error("Failed to send stop command:", error)
      }
    } catch (error) {
      console.error("Error sending stop command:", error)
    }
  }

  return (
    <Card className="bg-neutral-900 border border-neutral-700 shadow-lg h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold text-white tracking-widest">CONTROL PANEL</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex-1">
        {/* Motor 序列号选择 */}
        <div className="space-y-2">
          <label className="text-xs text-neutral-400 block">MOTOR SERIAL</label>
          <div className="flex items-center gap-2">
            <select
              value={selectedSerial}
              onChange={(e) => setSelectedSerial(Number.parseInt(e.target.value))}
              className="flex-1 bg-neutral-800 border border-neutral-600 text-white text-xs px-3 py-2 rounded focus:outline-none focus:border-orange-500"
            >
              {serialOptions.map((num) => (
                <option key={num} value={num}>
                  {formatSerial(num)}
                </option>
              ))}
            </select>
            <div className="bg-neutral-800 border border-neutral-600 text-orange-500 text-xs font-bold px-3 py-2 rounded min-w-[60px] text-center">
              {getMotorModel(selectedSerial)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setSpeedMode(true)
              setTorqueMode(false)
            }}
            className={`py-2 px-3 rounded text-xs font-bold transition-all ${
              speedMode
                ? "bg-orange-500 text-white border border-orange-400"
                : "bg-neutral-800 text-neutral-300 border border-neutral-600 hover:border-orange-500"
            }`}
          >
            SPEED MODE
          </button>
          <button
            onClick={() => {
              setTorqueMode(true)
              setSpeedMode(false)
            }}
            className={`py-2 px-3 rounded text-xs font-bold transition-all ${
              torqueMode
                ? "bg-blue-500 text-white border border-blue-400"
                : "bg-neutral-800 text-neutral-300 border border-neutral-600 hover:border-blue-500"
            }`}
          >
            TORQUE MODE
          </button>
        </div>

        <div className="space-y-2">
          <div>
            <label className="text-xs text-neutral-400 block mb-2">Target RPM: {targetRpm}</label>
            <input
              type="range"
              min="0"
              max="8000"
              value={targetRpm}
              onChange={(e) => setTargetRpm(Number.parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs text-neutral-400 block mb-2">Target Torque: {targetTorque} mN·m</label>
            <input
              type="range"
              min="0"
              max="6000"
              value={targetTorque}
              onChange={(e) => setTargetTorque(Number.parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleSet}
            className="py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded border-2 border-orange-400 transition-all shadow-lg hover:shadow-orange-500/50"
          >
            SET
          </button>
          <button
            onClick={handleStop}
            className="py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded border-2 border-red-500 transition-all shadow-lg hover:shadow-red-600/50"
          >
            STOP
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

// Activity Overview Card Component
function ActivityOverviewCard() {
  const [chartData, setChartData] = useState<Array<{ time: number; rpm: number; torque: number }>>([])
  const [isConnected, setIsConnected] = useState(false)
  
  // 使用 useRef 存储数据，避免每次渲染创建新数组
  const dataPointsRef = useRef<Array<{ time: number; rpm: number; torque: number; timestamp: number }>>([])
  const lastDataRef = useRef({ rpm: 0, torque: 0 })
  const abortControllerRef = useRef<AbortController | null>(null)
  const chartDataLengthRef = useRef(0) // 跟踪当前图表数据长度，避免闭包问题

  useEffect(() => {
    let fetchIntervalId: ReturnType<typeof setInterval> | null = null
    let updateIntervalId: ReturnType<typeof setInterval> | null = null
    
    // 从后端获取数据（每100ms获取一次，10Hz频率）
    const fetchData = async () => {
      // 取消之前的请求，避免请求堆积
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      
      abortControllerRef.current = new AbortController()
      
      try {
        const response = await fetch(API_ENDPOINTS.CONTROL_LATEST, {
          signal: abortControllerRef.current.signal,
        })
        if (response.ok) {
          const result = await response.json()
          if (result.motor_status) {
            // RPM 范围 0~8000（直接使用，确保在范围内）
            const rpm = Math.max(0, Math.min(8000, result.motor_status.rpm))
            
            // Torque 后端返回单位为 N·m，前端显示为 mN·m（乘以1000）
            // 范围 0~6000 mN·m（对应 0~6 N·m）
            const torqueNm = result.motor_status.torque || 0
            const torque = Math.max(0, Math.min(6000, torqueNm * 1000))
            
            lastDataRef.current = { rpm, torque }
            setIsConnected(true)
          }
        } else {
          setIsConnected(false)
        }
      } catch (error: any) {
        // 忽略取消请求的错误
        if (error.name !== 'AbortError') {
          console.error("Failed to fetch activity data:", error)
          setIsConnected(false)
        }
      }
    }

    // 更新图表数据（每100ms更新一次，10Hz频率）
    const updateChart = () => {
      const now = Date.now()
      const dataPoints = dataPointsRef.current
      const lastData = lastDataRef.current
      
      // 只在数据真正变化时才添加新数据点（避免重复数据）
      const hasDataChanged = 
        dataPoints.length === 0 || 
        dataPoints[dataPoints.length - 1].rpm !== lastData.rpm ||
        dataPoints[dataPoints.length - 1].torque !== lastData.torque
      
      if (hasDataChanged) {
        // 添加新数据点（使用最新的数据）
        dataPoints.push({
          time: 0, // 临时值，稍后会重新计算
          rpm: lastData.rpm,
          torque: lastData.torque,
          timestamp: now,
        })
      } else {
        // 如果数据没变化，只更新时间戳（用于滑动窗口）
        if (dataPoints.length > 0) {
          dataPoints[dataPoints.length - 1].timestamp = now
        }
      }
      
      // 移除超过10秒的旧数据
      const tenSecondsAgo = now - 10000 // 10秒 = 10000毫秒
      while (dataPoints.length > 0 && dataPoints[0].timestamp < tenSecondsAgo) {
        dataPoints.shift()
      }
      
      // 严格限制最大数据点数量（最多100个点，对应10秒@10Hz）
      const MAX_POINTS = 100
      if (dataPoints.length > MAX_POINTS) {
        dataPoints.splice(0, dataPoints.length - MAX_POINTS)
      }
      
      // 只在有数据变化时才更新图表（避免不必要的重新渲染）
      if (hasDataChanged) {
        // 重新计算所有数据点的相对时间（相对于当前时间，范围从-10到0）
        // 重用数组
        const updatedData: Array<{ time: number; rpm: number; torque: number }> = []
        updatedData.length = dataPoints.length // 预分配数组大小
        for (let i = 0; i < dataPoints.length; i++) {
          const point = dataPoints[i]
          const ageSeconds = (now - point.timestamp) / 1000
          updatedData[i] = {
            time: -ageSeconds, // 负数表示历史时间，0表示当前
            rpm: point.rpm,
            torque: point.torque,
          }
        }
        
        // 更新图表数据（使用函数式更新，避免闭包问题）
        chartDataLengthRef.current = dataPoints.length
        setChartData(() => updatedData)
      } else if (dataPoints.length > 0) {
        // 即使数据没变化，也需要更新时间轴（但降低频率）
        // 只在数据点数量变化时才更新（避免频繁更新）
        if (chartDataLengthRef.current !== dataPoints.length) {
          const updatedData: Array<{ time: number; rpm: number; torque: number }> = []
          updatedData.length = dataPoints.length
          for (let i = 0; i < dataPoints.length; i++) {
            const point = dataPoints[i]
            const ageSeconds = (now - point.timestamp) / 1000
            updatedData[i] = {
              time: -ageSeconds,
              rpm: point.rpm,
              torque: point.torque,
            }
          }
          chartDataLengthRef.current = dataPoints.length
          setChartData(() => updatedData)
        }
      }
    }

    // 立即获取数据
    fetchData()

    // 每100ms从后端获取一次真实数据（10Hz频率）
    fetchIntervalId = setInterval(fetchData, 100)
    
    // 每100ms更新一次图表（10Hz频率，保持流畅）
    updateIntervalId = setInterval(updateChart, 100)

    return () => {
      if (fetchIntervalId) {
        clearInterval(fetchIntervalId)
      }
      if (updateIntervalId) {
        clearInterval(updateIntervalId)
      }
      // 清理时取消pending请求
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      // 清空数据点数组
      dataPointsRef.current = []
      chartDataLengthRef.current = 0
    }
  }, [])

  return (
    <Card className="bg-neutral-900 border border-neutral-700 shadow-lg h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold text-white tracking-widest">ACTIVITY OVERVIEW</CardTitle>
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} title={isConnected ? "Connected" : "Disconnected"}></div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        {!isConnected && chartData.length === 0 ? (
          <div className="text-center text-neutral-500 text-xs py-8">Waiting for backend connection...</div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart 
              data={chartData} 
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillRpm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e04671" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#e04671" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="fillTorque" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#46e0c7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#46e0c7" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF" 
                style={{ fontSize: "11px" }}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[-10, 0]}
                type="number"
                scale="linear"
                tickCount={6}
                tickFormatter={(value) => {
                  return `${value.toFixed(1)}s`
                }}
              />
              <YAxis 
                yAxisId="rpm"
                stroke="#e04671" 
                style={{ fontSize: "11px" }}
                tickLine={false}
                axisLine={false}
                domain={[0, 8000]}
                tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
              />
              <YAxis 
                yAxisId="torque"
                orientation="right"
                stroke="#46e0c7" 
                style={{ fontSize: "11px" }}
                tickLine={false}
                axisLine={false}
                domain={[0, 6000]}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: "#1f2937", 
                  border: "1px solid #374151",
                  borderRadius: "6px"
                }}
                labelStyle={{ color: "#fff", fontSize: "12px" }}
                formatter={(value: number, name: string) => {
                  if (name === "rpm") {
                    return [`${value.toFixed(0)} RPM`, "RPM"]
                  } else if (name === "torque") {
                    return [`${value.toFixed(0)} mN·m`, "Torque"]
                  }
                  return [value, name]
                }}
                labelFormatter={(value) => `Time: ${value.toFixed(1)}s`}
              />
              <Area
                yAxisId="rpm"
                type="linear"
                dataKey="rpm"
                stroke="#e04671"
                strokeWidth={2}
                fill="url(#fillRpm)"
                fillOpacity={1}
                dot={false}
                activeDot={{ r: 4, fill: "#e04671" }}
              />
              <Area
                yAxisId="torque"
                type="linear"
                dataKey="torque"
                stroke="#46e0c7"
                strokeWidth={2}
                fill="url(#fillTorque)"
                fillOpacity={1}
                dot={false}
                activeDot={{ r: 4, fill: "#46e0c7" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

// Task Information Card Component
function TaskInformationCard() {
  const [tasks] = useState([
    {
      id: "TASK-2025-061",
      status: "RUNNING",
      duration: "02:45:32",
      operator: "SYSTEM-A",
      lastUpdate: "25/06/2025 14:23 UTC",
    },
    {
      id: "TASK-2025-102",
      status: "IDLE",
      duration: "00:00:00",
      operator: "OPERATOR-B",
      lastUpdate: "25/06/2025 13:45 UTC",
    },
    {
      id: "TASK-2025-13",
      status: "ERROR",
      duration: "01:22:15",
      operator: "SYSTEM-C",
      lastUpdate: "25/06/2025 12:30 UTC",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RUNNING":
        return "text-green-500"
      case "IDLE":
        return "text-neutral-400"
      case "ERROR":
        return "text-red-500"
      default:
        return "text-white"
    }
  }

  return (
    <Card className="bg-neutral-900 border border-neutral-700 shadow-lg h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold text-white tracking-widest">TASK INFORMATION</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="bg-neutral-800 p-3 rounded border border-neutral-700 text-xs">
              <div className="flex justify-between items-start mb-2">
                <span className="text-blue-500 font-mono">{task.id}</span>
                <span className={`font-bold ${getStatusColor(task.status)}`}>{task.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-neutral-400">
                <div>
                  <span className="text-neutral-500">Duration:</span> {task.duration}
                </div>
                <div>
                  <span className="text-neutral-500">Operator:</span> {task.operator}
                </div>
              </div>
              <div className="text-neutral-500 mt-2">{task.lastUpdate}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Main Dashboard Page
export default function CommandCenterPage() {
  return (
    <div className="p-4 bg-gradient-to-b from-neutral-950 to-neutral-900">
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Row 1: Three Cards */}
        <div className="lg:col-span-4 flex">
          <div className="w-full">
            <MotorStatusCard />
          </div>
        </div>
        <div className="lg:col-span-4 flex">
          <div className="w-full">
            <VibrationMetricsCard />
          </div>
        </div>
        <div className="lg:col-span-4 flex">
          <div className="w-full">
            <ControlPanelCard />
          </div>
        </div>

        {/* Row 2: Two Cards */}
        <div className="lg:col-span-7 flex">
          <div className="w-full">
            <ActivityOverviewCard />
          </div>
        </div>
        <div className="lg:col-span-5 flex">
          <div className="w-full">
            <TaskInformationCard />
          </div>
        </div>

      </div>
    </div>
  )
}
