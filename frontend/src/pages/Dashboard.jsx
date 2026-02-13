import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Dashboard.css'

const TABS = [
  { id: 'all', label: 'Todos los productos' },
  { id: 'sneakers', label: 'Zapatillas' },
  { id: 'accessories', label: 'Accesorios' },
  { id: 'flash', label: 'Oferta flash' },
  { id: 'bestsellers', label: 'Más vendidos' },
]

const PRODUCTS = [
  {
    id: 1,
    brand: 'The Center',
    name: 'Zapatillas Swift Glide',
    rating: '4.8 (120)',
    price: '89,99 €',
    oldPrice: '120,00 €',
    discount: '-25%',
    tag: '900+ vendidos el último mes',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVadQIg6i4kGy8kFX59gCW3jcLvdjo75UsP2ySylvq2tK9lCDS7u9wFNx772MUS4mv4aLvsJV6e6kAJnEktxmdy3OTJ0BcNJJWfoHCtcKkhIWefIR3OoyudiE26qDhqG3bLUfVoQvmnPCRfa2xmxLaEIdiM1bUoGPWtDM5f1iZTXLonYJLeGAa6bhR2uvGNYXxVwfFt9rQvND-PcwRSR2dmpXuwwI6zdfvHRIqETVygIM3MdePIV8Zl7byQIdJahRLz0q0ReFKlPk',
    pickup: 'Recogida en tienda Centro',
    delivery: 'mar 24 oct',
    dots: 3,
  },
  {
    id: 2,
    brand: 'The Center',
    name: 'Reloj Aura',
    rating: '4.9 (84)',
    price: '159,00 €',
    oldPrice: null,
    discount: null,
    tag: '450+ vendidos el último mes',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzlVIPzkNwdRyVMp9O_uN5CCrfZmy3rKQdB-IbOWad9ddGI8-zChdsZkRlCJ43CTdriWFoEdWUP1GNQojih3j9gBHaH50BXNQHZV2JwR8ioS8Dg_nitQ-HBPHfZiMhFWfgO99dUK0fxJEl0s2wUsHCor66VvkSNaMyzz-9kgWu11Mp8GjCDbMnKiFZq5h1RvDI6idU5kEEdqxUkV_CmEvRH1aIzDoNsBzLqsV1qXsNNW2VFhYqlMOTfUnq9co4kibjQSCeSrVsjB8',
    delivery: '26 oct',
    deliveryFree: true,
    pickup: null,
    dots: 2,
  },
  {
    id: 3,
    brand: 'The Center',
    name: 'PureAudio Elite',
    rating: '5.0 (2.103)',
    price: '299,99 €',
    oldPrice: '349,00 €',
    discount: null,
    tag: '1.2k+ vendidos el último mes',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3MSWnbd3o2Ael_oO0c8N5nC5HyNSSaTXKVGWkcjcLPIT3WEq2A2Cw0kN1D65Z93iDYyP5nASLCo4CXarJWTkL-59k2I9iNh1YermLkXl3K1o5xZIsUzh0MLturlDp35mBPFwC1um09gUlHLs7HgYiefFoacD6qiPHk-w6U5iedWmqxrzcKuOufapRBE3Je_q8llVuu87RZq8uYi2C6wLOEpjUwVXtlV5DfJTBu7BWNK6FRfNllSvq3yDUgpI6le_3mV4gFiSvxeg',
    pickup: 'Centro Comercial Principal',
    deliveryExpress: 'Envío express disponible',
    dots: 4,
  },
  {
    id: 4,
    brand: 'The Center',
    name: 'Mochila Nomad Leather',
    rating: '4.7 (42)',
    price: '124,50 €',
    oldPrice: '180,00 €',
    discount: null,
    tag: '200+ vendidos el último mes',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-ZJ9US3-jst6s91819D1ca-mPvYsMDUZ61A3gEj9ygg2oD_pr11TeUkTVhpGFYfkM047KwOs9WRHlLtH6xNGB8YckdkDvwek4QfWnoePy_puYVP6HREwi5WiIbBIDE-NY5KnZ9pjXIaC1lZVZLCuAVx_lvlAuG00Fa9sSPxr_Ruk7wwvcv2m8zYfzFe07TIFIRE4mPci7RfXnlfASwJfAdHZ3LgdJ7tpm0GMT0z3Ebo6nG64QjBowmf5_7efZUdVPVAjU4eRfyaY',
    delivery: 'mié 25 oct',
    pickup: null,
    dots: 2,
  },
]

function Logistics({ pickup, delivery, deliveryFree, deliveryExpress }) {
  return (
    <div className="dashboard-card-logistics">
      {pickup && (
        <div className="dashboard-log-line">
          <span className="material-symbols-outlined">store</span>
          <span>Recogida en <strong>{pickup}</strong></span>
        </div>
      )}
      {delivery && !deliveryExpress && (
        <div className="dashboard-log-line">
          <span className="material-symbols-outlined">local_shipping</span>
          <span>{deliveryFree ? <>Envío gratis para <strong>{delivery}</strong></> : <>Envío para <strong>{delivery}</strong></>}</span>
        </div>
      )}
      {deliveryExpress && (
        <div className="dashboard-log-line dashboard-log-green">
          <span className="material-symbols-outlined">bolt</span>
          <span>{deliveryExpress}</span>
        </div>
      )}
    </div>
  )
}

function Dashboard() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [favorites, setFavorites] = useState({ 3: true })

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="dashboard-page">
      {/* Cabecera */}
      <header className="dashboard-header">
        <div className="dashboard-header-inner">
          <button type="button" className="dashboard-icon-btn" aria-label="Menú">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="dashboard-brand">
            <div className="dashboard-brand-icon">
              <span className="material-symbols-outlined filled-icon">bolt</span>
            </div>
            <h1 className="dashboard-brand-title">The Center</h1>
          </div>
          <div className="dashboard-header-actions">
            <button type="button" className="dashboard-icon-btn" aria-label="Perfil">
              <span className="material-symbols-outlined">person</span>
            </button>
            <button type="button" className="dashboard-icon-btn dashboard-cart-btn" aria-label="Carrito">
              <span className="material-symbols-outlined">shopping_cart</span>
              <span className="dashboard-cart-badge">3</span>
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {/* Búsqueda */}
        <div className="dashboard-search-wrap">
          <div className="dashboard-search-box">
            <span className="material-symbols-outlined dashboard-search-icon">search</span>
            <input
              type="text"
              className="dashboard-search-input"
              placeholder="¿Qué estás buscando?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar"
            />
          </div>
        </div>

        {/* Pestañas */}
        <div className="dashboard-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`dashboard-tab ${activeTab === tab.id ? 'dashboard-tab-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid de productos */}
        <div className="dashboard-grid">
          {PRODUCTS.map((p) => (
            <article key={p.id} className="dashboard-card">
              <div className="dashboard-card-image-wrap">
                <img src={p.image} alt="" className="dashboard-card-image" />
                <div className="dashboard-card-actions">
                  <button
                    type="button"
                    className={`dashboard-fav-btn ${favorites[p.id] ? 'dashboard-fav-btn-active' : ''}`}
                    onClick={() => toggleFavorite(p.id)}
                    aria-label={favorites[p.id] ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                  >
                    <span className="material-symbols-outlined">favorite</span>
                  </button>
                </div>
                <div className="dashboard-card-tag">
                  <span className="material-symbols-outlined filled-icon">trending_up</span>
                  {p.tag}
                </div>
                <div className="dashboard-card-dots">
                  {Array.from({ length: p.dots }).map((_, i) => (
                    <span
                      key={i}
                      className={`dashboard-dot ${i === 0 ? 'dashboard-dot-active' : ''}`}
                    />
                  ))}
                </div>
              </div>
              <div className="dashboard-card-body">
                <div className="dashboard-card-head">
                  <p className="dashboard-card-brand">{p.brand}</p>
                  <h3 className="dashboard-card-title">{p.name}</h3>
                </div>
                <div className="dashboard-card-meta">
                  <div className="dashboard-rating">
                    <span className="material-symbols-outlined filled-icon">star</span>
                    <span>{p.rating}</span>
                  </div>
                  <div className="dashboard-colors">
                    <span className="dashboard-color dashboard-color-primary" />
                    <span className="dashboard-color" />
                    <span className="dashboard-color" />
                  </div>
                </div>
                <div className="dashboard-card-prices">
                  <span className="dashboard-price">{p.price}</span>
                  {p.oldPrice && <span className="dashboard-old-price">{p.oldPrice}</span>}
                  {p.discount && <span className="dashboard-discount">{p.discount}</span>}
                </div>
                <Logistics
                  pickup={p.pickup}
                  delivery={p.delivery}
                  deliveryFree={p.deliveryFree}
                  deliveryExpress={p.deliveryExpress}
                />
                <button type="button" className="dashboard-add-btn">
                  <span className="material-symbols-outlined">shopping_bag</span>
                  Añadir al carrito
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Navegación inferior */}
      <nav className="dashboard-bottom-nav" aria-label="Navegación principal">
        <Link to="/dashboard" className="dashboard-nav-item dashboard-nav-active">
          <span className="material-symbols-outlined filled-icon">home</span>
          <span>Inicio</span>
        </Link>
        <button type="button" className="dashboard-nav-item">
          <span className="material-symbols-outlined">search</span>
          <span>Buscar</span>
        </button>
        <button type="button" className="dashboard-nav-item">
          <span className="material-symbols-outlined">favorite</span>
          <span>Favoritos</span>
        </button>
        <Link to="/dashboard" className="dashboard-nav-item dashboard-nav-cart">
          <span className="material-symbols-outlined">shopping_bag</span>
          <span>Carrito</span>
          <span className="dashboard-nav-dot" />
        </Link>
      </nav>
    </div>
  )
}

export default Dashboard
