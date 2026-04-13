'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'
import BuyPopup from '@/components/BuyPopup'
import { Product } from '@/lib/types'

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('is_live', true)
        .single()
      if (!data) { router.push('/'); return }
      setProduct(data as Product)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <p style={{ color: 'var(--muted)' }}>Loading…</p>
      </div>
    </div>
  )

  if (!product) return null

  const images = product.images?.length ? product.images : [`https://placehold.co/600x500/F2E8DF/8A7E74?text=${encodeURIComponent(product.name)}`]

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
        {/* Breadcrumb */}
        <p style={{ margin: '0 0 32px', fontSize: 13, color: 'var(--muted)' }}>
          <a href="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Shop</a>
          {' / '}
          <span style={{ color: 'var(--charcoal)' }}>{product.name}</span>
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>

          {/* Left: Images */}
          <div>
            {/* Main image */}
            <div style={{
              aspectRatio: '4/3',
              background: 'var(--blush)',
              borderRadius: 2,
              overflow: 'hidden',
              marginBottom: 12,
              border: '1px solid var(--border)',
            }}>
              <img
                src={images[activeImg]}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { (e.currentTarget as HTMLImageElement).src = `https://placehold.co/600x500/F2E8DF/8A7E74?text=${encodeURIComponent(product.name)}` }}
              />
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveImg(i)}
                    style={{
                      width: 72, height: 72,
                      borderRadius: 2,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: `2px solid ${i === activeImg ? 'var(--terracotta)' : 'var(--border)'}`,
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { (e.currentTarget as HTMLImageElement).src = `https://placehold.co/72x72/F2E8DF/8A7E74?text=img` }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div>
            {product.category && (
              <p style={{ margin: '0 0 8px', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                {product.category}
              </p>
            )}
            <h1 style={{ margin: '0 0 16px', fontSize: 36, lineHeight: 1.15, fontWeight: 400 }}>
              {product.name}
            </h1>
            <p style={{ margin: '0 0 28px', fontSize: 28, color: 'var(--terracotta)', fontFamily: 'DM Sans, sans-serif' }}>
              ₹{product.price}
            </p>

            {product.description && (
              <div style={{ margin: '0 0 36px', paddingBottom: 36, borderBottom: '1px solid var(--border)' }}>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.8, color: 'var(--charcoal)' }}>
                  {product.description}
                </p>
              </div>
            )}

            {/* Handmade note */}
            <div style={{
              background: 'var(--blush)',
              borderRadius: 2,
              padding: '16px 20px',
              marginBottom: 28,
              display: 'flex', gap: 12, alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 20 }}>🧶</span>
              <div>
                <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 500 }}>Made to order</p>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
                  Each piece is handcrafted after your order. We'll discuss colours, customisation and delivery timeline on WhatsApp.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowPopup(true)}
              className="btn-primary"
              style={{ width: '100%', padding: '16px 28px', fontSize: 15 }}
            >
              Buy Now
            </button>

            <p style={{ margin: '12px 0 0', textAlign: 'center', fontSize: 12, color: 'var(--muted)' }}>
              You'll be redirected to WhatsApp to complete your order
            </p>
          </div>
        </div>
      </div>

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 680px) {
          .product-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>

      {showPopup && <BuyPopup product={product} onClose={() => setShowPopup(false)} />}
    </div>
  )
}
