import * as axios from 'axios'

let API: axios.AxiosInstance

export function getClient(): axios.AxiosInstance {
  return API
}

export function setupClient(host: string, token: string) {
  const config = {
    baseURL: host,
    timeout: 0,
    headers: {},
  }
  if (token) {
    config.headers = { authorization: `BEARER ${token}` }
  }
  API = axios.default.create(config)
}
