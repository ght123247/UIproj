import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { cn } from "@/lib/utils"

interface GaugeCardProps {
  title: string
  value: number
  maxValue: number
  unit: string
  color: "blue" | "orange"
  chartData: Array<{ time: string; value: number }>
}

export function GaugeCard({ title, value, maxValue, unit, color, chartData }: GaugeCardProps) {
  const percentage = (value / maxValue) * 100
  const colorClasses = {
    blue: {
      progress: "bg-blue-500",
      glow: "shadow-[0_0_15px_rgba(70,224,199,0.5)]",
      chart: "#46e0c7",
    },
    orange: {
      progress: "bg-orange-500",
      glow: "shadow-[0_0_15px_rgba(224,70,113,0.5)]",
      chart: "#e04671",
    },
  }

  const currentColor = colorClasses[color]

  return (
    <Card className={cn("bg-[#1a1d22] border-[#2a2d33] text-white", currentColor.glow)}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-300">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold" style={{ color: currentColor.chart }}>
              {value.toFixed(1)}
            </span>
            <span className="text-lg text-gray-400">{unit}</span>
          </div>
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-800">
            <div
              className={cn("h-full transition-all duration-300", currentColor.progress)}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>0</span>
            <span>{maxValue}</span>
          </div>
        </div>
        <div className="h-[120px] w-full" style={{ minHeight: '120px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <XAxis 
                dataKey="time" 
                tick={{ fill: "#9ca3af", fontSize: 10 }}
                axisLine={{ stroke: "#374151" }}
                tickLine={{ stroke: "#374151" }}
              />
              <YAxis 
                tick={{ fill: "#9ca3af", fontSize: 10 }}
                axisLine={{ stroke: "#374151" }}
                tickLine={{ stroke: "#374151" }}
                domain={[0, maxValue]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1d22",
                  border: `1px solid ${currentColor.chart}`,
                  borderRadius: "6px",
                  color: "#fff",
                }}
                labelStyle={{ color: "#9ca3af" }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={currentColor.chart}
                strokeWidth={2}
                dot={false}
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

