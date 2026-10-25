import { useEffect, useState } from 'react'

export const resourceFiles = {
  cv: 'cv.pdf',
  presentation: 'enterprise-test-management.pdf',
  powerpoint: 'enterprise-test-management.pptx',
} as const
export const resourceUrl = (file: string) => `${import.meta.env.BASE_URL}resources/${file}`
export type AssetState = 'checking' | 'available' | 'unavailable'

// A missing asset can return Vite's index.html with status 200; check the actual file signature.
export function hasResourceSignature(bytes: Uint8Array, type: 'pdf' | 'pptx') {
  return type === 'pdf'
    ? bytes.length >= 5 && [0x25, 0x50, 0x44, 0x46, 0x2d].every((value, index) => bytes[index] === value)
    : bytes.length >= 4 && [0x50, 0x4b, 0x03, 0x04].every((value, index) => bytes[index] === value)
}
export async function resourceIsAvailable(url: string, type: 'pdf' | 'pptx', signal: AbortSignal) {
  const response = await fetch(url, { headers: { Range: 'bytes=0-7' }, signal, cache: 'no-cache' })
  if (!response.ok || response.headers.get('content-type')?.includes('text/html')) {
    await response.body?.cancel()
    return false
  }
  const reader = response.body?.getReader()
  if (!reader) return false
  const signature: number[] = []
  try {
    while (signature.length < 8) {
      const { done, value } = await reader.read()
      if (done) break
      signature.push(...value.subarray(0, 8 - signature.length))
    }
  } finally { await reader.cancel() }
  return hasResourceSignature(new Uint8Array(signature), type)
}
function useResource(file: string, type: 'pdf' | 'pptx') {
  const [status, setStatus] = useState<AssetState>('checking')
  useEffect(() => {
    const controller = new AbortController()
    resourceIsAvailable(resourceUrl(file), type, controller.signal)
      .then(available => { if (!controller.signal.aborted) setStatus(available ? 'available' : 'unavailable') })
      .catch(() => { if (!controller.signal.aborted) setStatus('unavailable') })
    return () => controller.abort()
  }, [file, type])
  return status
}

export function usePortfolioResources() {
  return { cv: useResource(resourceFiles.cv, 'pdf'), presentation: useResource(resourceFiles.presentation, 'pdf'), powerpoint: useResource(resourceFiles.powerpoint, 'pptx') }
}
export type ResourceAvailability = ReturnType<typeof usePortfolioResources>
