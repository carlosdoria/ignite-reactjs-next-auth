import { FormEvent, useState } from 'react'
import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { useAuth } from '../context/AuthContext'

const Home: NextPage = () => {
  const { signIn } = useAuth()
  
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  async function handleSubmit (event: FormEvent) {
    event.preventDefault()

    const data = {
      email,
      password
    }

    await signIn(data)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <input type='email' value={email} onChange={e => setEmail(e.target.value)} />
      <input type='password' value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Entrar</button>
    </form>
  )
}

export default Home
