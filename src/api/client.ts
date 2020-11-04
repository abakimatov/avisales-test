import axios from 'axios'

import { BACKEND_URL } from 'constants/api'

export const client = axios.create({
  baseURL: BACKEND_URL,
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
  },
})
