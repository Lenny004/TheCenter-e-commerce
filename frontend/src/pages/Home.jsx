import { useState, useEffect } from 'react'
import { api } from '../api'

function Home() {
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .get('/api/health')
      .then((res) => {
        setHealth(res.data)
      })
      .catch((err) => {
        setError(err.message || 'Error al conectar con el backend')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div className="page-home">
      <h1>Bienvenido a The Center</h1>
      <p>E-commerce de prendas de vestir.</p>

      <section className="backend-status" aria-label="Estado del backend">
        <h2>Estado del backend</h2>
        {loading && <p>Cargando...</p>}
        {error && (
          <p className="error">
            No se pudo conectar al backend: {error}. Asegúrate de que el backend esté en http://localhost:5000
          </p>
        )}
        {health && (
          <pre className="health-response">{JSON.stringify(health, null, 2)}</pre>
        )}
      </section>
    </div>
  )
}

export default Home
