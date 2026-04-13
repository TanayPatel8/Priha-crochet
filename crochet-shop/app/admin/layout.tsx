'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      if (data.user) setUserEmail(data.user.email || '')
    })
  }, [])

  async function handleLogout() {
    await createClient().auth.signOut()
    router.push('/admin/login')
  }

  const navLinks = [
    { href: '/admin/dashboard', label: 'All Products' },
    { href: '/admin/product/new', label: '+ Add Product' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220,
        background: 'var(--charcoal)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 40,
      }}>
        {/* Logo */}
        <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ margin: 0, fontSize: 22, color: 'var(--terracotta)', fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}>
              Knotted
            </h1>
          </Link>
          <p style={{ margin: '4px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Admin
          </p>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {navLinks.map(link => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: 'block',
                  padding: '10px 24px',
                  fontSize: 14,
                  color: active ? 'white' : 'rgba(255,255,255,0.55)',
                  textDecoration: 'none',
                  background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                  borderLeft: active ? '3px solid var(--terracotta)' : '3px solid transparent',
                  transition: 'all 0.15s',
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* User + logout */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ margin: '0 0 8px', fontSize: 12, color: 'rgba(255,255,255,0.4)', wordBreak: 'break-all' }}>
            {userEmail}
          </p>
          <button
            onClick={handleLogout}
            style={{
              background: 'none', border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.6)', padding: '7px 14px',
              borderRadius: 2, fontSize: 12, cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', width: '100%',
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: 220, flex: 1, background: 'var(--cream)', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  )
}
