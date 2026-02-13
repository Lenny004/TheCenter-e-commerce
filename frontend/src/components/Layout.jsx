import { Link, Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className="layout">
      <header className="layout-header">
        <Link to="/" className="layout-brand">The Center</Link>
        <nav>
          <Link to="/">Inicio</Link>
          <Link to="/login">Iniciar sesión</Link>
          <Link to="/dashboard">Tienda</Link>
        </nav>
      </header>
      <main className="layout-main">
        <Outlet />
      </main>
      <footer className="layout-footer">
        <small>The Center &copy; 2025 - E-commerce de prendas</small>
      </footer>
    </div>
  )
}

export default Layout
