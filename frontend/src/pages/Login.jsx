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
          <h1 className="login-title">Sign in or create account</h1>
        </div>

        {/* Legal Banner */}
        <div className="login-legal">
          <p>
            By continuing, you agree to our{' '}
            <a href="#terms">Terms of Use</a> and{' '}
            <a href="#privacy">Privacy Policy</a>.
          </p>
        </div>

        {/* Login Form */}
        <div className="login-form">
          <div className="login-field">
            <label htmlFor="login-email" className="sr-only">
              Email or mobile phone
            </label>
            <input
              id="login-email"
              type="text"
              className="login-input"
              placeholder="Email or mobile phone"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <button type="button" className="login-btn-primary">
            Continue
          </button>
        </div>

        {/* Separator */}
        <div className="login-separator">
          <span className="login-separator-text">or</span>
        </div>

        {/* Passkey */}
        <button type="button" className="login-btn-passkey">
          <span className="material-symbols-outlined">fingerprint</span>
          Sign in with passkey
        </button>

        {/* Keep me signed in */}
        <div className="login-keep">
          <label className="login-checkbox-label">
            <span className="login-checkbox-wrap">
              <input
                type="checkbox"
                className="login-checkbox"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
              />
              <span className="login-checkbox-box" aria-hidden />
              <span className="material-symbols-outlined login-checkbox-icon">check</span>
            </span>
            <span className="login-checkbox-text">Keep me signed in</span>
          </label>
        </div>

        {/* Footer help */}
        <div className="login-footer">
          <button type="button" className="login-help">
            Need help signing in?
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
