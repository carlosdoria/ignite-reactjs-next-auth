import { useEffect } from 'react'
import { signOut, useAuth } from '../context/AuthContext'
import { api } from '../services/apis'

export default function Home () {
  const { user } = useAuth()
  
  useEffect(() => {
    api.get('/me')
    .then( response => console.log(response))
    .catch( error => signOut)
  }, [])

  return (
    <h1>Dashboard: {user?.email}</h1>
  )
}
