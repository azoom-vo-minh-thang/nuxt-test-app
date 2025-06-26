import type { Ref } from 'vue'

export type FetchResponse<T = any> = {
  data: Ref<T[]>
  pending: Ref<boolean>
  error: Ref<null | { message: string }>
}
