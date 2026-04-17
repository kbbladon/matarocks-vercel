export const cloudinaryTransform = (
  url: string | null | undefined,
  transform = 'q_auto,f_auto',
) => {
  if (!url) return ''
  if (!url.includes('res.cloudinary.com')) return url

  // Insert transformations before /vXXXXXX/ or before the public ID if no version
  return url.replace(/\/upload\/(?:v\d+\/)?/, `/upload/${transform}/`)
}
