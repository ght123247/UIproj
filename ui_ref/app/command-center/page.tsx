"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Motor Status Card Component
function MotorStatusCard() {
  const [data, setData] = useState({
    rpm: 2450,
    torque: 85,
    load: 72,
    temperature: 65,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => ({
        rpm: Math.max(1000, Math.min(3000, prev.rpm + (Math.random() - 0.5) * 100)),
        torque: Math.max(50, Math.min(100, prev.torque + (Math.random() - 0.5) * 10)),
        load: Math.max(30, Math.min(100, prev.load + (Math.random() - 0.5) * 8)),
        temperature: Math.max(40, Math.min(85, prev.temperature + (Math.random() - 0.5) * 3)),
      }))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const MetricRow = ({ label, value, max, unit, isOrange }: any) => (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-neutral-400">{label}</span>
        <span className={isOrange ? "text-orange-500 font-mono font-bold" : "text-white font-mono font-bold"}>
          {Math.round(value)} {unit}
        </span>
      </div>
      <div className="w-full bg-neutral-700 rounded-sm h-1.5 overflow-hidden">
        <div
          className={`h-full ${isOrange ? "bg-orange-500" : "bg-blue-500"} transition-all duration-500`}
          style={{ width: `${(value / max) * 100}%` }}
        ></div>
      </div>
    </div>
  )

  return (
    <Card className="bg-neutral-900 border border-neutral-700 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold text-white tracking-widest">MOTOR STATUS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <MetricRow label="RPM" value={data.rpm} max={3000} unit="rpm" isOrange={true} />
        <MetricRow label="TORQUE" value={data.torque} max={100} unit="Nm" isOrange={false} />
        <MetricRow label="LOAD" value={data.load} max={100} unit="%" isOrange={true} />
        <MetricRow label="TEMPERATURE" value={data.temperature} max={100} unit="°C" isOrange={false} />
      </CardContent>
    </Card>
  )
}

// Vibration Metrics Card Component
function VibrationMetricsCard() {
  const [data, setData] = useState({
    frequency: 45.2,
    amplitude: 2.8,
    rms: 1.15,
    impactCount: 342,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => ({
        frequency: Math.max(20, Math.min(80, prev.frequency + (Math.random() - 0.5) * 5)),
        amplitude: Math.max(1, Math.min(5, prev.amplitude + (Math.random() - 0.5) * 0.4)),
        rms: Math.max(0.5, Math.min(3, prev.rms + (Math.random() - 0.5) * 0.2)),
        impactCount: prev.impactCount + Math.floor(Math.random() * 5),
      }))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="bg-neutral-900 border border-neutral-700 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold text-white tracking-widest">VIBRATION METRICS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-neutral-800 p-3 rounded border border-neutral-700">
            <div className="text-xs text-neutral-400 mb-1">Main Frequency</div>
            <div className="text-lg font-bold text-blue-500 font-mono">{data.frequency.toFixed(1)} Hz</div>
          </div>
          <div className="bg-neutral-800 p-3 rounded border border-neutral-700">
            <div className="text-xs text-neutral-400 mb-1">Amplitude</div>
            <div className="text-lg font-bold text-orange-500 font-mono">{data.amplitude.toFixed(2)} g</div>
          </div>
          <div className="bg-neutral-800 p-3 rounded border border-neutral-700">
            <div className="text-xs text-neutral-400 mb-1">RMS</div>
            <div className="text-lg font-bold text-blue-500 font-mono">{data.rms.toFixed(2)}</div>
          </div>
          <div className="bg-neutral-800 p-3 rounded border border-neutral-700">
            <div className="text-xs text-neutral-400 mb-1">Impact Count</div>
            <div className="text-lg font-bold text-orange-500 font-mono">{data.impactCount}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Control Panel Card Component
function ControlPanelCard() {
  const [speedMode, setSpeedMode] = useState(false)
  const [torqueMode, setTorqueMode] = useState(false)
  const [targetRpm, setTargetRpm] = useState(2500)
  const [targetTorque, setTargetTorque] = useState(80)

  return (
    <Card className="bg-neutral-900 border border-neutral-700 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold text-white tracking-widest">CONTROL PANEL</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSpeedMode(!speedMode)}
            className={`py-2 px-3 rounded text-xs font-bold transition-all ${
              speedMode
                ? "bg-orange-500 text-white border border-orange-400"
                : "bg-neutral-800 text-neutral-300 border border-neutral-600 hover:border-orange-500"
            }`}
          >
            SPEED MODE
          </button>
          <button
            onClick={() => setTorqueMode(!torqueMode)}
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
              min="1000"
              max="3000"
              value={targetRpm}
              onChange={(e) => setTargetRpm(Number.parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs text-neutral-400 block mb-2">Target Torque: {targetTorque}</label>
            <input
              type="range"
              min="50"
              max="100"
              value={targetTorque}
              onChange={(e) => setTargetTorque(Number.parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <button className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded border-2 border-orange-400 transition-all shadow-lg hover:shadow-orange-500/50">
          SET
        </button>
      </CardContent>
    </Card>
  )
}

// Activity Overview Card Component
function ActivityOverviewCard() {
  const [chartData, setChartData] = useState(
    Array.from({ length: 12 }, (_, i) => ({
      time: `${i}:00`,
      rpm: 2000 + Math.random() * 1000,
      torque: 70 + Math.random() * 30,
    })),
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prev) => [
        ...prev.slice(1),
        {
          time: new Date().getHours() + ":00",
          rpm: 2000 + Math.random() * 1000,
          torque: 70 + Math.random() * 30,
        },
      ])
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="bg-neutral-900 border border-neutral-700 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold text-white tracking-widest">ACTIVITY OVERVIEW</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9CA3AF" style={{ fontSize: "12px" }} />
            <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
              labelStyle={{ color: "#fff" }}
            />
            <Line type="monotone" dataKey="rpm" stroke="#f97316" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="torque" stroke="#3b82f6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Task Information Card Component
function TaskInformationCard() {
  const [tasks] = useState([
    {
      id: "TASK-2025-001",
      status: "RUNNING",
      duration: "02:45:32",
      operator: "SYSTEM-A",
      lastUpdate: "25/06/2025 14:23 UTC",
    },
    {
      id: "TASK-2025-002",
      status: "IDLE",
      duration: "00:00:00",
      operator: "OPERATOR-B",
      lastUpdate: "25/06/2025 13:45 UTC",
    },
    {
      id: "TASK-2025-003",
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
    <Card className="bg-neutral-900 border border-neutral-700 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold text-white tracking-widest">TASK INFORMATION</CardTitle>
      </CardHeader>
      <CardContent>
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
    <div className="p-6 space-y-6 bg-gradient-to-b from-neutral-950 to-neutral-900">
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Row 1: Three Cards */}
        <div className="lg:col-span-4">
          <MotorStatusCard />
        </div>
        <div className="lg:col-span-4">
          <VibrationMetricsCard />
        </div>
        <div className="lg:col-span-4">
          <ControlPanelCard />
        </div>

        {/* Row 2: Two Cards */}
        <div className="lg:col-span-7">
          <ActivityOverviewCard />
        </div>
        <div className="lg:col-span-5">
          <TaskInformationCard />
        </div>
      </div>
    </div>
  )
}
