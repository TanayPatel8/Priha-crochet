'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Product } from '@/lib/types'

interface ProductFormProps {
  initial?: Partial<Product>
  productId?: string
  mode: 'create' | 'edit'
}

export default function ProductForm({ initial, productId, mode }: ProductFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(initial?.name || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [price, setPrice] = useState(initial?.price?.toString() || '')
  const [category, setCategory] = useState(initial?.category || '')
  const [isLive, setIsLive] = useState(initial?.is_live ?? false)
  const [existingImages, setExistingImages] = useState<string[]>(initial?.images || [])
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    setNewFiles(prev => [...prev, ...files])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => setNewPreviews(prev => [...prev, ev.target?.result as string])
      reader.readAsDataURL(file)
    })
  }

  function removeExistingImage(url: string) {
    setExistingImages(prev => prev.filter(u => u !== url))
  }

  function removeNewFile(index: number) {
    setNewFiles(prev => prev.filter((_, i) => i !== index))
    setNewPreviews(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !price) { setError('Name and price are required.'); return }
    setSaving(true)
    setError('')

    try {
      const supabase = createClient()

      // Upload new images
      const uploadedUrls: string[] = []
      for (const file of newFiles) {
        const ext = file.name.split('.').pop()
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: uploadError } = await supabase.storage.from('products').upload(path, file)
        if (uploadError) throw uploadError
        const { data: urlData } = supabase.storage.from('products').getPublicUrl(path)
        uploadedUrls.push(urlData.publicUrl)
      }

      const allImages = [...existingImages, ...uploadedUrls]

      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        price: parseFloat(price),
        category: category.trim() || null,
        is_live: isLive,
        images: allImages,
      }

      if (mode === 'create') {
        const { error: dbError } = await supabase.from('products').insert(payload)
        if (dbError) throw dbError
      } else {
        const { error: dbError } = await supabase.from('products').update(payload).eq('id', productId)
        if (dbError) throw dbError
      }

      router.push('/admin/dashboard')
    } catch (err: unknown) {
      setError((err as Error).message || 'Something went wrong.')
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    border: '1px solid var(--border)', borderRadius: 2,
    fontSize: 14, fontFamily: 'DM Sans, sans-serif',
    background: 'var(--cream)', outline: 'none',
    boxSizing: 'border-box' as const,
  }
  const labelStyle = {
    display: 'block', fontSize: 12,
    letterSpacing: '0.06em', textTransform: 'uppercase' as const,
    color: 'var(--muted)', marginBottom: 6,
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 700 }}>
      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 2, padding: '12px 16px', marginBottom: 24, color: '#DC2626', fontSize: 14 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Product Name *</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Boho Crochet Tote Bag" style={inputStyle} required />
        </div>

        <div>
          <label style={labelStyle}>Price (₹) *</label>
          <input type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="450" style={inputStyle} required />
        </div>

        <div>
          <label style={labelStyle}>Category</label>
          <input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Bags, Coasters, Accessories" style={inputStyle} />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe this product — material, size, colours available, care instructions…"
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>
      </div>

      {/* Image upload */}
      <div style={{ marginBottom: 28 }}>
        <label style={labelStyle}>Product Images</label>

        {/* Image previews */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
          {existingImages.map(url => (
            <div key={url} style={{ position: 'relative', width: 90, height: 90 }}>
              <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 2, border: '1px solid var(--border)' }} />
              <button
                type="button"
                onClick={() => removeExistingImage(url)}
                style={{
                  position: 'absolute', top: -6, right: -6,
                  background: '#DC2626', color: 'white',
                  border: 'none', borderRadius: '50%',
                  width: 20, height: 20, cursor: 'pointer',
                  fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >×</button>
            </div>
          ))}
          {newPreviews.map((src, i) => (
            <div key={i} style={{ position: 'relative', width: 90, height: 90 }}>
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 2, border: '1px solid var(--terracotta)' }} />
              <button
                type="button"
                onClick={() => removeNewFile(i)}
                style={{
                  position: 'absolute', top: -6, right: -6,
                  background: '#DC2626', color: 'white',
                  border: 'none', borderRadius: '50%',
                  width: 20, height: 20, cursor: 'pointer',
                  fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >×</button>
            </div>
          ))}

          {/* Add more */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: 90, height: 90,
              border: '2px dashed var(--border)',
              borderRadius: 2, background: 'none',
              cursor: 'pointer', color: 'var(--muted)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 4, fontSize: 11,
            }}
          >
            <span style={{ fontSize: 22 }}>+</span>
            <span>Add photo</span>
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)' }}>
          Upload multiple photos. First photo is the main display image.
        </p>
      </div>

      {/* Live toggle */}
      <div style={{
        background: isLive ? '#F0FDF4' : 'var(--warm-white)',
        border: `1px solid ${isLive ? '#BBF7D0' : 'var(--border)'}`,
        borderRadius: 4,
        padding: '16px 20px',
        marginBottom: 28,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        transition: 'all 0.2s',
      }}>
        <div>
          <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 500, color: isLive ? '#166534' : 'var(--charcoal)' }}>
            {isLive ? '🟢 Live — visible on shop' : '⚫ Draft — hidden from shop'}
          </p>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)' }}>
            {isLive ? 'Customers can see and buy this product.' : 'Only you can see this. Toggle to publish.'}
          </p>
        </div>
        <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, flexShrink: 0 }}>
          <input
            type="checkbox"
            checked={isLive}
            onChange={e => setIsLive(e.target.checked)}
            style={{ opacity: 0, width: 0, height: 0 }}
          />
          <span style={{
            position: 'absolute', inset: 0,
            background: isLive ? '#16A34A' : '#D1D5DB',
            borderRadius: 12,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }} onClick={() => setIsLive(v => !v)}>
            <span style={{
              position: 'absolute',
              top: 3, left: isLive ? 23 : 3,
              width: 18, height: 18,
              background: 'white',
              borderRadius: '50%',
              transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </span>
        </label>
      </div>

      {/* Submit */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          type="submit"
          disabled={saving}
          className="btn-primary"
          style={{ opacity: saving ? 0.7 : 1 }}
        >
          {saving ? 'Saving…' : mode === 'create' ? 'Create Product' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/dashboard')}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
