import { useState } from 'react'
import CameraMock from '../components/CameraMock'
import products from '../data/products.json'
import { useCart } from '../store/cart'

// Helper function to get clothing icon
const getClothingIcon = (category) => {
  switch(category) {
    case 'Áo dài': return '👘'
    case 'Váy': return '👗'
    case 'Áo': return '👕'
    case 'Phụ kiện': return '🧣'
    default: return '👔'
  }
}

// Helper function to get ethnic icon
const getEthnicIcon = (ethnic) => {
  switch(ethnic) {
    case 'Kinh': return '🏮'
    case 'H\'Mông': return '🌸'
    case 'Tày': return '🎋'
    case 'Thái': return '🎍'
    case 'Êđê': return '🌺'
    case 'Nùng': return '🌾'
    case 'Chăm': return '🕌'
    case 'Dao': return '🔴'
    case 'Cơ Tu': return '🌿'
    case 'Thuần': return '🌻'
    case 'Ba Na': return '🏔️'
    default: return '🎨'
  }
}

export default function TryOn() {
  const [current, setCurrent] = useState(products[0])
  const add = useCart(s => s.add)
  
  return (
    <div className="fade-in">
      <div className="section-title">✨ Virtual Try-On</div>
      <p style={{color: 'var(--text-light)', marginBottom: '32px', fontSize: '18px'}}>
        Trải nghiệm thử trang phục truyền thống với công nghệ AR
      </p>
      
      <div className="row" style={{alignItems:'flex-start', gap: '32px'}}>
        <aside className="sidebar">
          <div className="card">
            <div style={{fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: 'var(--primary)'}}>
              👘 Chọn trang phục
            </div>
            <div className="clothing-selection-grid">
              {products.map(p => (
                <button 
                  key={p.id} 
                  className={`clothing-selection-btn ${current.id === p.id ? 'active' : ''}`}
                  onClick={()=>setCurrent(p)}
                >
                  <div className="clothing-icon">
                    {getClothingIcon(p.category)}
                  </div>
                  <div className="clothing-info">
                    <div className="clothing-name">{p.name}</div>
                    <div className="clothing-details">
                      <span className="ethnic-badge">
                        {getEthnicIcon(p.ethnic)} {p.ethnic}
                      </span>
                      <span className="price">${p.price}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>
        
        <section className="main">
          <div className="camera-container">
            <CameraMock />
          </div>
          <div className="current-selection-card">
            <div className="selection-info">
              <div className="selection-header">
                <h3 style={{margin: 0, color: 'var(--text)'}}>{current.name}</h3>
                <div className="selection-badges">
                  <div className="badge ethnic-badge">
                    {getEthnicIcon(current.ethnic)} {current.ethnic}
                  </div>
                  <div className="badge category-badge">
                    {getClothingIcon(current.category)} {current.category}
                  </div>
                </div>
              </div>
              <div className="price-display">
                <span style={{fontSize: '24px', fontWeight: '700', color: 'var(--primary)'}}>
                  ${current.price}
                </span>
              </div>
            </div>
            <div className="action-buttons">
              <button className="btn ghost" onClick={()=>add(current)}>
                🛒 Thêm vào giỏ
              </button>
              <button className="btn primary">
                💳 Mua ngay
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}