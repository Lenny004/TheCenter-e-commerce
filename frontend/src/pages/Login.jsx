import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [keepSignedIn, setKeepSignedIn] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Top App Bar / Back */}
        <div className="login-topbar">
          <button
            type="button"
            className="login-back"
            onClick={() => navigate('/')}
            aria-label="Volver"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        </div>

        {/* Central Brand Logo */}
        <div className="login-brand">
          <div className="login-logo" aria-hidden>
            <div className="login-logo-inner" />
          </div>
          <h1 className="login-title">Inicia sesión o crea una cuenta</h1>
        </div>

        {/* Aviso legal */}
        <div className="login-legal">
          <p>
            Al continuar, aceptas nuestros{' '}
            <a href="#terms">Términos de uso</a> y nuestra{' '}
            <a href="#privacy">Política de privacidad</a>.
          </p>
        </div>

        {/* Formulario de login */}
        <div className="login-form">
          <div className="login-field">
            <label htmlFor="login-email" className="sr-only">
              Correo o teléfono
            </label>
            <input
              id="login-email"
              type="text"
              className="login-input"
              placeholder="Correo o teléfono"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <button type="button" className="login-btn-primary">
            Continuar
          </button>
        </div>
        {/* Registrate */}
        <div className="login-footer">
          <button type="button" className="login-help">
            <u>Crea una cuenta</u>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
