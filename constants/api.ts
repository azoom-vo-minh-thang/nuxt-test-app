import { ref } from 'vue'

export const DEFAULT_FETCH_RESPONSE = {
  data: ref([]),
  error: ref(null),
  pending: ref(false)
}
