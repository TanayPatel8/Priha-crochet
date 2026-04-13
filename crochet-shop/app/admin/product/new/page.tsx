import ProductForm from '@/components/ProductForm'

export default function NewProductPage() {
  return (
    <div style={{ padding: '40px 40px' }}>
      <div style={{ marginBottom: 32 }}>
        <a href="/admin/dashboard" style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}>
          ← Back to products
        </a>
        <h1 style={{ margin: '12px 0 6px', fontSize: 28 }}>Add New Product</h1>
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: 14 }}>Fill in the details below to list a new crochet product.</p>
      </div>
      <ProductForm mode="create" />
    </div>
  )
}
