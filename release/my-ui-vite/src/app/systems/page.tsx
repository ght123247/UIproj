import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Server,
  Database,
  Cpu,
  Activity,
  AlertTriangle,
  CheckCircle,
  Settings,
  X,
  Scan,
  Wrench,
  Thermometer,
} from "lucide-react"

interface System {
  id: string
  name: string
  role: string
  type: string
  status: "online" | "warning" | "maintenance" | "offline"
  health: number
  cpu: number
  memory: number
  storage: number
  temperature: number
  uptime: string
  location: string
}

export default function SystemsPage() {
  const [selectedSystem, setSelectedSystem] = useState<System | null>(null)

  const systems: System[] = [
    {
      id: "SYS-001",
      name: "COMMAND NODE ALPHA",
      role: "Edge Controller",
      type: "Edge Controller",
      status: "online",
      health: 96,
      cpu: 45,
      memory: 67,
      storage: 34,
      temperature: 47,
      uptime: "247 days",
      location: "Data Center 1",
    },
    {
      id: "SYS-002",
      name: "DATA PROCESSOR BETA",
      role: "Data Processor",
      type: "Data Processor",
      status: "online",
      health: 95,
      cpu: 72,
      memory: 84,
      storage: 78,
      temperature: 52,
      uptime: "189 days",
      location: "Data Center 2",
    },
    {
      id: "SYS-003",
      name: "ANALYTICS ENGINE GAMMA",
      role: "Analytics Engine",
      type: "Analytics Engine",
      status: "online",
      health: 94,
      cpu: 89,
      memory: 76,
      storage: 45,
      temperature: 58,
      uptime: "134 days",
      location: "Data Center 1",
    },
    {
      id: "SYS-004",
      name: "EDGE GATEWAY DELTA",
      role: "Edge Controller",
      type: "Edge Controller",
      status: "warning",
      health: 87,
      cpu: 23,
      memory: 45,
      storage: 12,
      temperature: 63,
      uptime: "156 days",
      location: "Factory Node",
    },
    {
      id: "SYS-005",
      name: "STORAGE ARRAY EPSILON",
      role: "Data Processor",
      type: "Data Processor",
      status: "maintenance",
      health: 76,
      cpu: 15,
      memory: 28,
      storage: 89,
      temperature: 42,
      uptime: "0 days",
      location: "Backup Facility",
    },
    {
      id: "SYS-006",
      name: "NETWORK HUB ZETA",
      role: "Edge Controller",
      type: "Edge Controller",
      status: "online",
      health: 92,
      cpu: 38,
      memory: 52,
      storage: 23,
      temperature: 44,
      uptime: "203 days",
      location: "Edge Gateway",
    },
    {
      id: "SYS-007",
      name: "AI INFERENCE SERVER",
      role: "Analytics Engine",
      type: "Analytics Engine",
      status: "online",
      health: 98,
      cpu: 65,
      memory: 71,
      storage: 38,
      temperature: 55,
      uptime: "178 days",
      location: "Data Center 1",
    },
    {
      id: "SYS-008",
      name: "SECURITY GATEWAY",
      role: "Edge Controller",
      type: "Edge Controller",
      status: "warning",
      health: 85,
      cpu: 28,
      memory: 58,
      storage: 19,
      temperature: 61,
      uptime: "142 days",
      location: "DMZ",
    },
    {
      id: "SYS-009",
      name: "BACKUP PROCESSOR",
      role: "Data Processor",
      type: "Data Processor",
      status: "offline",
      health: 0,
      cpu: 0,
      memory: 0,
      storage: 0,
      temperature: 25,
      uptime: "0 days",
      location: "Backup Facility",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500/20 text-green-500"
      case "warning":
        return "bg-orange-500/20 text-orange-500"
      case "maintenance":
        return "bg-neutral-500/20 text-neutral-300"
      case "offline":
        return "bg-red-500/20 text-red-500"
      default:
        return "bg-neutral-500/20 text-neutral-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case "maintenance":
        return <Settings className="w-4 h-4 text-neutral-300" />
      case "offline":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getSystemIcon = (type: string) => {
    switch (type) {
      case "Edge Controller":
        return <Server className="w-6 h-6 text-pink-500" />
      case "Data Processor":
        return <Database className="w-6 h-6 text-pink-500" />
      case "Analytics Engine":
        return <Cpu className="w-6 h-6 text-pink-500" />
      default:
        return <Server className="w-6 h-6 text-pink-500" />
    }
  }

  const getHealthColor = (health: number) => {
    if (health >= 95) return "text-green-500"
    if (health >= 85) return "text-white"
    if (health >= 70) return "text-orange-500"
    return "text-red-500"
  }

  const getTemperatureColor = (temp: number) => {
    if (temp < 50) return "text-green-500"
    if (temp < 60) return "text-yellow-500"
    if (temp < 70) return "text-orange-500"
    return "text-red-500"
  }

  // 统计数据
  const serversOnline = systems.filter((s) => s.status === "online").length
  const totalServers = systems.length
  const warnings = systems.filter((s) => s.status === "warning").length
  const maintenance = systems.filter((s) => s.status === "maintenance").length
  const avgUptime = 99.7 // 计算平均值

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">SYSTEMS MONITOR</h1>
          <p className="text-sm text-neutral-400">Infrastructure health and performance monitoring for industrial AI servers</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-pink-500 hover:bg-pink-600 text-white">
            <Scan className="w-4 h-4 mr-2" />
            System Scan
          </Button>
          <Button variant="outline" className="border-neutral-600 text-neutral-300 hover:bg-neutral-800 bg-transparent">
            <Wrench className="w-4 h-4 mr-2" />
            Maintenance Mode
          </Button>
        </div>
      </div>

      {/* System Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-neutral-900 border-neutral-700 border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">SERVERS ONLINE</p>
                <p className="text-2xl font-bold text-green-500 font-mono">
                  {serversOnline}/{totalServers}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700 border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">WARNINGS</p>
                <p className="text-2xl font-bold text-orange-500 font-mono">{warnings}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700 border-l-4 border-l-pink-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">AVERAGE UPTIME</p>
                <p className="text-2xl font-bold text-pink-500 font-mono">{avgUptime}%</p>
              </div>
              <Activity className="w-8 h-8 text-pink-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700 border-l-4 border-l-neutral-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">MAINTENANCE</p>
                <p className="text-2xl font-bold text-neutral-300 font-mono">{maintenance}</p>
              </div>
              <Settings className="w-8 h-8 text-neutral-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Systems Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {systems.map((system) => (
          <Card
            key={system.id}
            className="bg-neutral-900 border-neutral-700 hover:border-pink-500/50 transition-colors cursor-pointer"
            onClick={() => setSelectedSystem(system)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getSystemIcon(system.type)}
                  <div>
                    <CardTitle className="text-sm font-bold text-white tracking-wider">{system.name}</CardTitle>
                    <p className="text-xs text-neutral-400">{system.role} / {system.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(system.status)}
                  <Badge className={getStatusColor(system.status)}>{system.status.toUpperCase()}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">SYSTEM HEALTH</span>
                <span className={`text-sm font-bold font-mono ${getHealthColor(system.health)}`}>
                  {system.health}%
                </span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-pink-500 to-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${system.health}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-neutral-400 mb-1">CPU</div>
                  <div className="text-white font-mono">{system.cpu}%</div>
                  <div className="w-full bg-neutral-800 rounded-full h-1 mt-1">
                    <div
                      className="bg-pink-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${system.cpu}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="text-neutral-400 mb-1">MEMORY</div>
                  <div className="text-white font-mono">{system.memory}%</div>
                  <div className="w-full bg-neutral-800 rounded-full h-1 mt-1">
                    <div
                      className="bg-pink-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${system.memory}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="text-neutral-400 mb-1">STORAGE</div>
                  <div className="text-white font-mono">{system.storage}%</div>
                  <div className="w-full bg-neutral-800 rounded-full h-1 mt-1">
                    <div
                      className="bg-pink-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${system.storage}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="text-neutral-400 mb-1 flex items-center gap-1">
                    <Thermometer className="w-3 h-3" />
                    TEMPERATURE
                  </div>
                  <div className={`font-mono font-bold ${getTemperatureColor(system.temperature)}`}>
                    {system.temperature}°C
                  </div>
                  <div className="w-full bg-neutral-800 rounded-full h-1 mt-1">
                    <div
                      className={`h-1 rounded-full transition-all duration-300 ${
                        system.temperature < 50
                          ? "bg-green-500"
                          : system.temperature < 60
                            ? "bg-yellow-500"
                            : system.temperature < 70
                              ? "bg-orange-500"
                              : "bg-red-500"
                      }`}
                      style={{ width: `${Math.min(100, (system.temperature / 80) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="space-y-1 text-xs text-neutral-400 pt-2 border-t border-neutral-700">
                <div className="flex justify-between">
                  <span>Uptime:</span>
                  <span className="text-white font-mono">{system.uptime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="text-white">{system.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Detail Modal */}
      {selectedSystem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-neutral-900 border-neutral-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                {getSystemIcon(selectedSystem.type)}
                <div>
                  <CardTitle className="text-xl font-bold text-white tracking-wider">{selectedSystem.name}</CardTitle>
                  <p className="text-sm text-neutral-400">
                    {selectedSystem.id} • {selectedSystem.role} / {selectedSystem.type}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedSystem(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">SYSTEM STATUS</h3>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedSystem.status)}
                      <Badge className={getStatusColor(selectedSystem.status)}>
                        {selectedSystem.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">SYSTEM INFORMATION</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Location:</span>
                        <span className="text-white">{selectedSystem.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Uptime:</span>
                        <span className="text-white font-mono">{selectedSystem.uptime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Health Score:</span>
                        <span className={`font-mono ${getHealthColor(selectedSystem.health)}`}>
                          {selectedSystem.health}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Temperature:</span>
                        <span className={`font-mono font-bold ${getTemperatureColor(selectedSystem.temperature)}`}>
                          {selectedSystem.temperature}°C
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">RESOURCE USAGE</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-neutral-400">CPU Usage</span>
                          <span className="text-white font-mono">{selectedSystem.cpu}%</span>
                        </div>
                        <div className="w-full bg-neutral-800 rounded-full h-2">
                          <div
                            className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${selectedSystem.cpu}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-neutral-400">Memory Usage</span>
                          <span className="text-white font-mono">{selectedSystem.memory}%</span>
                        </div>
                        <div className="w-full bg-neutral-800 rounded-full h-2">
                          <div
                            className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${selectedSystem.memory}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-neutral-400">Storage Usage</span>
                          <span className="text-white font-mono">{selectedSystem.storage}%</span>
                        </div>
                        <div className="w-full bg-neutral-800 rounded-full h-2">
                          <div
                            className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${selectedSystem.storage}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-neutral-400 flex items-center gap-1">
                            <Thermometer className="w-3 h-3" />
                            Temperature
                          </span>
                          <span className={`font-mono font-bold ${getTemperatureColor(selectedSystem.temperature)}`}>
                            {selectedSystem.temperature}°C
                          </span>
                        </div>
                        <div className="w-full bg-neutral-800 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              selectedSystem.temperature < 50
                                ? "bg-green-500"
                                : selectedSystem.temperature < 60
                                  ? "bg-yellow-500"
                                  : selectedSystem.temperature < 70
                                    ? "bg-orange-500"
                                    : "bg-red-500"
                            }`}
                            style={{ width: `${Math.min(100, (selectedSystem.temperature / 80) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-neutral-700">
                <Button className="bg-pink-500 hover:bg-pink-600 text-white">Restart System</Button>
                <Button
                  variant="outline"
                  className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                >
                  View Logs
                </Button>
                <Button
                  variant="outline"
                  className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                >
                  Schedule Maintenance
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
