import type { ComponentType, SVGProps } from 'react'
type IconProps = SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number; fill?: string }
export type LucideIcon = ComponentType<IconProps>
function make(path: React.ReactNode): LucideIcon {
  return function Icon({ size = 20, strokeWidth = 1.8, ...props }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        {path}
      </svg>
    )
  }
}
export const Home = make(
    <>
      <path d="m3 10 9-7 9 7" />
      <path d="M5 9v12h14V9M9 21v-7h6v7" />
    </>,
  ),
  BookOpen = make(
    <>
      <path d="M12 7v14" />
      <path d="M3 18V5a1 1 0 0 1 1-1h4a4 4 0 0 1 4 4 4 4 0 0 1 4-4h4a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-4a4 4 0 0 0-4 3 4 4 0 0 0-4-3H4a1 1 0 0 1-1-1Z" />
    </>,
  ),
  Library = make(
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
      <path d="M8 7h8M8 11h6" />
    </>,
  ),
  Languages = make(
    <>
      <path d="m5 8 6 6" />
      <path d="m4 14 6-6 2-3" />
      <path d="M2 5h12" />
      <path d="M7 2h1" />
      <path d="M22 22 16 12l-6 10" />
      <path d="M14 18h8" />
    </>,
  ),
  MessageCircle = make(
    <>
      <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z" />
    </>,
  ),
  Headphones = make(
    <>
      <path d="M3 14v-3a9 9 0 0 1 18 0v3" />
      <path d="M5 14h1a2 2 0 0 1 2 2v4H7a4 4 0 0 1-4-4v-1a1 1 0 0 1 1-1Z" />
      <path d="M19 14h-1a2 2 0 0 0-2 2v4h1a4 4 0 0 0 4-4v-1a1 1 0 0 0-1-1Z" />
    </>,
  ),
  Mic2 = make(
    <>
      <path d="M12 19v3" />
      <path d="M8 22h8" />
      <rect x="9" y="2" width="6" height="13" rx="3" />
      <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
    </>,
  ),
  Target = make(
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </>,
  ),
  BriefcaseBusiness = make(
    <>
      <rect x="3" y="7" width="18" height="14" rx="2" />
      <path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2" />
    </>,
  ),
  Menu = make(
    <>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </>,
  ),
  X = make(
    <>
      <path d="m18 6-12 12M6 6l12 12" />
    </>,
  ),
  ChevronRight = make(
    <>
      <path d="m9 18 6-6-6-6" />
    </>,
  ),
  ChevronDown = make(
    <>
      <path d="m6 9 6 6 6-6" />
    </>,
  ),
  ChevronLeft = make(
    <>
      <path d="m15 18-6-6 6-6" />
    </>,
  ),
  Check = make(
    <>
      <path d="m5 12 4 4L19 6" />
    </>,
  ),
  CheckCircle2 = make(
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m8 12 3 3 5-6" />
    </>,
  ),
  Clock3 = make(
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </>,
  ),
  Heart = make(
    <>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8z" />
    </>,
  ),
  MoveRight = make(
    <>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </>,
  ),
  Play = make(
    <>
      <path d="m6 4 15 8-15 8z" />
    </>,
  ),
  RotateCcw = make(
    <>
      <path d="M3 12a9 9 0 1 0 2.6-6.4L3 8" />
      <path d="M3 3v5h5" />
    </>,
  ),
  Search = make(
    <>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </>,
  ),
  Sparkles = make(
    <>
      <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3ZM19 14l1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14ZM5 2l.9 2.1L8 5l-2.1.9L5 8l-.9-2.1L2 5l2.1-.9L5 2Z" />
    </>,
  ),
  Star = make(
    <>
      <path d="m12 3 2.8 5.8L21 9.7l-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.7l6.2-.9L12 3Z" />
    </>,
  ),
  Volume2 = make(
    <>
      <path d="M11 5 6 9H3v6h3l5 4z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />
    </>,
  ),
  Zap = make(
    <>
      <path d="m13 2-3 8H5l6 12 3-8h5L13 2z" />
    </>,
  ),
  CircleCheck = make(
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m8 12 3 3 5-6" />
    </>,
  ),
  Users = make(
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="10" cy="7" r="4" />
      <path d="M20 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
    </>,
  ),
  typeIcon = ''
