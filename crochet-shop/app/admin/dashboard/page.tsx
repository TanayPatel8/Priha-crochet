'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Product } from '@/lib/types'

export default function DashboardPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function loadProducts() {
    const supabase = createClient()
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    setProducts((data as Product[]) || [])
    setLoading(false)
  }

  useEffect(() => { loadProducts() }, [])

  async function toggleLive(product: Product) {
    setTogglingId(product.id)
    const supabase = createClient()
    await supabase
      .from('products')
      .update({ is_live: !product.is_live })
      .eq('id', product.id)
    setProducts(ps => ps.map(p => p.id === product.id ? { ...p, is_live: !p.is_live } : p))
    setTogglingId(null)
  }

  async function deleteProduct(product: Product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    setDeletingId(product.id)
    const supabase = createClient()

    // Delete images from storage
    if (product.images?.length) {
      const paths = product.images.map(url => {
        const parts = url.split('/products/')
        return parts[1] || ''
      }).filter(Boolean)
      if (paths.length) await supabase.storage.from('products').remove(paths)
    }

    await supabase.from('products').delete().eq('id', product.id)
    setProducts(ps => ps.filter(p => p.id !== product.id))
    setDeletingId(null)
  }

  const liveCount = products.filter(p => p.is_live).length

  return (
    <div style={{ padding: '40px 40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ margin: '0 0 6px', fontSize: 28 }}>Products</h1>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: 14 }}>
            {products.length} total · {liveCount} live
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/product/new')}
          className="btn-primary"
        >
          + Add Product
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Total Products', value: products.length },
          { label: 'Live (visible)', value: liveCount },
          { label: 'Draft (hidden)', value: products.length - liveCount },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'var(--warm-white)', border: '1px solid var(--border)',
            borderRadius: 4, padding: '20px 24px',
          }}>
            <p style={{ margin: '0 0 4px', fontSize: 12, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {stat.label}
            </p>
            <p style={{ margin: 0, fontSize: 28, fontFamily: 'Playfair Display, serif' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <p style={{ color: 'var(--muted)' }}>Loading products…</p>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', background: 'var(--warm-white)', border: '1px solid var(--border)', borderRadius: 4 }}>
          <p style={{ fontSize: 32, margin: '0 0 12px' }}>🧶</p>
          <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 400 }}>No products yet</h2>
          <p style={{ margin: '0 0 24px', color: 'var(--muted)' }}>Add your first crochet product to get started.</p>
          <button onClick={() => router.push('/admin/product/new')} className="btn-primary">
            + Add First Product
          </button>
        </div>
      ) : (
        <div style={{ background: 'var(--warm-white)', border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--blush)' }}>
                {['Product', 'Price', 'Category', 'Status', 'Actions'].map(col => (
                  <th key={col} style={{
                    padding: '12px 16px', textAlign: 'left',
                    fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: 'var(--muted)', fontWeight: 500,
                  }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product, i) => (
                <tr
                  key={product.id}
                  style={{
                    borderBottom: i < products.length - 1 ? '1px solid var(--border)' : 'none',
                    opacity: deletingId === product.id ? 0.4 : 1,
                    transition: 'opacity 0.2s',
                  }}
                >
                  {/* Product info */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 2,
                        background: 'var(--blush)',
                        overflow: 'hidden', flexShrink: 0,
                      }}>
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🧶</div>
                        )}
                      </div>
                      <span style={{ fontWeight: 400 }}>{product.name}</span>
                    </div>
                  </td>

                  {/* Price */}
                  <td style={{ padding: '14px 16px', color: 'var(--terracotta)', fontWeight: 500 }}>
                    ₹{product.price}
                  </td>

                  {/* Category */}
                  <td style={{ padding: '14px 16px', color: 'var(--muted)' }}>
                    {product.category || '—'}
                  </td>

                  {/* Live toggle */}
                  <td style={{ padding: '14px 16px' }}>
                    <button
                      onClick={() => toggleLive(product)}
                      disabled={togglingId === product.id}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '5px 12px', borderRadius: 20,
                        border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500,
                        fontFamily: 'DM Sans, sans-serif',
                        background: product.is_live ? '#DCFCE7' : '#F3F4F6',
                        color: product.is_live ? '#166534' : '#6B7280',
                        transition: 'all 0.2s',
                        opacity: togglingId === product.id ? 0.6 : 1,
                      }}
                    >
                      <span style={{
                        width: 7, height: 7, borderRadius: '50%',
                        background: product.is_live ? '#16A34A' : '#9CA3AF',
                        display: 'inline-block',
                      }} />
                      {product.is_live ? 'Live' : 'Draft'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => router.push(`/admin/product/${product.id}/edit`)}
                        style={{
                          background: 'none', border: '1px solid var(--border)',
                          borderRadius: 2, padding: '5px 12px', fontSize: 12,
                          cursor: 'pointer', color: 'var(--charcoal)',
                          fontFamily: 'DM Sans, sans-serif',
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(product)}
                        disabled={deletingId === product.id}
                        style={{
                          background: 'none', border: '1px solid #FECACA',
                          borderRadius: 2, padding: '5px 12px', fontSize: 12,
                          cursor: 'pointer', color: '#DC2626',
                          fontFamily: 'DM Sans, sans-serif',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
