import { useState } from 'react'
import CameraMock from '../components/CameraMock'
import SizeFinder from '../components/SizeFinder'
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
  const [showSizeFinder, setShowSizeFinder] = useState(false)
  const [selectedSize, setSelectedSize] = useState(null)
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
              {/* Size Selection */}
              {current.sizes && (
                <div style={{marginBottom: '16px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
                    <button 
                      className="size-finder-btn"
                      onClick={() => setShowSizeFinder(true)}
                    >
                      📏 Find my size
                    </button>
                    {selectedSize && (
                      <div style={{
                        padding: '6px 12px',
                        background: 'var(--accent)',
                        color: 'white',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        Size: {selectedSize}
                      </div>
                    )}
                  </div>
                  {current.sizes.sizeGuide && (
                    <p style={{
                      fontSize: '13px',
                      color: 'var(--text-light)',
                      margin: '4px 0 0 0',
                      fontStyle: 'italic'
                    }}>
                      💡 {current.sizes.sizeGuide}
                    </p>
                  )}
                </div>
              )}
              
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
      
      {/* Size Finder Modal */}
      <SizeFinder
        isOpen={showSizeFinder}
        onClose={() => setShowSizeFinder(false)}
        product={current}
        onSizeSelect={(size) => {
          setSelectedSize(size)
          setShowSizeFinder(false)
        }}
      />
    </div>
  )
}