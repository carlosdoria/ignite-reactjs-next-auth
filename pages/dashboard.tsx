import { FormEvent, useState } from 'react'
import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { useAuth } from '../context/AuthContext'

const Home: NextPage = () => {
  const { user } = useAuth()

  return (
    <h1>Dashboard: {user?.email}</h1>
  )
}

export default Home
