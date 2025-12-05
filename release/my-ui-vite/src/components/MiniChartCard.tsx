import { Card, CardContent } from "@/components/ui/card"
import { LineChart, Line, ResponsiveContainer } from "recharts"
import type { LucideIcon } from "lucide-react"

interface MiniChartCardProps {
  title: string
  value: number
  unit: string
  icon: LucideIcon
  chartData: Array<{ time: string; value: number }>
  color?: string
}

export function MiniChartCard({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  chartData,
  color = "#46e0c7"
}: MiniChartCardProps) {
  return (
    <Card className="bg-[#1a1d22] border-[#2a2d33] text-white">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-400">{title}</span>
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-white">{value.toFixed(1)}</span>
          <span className="text-sm text-gray-500">{unit}</span>
        </div>
        <div className="h-[60px] w-full" style={{ minHeight: '60px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
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

