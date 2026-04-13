import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/lib/types'

export const revalidate = 60

export default async function HomePage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_live', true)
    .order('created_at', { ascending: false })

  const items = (products as Product[]) || []

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      <div style={{
        background: 'var(--blush)',
        padding: '72px 24px',
        textAlign: 'center',
        borderBottom: '1px solid var(--border)',
      }}>
        <p style={{ margin: '0 0 12px', fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>
          Handmade with love
        </p>
        <h1 style={{ margin: '0 0 16px', fontSize: 'clamp(36px, 6vw, 64px)', lineHeight: 1.1 }}>
          Crochet that tells<br />
          <em>a story</em>
        </h1>
        <p style={{ margin: '0 auto', maxWidth: 480, fontSize: 16, color: 'var(--muted)', lineHeight: 1.7 }}>
          Each piece is hand-stitched to order. Browse and connect with us on WhatsApp to place your order.
        </p>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px' }}>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>🧶</p>
            <h2 style={{ fontSize: 22, fontWeight: 400, color: 'var(--muted)' }}>New pieces coming soon</h2>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h2 style={{ margin: 0, fontSize: 28 }}>Our Collection</h2>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: 14 }}>{items.length} piece{items.length !== 1 ? 's' : ''}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 28 }}>
              {items.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}
      </div>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '32px 24px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
        <p style={{ margin: 0 }}>© {new Date().getFullYear()} Knotted · Handmade Crochet</p>
      </footer>
    </div>
  )
}
