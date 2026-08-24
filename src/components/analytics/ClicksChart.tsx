/**
 * This component renders a line chart displaying the number of clicks over time for a specific short URL.
 * It uses the Recharts library to create a responsive line chart with a Cartesian grid, X and Y axes, and tooltips.
 * The chart is wrapped in a Card component for consistent styling with other analytics components.
 * The data for the chart is passed as a prop, which should be an array of
 * ClickDataPoint objects containing date and clicks properties.
 */
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import Card from '../ui/Card'

import type { ClickDataPoint } from '../../types/url'

interface ClicksChartProps {
  data: ClickDataPoint[]
}

const ClicksChart = ({ data }: ClicksChartProps) => {
  return (
    <Card className="mt-6">
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-white">Clicks over time</h3>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Daily clicks for this short URL.
        </p>
      </div>

      <div className="mt-6 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <CartesianGrid
              stroke="var(--chart-grid)"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{
                fontSize: 12,
                fill: 'var(--chart-text)',
              }}
            />

            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={{
                fontSize: 12,
                fill: 'var(--chart-text)',
              }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--chart-tooltip-bg)',
                borderColor: 'var(--chart-tooltip-border)',
                borderRadius: '8px',
                color: 'var(--chart-tooltip-text)',
              }}
              labelStyle={{
                color: 'var(--chart-tooltip-text)',
              }}
            />

            <Line
              type="monotone"
              dataKey="clicks"
              stroke="var(--chart-line)"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

export default ClicksChart
