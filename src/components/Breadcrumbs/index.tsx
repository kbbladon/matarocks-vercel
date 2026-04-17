// components/Breadcrumbs/index.tsx
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/utilities/ui'

type BreadcrumbItem = {
  label: string
  href?: string // ✅ Must be optional
}

type BreadcrumbsProps = {
  items: BreadcrumbItem[]
  className?: string
  linkColor?: string
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className, linkColor }) => {
  return (
    <nav aria-label="Breadcrumb" className={cn('text-sm', className)}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={index} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:opacity-80"
                  style={{ color: linkColor || '#FFD700' }}
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'font-medium text-white' : 'text-white/60'}>
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="h-4 w-4 text-white/60" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
