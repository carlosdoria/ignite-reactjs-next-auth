import Router from 'next/router'
import { createContext, ReactNode, useContext, useState } from 'react'
import { api } from '../services/apis'

interface User {
  email: string
  permissions: string[]
  roles: string[]
}
interface SignInCredentials {
  email: string
  password: string
}

interface AuthContextData {
  signIn(credentials: SignInCredentials): Promise<void>
  user: User | undefined
  isAuthenticated: boolean
}

interface AuthProviderProps {
  children: ReactNode
}

const AuthContext = createContext({} as AuthContextData)

export function AuthProvider ({children}: AuthProviderProps) {
  const [ user, setUser ] = useState<User>()
  const isAuthenticated = !!user

  async function signIn ({ email, password }: SignInCredentials) {
    try {
      const response = await api.post('sessions', {
        email,
        password
      })

      const { permissions, roles, token, refreshToken } = response.data
      
      setUser({
        email,
        permissions,
        roles
      })

      Router.push('dashboard')
    } catch (error) {
      console.log(error)
    }
  }
  
  return(
    <AuthContext.Provider value={{
      signIn,
      isAuthenticated,
      user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  return context
}