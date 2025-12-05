import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  Search,
  Brain,
  Settings,
  Factory,
  Clock,
  TrendingUp,
  X,
  BarChart3,
  Sparkles,
} from "lucide-react"

interface Model {
  id: string
  name: string
  material: string
  process: string
  status: "active" | "training" | "archived"
  category: "optimal" | "experimental" | "critical"
  description: string
  tags: string[]
  accuracy: number
  rSquared: number
  avgError: number
  tasks: number
  robots: number
  lastUpdate: string
  line: string
  robot: string
  optimizationTarget: string
  trainingDuration: string
  version: string
  trainingHistory?: Array<{ epoch: number; loss: number; accuracy: number }>
  suggestedParams?: {
    torque: { min: number; max: number }
    rpm: { min: number; max: number }
    force: { min: number; max: number }
  }
}

export default function IntelligencePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)

  const models: Model[] = [
    {
      id: "SAND-AI-CARBON FIBER T700-v3.1",
      name: "SAND-AI CARBON FIBER T700 v3.1",
      material: "Carbon Fiber T700",
      process: "Fine Finish",
      status: "active",
      category: "optimal",
      description: "AI model trained on 247 polishing sessions for aluminum surface finishing.",
      tags: ["aluminum", "fine", "mirror", "low torque"],
      accuracy: 93,
      rSquared: 0.89,
      avgError: 4.2,
      tasks: 42,
      robots: 5,
      lastUpdate: "2025-11-10",
      line: "Line 3",
      robot: "R-SUR204",
      optimizationTarget: "Min Surface Roughness",
      trainingDuration: "3 h 42 m",
      version: "v3.2",
      trainingHistory: Array.from({ length: 50 }, (_, i) => ({
        epoch: i + 1,
        loss: Math.max(0.1, 2.5 - (i / 50) * 2.3),
        accuracy: Math.min(95, 65 + (i / 50) * 28),
      })),
      suggestedParams: {
        torque: { min: 1.2, max: 1.6 },
        rpm: { min: 4800, max: 5200 },
        force: { min: 18, max: 22 },
      },
    },
    {
      id: "POLISH-AI-STEEL304-v2.8",
      name: "POLISH-AI STEEL304 v2.8",
      material: "Stainless Steel 304",
      process: "Rough Polish",
      status: "active",
      category: "optimal",
      description: "Optimized model for stainless steel rough polishing operations.",
      tags: ["steel", "rough", "high torque", "durable"],
      accuracy: 91,
      rSquared: 0.87,
      avgError: 5.1,
      tasks: 38,
      robots: 4,
      lastUpdate: "2025-11-08",
      line: "Line 1",
      robot: "R-AX205",
      optimizationTarget: "Max Material Removal",
      trainingDuration: "4 h 15 m",
      version: "v2.8",
      trainingHistory: Array.from({ length: 50 }, (_, i) => ({
        epoch: i + 1,
        loss: Math.max(0.15, 2.8 - (i / 50) * 2.5),
        accuracy: Math.min(93, 62 + (i / 50) * 29),
      })),
      suggestedParams: {
        torque: { min: 2.1, max: 2.8 },
        rpm: { min: 3500, max: 4200 },
        force: { min: 25, max: 32 },
      },
    },
    {
      id: "SAND-AI-TITANIUM-v1.5",
      name: "SAND-AI TITANIUM v1.5",
      material: "Titanium Alloy",
      process: "Precision Finish",
      status: "training",
      category: "experimental",
      description: "Experimental model for titanium precision finishing, currently in training phase.",
      tags: ["titanium", "precision", "aerospace", "experimental"],
      accuracy: 78,
      rSquared: 0.72,
      avgError: 8.5,
      tasks: 15,
      robots: 2,
      lastUpdate: "2025-11-12",
      line: "Line 5",
      robot: "R-AX210",
      optimizationTarget: "Surface Quality",
      trainingDuration: "2 h 18 m",
      version: "v1.5",
      trainingHistory: Array.from({ length: 30 }, (_, i) => ({
        epoch: i + 1,
        loss: Math.max(0.2, 3.2 - (i / 30) * 2.8),
        accuracy: Math.min(82, 55 + (i / 30) * 23),
      })),
      suggestedParams: {
        torque: { min: 0.8, max: 1.2 },
        rpm: { min: 5500, max: 6000 },
        force: { min: 12, max: 18 },
      },
    },
    {
      id: "SAND-AI-GLASS FIBER-v2.1",
      name: "SAND-AI GLASS FIBER v2.1",
      material: "Glass Fiber",
      process: "Rough Polish",
      status: "active",
      category: "optimal",
      description: "High-performance model for glass fiber rough polishing applications.",
      tags: ["glass fiber", "rough", "high rpm"],
      accuracy: 92, 
      rSquared: 0.91,
      avgError: 4.0,
      tasks: 42,
      robots: 5,
      lastUpdate: "2025-11-11",
      line: "Line 2",
      robot: "R-SUR211",
      optimizationTarget: "Min Surface Defects",
      trainingDuration: "5 h 30 m",
      version: "v2.1",
      trainingHistory: Array.from({ length: 50 }, (_, i) => ({
        epoch: i + 1,
        loss: Math.max(0.08, 2.2 - (i / 50) * 2.0),
        accuracy: Math.min(96, 68 + (i / 50) * 26),
      })),
      suggestedParams: {
        torque: { min: 0.9, max: 1.3 },
        rpm: { min: 6000, max: 6800 },
        force: { min: 15, max: 20 },
      },
    },
    {
      id: "SAND-AI-PEEK-v1.0",
      name: "SAND-AI PEEK v1.0",
      material: "PEEK",
      process: "Rough Polish",
      status: "active",
      category: "critical",
      description: "Legacy model archived due to performance degradation, requires retraining.",
      tags: ["peek", "rough", "legacy", "needs update"],
      accuracy: 88,
      rSquared: 0.65,
      avgError: 12.3,
      tasks: 28,
      robots: 3,
      lastUpdate: "2025-10-25",
      line: "Line 4",
      robot: "R-AX212",
      optimizationTarget: "Consistency",
      trainingDuration: "3 h 10 m",
      version: "v1.8",
      suggestedParams: {
        torque: { min: 1.5, max: 2.0 },
        rpm: { min: 4000, max: 4800 },
        force: { min: 20, max: 28 },
      },
    },
    {
      id: "SAND-AI-ALUMINA CERAMIC-v1.0",
      name: "SAND-AI ALUMINA CERAMIC v1.0",
      material: "Alumina Ceramics",
      process: "Ultra-Fine Finish",
      status: "training",
      category: "experimental",
      description: "New experimental model for ceramic ultra-fine finishing, early training stage.",
      tags: ["alumina ceramics", "ultra-fine", "brittle", "experimental"],
      accuracy: 65,
      rSquared: 0.58,
      avgError: 15.2,
      tasks: 8,
      robots: 1,
      lastUpdate: "2025-11-13",
      line: "Line 3",
      robot: "R-AX213",
      optimizationTarget: "Crack Prevention",
      trainingDuration: "1 h 45 m",
      version: "v1.0",
      trainingHistory: Array.from({ length: 20 }, (_, i) => ({
        epoch: i + 1,
        loss: Math.max(0.3, 4.0 - (i / 20) * 3.5),
        accuracy: Math.min(70, 50 + (i / 20) * 15),
      })),
      suggestedParams: {
        torque: { min: 0.5, max: 0.9 },
        rpm: { min: 3000, max: 3800 },
        force: { min: 8, max: 14 },
      },
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-500"
      case "training":
        return "bg-yellow-500/20 text-yellow-500"
      case "archived":
        return "bg-neutral-500/20 text-neutral-300"
      default:
        return "bg-neutral-500/20 text-neutral-300"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "optimal":
        return "bg-pink-500/20 text-pink-500"
      case "experimental":
        return "bg-orange-500/20 text-orange-500"
      case "critical":
        return "bg-red-500/20 text-red-500"
      default:
        return "bg-neutral-500/20 text-neutral-300"
    }
  }

  const filteredModels = models.filter(
    (model) =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // 统计数据
  const totalModels = models.length
  const trainingJobs = models.filter((m) => m.status === "training").length
  const activeModels = models.filter((m) => m.status === "active").length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">SURFACE INTELLIGENCE CENTER</h1>
          <p className="text-sm text-neutral-400">AI-driven learning and optimization for industrial sanding and polishing</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-pink-500 hover:bg-pink-600 text-white">
            <Brain className="w-4 h-4 mr-2" />
            New Training
          </Button>
          <Button variant="outline" className="border-neutral-600 text-neutral-300 hover:bg-neutral-800 bg-transparent">
            <BarChart3 className="w-4 h-4 mr-2" />
            Model Metrics
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-neutral-900 border-neutral-700 border-l-4 border-l-pink-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">TOTAL MODELS</p>
                <p className="text-2xl font-bold text-pink-500 font-mono">{totalModels}</p>
              </div>
              <Brain className="w-8 h-8 text-pink-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700 border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">TRAINING JOBS</p>
                <p className="text-2xl font-bold text-yellow-500 font-mono">{trainingJobs}</p>
              </div>
              <Settings className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700 border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">ACTIVE MODELS</p>
                <p className="text-2xl font-bold text-green-500 font-mono">{activeModels}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Model Reports */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">MODEL REPORTS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredModels.map((model) => (
              <div
                key={model.id}
                className="border border-neutral-700 rounded p-4 hover:border-pink-500/50 transition-colors cursor-pointer"
                onClick={() => setSelectedModel(model)}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start gap-3">
                      <Brain className="w-5 h-5 text-pink-500 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-white tracking-wider">{model.name}</h3>
                        <p className="text-xs text-neutral-400 font-mono">{model.id}</p>
                        <p className="text-xs text-neutral-300 mt-1">
                          {model.material} / {model.process}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-neutral-300 ml-8">{model.description}</p>

                    <div className="flex flex-wrap gap-2 ml-8">
                      {model.tags.map((tag) => (
                        <Badge key={tag} className="bg-neutral-800 text-neutral-300 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="ml-8 text-xs text-neutral-400">
                      <span className="text-neutral-300">Performance Metrics:</span> Accuracy: {model.accuracy}% • R²:{" "}
                      {model.rSquared.toFixed(2)} • Avg Error: {model.avgError}%
                    </div>

                    <div className="ml-8 text-xs text-neutral-400">
                      <span className="text-neutral-300">Data Sources:</span> {model.tasks} Tasks • {model.robots}{" "}
                      Robots
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2">
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getStatusColor(model.status)}>{model.status.toUpperCase()}</Badge>
                      <Badge className={getCategoryColor(model.category)}>{model.category.toUpperCase()}</Badge>
                    </div>

                    <div className="text-xs text-neutral-400 space-y-1 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Factory className="w-3 h-3" />
                        <span>
                          {model.line} – {model.robot}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        <Settings className="w-3 h-3" />
                        <span>{model.optimizationTarget}</span>
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        <Clock className="w-3 h-3" />
                        <span>{model.trainingDuration}</span>
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        <Sparkles className="w-3 h-3" />
                        <span className="font-mono">{model.version}</span>
                      </div>
                      <div className="font-mono mt-1">{model.lastUpdate}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Model Detail Modal */}
      {selectedModel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-neutral-900 border-neutral-700 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-white tracking-wider">{selectedModel.name}</CardTitle>
                <p className="text-sm text-neutral-400 font-mono">{selectedModel.id}</p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedModel(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">MODEL STATUS</h3>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(selectedModel.status)}>
                        {selectedModel.status.toUpperCase()}
                      </Badge>
                      <Badge className={getCategoryColor(selectedModel.category)}>
                        {selectedModel.category.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">MODEL DETAILS</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Material:</span>
                        <span className="text-white">{selectedModel.material}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Process:</span>
                        <span className="text-white">{selectedModel.process}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Line / Robot:</span>
                        <span className="text-white font-mono">
                          {selectedModel.line} – {selectedModel.robot}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Optimization Target:</span>
                        <span className="text-white">{selectedModel.optimizationTarget}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Training Duration:</span>
                        <span className="text-white font-mono">{selectedModel.trainingDuration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Version:</span>
                        <span className="text-white font-mono">{selectedModel.version}</span>
                      </div>
                    </div>
                  </div>

                  {selectedModel.suggestedParams && (
                    <div>
                      <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">
                        AI-SUGGESTED CONTROL PARAMETERS
                      </h3>
                      <div className="space-y-2 text-sm bg-neutral-800 p-3 rounded">
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Torque:</span>
                          <span className="text-white font-mono">
                            {selectedModel.suggestedParams.torque.min}–{selectedModel.suggestedParams.torque.max} Nm
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">RPM:</span>
                          <span className="text-white font-mono">
                            {selectedModel.suggestedParams.rpm.min}–{selectedModel.suggestedParams.rpm.max}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Force:</span>
                          <span className="text-white font-mono">
                            {selectedModel.suggestedParams.force.min}–{selectedModel.suggestedParams.force.max} N
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">PERFORMANCE METRICS</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Accuracy:</span>
                        <span className="text-white font-mono">{selectedModel.accuracy}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">R² Score:</span>
                        <span className="text-white font-mono">{selectedModel.rSquared.toFixed(3)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Average Error:</span>
                        <span className="text-white font-mono">{selectedModel.avgError}%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">TAGS</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedModel.tags.map((tag) => (
                        <Badge key={tag} className="bg-neutral-800 text-neutral-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {selectedModel.trainingHistory && (
                <div>
                  <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-4">TRAINING HISTORY</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-neutral-400 mb-2">Loss vs Epoch</p>
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={selectedModel.trainingHistory}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="epoch" stroke="#9CA3AF" style={{ fontSize: "12px" }} />
                          <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
                          <Tooltip
                            contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                            labelStyle={{ color: "#fff" }}
                          />
                          <Area
                            type="monotone"
                            dataKey="loss"
                            stroke="#ec4899"
                            fill="#ec4899"
                            fillOpacity={0.3}
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 mb-2">Accuracy vs Epoch</p>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={selectedModel.trainingHistory}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="epoch" stroke="#9CA3AF" style={{ fontSize: "12px" }} />
                          <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
                          <Tooltip
                            contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                            labelStyle={{ color: "#fff" }}
                          />
                          <Line
                            type="monotone"
                            dataKey="accuracy"
                            stroke="#22c55e"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">DESCRIPTION</h3>
                <p className="text-sm text-neutral-300 leading-relaxed">{selectedModel.description}</p>
              </div>

              <div className="flex gap-2 pt-4 border-t border-neutral-700">
                <Button className="bg-pink-500 hover:bg-pink-600 text-white">View Full Metrics</Button>
                <Button
                  variant="outline"
                  className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                >
                  Export Model
                </Button>
                <Button
                  variant="outline"
                  className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                >
                  Retrain Model
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
