import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Target, MapPin, Clock, Users, AlertTriangle, CheckCircle, XCircle, X, FileText, Plus } from "lucide-react"

interface Task {
  id: string
  name: string
  status: "active" | "planning" | "completed" | "fault"
  priority: "critical" | "high" | "medium" | "low"
  location: string
  workstation: string
  robots: number
  progress: number
  startDate: string
  estimatedCompletion: string
  description: string
  stages: string[]
}

export default function TasksPage() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const tasks: Task[] = [
    {
      id: "TK-OMEGA-021",
      name: "SURFACE FINISHING – PANEL #021",
      status: "active",
      priority: "critical",
      location: "Line 3",
      workstation: "Robot R-AX204",
      robots: 2,
      progress: 75,
      startDate: "2025-11-10",
      estimatedCompletion: "2025-11-15",
      description: "Polishing aluminum housing (fine surface stage)",
      stages: ["Rough polishing", "Fine polishing", "Final inspection", "Quality check"],
    },
    {
      id: "TK-DELTA-042",
      name: "PRECISION POLISHING – COMPONENT #042",
      status: "active",
      priority: "high",
      location: "Line 1",
      workstation: "Robot R-AX205",
      robots: 1,
      progress: 45,
      startDate: "2025-11-12",
      estimatedCompletion: "2025-11-18",
      description: "High-precision surface finishing for aerospace component",
      stages: ["Surface preparation", "Primary polishing", "Secondary polishing", "Final buffing"],
    },
    {
      id: "TK-SIERRA-015",
      name: "BATCH POLISHING – BATCH #015",
      status: "completed",
      priority: "medium",
      location: "Line 2",
      workstation: "Robot R-AX206",
      robots: 3,
      progress: 100,
      startDate: "2025-11-05",
      estimatedCompletion: "2025-11-10",
      description: "Batch processing of 50 units for automotive parts",
      stages: ["Batch setup", "Automated polishing", "Quality inspection", "Packaging"],
    },
    {
      id: "TK-ALPHA-038",
      name: "CUSTOM FINISHING – ORDER #038",
      status: "planning",
      priority: "high",
      location: "Line 4",
      workstation: "Robot R-AX207",
      robots: 1,
      progress: 0,
      startDate: "2025-11-16",
      estimatedCompletion: "2025-11-20",
      description: "Custom surface treatment for specialized component",
      stages: ["Material analysis", "Parameter setup", "Polishing execution", "Custom inspection"],
    },
    {
      id: "TK-BRAVO-029",
      name: "EMERGENCY REPOLISH – UNIT #029",
      status: "fault",
      priority: "critical",
      location: "Line 1",
      workstation: "Robot R-AX209",
      robots: 1,
      progress: 30,
      startDate: "2025-11-08",
      estimatedCompletion: "2025-11-12",
      description: "Emergency repolishing due to surface defect detection",
      stages: ["Defect analysis", "Surface correction", "Repolishing", "Re-inspection"],
    },
    {
      id: "TK-GAMMA-056",
      name: "PRODUCTION RUN – SERIES #056",
      status: "active",
      priority: "medium",
      location: "Line 5",
      workstation: "Robot R-AX210",
      robots: 2,
      progress: 62,
      startDate: "2025-11-11",
      estimatedCompletion: "2025-11-17",
      description: "Standard production polishing for consumer electronics",
      stages: ["Setup", "Polishing", "Cleaning", "Final inspection"],
    },
    {
      id: "TK-ZETA-033",
      name: "PROTOTYPE FINISHING – PROTOTYPE #033",
      status: "active",
      priority: "low",
      location: "Line 3",
      workstation: "Robot R-AX213",
      robots: 1,
      progress: 88,
      startDate: "2025-11-13",
      estimatedCompletion: "2025-11-16",
      description: "Prototype surface finishing for R&D validation",
      stages: ["Prototype setup", "Test polishing", "Measurement", "Documentation"],
    },
    {
      id: "TK-THETA-047",
      name: "QUALITY ASSURANCE – QA #047",
      status: "completed",
      priority: "high",
      location: "Line 2",
      workstation: "Robot R-AX211",
      robots: 1,
      progress: 100,
      startDate: "2025-11-07",
      estimatedCompletion: "2025-11-11",
      description: "Quality assurance polishing for certified components",
      stages: ["QA setup", "Precision polishing", "Certification check", "Documentation"],
    },
    {
      id: "TK-LAMBDA-061",
      name: "MAINTENANCE POLISHING – MAINT #061",
      status: "planning",
      priority: "medium",
      location: "Line 4",
      workstation: "Robot R-AX212",
      robots: 1,
      progress: 0,
      startDate: "2025-11-19",
      estimatedCompletion: "2025-11-22",
      description: "Maintenance polishing for refurbished components",
      stages: ["Assessment", "Surface restoration", "Polishing", "Verification"],
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-white/20 text-white"
      case "planning":
        return "bg-orange-500/20 text-orange-500"
      case "completed":
        return "bg-white/20 text-white"
      case "fault":
        return "bg-red-500/20 text-red-500"
      default:
        return "bg-neutral-500/20 text-neutral-300"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500/20 text-red-500"
      case "high":
        return "bg-orange-500/20 text-orange-500"
      case "medium":
        return "bg-neutral-500/20 text-neutral-300"
      case "low":
        return "bg-white/20 text-white"
      default:
        return "bg-neutral-500/20 text-neutral-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Target className="w-4 h-4" />
      case "planning":
        return <Clock className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "fault":
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  // 统计数据
  const activeTasks = tasks.filter((t) => t.status === "active").length
  const completedTasks = tasks.filter((t) => t.status === "completed").length
  const faultedTasks = tasks.filter((t) => t.status === "fault").length
  const totalTasks = tasks.length
  const successRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">OPERATIONS CENTER</h1>
          <p className="text-sm text-neutral-400">Task management and polishing progress monitoring</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-green-500 hover:bg-green-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
          <Button variant="outline" className="border-neutral-600 text-neutral-300 hover:bg-neutral-800 bg-transparent">
            <FileText className="w-4 h-4 mr-2" />
            Task Report
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-neutral-900 border-neutral-700 border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">ACTIVE TASKS</p>
                <p className="text-2xl font-bold text-green-500 font-mono">{activeTasks}</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700 border-l-4 border-l-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">COMPLETED</p>
                <p className="text-2xl font-bold text-white font-mono">{completedTasks}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700 border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">FAULTED</p>
                <p className="text-2xl font-bold text-red-500 font-mono">{faultedTasks}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700 border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">SUCCESS RATE</p>
                <p className="text-2xl font-bold text-orange-500 font-mono">{successRate}%</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <Card
            key={task.id}
            className="bg-neutral-900 border-neutral-700 hover:border-orange-500/50 transition-colors cursor-pointer"
            onClick={() => setSelectedTask(task)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-sm font-bold text-white tracking-wider">{task.name}</CardTitle>
                  <p className="text-xs text-neutral-400 font-mono mt-1">{task.id}</p>
                </div>
                <div className="flex items-center gap-2">{getStatusIcon(task.status)}</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Badge className={getStatusColor(task.status)}>{task.status.toUpperCase()}</Badge>
                <Badge className={getPriorityColor(task.priority)}>{task.priority.toUpperCase()}</Badge>
              </div>

              <p className="text-sm text-neutral-300">{task.description}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <MapPin className="w-3 h-3" />
                  <span>
                    {task.location} – {task.workstation}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <Users className="w-3 h-3" />
                  <span>{task.robots} {task.robots === 1 ? "robot" : "robots"} assigned</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <Clock className="w-3 h-3" />
                  <span>Est. completion: {task.estimatedCompletion}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400">Progress</span>
                  <span className="text-white font-mono">{task.progress}%</span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-neutral-900 border-neutral-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-white tracking-wider">{selectedTask.name}</CardTitle>
                <p className="text-sm text-neutral-400 font-mono">{selectedTask.id}</p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedTask(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">TASK STATUS</h3>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(selectedTask.status)}>
                        {selectedTask.status.toUpperCase()}
                      </Badge>
                      <Badge className={getPriorityColor(selectedTask.priority)}>
                        {selectedTask.priority.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">TASK DETAILS</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Location:</span>
                        <span className="text-white">{selectedTask.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Workstation:</span>
                        <span className="text-white font-mono">{selectedTask.workstation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Robots:</span>
                        <span className="text-white font-mono">{selectedTask.robots}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Start Date:</span>
                        <span className="text-white font-mono">{selectedTask.startDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Est. Completion:</span>
                        <span className="text-white font-mono">{selectedTask.estimatedCompletion}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">PROGRESS</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">Completion</span>
                        <span className="text-white font-mono">{selectedTask.progress}%</span>
                      </div>
                      <div className="w-full bg-neutral-800 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-pink-500 to-red-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${selectedTask.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">POLISHING STAGES</h3>
                    <div className="space-y-2">
                      {selectedTask.stages.map((stage, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-neutral-300">{stage}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">DESCRIPTION</h3>
                <p className="text-sm text-neutral-300">{selectedTask.description}</p>
              </div>

              <div className="flex gap-2 pt-4 border-t border-neutral-700">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">Update Status</Button>
                <Button
                  variant="outline"
                  className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                >
                  View Reports
                </Button>
                <Button
                  variant="outline"
                  className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                >
                  Assign Robots
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

