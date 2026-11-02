import '@testing-library/jest-dom/vitest'
import { afterEach, beforeAll, beforeEach, vi } from 'vitest'

class MockMediaQueryList {
  matches = false
  media = ''
  onchange: ((event: MediaQueryListEvent) => void) | null = null
  addListener = vi.fn()
  removeListener = vi.fn()
  addEventListener = vi.fn()
  removeEventListener = vi.fn()
  dispatchEvent = vi.fn().mockReturnValue(false)
}

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: () => new MockMediaQueryList(),
  })
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: class MockIntersectionObserver {
      observe = vi.fn()
      unobserve = vi.fn()
      disconnect = vi.fn()
      takeRecords = vi.fn(() => [])
      root: Element | null = null
      rootMargin = ''
      thresholds: number[] = []
    },
  })
})

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: () => new MockMediaQueryList(),
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})
