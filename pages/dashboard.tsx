import { useEffect } from 'react'
import { Can } from '../components/Can'
import { useAuth } from '../context/AuthContext'
import { setupAPIClient } from '../services/api'
import { api } from '../services/apiClient'
import { withSSRAuth } from '../utils/withSSRAuth'

export default function Home () {
  const { user, signOut } = useAuth()

  return (
    <>
      <h1>Dashboard: {user?.email}</h1>

      <button onClick={() => signOut()}>Logout</button>

      <Can permissions={['metrics.list']}>
        <h2>Metrics</h2>
      </Can>
    </>
  )
}


export const getServerSideProps = withSSRAuth( async (ctx) => {
  const apiClient = setupAPIClient(ctx)
  const response = await apiClient.get('/me')

  return {
    props: {}
  }
})