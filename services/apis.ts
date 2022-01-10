import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from 'nookies'
import { signOut } from "../context/AuthContext";

let cookies = parseCookies()
let isRefreshing = false
let isFailedRequestsQueue = []

export const api = axios.create({
  baseURL: 'http://localhost:3333',
})

api.defaults.headers['Authorization'] = `Bearer ${cookies['nextauth.token']}`;

api.interceptors.response.use(
  response => {
    return response
}, 
  (error: AxiosError) => {
    if(error.response?.status === 401) {
      if(error.response.data?.code === 'token.expired') {
        cookies = parseCookies()

        const { 'nextauth.refreshToken': refreshToken } = cookies
        const originalConfig = error.config
        
        if(!isRefreshing) {
          isRefreshing = true

          api.post('/refresh', {
            refreshToken
          })
          .then( response => {
            
            setCookie( undefined, 'nextauth.token', response.data.token, {
              maxAge: 60 * 60 * 24 * 30, //days
              path: '/'
            })
            
            setCookie( undefined, 'nextauth.refreshToken', response.data.refreshToken, {
              maxAge: 60 * 60 * 24 * 30, //days
              path: '/'
            })
            
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`

            isFailedRequestsQueue.forEach(request => {
              request.onSuccess(response.data.token)
            })
            isFailedRequestsQueue = []
          })
          .catch(error => {
            isFailedRequestsQueue.forEach( request => {
              request.onFailure(error)
              isFailedRequestsQueue = []
            })
          })
          .finally(() => {
            isRefreshing = false
          })
        }

        return new Promise((resolve, reject) => {
          isFailedRequestsQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers['Authorization'] = `Bearer ${token}`;

              resolve(api(originalConfig))
            },
            onFailure: (err: AxiosError) => {
              reject(err)
            }
          })
        })
      } else {
        signOut()
      }
    }
    
  return Promise.reject(error)
})
