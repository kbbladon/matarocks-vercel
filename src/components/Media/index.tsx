import React, { Fragment } from 'react'
import type { Props } from './types'
import { ImageMedia } from './ImageMedia'
import { VideoMedia } from './VideoMedia'
import { cn } from '@/utilities/ui'

export const Media: React.FC<Props> = (props) => {
  const { className, htmlElement = 'div', resource, fill } = props

  // Determine if this is a video (only possible if resource is a full media object)
  const isVideo = typeof resource === 'object' && resource?.mimeType?.includes('video')

  // Wrapper logic
  const Wrapper = htmlElement || Fragment
  const wrapperProps = htmlElement
    ? {
        className: cn(
          {
            // When fill is true, force the wrapper to fill its container
            'w-full h-full': fill,
          },
          className,
        ),
      }
    : {}

  // Choose the correct child component
  const Child = isVideo ? VideoMedia : ImageMedia

  return (
    <Wrapper {...wrapperProps}>
      <Child {...props} />
    </Wrapper>
  )
}
