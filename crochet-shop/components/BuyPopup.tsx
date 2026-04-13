'use client'
import { useState } from 'react'
import { Product } from '@/lib/types'

interface BuyPopupProps {
  product: Product
  onClose: () => void
}

export default function BuyPopup({ product, onClose }: BuyPopupProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' })
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleBuy() {
    if (!form.name || !form.phone || !form.address) {
      alert('Please fill in your name, phone and address.')
      return
    }
    setLoading(true)
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999'
    const message = encodeURIComponent(
`Hello! I'd like to order:

🧶 *${product.name}*
💰 Price: ₹${product.price}

👤 Name: ${form.name}
📧 Email: ${form.email || 'Not provided'}
📞 Phone: ${form.phone}
📍 Address: ${form.address}

Please confirm availability. Thank you!`
    )
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
    setLoading(false)
    onClose()
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(44,44,44,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--warm-white)',
          width: '100%', maxWidth: 480,
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          background: 'var(--blush)',
          padding: '20px 28px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              You're ordering
            </p>
            <h3 style={{ margin: '4px 0 0', fontSize: 20 }}>{product.name}</h3>
            <p style={{ margin: '4px 0 0', color: 'var(--terracotta)', fontWeight: 500 }}>₹{product.price}</p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--muted)', lineHeight: 1 }}
          >×</button>
        </div>

        {/* Form */}
        <div style={{ padding: '24px 28px 28px' }}>
          <p style={{ margin: '0 0 20px', fontSize: 13, color: 'var(--muted)' }}>
            Fill in your details and we'll chat on WhatsApp to confirm your order.
          </p>

          {[
            { label: 'Your Name *', name: 'name', type: 'text', placeholder: 'Priya Sharma' },
            { label: 'Email', name: 'email', type: 'email', placeholder: 'priya@email.com' },
            { label: 'Phone Number *', name: 'phone', type: 'tel', placeholder: '+91 98765 43210' },
          ].map(field => (
            <div key={field.name} style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>
                {field.label}
              </label>
              <input
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1px solid var(--border)',
                  borderRadius: 2, fontSize: 14,
                  background: 'var(--cream)',
                  fontFamily: 'DM Sans, sans-serif',
                  outline: 'none',
                }}
              />
            </div>
          ))}

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>
              Delivery Address *
            </label>
            <textarea
              name="address"
              placeholder="House no, Street, City, State, PIN"
              value={form.address}
              onChange={handleChange}
              rows={3}
              style={{
                width: '100%', padding: '10px 14px',
                border: '1px solid var(--border)',
                borderRadius: 2, fontSize: 14,
                background: 'var(--cream)',
                fontFamily: 'DM Sans, sans-serif',
                resize: 'vertical', outline: 'none',
              }}
            />
          </div>

          <button
            onClick={handleBuy}
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <span>Continue on WhatsApp</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
