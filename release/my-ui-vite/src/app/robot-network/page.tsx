import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Search, Filter, MoreHorizontal, MapPin, Clock, Activity, Settings, Eye, Wrench, AlertCircle, X, Brain } from "lucide-react"

interface Robot {
  id: string
  station: string
  location: string
  model: string
  status: "active" | "idle" | "fault" | "maintenance"
  task: string
  load: number
  temperature: number
  maintenanceRemaining: number
  lastUpdate: string
}

export default function RobotNetworkPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRobot, setSelectedRobot] = useState<Robot | null>(null)
  const [robots, setRobots] = useState<Robot[]>([
    {
      id: "R-AX204",
      station: "Line 3",
      location: "Zone B",
      model: "XMotor-G625",
      status: "active",
      task: "Surface Polishing #42",
      load: 78,
      temperature: 42.3,
      maintenanceRemaining: 76,
      lastUpdate: "1 min ago",
    },
    {
      id: "R-AX205",
      station: "Line 1",
      location: "Zone A",
      model: "XMotor-G625",
      status: "active",
      task: "Surface Polishing #38",
      load: 65,
      temperature: 38.7,
      maintenanceRemaining: 82,
      lastUpdate: "2 min ago",
    },
    {
      id: "R-AX206",
      station: "Line 2",
      location: "Zone C",
      model: "XMotor-G525",
      status: "idle",
      task: "Standby",
      load: 0,
      temperature: 32.1,
      maintenanceRemaining: 91,
      lastUpdate: "5 min ago",
    },
    {
      id: "R-AX207",
      station: "Line 4",
      location: "Zone D",
      model: "XMotor-G350",
      status: "maintenance",
      task: "Calibration",
      load: 0,
      temperature: 28.5,
      maintenanceRemaining: 35,
      lastUpdate: "15 min ago",
    },
    {
      id: "R-AX208",
      station: "Line 3",
      location: "Zone B",
      model: "XMotor-G550",
      status: "active",
      task: "Surface Polishing #45",
      load: 82,
      temperature: 45.2,
      maintenanceRemaining: 58,
      lastUpdate: "30 sec ago",
    },
    {
      id: "R-AX209",
      station: "Line 1",
      location: "Zone A",
      model: "XMotor-G350",
      status: "fault",
      task: "Error: Motor Overload",
      load: 0,
      temperature: 52.8,
      maintenanceRemaining: 28,
      lastUpdate: "8 min ago",
    },
    {
      id: "R-AX210",
      station: "Line 5",
      location: "Zone E",
      model: "XMotor-G650",
      status: "active",
      task: "Surface Polishing #41",
      load: 71,
      temperature: 40.1,
      maintenanceRemaining: 85,
      lastUpdate: "1 min ago",
    },
    {
      id: "R-AX211",
      station: "Line 2",
      location: "Zone C",
      model: "XMotor-G525",
      status: "active",
      task: "Surface Polishing #39",
      load: 69,
      temperature: 39.5,
      maintenanceRemaining: 73,
      lastUpdate: "2 min ago",
    },
    {
      id: "R-AX212",
      station: "Line 4",
      location: "Zone D",
      model: "XMotor-G525",
      status: "maintenance",
      task: "Service Check",
      load: 0,
      temperature: 30.2,
      maintenanceRemaining: 42,
      lastUpdate: "20 min ago",
    },
    {
      id: "R-AX213",
      station: "Line 3",
      location: "Zone B",
      model: "XMotor-G350",
      status: "active",
      task: "Surface Polishing #43",
      load: 75,
      temperature: 41.8,
      maintenanceRemaining: 68,
      lastUpdate: "1 min ago",
    },
    {
      id: "R-AX214",
      station: "Line 1",
      location: "Zone A",
      model: "XMotor-G550",
      status: "idle",
      task: "Standby",
      load: 0,
      temperature: 33.4,
      maintenanceRemaining: 88,
      lastUpdate: "10 min ago",
    },
    {
      id: "R-AX215",
      station: "Line 5",
      location: "Zone E",
      model: "XMotor-G350",
      status: "maintenance",
      task: "Parameter Tuning",
      load: 0,
      temperature: 29.7,
      maintenanceRemaining: 38,
      lastUpdate: "25 min ago",
    },
    {
      id: "R-AX216",
      station: "Line 2",
      location: "Zone C",
      model: "XMotor-G650",
      status: "active",
      task: "Surface Polishing #44",
      load: 80,
      temperature: 43.6,
      maintenanceRemaining: 64,
      lastUpdate: "45 sec ago",
    },
  ])

  // 实时更新机器人数据
  useEffect(() => {
    const interval = setInterval(() => {
      setRobots((prevRobots) =>
        prevRobots.map((robot) => {
          if (robot.status === "active") {
            return {
              ...robot,
              load: Math.max(30, Math.min(95, robot.load + (Math.random() - 0.5) * 10)),
              temperature: Math.max(35, Math.min(55, robot.temperature + (Math.random() - 0.5) * 2)),
              maintenanceRemaining: Math.max(0, Math.min(100, robot.maintenanceRemaining - Math.random() * 0.1)),
              lastUpdate: "1 min ago",
            }
          }
          return robot
        }),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const filteredRobots = robots.filter(
    (robot) =>
      robot.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot.station.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot.model.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // 统计数据
  const activeRobots = robots.filter((r) => r.status === "active").length
  const maintenanceRobots = robots.filter((r) => r.status === "maintenance").length
  const faultedRobots = robots.filter((r) => r.status === "fault").length

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "idle":
        return "bg-yellow-500"
      case "fault":
        return "bg-red-500"
      case "maintenance":
        return "bg-orange-500"
      default:
        return "bg-neutral-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active"
      case "idle":
        return "Idle"
      case "fault":
        return "Fault"
      case "maintenance":
        return "Maintenance"
      default:
        return status
    }
  }

  const getMaintenanceColor = (percentage: number) => {
    if (percentage >= 70) return "bg-green-500"
    if (percentage >= 40) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getMaintenanceTextColor = (percentage: number) => {
    if (percentage >= 70) return "text-green-500"
    if (percentage >= 40) return "text-yellow-500"
    return "text-red-500"
  }

  const getMaintenanceHours = (percentage: number) => {
    // 假设100% = 200小时，线性计算
    return Math.round((percentage / 100) * 200)
  }

  // 计算预测的维护事件数（未来24小时内）
  const predictedMaintenanceEvents = robots.filter(
    (r) => r.maintenanceRemaining < 40 && r.status === "active",
  ).length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">ROBOT NETWORK</h1>
          <p className="text-sm text-neutral-400">Monitor and manage connected polishing robots</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-green-500 hover:bg-green-600 text-white">
            <Activity className="w-4 h-4 mr-2" />
            Deploy Robot
          </Button>
          <Button variant="outline" className="border-neutral-600 text-neutral-300 hover:bg-neutral-800 bg-transparent">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-1 bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Search robots..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700 border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">ACTIVE ROBOTS</p>
                <p className="text-2xl font-bold text-green-500 font-mono">{activeRobots}</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700 border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">IN MAINTENANCE</p>
                <p className="text-2xl font-bold text-orange-500 font-mono">{maintenanceRobots}</p>
              </div>
              <Wrench className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700 border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">FAULTED ROBOTS</p>
                <p className="text-2xl font-bold text-red-500 font-mono">{faultedRobots}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Robot List */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">ROBOT ROSTER</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">ROBOT ID</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">
                    STATION / LOCATION
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">MODEL</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">STATUS</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">TASK</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">LOAD (%)</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">
                    TEMPERATURE (°C)
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">
                    MAINTENANCE REMAINING (%)
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">
                    LAST UPDATE
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredRobots.map((robot, index) => (
                  <tr
                    key={robot.id}
                    className={`border-b border-neutral-800 hover:bg-neutral-800 transition-colors cursor-pointer ${
                      index % 2 === 0 ? "bg-neutral-900" : "bg-neutral-850"
                    }`}
                    onClick={() => setSelectedRobot(robot)}
                  >
                    <td className="py-3 px-4 text-sm text-white font-mono">{robot.id}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-neutral-400" />
                        <span className="text-sm text-neutral-300">
                          {robot.station} – {robot.location}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-white font-mono">{robot.model}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(robot.status)}`}></div>
                        <span className="text-xs text-neutral-300 uppercase tracking-wider">
                          {getStatusText(robot.status)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-neutral-300">{robot.task}</td>
                    <td className="py-3 px-4 text-sm text-white font-mono">{robot.load.toFixed(0)}%</td>
                    <td className="py-3 px-4 text-sm text-white font-mono">{robot.temperature.toFixed(1)}</td>
                    <td className="py-3 px-4">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="w-full min-w-[100px]">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-bold font-mono ${getMaintenanceTextColor(robot.maintenanceRemaining)}`}>
                                  {robot.maintenanceRemaining.toFixed(0)}%
                                </span>
                              </div>
                              <div className="w-full bg-neutral-700 rounded-sm h-1.5 overflow-hidden">
                                <div
                                  className={`h-full ${getMaintenanceColor(robot.maintenanceRemaining)} transition-all duration-500`}
                                  style={{ width: `${robot.maintenanceRemaining}%` }}
                                ></div>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-neutral-800 border-neutral-700 text-white">
                            <p>
                              Estimated {getMaintenanceHours(robot.maintenanceRemaining)} hours remaining before next
                              maintenance cycle
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-neutral-400" />
                        <span className="text-sm text-neutral-300 font-mono">{robot.lastUpdate}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-neutral-400 hover:text-orange-500"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className="bg-neutral-800 border-neutral-700 text-white"
                          align="end"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DropdownMenuItem className="text-neutral-300 hover:bg-neutral-700 hover:text-white cursor-pointer">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-neutral-300 hover:bg-neutral-700 hover:text-white cursor-pointer">
                            <Activity className="w-4 h-4 mr-2" />
                            Open Real-time Data
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-neutral-300 hover:bg-neutral-700 hover:text-white cursor-pointer">
                            <Brain className="w-4 h-4 mr-2" />
                            AI Diagnostics
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-neutral-300 hover:bg-neutral-700 hover:text-white cursor-pointer">
                            <Settings className="w-4 h-4 mr-2" />
                            Adjust Parameters
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400 hover:bg-red-500/20 hover:text-red-400 cursor-pointer">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Stop Robot
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* System Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div>
              <p className="text-xs text-neutral-400 tracking-wider mb-1">NETWORK LATENCY</p>
              <p className="text-lg font-bold text-green-500 font-mono">12 ms</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div>
              <p className="text-xs text-neutral-400 tracking-wider mb-1">COMMUNICATION HEALTH</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm font-bold text-green-500">EXCELLENT</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div>
              <p className="text-xs text-neutral-400 tracking-wider mb-1">TASK COMPLETION RATE</p>
              <p className="text-lg font-bold text-white font-mono">94.2%</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div>
              <p className="text-xs text-neutral-400 tracking-wider mb-1">PREDICTED MAINTENANCE EVENTS</p>
              <p className="text-lg font-bold text-orange-500 font-mono">{predictedMaintenanceEvents}</p>
              <p className="text-xs text-neutral-500 mt-1">Next 24h</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Robot Detail Modal */}
      {selectedRobot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-neutral-900 border-neutral-700 w-full max-w-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-white tracking-wider font-mono">{selectedRobot.id}</CardTitle>
                <p className="text-sm text-neutral-400">{selectedRobot.model}</p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedRobot(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider mb-1">STATUS</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedRobot.status)}`}></div>
                    <span className="text-sm text-white uppercase tracking-wider">
                      {getStatusText(selectedRobot.status)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider mb-1">LOCATION</p>
                  <p className="text-sm text-white">
                    {selectedRobot.station} – {selectedRobot.location}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider mb-1">CURRENT TASK</p>
                  <p className="text-sm text-white">{selectedRobot.task}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider mb-1">LOAD</p>
                  <p className="text-sm text-white font-mono">{selectedRobot.load.toFixed(0)}%</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider mb-1">TEMPERATURE</p>
                  <p className="text-sm text-white font-mono">{selectedRobot.temperature.toFixed(1)} °C</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider mb-1">MAINTENANCE REMAINING</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold font-mono ${getMaintenanceTextColor(selectedRobot.maintenanceRemaining)}`}>
                      {selectedRobot.maintenanceRemaining.toFixed(0)}%
                    </span>
                    <div className="flex-1 bg-neutral-700 rounded-sm h-2 overflow-hidden">
                      <div
                        className={`h-full ${getMaintenanceColor(selectedRobot.maintenanceRemaining)} transition-all duration-500`}
                        style={{ width: `${selectedRobot.maintenanceRemaining}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    ~{getMaintenanceHours(selectedRobot.maintenanceRemaining)} hours remaining
                  </p>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">View Real-time Data</Button>
                <Button
                  variant="outline"
                  className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                >
                  Adjust Parameters
                </Button>
                <Button
                  variant="outline"
                  className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                >
                  Diagnostics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

