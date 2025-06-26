import { vi } from 'vitest'
import { ref, type Ref } from 'vue'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

import type { FetchResponse } from '@/types/api'

const createMockKyInstance = () => {
  const jsonMock = vi.fn()
  const postMock = vi.fn(() => ({ json: jsonMock }))
  const getMock = vi.fn(() => ({ json: jsonMock }))

  const kyInstance = vi.fn(() => ({ json: jsonMock }))

  Object.assign(kyInstance, {
    post: postMock,
    get: getMock,
    put: vi.fn(() => ({ json: jsonMock })),
    delete: vi.fn(() => ({ json: jsonMock })),
    json: jsonMock
  })

  return { kyInstance, postMock, getMock, jsonMock }
}

const {
  kyInstance: mockKyInstance,
  postMock: kyPostMock,
  getMock: kyGetMock,
  jsonMock: kyJsonMock
} = createMockKyInstance()

const { useNuxtAppMock, useFetchMock, useAsyncDataMock, useLazyAsyncDataMock, useRouterMock } = vi.hoisted(() => {
  return {
    useNuxtAppMock: vi.fn(() => ({
      $apis: {
        test: mockKyInstance
      },
      callHook: vi.fn()
    })),
    useFetchMock: vi.fn(() => DEFAULT_FETCH_RESPONSE as FetchResponse),
    useAsyncDataMock: vi.fn(() => DEFAULT_FETCH_RESPONSE as FetchResponse),
    useLazyAsyncDataMock: vi.fn(() => DEFAULT_FETCH_RESPONSE as FetchResponse),
    useRouterMock: vi.fn(() => ({
      push: vi.fn(),
      replace: vi.fn(),
      go: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      beforeEach: vi.fn(),
      afterEach: vi.fn(),
      currentRoute: { value: { path: '/', query: {}, params: {} } }
    }))
  }
})

// --- Global $fetch mock for Nuxt 3 unit tests ---
// Returns a new todo when POSTing to /todos, empty array otherwise.
vi.stubGlobal('$fetch', vi.fn(async (url, options) => {
  if (url === 'https://jsonplaceholder.typicode.com/todos' && options?.method === 'POST') {
    return { id: 1, title: 'New Todo', completed: false }
  }
  return []
}))

// --- Mock ky-universal to override plugin creating $apis ---
// Ensures all ky.create() in plugins/api.ts returns the mockKyInstance.
vi.mock('ky-universal', () => ({
  __esModule: true,
  default: {
    create: vi.fn(() => mockKyInstance)
  }
}))

// --- Mock Nuxt composables and helpers ---
mockNuxtImport('useNuxtApp', () => useNuxtAppMock)
mockNuxtImport('useFetch', () => useFetchMock)
mockNuxtImport('useLazyAsyncData', () => useLazyAsyncDataMock)
mockNuxtImport('useAsyncData', () => useAsyncDataMock)
mockNuxtImport('useRouter', () => useRouterMock)
mockNuxtImport('navigateTo', () => vi.fn())
mockNuxtImport('useRoute', () =>
  vi.fn(() => ({
    path: '/',
    query: {},
    params: {},
    name: 'index',
    meta: {}
  }))
)
mockNuxtImport('useHead', () => vi.fn())
mockNuxtImport('useSeoMeta', () => vi.fn())

const initUseFetchMock = (payload?: Partial<FetchResponse>) => {
  useFetchMock.mockImplementation(() => ({
    data: payload?.data ?? ref([]),
    error: payload?.error ?? ref(null),
    pending: payload?.pending ?? ref(false)
  }))
}

const initUseAsyncDataMock = (payload?: Partial<FetchResponse>) => {
  useAsyncDataMock.mockImplementation(() => ({
    data: payload?.data ?? ref([]),
    error: payload?.error ?? ref(null),
    pending: payload?.pending ?? ref(false)
  }))
}

const initUseLazyAsyncDataMock = (payload?: Partial<FetchResponse>) => {
  useLazyAsyncDataMock.mockImplementation(() => ({
    data: payload?.data ?? ref([]),
    error: payload?.error ?? ref(null),
    pending: payload?.pending ?? ref(false)
  }))
}

export {
  useNuxtAppMock,
  useFetchMock,
  useAsyncDataMock,
  useLazyAsyncDataMock,
  useRouterMock,
  mockKyInstance,
  kyPostMock,
  kyGetMock,
  kyJsonMock,
  initUseFetchMock,
  initUseAsyncDataMock,
  initUseLazyAsyncDataMock
}
