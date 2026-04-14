'use client'
import Link from 'next/link'
import { Product } from '@/lib/types'

export default function ProductCard({ product }: { product: Product }) {
  const img = product.images?.[0] || '/placeholder.jpg'
  return (
    <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        background: 'var(--warm-white)',
        border: '1px solid var(--border)',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'
          ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
          ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
        }}
      >
        {/* Image */}
        <div style={{ aspectRatio: '4/3', overflow: 'hidden', background: 'var(--blush)' }}>
          <img
            src={img}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            onError={e => { (e.currentTarget as HTMLImageElement).src = `https://placehold.co/400x300/F2E8DF/8A7E74?text=${encodeURIComponent(product.name)}` }}
          />
        </div>

        {/* Info */}
        <div style={{ padding: '16px 20px 20px' }}>
          {product.category && (
            <p style={{ margin: '0 0 4px', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {product.category}
            </p>
          )}
          <h3 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 400 }}>{product.name}</h3>
          <p style={{ margin: 0, fontSize: 16, color: 'var(--terracotta)', fontWeight: 500 }}>
            ₹{product.price}
          </p>
        </div>
      </div>
    </Link>
  )
}
