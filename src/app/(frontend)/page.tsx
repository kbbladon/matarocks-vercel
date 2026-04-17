// app/(frontend)/page.tsx
import Page, { generateMetadata as generatePageMetadata } from './[slug]/page'

export default async function HomePage() {
  // Force the slug to 'home' for the root route
  return <Page params={Promise.resolve({ slug: 'home' })} />
}

export async function generateMetadata() {
  return generatePageMetadata({ params: Promise.resolve({ slug: 'home' }) })
}
