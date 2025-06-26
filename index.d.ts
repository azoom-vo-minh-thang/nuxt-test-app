import type { KyInstance } from 'ky'

declare module '#app' {
  interface NuxtApp {
    $apis: {
      test: KyInstance
    }
  }
}
