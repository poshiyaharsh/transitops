import React from 'react'

type ChartDatum = Record<string, string | number>
type ChartProps = {
  data?: ChartDatum[]
  children?: React.ReactNode
  margin?: { top?: number; right?: number; bottom?: number; left?: number }
}

export function ResponsiveContainer({ children, height = 200 }: { children: React.ReactNode; width?: string | number; height?: number }) {
  return <div style={{ width: '100%', height }}>{children}</div>
}

export function AreaChart(props: ChartProps) {
  return <ChartFrame {...props} variant="area" />
}

export function BarChart(props: ChartProps) {
  return <ChartFrame {...props} variant="bar" />
}

function ChartFrame({ data = [], children, variant }: ChartProps & { variant: 'area' | 'bar' }) {
  const series = collectSeries(children)
  const labelKey = findLabelKey(data)
  const max = Math.max(1, ...data.flatMap((row) => series.map((s) => Number(row[s.dataKey]) || 0)))
  const w = 640
  const h = 220
  const pad = { top: 20, right: 18, bottom: 34, left: 42 }
  const plotW = w - pad.left - pad.right
  const plotH = h - pad.top - pad.bottom

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" role="img">
      <g stroke="rgba(156,163,175,0.16)" strokeWidth="1">
        {[0, 1, 2, 3].map((i) => <line key={i} x1={pad.left} x2={w - pad.right} y1={pad.top + (plotH / 3) * i} y2={pad.top + (plotH / 3) * i} />)}
      </g>
      {variant === 'bar' ? renderBars(data, series, labelKey, max, pad, plotW, plotH) : renderAreas(data, series, labelKey, max, pad, plotW, plotH)}
    </svg>
  )
}

function renderBars(data: ChartDatum[], series: Series[], labelKey: string, max: number, pad: Padding, plotW: number, plotH: number) {
  const groupW = plotW / Math.max(1, data.length)
  const barW = Math.max(8, (groupW - 14) / Math.max(1, series.length))
  return (
    <g>
      {data.map((row, i) => (
        <g key={i}>
          {series.map((s, si) => {
            const value = Number(row[s.dataKey]) || 0
            const barH = (value / max) * plotH
            return (
              <rect
                key={s.dataKey}
                x={pad.left + i * groupW + 8 + si * barW}
                y={pad.top + plotH - barH}
                width={barW - 2}
                height={barH}
                rx="5"
                fill={s.fill}
              />
            )
          })}
          <text x={pad.left + i * groupW + groupW / 2} y={pad.top + plotH + 22} textAnchor="middle" fill="#9CA3AF" fontSize="12">
            {String(row[labelKey] ?? '')}
          </text>
        </g>
      ))}
    </g>
  )
}

function renderAreas(data: ChartDatum[], series: Series[], labelKey: string, max: number, pad: Padding, plotW: number, plotH: number) {
  return (
    <g>
      {series.map((s, si) => {
        const points = data.map((row, i) => {
          const x = pad.left + (i / Math.max(1, data.length - 1)) * plotW
          const y = pad.top + plotH - ((Number(row[s.dataKey]) || 0) / max) * plotH
          return `${x},${y}`
        })
        const area = `${pad.left},${pad.top + plotH} ${points.join(' ')} ${pad.left + plotW},${pad.top + plotH}`
        return (
          <g key={s.dataKey}>
            <polygon points={area} fill={s.fill?.startsWith('url(') ? (si === 0 ? 'rgba(245,158,11,0.16)' : 'rgba(239,68,68,0.12)') : s.fill} />
            <polyline points={points.join(' ')} fill="none" stroke={s.stroke || s.fill} strokeWidth={s.strokeWidth || 3} />
          </g>
        )
      })}
      {data.map((row, i) => (
        <text key={i} x={pad.left + (i / Math.max(1, data.length - 1)) * plotW} y={pad.top + plotH + 22} textAnchor="middle" fill="#9CA3AF" fontSize="12">
          {String(row[labelKey] ?? '')}
        </text>
      ))}
    </g>
  )
}

export function PieChart({ children }: { children?: React.ReactNode }) {
  const pie = React.Children.toArray(children).find((child) => React.isValidElement(child) && child.type === Pie) as React.ReactElement<PieProps> | undefined
  const data = pie?.props.data ?? []
  const total = Math.max(1, data.reduce((sum, row) => sum + Number(row[pie?.props.dataKey ?? 'value'] || 0), 0))
  let angle = -90
  const cx = 120
  const cy = 88
  const inner = pie?.props.innerRadius ?? 44
  const outer = pie?.props.outerRadius ?? 74

  return (
    <svg viewBox="0 0 240 176" width="100%" height="100%" role="img">
      {data.map((row, i) => {
        const value = Number(row[pie?.props.dataKey ?? 'value'] || 0)
        const sweep = (value / total) * 360
        const path = donutPath(cx, cy, inner, outer, angle, angle + sweep - 2)
        angle += sweep
        return <path key={i} d={path} fill={String(row.color ?? palette[i % palette.length])} />
      })}
    </svg>
  )
}

type Series = { dataKey: string; fill: string; stroke?: string; strokeWidth?: number }
type Padding = { top: number; right: number; bottom: number; left: number }
type PrimitiveProps = { dataKey?: string; fill?: string; stroke?: string; strokeWidth?: number; children?: React.ReactNode }
type PieProps = { data?: ChartDatum[]; dataKey?: string; innerRadius?: number; outerRadius?: number; children?: React.ReactNode }

function collectSeries(children: React.ReactNode): Series[] {
  const found: Series[] = []
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement<PrimitiveProps>(child)) return
    if ((child.type === Bar || child.type === Area) && child.props.dataKey) {
      found.push({
        dataKey: child.props.dataKey,
        fill: child.props.fill || child.props.stroke || '#3B82F6',
        stroke: child.props.stroke,
        strokeWidth: child.props.strokeWidth,
      })
    }
  })
  return found.length ? found : [{ dataKey: 'value', fill: '#3B82F6' }]
}

function findLabelKey(data: ChartDatum[]) {
  const first = data[0] ?? {}
  return Object.keys(first).find((key) => typeof first[key] === 'string') ?? Object.keys(first)[0] ?? 'name'
}

function donutPath(cx: number, cy: number, inner: number, outer: number, start: number, end: number) {
  const a = (deg: number, r: number) => {
    const rad = (Math.PI / 180) * deg
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]
  }
  const [x1, y1] = a(start, outer)
  const [x2, y2] = a(end, outer)
  const [x3, y3] = a(end, inner)
  const [x4, y4] = a(start, inner)
  const large = end - start > 180 ? 1 : 0
  return `M ${x1} ${y1} A ${outer} ${outer} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${inner} ${inner} 0 ${large} 0 ${x4} ${y4} Z`
}

const palette = ['#F59E0B', '#3B82F6', '#22C55E', '#EF4444']

export function Area(_: PrimitiveProps) { return null }
export function Bar(_: PrimitiveProps) { return null }
export function XAxis(_: PrimitiveProps) { return null }
export function YAxis(_: PrimitiveProps) { return null }
export function Tooltip(_: PrimitiveProps) { return null }
export function Pie(_: PieProps) { return null }
export function Cell(_: PrimitiveProps) { return null }
