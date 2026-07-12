import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string
  color?: string
}

const paths: Record<string, JSX.Element[]> = {
  AlertTriangle: [<path key="a" d="M12 4 3 20h18L12 4Z" />, <path key="b" d="M12 9v5" />, <path key="c" d="M12 17h.01" />],
  BarChart3: [<path key="a" d="M5 19V9" />, <path key="b" d="M12 19V5" />, <path key="c" d="M19 19v-7" />],
  Bell: [<path key="a" d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />, <path key="b" d="M10 21h4" />],
  Building2: [<path key="a" d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />, <path key="b" d="M8 7h1M8 11h1M13 7h1M13 11h1M8 15h1M13 15h1" />, <path key="c" d="M2 21h20" />],
  CheckCircle2: [<circle key="a" cx="12" cy="12" r="9" />, <path key="b" d="m8 12 3 3 5-6" />],
  ChevronRight: [<path key="a" d="m9 18 6-6-6-6" />],
  Clock: [<circle key="a" cx="12" cy="12" r="9" />, <path key="b" d="M12 7v5l3 2" />],
  Eye: [<path key="a" d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />, <circle key="b" cx="12" cy="12" r="3" />],
  EyeOff: [<path key="a" d="m3 3 18 18" />, <path key="b" d="M10.6 10.6a3 3 0 0 0 4.2 4.2" />, <path key="c" d="M9.8 5.2A10.5 10.5 0 0 1 12 5c6 0 10 7 10 7a18 18 0 0 1-3.2 4.2" />, <path key="d" d="M6.4 6.8C3.7 8.8 2 12 2 12s4 7 10 7c1.2 0 2.3-.3 3.3-.7" />],
  Filter: [<path key="a" d="M4 5h16l-6 7v6l-4 2v-8L4 5Z" />],
  Fuel: [<path key="a" d="M5 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16" />, <path key="b" d="M8 8h5" />, <path key="c" d="M16 8h2l2 2v8a2 2 0 0 0 4 0v-5l-2-2" />],
  LayoutDashboard: [<rect key="a" x="3" y="3" width="7" height="8" rx="1" />, <rect key="b" x="14" y="3" width="7" height="5" rx="1" />, <rect key="c" x="14" y="12" width="7" height="9" rx="1" />, <rect key="d" x="3" y="15" width="7" height="6" rx="1" />],
  Mail: [<rect key="a" x="3" y="5" width="18" height="14" rx="2" />, <path key="b" d="m3 7 9 7 9-7" />],
  MapPin: [<path key="a" d="M12 21s7-5.5 7-12A7 7 0 0 0 5 9c0 6.5 7 12 7 12Z" />, <circle key="b" cx="12" cy="9" r="2.5" />],
  MessageSquare: [<path key="a" d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />],
  MoreHorizontal: [<path key="a" d="M5 12h.01M12 12h.01M19 12h.01" />],
  Palette: [<path key="a" d="M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 1-3.7 1.6 1.6 0 0 1 .8-3h1.2A4.5 4.5 0 0 0 21 9.8C21 6 17 3 12 3Z" />, <path key="b" d="M7 10h.01M9 6.5h.01M14 6.5h.01M17 10h.01" />],
  Phone: [<path key="a" d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.4 2.6a2 2 0 0 1-.6 1.8L7.6 9.4a16 16 0 0 0 7 7l1.3-1.3a2 2 0 0 1 1.8-.6l2.6.4a2 2 0 0 1 1.7 2Z" />],
  Plus: [<path key="a" d="M12 5v14M5 12h14" />],
  Save: [<path key="a" d="M5 3h12l2 2v16H5V3Z" />, <path key="b" d="M8 3v6h8V3M8 21v-7h8v7" />],
  Search: [<circle key="a" cx="11" cy="11" r="7" />, <path key="b" d="m20 20-4-4" />],
  Settings: [<path key="a" d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />, <path key="b" d="M4 12h2m12 0h2M12 4v2m0 12v2M6.3 6.3l1.4 1.4m8.6 8.6 1.4 1.4m0-11.4-1.4 1.4m-8.6 8.6-1.4 1.4" />],
  Shield: [<path key="a" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />],
  Star: [<path key="a" d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2 7.5 14 3 9.6l6.2-.9L12 3Z" />],
  TrendingDown: [<path key="a" d="m22 17-8-8-4 4-8-8" />, <path key="b" d="M16 17h6v-6" />],
  TrendingUp: [<path key="a" d="m22 7-8 8-4-4-8 8" />, <path key="b" d="M16 7h6v6" />],
  Truck: [<path key="a" d="M3 6h11v9H3z" />, <path key="b" d="M14 9h4l3 3v3h-7V9Z" />, <circle key="c" cx="7" cy="18" r="2" />, <circle key="d" cx="18" cy="18" r="2" />],
  User: [<circle key="a" cx="12" cy="8" r="4" />, <path key="b" d="M4 21a8 8 0 0 1 16 0" />],
  Users: [<path key="a" d="M16 21a6 6 0 0 0-12 0" />, <circle key="b" cx="10" cy="8" r="4" />, <path key="c" d="M22 21a5 5 0 0 0-5-5M17 4a3 3 0 0 1 0 6" />],
  Wrench: [<path key="a" d="M14.7 6.3a5 5 0 0 0-6.3 6.3L3 18l3 3 5.4-5.4a5 5 0 0 0 6.3-6.3l-3 3-3-3 3-3Z" />],
  Zap: [<path key="a" d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />],
}

function makeIcon(name: string) {
  return function Icon({ size = 24, color = 'currentColor', strokeWidth = 2, fill = 'none', ...props }: IconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill={fill}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        {paths[name]}
      </svg>
    )
  }
}

export const AlertTriangle = makeIcon('AlertTriangle')
export const BarChart3 = makeIcon('BarChart3')
export const Bell = makeIcon('Bell')
export const Building2 = makeIcon('Building2')
export const CheckCircle2 = makeIcon('CheckCircle2')
export const ChevronRight = makeIcon('ChevronRight')
export const Clock = makeIcon('Clock')
export const Eye = makeIcon('Eye')
export const EyeOff = makeIcon('EyeOff')
export const Filter = makeIcon('Filter')
export const Fuel = makeIcon('Fuel')
export const LayoutDashboard = makeIcon('LayoutDashboard')
export const Mail = makeIcon('Mail')
export const MapPin = makeIcon('MapPin')
export const MessageSquare = makeIcon('MessageSquare')
export const MoreHorizontal = makeIcon('MoreHorizontal')
export const Palette = makeIcon('Palette')
export const Phone = makeIcon('Phone')
export const Plus = makeIcon('Plus')
export const Save = makeIcon('Save')
export const Search = makeIcon('Search')
export const Settings = makeIcon('Settings')
export const Shield = makeIcon('Shield')
export const Star = makeIcon('Star')
export const TrendingDown = makeIcon('TrendingDown')
export const TrendingUp = makeIcon('TrendingUp')
export const Truck = makeIcon('Truck')
export const User = makeIcon('User')
export const Users = makeIcon('Users')
export const Wrench = makeIcon('Wrench')
export const Zap = makeIcon('Zap')
