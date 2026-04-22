import { REACT_APP_API_TIMEOUT, REACT_APP_API_URL } from '@env'

import { createApiClient } from '@postsop/apis'

import { customizer } from './customizer'

const client = createApiClient({
  customizer,
  adapter: 'fetch',
  baseURL: REACT_APP_API_URL,
  timeout: Number(REACT_APP_API_TIMEOUT) || 10000,
})

export const { request, requestEndpoint } = client
export default client.client
