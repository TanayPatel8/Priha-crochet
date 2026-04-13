import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Knotted — Handmade Crochet',
  description: 'Handcrafted crochet bags, accessories & home décor made with love.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
