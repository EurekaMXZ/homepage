type LoadStatus = 'pending' | 'fulfilled' | 'rejected'

interface ImageLoadEntry {
  promise: Promise<void>
  status: LoadStatus
}

const imageLoadCache = new Map<string, ImageLoadEntry>()

function resolveWhenDecoded(image: HTMLImageElement, url: string) {
  return new Promise<void>((resolve, reject) => {
    const handleLoad = () => {
      if (typeof image.decode === 'function') {
        image
          .decode()
          .catch(() => undefined)
          .finally(resolve)
        return
      }

      resolve()
    }

    image.onload = handleLoad
    image.onerror = () => reject(new Error(`Failed to preload background: ${url}`))
    image.src = url

    if (image.complete) {
      handleLoad()
    }
  })
}

export function isBackgroundImageReady(url: string) {
  return imageLoadCache.get(url)?.status === 'fulfilled'
}

export function preloadBackgroundImage(url: string) {
  const existing = imageLoadCache.get(url)

  if (existing) {
    return existing.promise
  }

  const image = new Image()
  image.decoding = 'async'

  const entry: ImageLoadEntry = {
    status: 'pending',
    promise: resolveWhenDecoded(image, url)
      .then(() => {
        entry.status = 'fulfilled'
      })
      .catch((error) => {
        imageLoadCache.delete(url)
        entry.status = 'rejected'
        throw error
      }),
  }

  imageLoadCache.set(url, entry)
  return entry.promise
}
