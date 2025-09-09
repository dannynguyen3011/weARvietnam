import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../store/cart'

export default function Header() {
  const items = useCart(s => s.items)
  const count = items.reduce((s,i)=>s+i.qty,0)
  return (
    <header>
      <div className="container nav">
        <Link to="/" className="brand">
          <span style={{fontSize: '20px', marginRight: '8px'}}>🇻🇳</span>
          weARvietnam
        </Link>
        <nav className="links">
          <NavLink to="/shop">
            👘 Trang phục
          </NavLink>
          <NavLink to="/artisans">
            🏘️ Làng nghề
          </NavLink>
          <NavLink to="/try-on">
            ✨ Virtual Try‑On
          </NavLink>
          <NavLink to="/cart" style={{position: 'relative'}}>
            🛒 Giỏ hàng
            {count > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: 'var(--accent)',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700'
              }}>
                {count}
              </span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  )
}