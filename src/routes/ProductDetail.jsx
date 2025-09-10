import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import products from '../data/products.json'
import ModelViewerPlaceholder from '../components/ModelViewerPlaceholder'
import SizeFinder from '../components/SizeFinder'
import { useCart } from '../store/cart'

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

export default function ProductDetail() {
  const { id } = useParams()
  const product = products.find(p => p.id === id)
  const [showSizeFinder, setShowSizeFinder] = useState(false)
  const [selectedSize, setSelectedSize] = useState(null)
  const add = useCart(s => s.add)
  
  if (!product) {
    return (
      <div className="fade-in" style={{textAlign: 'center', padding: '60px 20px'}}>
        <h2>❌ Không tìm thấy sản phẩm</h2>
        <p>Sản phẩm bạn đang tìm kiếm không tồn tại.</p>
        <Link to="/shop" className="btn primary">🛍️ Quay lại cửa hàng</Link>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div className="container">
        {/* Breadcrumb */}
        <div style={{marginBottom: '24px'}}>
          <Link to="/shop" style={{color: 'var(--text-light)', textDecoration: 'none'}}>
            🛍️ Cửa hàng
          </Link>
          <span style={{margin: '0 8px', color: 'var(--text-light)'}}>›</span>
          <span style={{color: 'var(--text)'}}>{product.name}</span>
        </div>

        <div className="row" style={{alignItems:'flex-start', gap: '40px'}}>
          {/* Product Images */}
          <section className="main" style={{flex: '1.2'}}>
            <div style={{background: 'var(--bg-light)', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px'}}>
              <img 
                src={product.image} 
                alt={product.name}
                style={{
                  width: '100%',
                  height: '500px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
            <ModelViewerPlaceholder />
          </section>

          {/* Product Info */}
          <aside className="sidebar" style={{flex: '1'}}>
            <div className="card" style={{padding: '32px'}}>
              {/* Product Title */}
              <h1 style={{
                fontSize: '32px',
                fontWeight: '700',
                color: 'var(--text)',
                margin: '0 0 16px 0',
                lineHeight: '1.2'
              }}>
                {product.name}
              </h1>

              {/* Badges */}
              <div style={{display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap'}}>
                <div className="badge" style={{
                  background: 'var(--primary)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {getEthnicIcon(product.ethnic)} {product.ethnic}
                </div>
                <div className="badge" style={{
                  background: 'var(--secondary)',
                  color: 'var(--text)',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  📍 {product.category}
                </div>
              </div>

              {/* Price */}
              <div style={{marginBottom: '24px'}}>
                <span style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  color: 'var(--primary)'
                }}>
                  ${product.price}
                </span>
              </div>

              {/* Product Details */}
              <div style={{
                marginBottom: '32px',
                padding: '20px',
                background: 'var(--bg-light)',
                borderRadius: '8px',
                border: '1px solid var(--border)'
              }}>
                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'var(--text)'
                }}>
                  🏘️ Thông tin nghệ nhân
                </h3>
                <p style={{margin: '0 0 8px 0', color: 'var(--text-light)'}}>
                  <strong>Làng nghề:</strong> {product.village}
                </p>
                <p style={{margin: '0', color: 'var(--text-light)'}}>
                  <strong>Tỉnh/Thành:</strong> {product.province}
                </p>
              </div>

              {/* Size Selection */}
              {product.sizes && (
                <div style={{marginBottom: '24px'}}>
                  <h3 style={{
                    margin: '0 0 16px 0',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'var(--text)'
                  }}>
                    📏 Chọn kích cỡ
                  </h3>
                  
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
                    <button 
                      className="size-finder-btn"
                      onClick={() => setShowSizeFinder(true)}
                    >
                      📏 Find my size
                    </button>
                    {selectedSize && (
                      <div style={{
                        padding: '8px 16px',
                        background: 'var(--accent)',
                        color: 'white',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        Size: {selectedSize}
                      </div>
                    )}
                  </div>

                  {/* Available Sizes */}
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                    marginBottom: '12px'
                  }}>
                    {product.sizes.available.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        style={{
                          padding: '8px 16px',
                          border: `2px solid ${selectedSize === size ? 'var(--primary)' : 'var(--border)'}`,
                          background: selectedSize === size ? 'var(--primary)' : 'var(--bg)',
                          color: selectedSize === size ? 'white' : 'var(--text)',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '14px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  {product.sizes.sizeGuide && (
                    <p style={{
                      fontSize: '13px',
                      color: 'var(--text-light)',
                      margin: '0',
                      fontStyle: 'italic'
                    }}>
                      💡 {product.sizes.sizeGuide}
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                <button 
                  className="btn primary"
                  onClick={() => add(product)}
                  style={{fontSize: '16px', fontWeight: '600'}}
                >
                  🛒 Thêm vào giỏ hàng
                </button>
                <Link 
                  to="/try-on" 
                  className="btn ghost"
                  style={{textAlign: 'center', fontSize: '16px', fontWeight: '600'}}
                >
                  ✨ Thử nghiệm AR
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Size Finder Modal */}
      <SizeFinder
        isOpen={showSizeFinder}
        onClose={() => setShowSizeFinder(false)}
        product={product}
        onSizeSelect={(size) => {
          setSelectedSize(size)
          setShowSizeFinder(false)
        }}
      />
    </div>
  )
}