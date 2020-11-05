import axios, { AxiosError } from 'axios'

import { BACKEND_URL } from 'constants/api'

export const client = axios.create({
  baseURL: BACKEND_URL,
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  },
})

client.interceptors.response.use(
  (value) => Promise.resolve(value),
  async (error: AxiosError) => {
    if (error.config && error.response && error.response.status >= 500) {
      return client.request({
        method: error.config.method,
        url: error.config.url,
        params: error.config.params,
        withCredentials: true,
      })
    }

    return Promise.reject(error)
  },
)
