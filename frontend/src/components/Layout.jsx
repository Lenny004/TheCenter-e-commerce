import { Link } from 'react-router-dom'

function Layout({ children }) {
  return (
    <div className="layout">
      <header className="layout-header">
        <Link to="/" className="layout-brand">The Center</Link>
        <nav>
          <Link to="/">Inicio</Link>
        </nav>
      </header>
      <main className="layout-main">
        {children}
      </main>
      <footer className="layout-footer">
        <small>The Center &copy; 2025 - E-commerce de prendas</small>
      </footer>
    </div>
  )
}

export default Layout
