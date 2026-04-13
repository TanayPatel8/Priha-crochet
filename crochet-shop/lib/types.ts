export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  images: string[]
  is_live: boolean
  category: string | null
  created_at: string
}
