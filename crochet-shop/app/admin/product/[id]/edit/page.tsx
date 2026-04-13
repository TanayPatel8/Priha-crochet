'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ProductForm from '@/components/ProductForm'
import { Product } from '@/lib/types'

export default function EditProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    createClient()
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setProduct(data as Product)
        setLoading(false)
      })
  }, [id])

  if (loading) return (
    <div style={{ padding: '40px 40px', color: 'var(--muted)' }}>Loading product…</div>
  )

  if (!product) return (
    <div style={{ padding: '40px 40px', color: '#DC2626' }}>Product not found.</div>
  )

  return (
    <div style={{ padding: '40px 40px' }}>
      <div style={{ marginBottom: 32 }}>
        <a href="/admin/dashboard" style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}>
          ← Back to products
        </a>
        <h1 style={{ margin: '12px 0 6px', fontSize: 28 }}>Edit Product</h1>
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: 14 }}>
          Editing: <strong>{product.name}</strong>
        </p>
      </div>
      <ProductForm mode="edit" productId={product.id} initial={product} />
    </div>
  )
}
