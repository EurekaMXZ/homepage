/// <reference types="vite/client" />

declare module 'virtual:background-manifest' {
  interface GeneratedBackgroundData {
    blurHash: string
    dominantColor: string
    placeholderDataUrl: string
  }

  const manifest: Record<string, GeneratedBackgroundData>

  export default manifest
}
