import type { CallToActionBlock as CallToActionBlockProps } from '@/payload-types'
import React from 'react'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

type Props = { className?: string } & CallToActionBlockProps

export const CallToActionBlock: React.FC<Props> = ({ className, links, richText }) => {
  return (
    <div className={className}>
      <div className="container">
        <div className="bg-card rounded border-border border p-4 flex flex-col gap-8 md:flex-row md:justify-between md:items-center">
          <div className="max-w-[48rem] flex items-center">
            {richText && <RichText className="mb-0" data={richText} enableGutter={false} />}
          </div>
          <div className="flex flex-col gap-8">
            {(links || []).map(({ link }, i) => (
              <CMSLink key={i} size="lg" {...link} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
