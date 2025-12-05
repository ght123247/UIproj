import { useState, useEffect } from "react"
import { GaugeCard } from "./GaugeCard"
import { MiniChartCard } from "./MiniChartCard"
import { 
  Thermometer, 
  Gauge, 
  Vibrate, 
  Activity, 
  BarChart3,
  Wifi,
  WifiOff
} from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface MetricData {
  value: number
  history: Array<{ time: string; value: number }>
}

interface DashboardData {
  rpm: MetricData
  torque: MetricData
  temperature: MetricData
  load: MetricData
  vibrationFreq: MetricData
  amplitude: MetricData
  rms: MetricData
}

function generateRandomValue(min: number, max: number, current?: number): number {
  if (current === undefined) {
    return Math.random() * (max - min) + min
  }
  const change = (Math.random() - 0.5) * (max - min) * 0.1
  return Math.max(min, Math.min(max, current + change))
}

function generateTimeLabel(index: number, total: number): string {
  const minutesAgo = total - index - 1
  if (minutesAgo === 0) return "now"
  return `${minutesAgo}m`
}

function initializeHistory(maxValue: number, length: number = 20): Array<{ time: string; value: number }> {
  return Array.from({ length }, (_, i) => ({
    time: generateTimeLabel(i, length),
    value: generateRandomValue(maxValue * 0.7, maxValue * 0.95),
  }))
}

export function Dashboard() {
  const [data, setData] = useState<DashboardData>(() => ({
    rpm: {
      value: 2450,
      history: initializeHistory(3000, 20),
    },
    torque: {
      value: 125.5,
      history: initializeHistory(200, 20),
    },
    temperature: {
      value: 72.3,
      history: initializeHistory(100, 15),
    },
    load: {
      value: 68.2,
      history: initializeHistory(100, 15),
    },
    vibrationFreq: {
      value: 45.8,
      history: initializeHistory(60, 15),
    },
    amplitude: {
      value: 2.3,
      history: initializeHistory(5, 15),
    },
    rms: {
      value: 1.8,
      history: initializeHistory(3, 15),
    },
  }))

  const [isOnline] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Update data every 2 seconds
    const dataInterval = setInterval(() => {
      setData((prev) => {
        const updateHistory = (history: Array<{ time: string; value: number }>, newValue: number) => {
          const newHistory = [...history.slice(1), { time: "now", value: newValue }]
          return newHistory.map((item, i) => ({
            ...item,
            time: generateTimeLabel(i, newHistory.length),
          }))
        }

        const newRpmValue = generateRandomValue(2000, 2800, prev.rpm.value)
        const newTorqueValue = generateRandomValue(100, 180, prev.torque.value)
        const newTempValue = generateRandomValue(65, 85, prev.temperature.value)
        const newLoadValue = generateRandomValue(50, 85, prev.load.value)
        const newVibFreqValue = generateRandomValue(35, 55, prev.vibrationFreq.value)
        const newAmpValue = generateRandomValue(1.5, 3.5, prev.amplitude.value)
        const newRmsValue = generateRandomValue(1.2, 2.5, prev.rms.value)

        return {
          rpm: {
            value: newRpmValue,
            history: updateHistory(prev.rpm.history, newRpmValue),
          },
          torque: {
            value: newTorqueValue,
            history: updateHistory(prev.torque.history, newTorqueValue),
          },
          temperature: {
            value: newTempValue,
            history: updateHistory(prev.temperature.history, newTempValue),
          },
          load: {
            value: newLoadValue,
            history: updateHistory(prev.load.history, newLoadValue),
          },
          vibrationFreq: {
            value: newVibFreqValue,
            history: updateHistory(prev.vibrationFreq.history, newVibFreqValue),
          },
          amplitude: {
            value: newAmpValue,
            history: updateHistory(prev.amplitude.history, newAmpValue),
          },
          rms: {
            value: newRmsValue,
            history: updateHistory(prev.rms.history, newRmsValue),
          },
        }
      })
    }, 2000)

    return () => {
      clearInterval(timeInterval)
      clearInterval(dataInterval)
    }
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-[#0f1115] text-white">
      {/* Top Bar */}
      <div className="border-b border-[#2a2d33] bg-[#1a1d22] px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Industrial Monitoring Dashboard</h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              {isOnline ? (
                <>
                  <Wifi className="h-5 w-5 text-green-500" />
                  <span className="text-green-500 font-medium">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-5 w-5 text-red-500" />
                  <span className="text-red-500 font-medium">Offline</span>
                </>
              )}
            </div>
            <Separator orientation="vertical" className="h-6 bg-[#2a2d33]" />
            <div className="text-gray-400 font-mono">
              {formatTime(currentTime)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Large Cards */}
          <GaugeCard
            title="RPM"
            value={data.rpm.value}
            maxValue={3000}
            unit="rpm"
            color="blue"
            chartData={data.rpm.history}
          />
          <GaugeCard
            title="Torque"
            value={data.torque.value}
            maxValue={6000}
            unit="mNm"
            color="orange"
            chartData={data.torque.history}
          />
        </div>

        {/* Small Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <MiniChartCard
            title="Temperature"
            value={data.temperature.value}
            unit="°C"
            icon={Thermometer}
            chartData={data.temperature.history}
            color="#46e0c7"
          />
          <MiniChartCard
            title="Load"
            value={data.load.value}
            unit="%"
            icon={Gauge}
            chartData={data.load.history}
            color="#e04671"
          />
          <MiniChartCard
            title="Vibration Freq"
            value={data.vibrationFreq.value}
            unit="Hz"
            icon={Vibrate}
            chartData={data.vibrationFreq.history}
            color="#46e0c7"
          />
          <MiniChartCard
            title="Amplitude"
            value={data.amplitude.value}
            unit="mm"
            icon={Activity}
            chartData={data.amplitude.history}
            color="#e04671"
          />
          <MiniChartCard
            title="RMS"
            value={data.rms.value}
            unit="mm/s"
            icon={BarChart3}
            chartData={data.rms.history}
            color="#46e0c7"
          />
        </div>
      </div>
    </div>
  )
}
