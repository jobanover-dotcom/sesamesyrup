'use client'

import { useEffect, useRef } from 'react'
import styles from './LightField.module.css'

type Blob = {
  x: number
  y: number
  radius: number
  speedX: number
  speedY: number
  phase: number
  morph: number
  tone: number
}

const BASE_ALPHA = 0.055
const MAX_BLOBS = 9

/**
 * Drifting grayscale light-field: soft monochrome blobs slowly morphing
 * behind the hero. Pauses when offscreen or when the tab is hidden,
 * disables itself for reduced-motion users (static gradient fallback)
 * and reduces blob count on small screens.
 */
export function LightField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d', { alpha: true })
    if (!context) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotion.matches) return // CSS static gradient in stylesheet stays visible

    let blobs: Blob[] = []
    let animationId = 0
    let visible = true
    let width = 0
    let height = 0
    let lastTime = performance.now()

    /** Monochrome smoke: light smoke in dark mode, ink in light mode. */
    const isLight = () => document.documentElement.getAttribute('data-theme') === 'light'

    const createBlobs = (smallViewport: boolean) => {
      const count = smallViewport ? 4 : MAX_BLOBS
      blobs = Array.from({ length: count }, (_, index) => ({
        x: Math.random(),
        y: Math.random(),
        radius: 0.18 + Math.random() * 0.3,
        speedX: (0.006 + Math.random() * 0.014) * (Math.random() > 0.5 ? 1 : -1),
        speedY: (0.004 + Math.random() * 0.01) * (Math.random() > 0.5 ? 1 : -1),
        phase: Math.random() * Math.PI * 2,
        morph: 0.4 + Math.random() * 0.8,
        tone: (index % 3) * 0.4 + 0.6,
      }))
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = rect.width
      height = rect.height
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (time: number) => {
      const elapsed = Math.min((time - lastTime) / 1000, 0.1)
      lastTime = time

      context.clearRect(0, 0, width, height)
      for (const blob of blobs) {
        blob.x += blob.speedX * elapsed
        blob.y += blob.speedY * elapsed
        blob.phase += blob.morph * elapsed
        if (blob.x < -0.25) blob.x = 1.25
        if (blob.x > 1.25) blob.x = -0.25
        if (blob.y < -0.25) blob.y = 1.25
        if (blob.y > 1.25) blob.y = -0.25

        const pulse = 0.8 + 0.2 * Math.sin(blob.phase)
        const radius =
          blob.radius * Math.max(width, height) * pulse
        const cx = blob.x * width
        const cy = blob.y * height

        const light = isLight()
        const core = light ? '10, 10, 10' : '235, 235, 235'
        const mid = light ? '40, 40, 40' : '220, 220, 220'
        const edge = light ? '60, 60, 60' : '200, 200, 200'
        const alpha = BASE_ALPHA * blob.tone * pulse

        const gradient = context.createRadialGradient(cx, cy, 0, cx, cy, radius)
        gradient.addColorStop(0, `rgba(${core}, ${alpha})`)
        gradient.addColorStop(0.55, `rgba(${mid}, ${alpha * 0.55})`)
        gradient.addColorStop(1, `rgba(${edge}, 0)`)
        context.fillStyle = gradient
        context.beginPath()
        context.arc(cx, cy, radius, 0, Math.PI * 2)
        context.fill()
      }
    }

    const loop = (time: number) => {
      if (visible && !document.hidden) draw(time)
      animationId = requestAnimationFrame(loop)
    }

    resize()
    createBlobs(width < 720)

    const resizeObserver = new ResizeObserver(() => {
      resize()
      createBlobs(canvas.getBoundingClientRect().width < 720)
    })
    resizeObserver.observe(canvas)

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true
    })
    visibilityObserver.observe(canvas)

    animationId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(animationId)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
    }
  }, [])

  return (
    <div className={styles.field} aria-hidden={true}>
      <div className={styles.fallback} />
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.grain} />
    </div>
  )
}
