'use client'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav style={{
      borderBottom: '1px solid var(--border)',
      background: 'var(--warm-white)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 64,
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1 style={{ fontSize: 24, margin: 0, color: 'var(--terracotta)', fontStyle: 'italic' }}>
            Knotted
          </h1>
        </Link>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <Link href="/" style={{ color: 'var(--charcoal)', textDecoration: 'none', fontSize: 14, letterSpacing: '0.05em' }}>
            Shop
          </Link>
          <Link href="/#about" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: 14, letterSpacing: '0.05em' }}>
            About
          </Link>
        </div>
      </div>
    </nav>
  )
}
