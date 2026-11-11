import { useEffect, useRef } from 'react'
export default function Particles() {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current, x = c.getContext('2d')
    let w, h, raf
    const rs = () => { w = c.width = innerWidth; h = c.height = innerHeight }
    rs(); addEventListener('resize', rs)
    const P = Array.from({ length: 55 }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.8 + 0.4, v: Math.random() * 0.4 + 0.1, g: Math.random() < 0.18 }))
    const draw = () => {
      x.clearRect(0, 0, w, h)
      P.forEach(p => {
        p.y -= p.v; p.x += Math.sin(p.y / 60) * 0.2
        if (p.y < 0) { p.y = h; p.x = Math.random() * w }
        x.beginPath(); x.arc(p.x, p.y, p.r, 0, 7)
        x.fillStyle = p.g ? 'rgba(245,185,66,.75)' : 'rgba(140,210,255,.5)'; x.fill()
      })
    }
    const loop = () => { draw(); raf = requestAnimationFrame(loop) }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) draw(); else loop()
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', rs) }
  }, [])
  return <canvas ref={ref} className="fx" aria-hidden="true" />
}
