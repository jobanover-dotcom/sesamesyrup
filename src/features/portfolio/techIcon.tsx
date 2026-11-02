import {
  Boxes,
  Braces,
  Cloud,
  Code2,
  Container,
  Database,
  GitBranch,
  Layers,
  LayoutTemplate,
  Monitor,
  Palette,
  PenTool,
  Server,
  Shapes,
  Terminal,
  Wrench,
} from 'lucide-react'
import type { ReactNode } from 'react'

/** Single-tone lucide glyphs for technology icons. */
export function techIcon(key: string): ReactNode {
  switch (key) {
    case 'code':
      return <Code2 />
    case 'terminal':
      return <Terminal />
    case 'braces':
      return <Braces />
    case 'layout':
      return <LayoutTemplate />
    case 'palette':
      return <Palette />
    case 'database':
      return <Database />
    case 'server':
      return <Server />
    case 'cloud':
      return <Cloud />
    case 'pen-tool':
      return <PenTool />
    case 'layers':
      return <Layers />
    case 'git':
      return <GitBranch />
    case 'container':
      return <Container />
    case 'shapes':
      return <Shapes />
    case 'wrench':
      return <Wrench />
    case 'monitor':
      return <Monitor />
    case 'box':
      return <Boxes />
    default:
      return null
  }
}
