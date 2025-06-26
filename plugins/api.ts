import ky from 'ky-universal'

import { ERROR_STATUS } from '@/constants'

export default defineNuxtPlugin(() => {
  const apis: any = {
    test: createAPI({
      apiBaseUrl: 'https://jsonplaceholder.typicode.com'
    })
  }

  return {
    provide: { apis }
  }
})

function createAPI(config: { apiBaseUrl: string }) {
  return ky.create({
    prefixUrl: config.apiBaseUrl,
    timeout: 30000,
    credentials: 'include',
    hooks: {
      beforeError: [
        (error) => {
          console.log('error', error)
          console.log('error name', error?.name)

          return error
        }
      ],
      afterResponse: [
        (_request, _options, response) => {
          if (response.status === ERROR_STATUS.forbidden) {
            showError({
              statusCode: ERROR_STATUS.forbidden
            })

            return
          }

          return response
        }
      ]
    }
  })
}
