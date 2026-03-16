import { REACT_APP_API_URL } from '@env'
import axios from 'axios'

const service = axios.create({
  baseURL: REACT_APP_API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

console.log('REACT_APP_API_URL', REACT_APP_API_URL)

export default service
