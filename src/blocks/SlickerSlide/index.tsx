import dynamic from 'next/dynamic'

const DynamicSlickerSlide = dynamic(
  () => import('./Component').then((mod) => mod.SlickerSlideComponent),
  {
    ssr: true,
    loading: () => (
      <div className="w-full py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-96 bg-gray-800 animate-pulse rounded-xl" />
        </div>
      </div>
    ),
  },
)

export const SlickerSlide = (props: any) => {
  return <DynamicSlickerSlide {...props} />
}
