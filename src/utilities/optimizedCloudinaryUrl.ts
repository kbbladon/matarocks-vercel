export const optimizedCloudinaryUrl = (url: string, width?: number): string => {
  if (!url || !url.includes('res.cloudinary.com')) return url

  const parts = url.split('/upload/')
  if (parts.length < 2) return url

  const transformations = width ? `w_${width},f_auto,q_auto` : 'f_auto,q_auto'

  return `${parts[0]}/upload/${transformations}/${parts[1]}`
}
